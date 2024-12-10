"use client";

import React, { useState } from "react";
import { FileUpload } from "../ui/file-upload";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique ID generation


import { storage } from "../../firebase"; // Make sure to import Firebase storage setup
import { ref, uploadString, getDownloadURL } from "firebase/storage"; // Firebase storage functions
import { useCardsStore } from '../../store/useCardsStore';
import {PromptDesign} from '../../store/useCardsStore'

interface FileUploadDemoProps {}

// Modal Component
const Modal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-black">{message}</h2>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-black text-white rounded-lg focus:outline-none"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const FileUploadDemo: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("Vibrant");
  const [generatedImages, setGeneratedImages] = useState<(string | null)[]>([null, null, null]);
  const [modalMessage, setModalMessage] = useState<string | null>(null); // Modal state
  const { cards, setCards, updateCards } = useCardsStore(); 

  const themes = ["Black & White", "Vibrant", "Pastel Colored"];

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTheme(event.target.value);
  };

  const handleCloseModal = () => {
    // Clear the images and close the modal
    setUploadedImage(null);
    setGeneratedImage(null);
    setModalMessage(null);
  };

  // Function to extract the middle five words from a prompt
  const extractMiddleFiveWords = (prompt: string): string => {
    const words = prompt.split(" ");
    const start = Math.max(0, Math.floor((words.length - 5) / 2));
    return words.slice(start, start + 5).join(" ");
  };

  // Function to save the generated image to Firebase Storage and MongoDB
  const handleSave = async (
    imageSrc: string,
    prompt: string,
    setGeneratedImages: React.Dispatch<React.SetStateAction<(string | null)[]>>,
    updateCards: (updater: (cards: PromptDesign[]) => PromptDesign[]) => void
    ) => {
    try {
      const imagetitle = extractMiddleFiveWords(prompt);
      const uniqueId = uuidv4();
      const storageRef = ref(storage, `images/generated_image_${uniqueId}`);
  
      // Upload the full Base64 string in 'data_url' format
      await uploadString(storageRef, imageSrc, "data_url");
  
      // Get the download URL for the stored image
      const downloadURL = await getDownloadURL(storageRef);
  
      // Metadata for MongoDB
      const metadata = {
        title: imagetitle,
        imageUrl: downloadURL,
        username: "anum",
        patternType: "prompt",
        prompt: prompt,
      };
  
      // Save metadata in MongoDB
      const res = await fetch("http://localhost:5000/api/prompt-designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });
  
      if (!res.ok) {
        throw new Error("Database save failed with status: " + res.statusText);
      }
  
      toast.success("Image successfully saved!");
      const savedImage: PromptDesign = await res.json();
      updateCards((prevCards) => {
        // Ensure prevCards is an array before spreading it
        if (!Array.isArray(prevCards)) return prevCards;
        
        // Ensure savedImage is valid (you can add more checks based on your requirements)
        if (!savedImage || !savedImage.title) {
          console.error("Invalid card:", savedImage);
          return prevCards;
        }
    
        // Append the new card
        return [...prevCards, savedImage];
      });
      setGeneratedImages((prevImages) => [...prevImages, downloadURL]);
    } catch (error) {
      console.error("Error during save:", error);
      toast.error("Error saving the image.");
    }
  };
  

  // Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
   
    const uniqueId = uuidv4();
    if (files.length > 0) {
      const file = files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setModalMessage("Invalid file type. Please upload a PNG, JPG, or JPEG image.");
        return;
      }

      const base64Image = await fileToBase64(file);
      setUploadedImage(base64Image);

       try {
           setLoading(true);
           const prompt = `A high-quality textile with ${selectedTheme} pattern based on the sketch`;
           const negativePrompt = "lowres, bad anatomy, bad quality";
           const requestBody = {
           prompt,
           negative_prompt: negativePrompt,
           sketch: base64Image.split(",")[1], // Removes the prefix data:image/...;base64,
         };

           console.log(prompt)
           const response = await fetch("https://fyp1-sketch-to-image.hf.space/generate", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(requestBody),
         });
         
         if (response.ok) {
           const data = await response.json();
           const generatedImageBase64 = `data:image/png;base64,${data.image}`;
           setGeneratedImage(generatedImageBase64);
    //   const generatedImageBase64 = `data:image/png;base64,${base64Image.split(',')[1]}`;
    // setGeneratedImage(generatedImageBase64);
    setGeneratedImages([generatedImageBase64]);

    // Save the generated image to Firebase and MongoDB
    handleSave(generatedImageBase64, prompt,setGeneratedImages,updateCards);

         } else {
           console.error("Failed to generate image:", response.statusText);
         toast.error<string>("Error generating image.Try Later!");
         }
       } catch (error) {
         console.error("Error uploading file:", error);
       } finally {
         setLoading(false);
       }
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setGeneratedImage(null);
  };

  return (
    <div>
        

      {/* Theme Selection */}
      <div className="mb-6 max-w-md mx-auto z-20">
        <div className="text-black  mb-2 text-center font-semibold"></div>
        <div className="flex justify-around ">
          {themes.map((theme) => (
            <label key={theme} className="flex items-center space-x-2">
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={selectedTheme === theme}
                onChange={handleThemeChange}
                className="focus:ring-2 focus:ring-customPurple"
              />
              <span className="text-black font-bold font-para">{theme}</span>
            </label>
          ))}
        </div>
      </div>

      <div
        className={`w-full max-w-7xl mx-auto h-[300px] bg-transparent
        ${uploadedImage ? "lg:flex lg:flex-row gap-8" : "flex flex-col"}`
        }
      >
        {/* Left Column */}
        <div
          className={`w-full ${
            uploadedImage ? "lg:w-1/2 border-r border-[#91535f] pr-4" : ""
          } flex flex-col items-center`}
        >
          {/* <h2 className="text-2xl text-black font-custom mb-4 font-semibold">
            Your Sketch
          </h2> */}

          {/* Uploaded Image Section */}
          {uploadedImage ? (
            <div className="mt-4 w-full flex flex-col items-center">
              {/* <h3 className="text-black mb-2">Uploaded Image:</h3> */}
              <div className="w-64 h-64 border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={uploadedImage}
                  alt="Uploaded Sketch"
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                onClick={handleRemoveImage}
                className="mt-4 text-red-500 hover:text-red-700 font-semibold"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <FileUpload onChange={handleFileUpload} />
          )}
        </div>

        {/* Right Column */}
        {uploadedImage && (
          <div className="w-full lg:w-1/2 flex flex-col items-center pl-4">
            <h2 className="text-2xl text-[#616852] font-semibold font-custom mb-4">
              Generated Pattern
            </h2>
            {loading}
            {generatedImage && (
              <div className="w-64 h-64 border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={generatedImage}
                  alt="Generated Pattern"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {modalMessage && <Modal message={modalMessage} onClose={handleCloseModal} />}
    </div>
  );
};

export default FileUploadDemo;