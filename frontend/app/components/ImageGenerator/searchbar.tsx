  "use client";

  import React, { useState } from "react";
  import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
  import Image from "next/image";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { storage } from "../../firebase";
  import { ref, uploadString, getDownloadURL } from "firebase/storage";
  import { v4 as uuidv4 } from 'uuid';
  import { useCardsStore } from '../../store/useCardsStore';
  import {PromptDesign} from '../../store/useCardsStore'
import { relative } from "path";

  // Function to call GPT via RapidAPI to rephrase the prompt
  const rephrasePrompt = async (prompt: string) => {
    const url = "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "600ce61e42msh91c8a2047564176p12ff8ajsn1015c0f9de65",
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `Rephrase the following prompt two different ways, separated by a "/": ${prompt}`,
          },
        ],
        system_prompt: "",
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
        web_access: false,
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const rephrasedPrompts = result.result.split("/"); // Split the response by "/"

      // Handle cases where the API might not return two rephrases
      const rephrasedPrompt1 = rephrasedPrompts[0]?.trim() || "";
      const rephrasedPrompt2 = rephrasedPrompts[1]?.trim() || "";

      return { rephrasedPrompt1, rephrasedPrompt2 };
    } catch (error) {
      console.error(error);
      return { rephrasedPrompt1: null, rephrasedPrompt2: null };
    }
  };

  // Function to call the Hugging Face API and get a single image
  const queryImageGeneration = async (prompt: string) => {
    const API_URL = "https://api-inference.huggingface.co/models/fyp1/pattern_generation";
    const headers = {
      Authorization: "Bearer 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",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          inputs: `a textile design pattern of ${prompt}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  const extractMiddleFiveWords = (prompt: string): string => {
    const words = prompt.trim().split(/\s+/); // Split by spaces, ensuring multiple spaces are handled
    const totalWords = words.length;

    if (totalWords <= 5) {
      // If the string has 5 or fewer words, return the entire string
      return prompt;
    }

    // Calculate the start index for the middle 5 words
    const startIndex = Math.floor((totalWords - 5) / 2);

    // Extract the middle 5 words
    const middleWords = words.slice(startIndex, startIndex + 5);

    // Join the words back into a string and return
    return middleWords.join(" ");
  };

  // Function to save the generated image to Firebase Storage and MongoDB
  const handleSave = async (imageSrc: string, prompt: string, setGeneratedImages: React.Dispatch<React.SetStateAction<(string | null)[]>>, updateCards: (updater: (cards: PromptDesign[]) => PromptDesign[]) => void ) => {
    try {
      // Extracting image title
      const imagetitle = extractMiddleFiveWords(prompt);

      // Generate a unique identifier
      const uniqueId = uuidv4();
      const storageRef = ref(storage, `images/generated_image_${uniqueId}`);

      const response = await fetch(imageSrc);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        await uploadString(storageRef, base64String, "data_url");

        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image saved. Firebase URL:", downloadURL);

        const userEmail = localStorage.getItem("userEmail");

        const metadata = {
          title: imagetitle,
          imageUrl: downloadURL,
          username: userEmail,
          patternType: "prompt",
          prompt: prompt
        };

        const res = await fetch("http://localhost:5000/api/prompt-designs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadata),
        });

        if (!res.ok) {
          throw new Error("Failed to save image in the database.");
        }

        const savedImage: PromptDesign = await res.json();
        console.log("Image saved in the database:", savedImage);

        toast.success("Image successfully saved!", {
          toastId: uniqueId // Use a unique ID here
        });
        // updateCards((prevCards) => [...prevCards, savedImage]);
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
      };
    } catch (error) {
      console.error("Error saving the image:", error);
      toast.error("Error saving the image.");
    }
  };

  export function PlaceholdersAndVanishInputDemo({ onPromptChange }: { onPromptChange: (input: string) => void }) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState([false, false, false]);
    const [generatedImages, setGeneratedImages] = useState<(string | null)[]>([null, null, null]);
    const [searchInitiated, setSearchInitiated] = useState(false);
    const { cards, setCards, updateCards } = useCardsStore(); 

    const placeholders = [
      "create a bold geometric pattern",
      "craft a modern minimalistic print",
      "design a texture inspired by nature",
      "design a vibrant  floral motif",
      "create a pattern using traditional Sindhi Ajrak designs",
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setPrompt(input);
      onPromptChange(input);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSearchInitiated(true);
    
      const promptsList: string[] = [prompt];
    
      // Call the rephrasePrompt function and get the two rephrased prompts
      const { rephrasedPrompt1, rephrasedPrompt2 } = await rephrasePrompt(prompt);
    
      console.log("rephrasedPrompt1:", rephrasedPrompt1);
      console.log("rephrasedPrompt2:", rephrasedPrompt2);
    
      if (rephrasedPrompt1) promptsList.push(rephrasedPrompt1);
      if (rephrasedPrompt2) promptsList.push(rephrasedPrompt2);
    
      const newLoadingState = [true, true, true]; // Assuming you want all loading states to be true initially
      setLoading(newLoadingState);
    
      const newGeneratedImages = await Promise.all(
        promptsList.map(async (p) => {
          const imageUrl = await queryImageGeneration(p);
          if (imageUrl) {
            await handleSave(imageUrl, p, setGeneratedImages,updateCards); // Save the image if generated
            return imageUrl; // Return the generated image URL
          }
          return null; // If no image was generated
        })
      );
    
      setGeneratedImages(newGeneratedImages); // Set all generated images
      setLoading(newLoadingState.map(() => false)); // Set loading to false after all operations
    };

    return (
      <div className="w-full">
        <div className="h-auto flex flex-col justify-center items-center px-4 bg-[#E7E4D8]">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
    
        {searchInitiated && (
          <div className="min-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 justify-items-center"   style={{
            position: "relative", 
            zIndex: 1, 
          }}> {/* Added justify-items-center */}
            {loading.map((isLoading, index) => (
              <div key={index} className="flex justify-between items-center bg-[#F4F2EF] rounded-lg">
                <div className="w-[300px] h-[300px] flex justify-center items-center">
                  {isLoading ? (
                    <img className="w-[300px] h-[300px]" src="/Imgur.gif" alt="loading" />
                  ) : generatedImages[index] ? (
                    <Image
                      src={generatedImages[index] as string}
                      alt={`Generated pattern ${index + 1}`}
                      width={500}
                      height={500}
                      className="rounded-lg object-cover "  
              
                    />
                  ) : (
                    <div className="w-[300px] h-[300px] bg-[#E7E4D8] rounded-md shadow-lg">
                      <img className="w-[300px] h-[300px]" src="/Imgur.gif" alt="loading" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* <ToastContainer
          position="top-right"
          autoClose={3000} // Auto close after 3 seconds
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        /> */}
      </div>
    );
    
  }
