import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const FabricMaterialSelection = () => {
  const [bgColor, setBgColor] = useState("#a3846f");
  const [text, setText] = useState(""); // State to manage the text area content

  return (
    <div
      className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center cursor-pointer portfolio-page"
      style={{ backgroundImage: "url('/Picture7.jpg')" }}
    >
      <div
        className="text-white w-[90%] min-w-[380px] bg-opacity-90 p-8 flex flex-col items-center"
        style={{
          backgroundColor: bgColor,
          marginLeft: "110px",
          marginRight: "110px",
        }}
      >
        <h1 className="text-4xl font-semibold mb-4">Final Designs</h1>
        <div className="w-[500px] h-[210px] grid grid-cols-4 gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-lg p-2 w-70 h-10 resize-none"
            placeholder="Enter your text here..."
          />
          <img
            src="/Picture12.jpg"
            alt="Fashion 1"
            className="rounded-lg object-cover w-60 h-40"
          />
          <img
            src="/Picture14.jpg"
            alt="Fashion 3"
            className="rounded-lg object-cover w-70 h-50"
          />
          <img
            src="/Picture15.jpg"
            alt="Fashion 4"
            className="rounded-lg object-cover w-60 h-60"
          />
        </div>
      </div>
    </div>
  );
};