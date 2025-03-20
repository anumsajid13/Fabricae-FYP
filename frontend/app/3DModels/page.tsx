'use client';
import React, { useState, useEffect, useRef} from "react";
import html2canvas from "html2canvas";
import NavBar from '../components/ImageGenerator/NavBar2';
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { useSelectedCardsStore} from "../store/selectedCardsStore"
import { useThree } from "@react-three/fiber";
import { FiUploadCloud } from "react-icons/fi";
import PatternGalleryPopup from "../components/3Dvisualization/PatternGalleryPopup"
import { FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid"; 
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; 
import { ToastContainer, toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";
import { FiLoader } from "react-icons/fi";
import ThreeDGallery from "../components/3Dvisualization/ThreeDGallery";


const ModelComponent = dynamic(
  () => import("../components/3Dvisualization/ModelComponent"),
  { ssr: false }
);

const ModelsPage = () => {
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState<any>(1)
  const { selectedCards, setSelectedCards } = useSelectedCardsStore();
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState(false); 
  const [title, setTitle] = useState("");
  const [gallery3DOpen, setGallery3DOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/model-routes/3d-mockups");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();
        setModels(data);
        setSelectedModel(data[0]);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const fetchPatterns = async () => {
    const username = localStorage.getItem("userEmail");
    if (!username) {
      console.error("No username found in localStorage");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/prompt-designs/retrieve-by-username/${username}`);
      if (!response.ok) throw new Error("Failed to fetch patterns");

      const data = await response.json();
      setPatterns(data); // ✅ Set the fetched images into state
    } catch (error) {
      console.error("Error fetching patterns:", error);
    }
  };


  const handleOpenGallery = () => {
    fetchPatterns(); // Fetch patterns before opening
    setGalleryOpen(true); // Open the popup
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value)); 
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      // Get the Three.js canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }
  
      // Create a new canvas and get its context
      const newCanvas = document.createElement('canvas');
      const context = newCanvas.getContext('2d');
      if (!context) {
        console.error("Could not get 2d context");
        return;
      }
  
      // Set the new canvas dimensions to match the original
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;
  
      // Draw the WebGL canvas content onto the new canvas
      // This preserves the WebGL state
      context.drawImage(canvas, 0, 0);
  
      // Convert to base64 image
      const dataUrl = newCanvas.toDataURL('image/png', 1.0);
      setScreenshot(dataUrl);
      setShowPreview(true);
  
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }finally {
      setIsCapturing(false);
    }
  };
  
  // // Add this function to actually save the screenshot
  // const handleSaveDesign = async () => {
  //   if (!screenshot) return;
  
  //   try {
  //     // Convert base64 to blob
  //     const base64Response = await fetch(screenshot);
  //     const blob = await base64Response.blob();
  
  //     // Create a download link
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `design-${Date.now()}.png`;
      
  //     // Trigger download
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  
  //     setShowPreview(false);
  //   } catch (error) {
  //     console.error("Error saving screenshot:", error);
  //   }
  // };

  const handleSaveDesign = async () => {
    if (!screenshot || !title.trim()) {
      toast.error("Please enter a title before saving!");
      return;
    }

    setSaving(true);  // Start loader
    try {
      const username = localStorage.getItem("userEmail") || "anonymous";
      const timestamp = new Date().toISOString();
      const storageRef = ref(storage, `screenshots/${title}.png`);

      await uploadString(storageRef, screenshot, "data_url");
      const imageUrl = await getDownloadURL(storageRef);

      const res = await fetch("http://localhost:5000/api/prompt-designs/save3D", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          imageUrl,
          createdAt: timestamp,
          username,
        }),
      });

      if (!res.ok) throw new Error("Failed to save design in database");

      toast.success("Design saved successfully!");
      setShowPreview(false);
    } catch (error) {
      toast.error(" Error saving design");
      console.error("Error saving design:", error);
    } finally {
      setSaving(false);  // Stop loader
    }
  };

  

  if (loading) return <p>Loading...</p>;

  return (

    <div className="bg-[#E7E4D8] min-h-screen overflow-hidden">
    <NavBar />
    <div className="flex flex-col md:flex-row h-[90vh] mt-1">
      {/* Left Side: 3D Model Display (70%) */}
      
     <div className="w-full md:w-7/12 p-6 flex items-center justify-center relative">
  <div className="bg-[#434242] rounded-2xl shadow-xl p-4 w-full h-full flex items-center justify-center border-1" ref={canvasRef}>
    {selectedModel && (
      <Canvas gl={{ preserveDrawingBuffer: true }} style={{ width: "100%", height: "100%", borderRadius: "16px" }}>
        {/* Flat Background Color */}
        <color attach="background" args={["#EAE7DB"]} />
        <Environment preset="sunset" />
        <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={10} />
        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
        
        {/* Centered Model */}
        <group position={[0, -1, 0]}>
        <ModelComponent key={selectedModel._id} modelUrl={selectedModel.glbUrl} textureUrl={selectedPattern} sliderValue={sliderValue}/>
        </group>
      </Canvas>
    )}

    {/* Buttons inside the canvas */}
        <div className="absolute top-12 right-12 flex gap-2">
          <img
            src="/undo.png"
            alt="Undo"
            className="w-10 h-10 bg-gradient-to-r from-white to-[#F8F7F2] p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer"
          />
          <img
            src="/redo.png"
            alt="Redo"
            className="w-10 h-10 bg-gradient-to-r from-white to-[#F8F7F2] p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer"
          />
        </div>


        {/* Slider below */}
        <div className="absolute bottom-12 left-12 right-4 w-[89%]">
          <input
            type="range"
            className="w-full accent-[#B4707E] hover:accent-[#822538] transition-all duration-300"
            value={sliderValue}  // Bind slider value
            onChange={handleSliderChange}
          />
        </div>
      </div>
    </div>

  
      {/* Right Side: Mannequin Selection and Patterns (30%) */}
      <div className="w-full md:w-5/12 space-y-6 p-4 bg-[#E7E4D8] overflow-auto">
        {/* Select Mannequin */}
        <div className="bg-gradient-to-br  bg-[#434242] rounded-2xl p-4 shadow-md">
          <h2 className=" text-white text-lg font-semibold mb-3 bg-gradient-to-r from-[#822538] to-[#B4707E] bg-clip-text text-transparent">
            Select Mannequin
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {models.map((model) => (
              <div
                key={model._id}
                className={`w-26 h-26 aspect-square bg-gradient-to-br bg-[#434242] rounded-2xl cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-2 ${
                  selectedModel?._id === model._id ? "ring-4 ring-white" : ""
                }`}
                onClick={() => setSelectedModel(model)}
              >
                {/* Model Image */}
                <img
                  src={model.images[0]} // Assuming images is an array and the first image is used
                  alt={model.mockupName}
                  className="w-full h-full object-cover rounded-2xl shadow-md" // Ensures the image covers the area and is rounded
                />
              </div>
            ))}
          </div>
        </div>

        {/* Screenshot Preview Modal */}
        {showPreview && screenshot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
              <h2 className="text-lg font-semibold mb-4">Preview Screenshot</h2>
              <input
                type="text"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <img src={screenshot} alt="Screenshot Preview" className="rounded-lg shadow-md mb-4 w-full" />
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
                <button onClick={handleSaveDesign} className="px-4 py-2 bg-gradient-to-r from-[#822538] to-[#B4707E] text-white rounded-lg hover:from-[#B4707E] hover:to-[#822538]">
                   {saving ? <FiLoader className="animate-spin text-xl" /> : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Design Patterns */}
        <div className="bg-gradient-to-br bg-[#434242] rounded-2xl p-4 shadow-md">
        <div className="bg-gradient-to-br from-white to-[#F8F7F2] rounded-2xl p-4 shadow-md flex justify-between items-center">
          <h2 className="text-lg text-black font-semibold mb-3 bg-black bg-clip-text text-transparent">
            Design Patterns
          </h2>
          <FiUploadCloud
            size={28} 
            className="text-black cursor-pointer hover:scale-110 transition-transform hover:text-[#B4707E]" // ✅ Stylish hover effect
            onClick={handleOpenGallery}
          />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {selectedCards.map((pattern) => (
              <div
                key={pattern.src}
                className={`group bg-[#E7E4D8] flex flex-col items-center p-4 rounded-2xl cursor-pointer shadow-md transition-all transform hover:scale-105 ${
                  selectedPattern === pattern.src ? "ring-4 ring-white" : ""
                }`}
                onClick={() => setSelectedPattern(pattern.src)}
              >
                {/* Pattern Image */}
                <img
                  src={pattern.src}
                  alt={pattern.title}
                  className="object-cover rounded-2xl shadow-md"
                />
                {/* Trash Icon (Appears on Hover) */}
                <button
                  className="absolute top-2 right-2 bg-white bg-opacity-75 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents selection
                    setSelectedCards(selectedCards.filter((img) => img.src !== pattern.src)); // ✅ Remove from Zustand store
                  }}
                >
                  <FaTrash className="text-red-600 text-lg hover:text-red-800 transition-colors" />
                </button>
                {/* <p className="mt-2 text-sm font-medium text-center text-[#333]">{pattern.title}</p> */}
              </div>
            ))}
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="flex gap-4">
          <button  onClick={captureScreenshot} disabled={isCapturing} className="flex-1 bg-gradient-to-r from-[#434242] to-[#a8a8a8] text-white py-3 rounded-2xl font-semibold  transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
            <span className="flex items-center justify-center gap-2">
            <img className= "w-8 h-8" src= "/save.png"/>
            {isCapturing ? 'Capturing...' : 'Save Design'}
            </span>
            
          </button>
          <button
            onClick={() => setGallery3DOpen(true)}
            className="flex-1 bg-gradient-to-r from-white to-[#F8F7F2] text-[#434242] border-spacing-3 border-[#434242] py-3 rounded-2xl font-semibold hover:bg-[#E7E4D8] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <span className="flex items-center justify-center gap-2">
              View 3D Gallery
            </span>
          </button>
          <button className="flex-1 bg-gradient-to-r from-white to-[#F8F7F2] text-[#434242]  border-[#434242] py-3 rounded-2xl font-semibold hover:bg-[#E7E4D8] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
           
            <span className="flex items-center justify-center gap-2">
            Next
            <img className= "w-8 h-8" src= "/next.png"/>
              
            </span>
          </button>
          

        </div>
      </div>
    </div>

    <PatternGalleryPopup
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={patterns} 
    />
    <ThreeDGallery isOpen={gallery3DOpen} onClose={() => setGallery3DOpen(false)} />

    <ToastContainer position="top-right" autoClose={3000} />
  </div>
  

  );
  
};

export default ModelsPage;
