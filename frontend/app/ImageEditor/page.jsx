"use client";
import { useRef, useEffect, useState } from "react";
import { Canvas, PencilBrush } from "fabric";
import Toolbox from "../components/ImageEditor/Toolbox";
import EditorCanvas from "../components/ImageEditor/EditorCanvas";
import "./page.css";
import * as fabric from "fabric";
import Navbar from "../components/ImageGenerator/NavBar2";
import ImageBox from "../components/ImageEditor/ImageBox"

function ImageEditor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(null);

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, {backgroundColor: 'white'}); 
    canvas.setDimensions({width: 1000, height: 500});
    const brush = new PencilBrush(canvas);
    brush.color = 'black';
    brush.width = 4;
    canvas.freeDrawingBrush = brush;
    setCanvas(canvas);
    
    return () => canvas.dispose();
  }, [canvasRef, setCanvas]);

  return (
    <>
    <Navbar />
    <div className="editor flex h-screen bg-[#E7E4D8]">      
      <Toolbox canvas={canvas} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
      <EditorCanvas ref={canvasRef} canvas={canvas} setCurrentFilter={setCurrentFilter}/>
      <ImageBox canvas={canvas} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
    
    </div>
    </>
  );
}

export default ImageEditor;
