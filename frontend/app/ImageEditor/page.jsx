"use client";
import { useRef, useEffect, useState } from "react";
import { Canvas, PencilBrush } from "fabric";
import Toolbox from "../components/ImageEditor/Toolbox";
import EditorCanvas from "../components/ImageEditor/EditorCanvas";
import Navbar from "../components/ImageGenerator/NavBar2";
import ImageBox from "../components/ImageEditor/ImageBox";
import ImageGalleryPopup from "../components/ImageEditor/ImageGalleryPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function ImageEditor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); //  State lifted to parent

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, { backgroundColor: "white" });
    canvas.setDimensions({ width: 1000, height: 500 });
    const brush = new PencilBrush(canvas);
    brush.color = "black";
    brush.width = 4;
    canvas.freeDrawingBrush = brush;
    setCanvas(canvas);

    return () => canvas.dispose();
  }, [canvasRef, setCanvas]);

  return (
    <>
      <Navbar />
      <div className="editor flex h-screen bg-[#E7E4D8]">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        
        {/* Pass setIsGalleryOpen to Toolbox */}
        <Toolbox 
          canvas={canvas} 
          currentFilter={currentFilter} 
          setCurrentFilter={setCurrentFilter} 
          openGallery={() => setIsGalleryOpen(true)} //  Pass function to open gallery
        />

        <EditorCanvas ref={canvasRef} canvas={canvas} setCurrentFilter={setCurrentFilter} />
        <ImageBox canvas={canvas} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />

        {/* Render ImageGalleryPopup at the correct level */}
        {isGalleryOpen && (
          <ImageGalleryPopup 
            isOpen={isGalleryOpen} 
            onClose={() => setIsGalleryOpen(false)}
            username={localStorage.getItem("userEmail")} 
          />
        )}
      </div>
    </>
  );
}

export default ImageEditor;
