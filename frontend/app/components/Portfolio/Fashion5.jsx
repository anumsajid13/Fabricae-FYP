import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const SketchesIllustrations =() =>{
 
  const [bgColor, setBgColor] = useState("#a3846f");
 return (
   <div
     className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center cursor-pointer portfolio-page"
     style={{ backgroundImage: "url('/Picture7.jpg')" }}
   >
     <div className="text-white w-[90%] min-w-[380px] bg-opacity-90 p-8 flex flex-row items-center"
      style={{
        backgroundColor: bgColor,
        marginLeft: "110px",
        marginRight: "110px",
      }}
      >
       <div className="text-white">
         <h1 className="text-4xl font-semibold mb-4">Work Process</h1>
         <p className="text-lg mb-6">
           Display your design skills through fashion sketches and illustrations.
           Include both rough sketches and polished drawings to showcase your range.
         </p>
         <h2 className="font-bold text-xl">NEW FASHION</h2>
       </div>
       <div className="flex justify-center">
         <img
           src="/Picture16.jpg"
           alt="Fashion Illustration"
           className="rounded-lg object-cover w-[550px] max-h-72 md:max-h-100"
         />
       </div>
     </div>
   </div>
 );
};

