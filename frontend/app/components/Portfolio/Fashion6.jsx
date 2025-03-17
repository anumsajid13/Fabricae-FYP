import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const PortfolioSection =() => {

   const {
           handleTextSelection,
           registerComponent,
           applyStyle,
           getPageState,
           updatePageState,
           selectedPage,
           getElementPosition,
           updateElementPosition,
         } = useFashionStore();

         const pageId = `fashion-portfolio-${selectedPage}`;
         const pageState = getPageState(pageId);

         // Component ID for this component
         const componentId = "fashion-collab";
       const [bgColor, setBgColor] = useState("#a3846f");
        const [backgroundImage, setBackgroundImage] = useState(
           pageState.backgroundImage || "/Picture7.jpg"
         );

  return (
    <div
    style={{
      backgroundImage: `url('${backgroundImage}')`,
    }}
    className="w-[828px] bg-cover bg-center min-h-screen flex flex-col items-center justify-center cursor-pointer portfolio-page"

  >
      <div className="text-white w-[90%] min-w-[500px] h-[400px] bg-opacity-90 p-8 flex flex-row items-center"
      style={{
        backgroundColor: bgColor,
        height: "400px",
        marginLeft: "110px",
        marginRight: "110px",
      }}
      >
        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 md:w-2/3">
          <div className="row-span-2">
            <img
              src="/Picture17.jpg"
              alt="Model 1"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <img
            src="/Picture18.jpg"
            alt="Model 2"
            className="w-full h-40 object-cover rounded-lg"
          />
          <img
            src="/Picture19.jpg"
            alt="Model 3"
            className="w-full h-40 object-cover rounded-lg"
          />
          <img
            src="/Picture20.jpg"
            alt="Model 4"
            className="col-span-2 w-full h-40 object-cover rounded-lg"
          />
        </div>

        {/* Text Content */}
        <div className="md:w-1/3 text-white p-6 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white">Contact & Social Media</h2>
          <p className="mt-4 text-white text-sm">
          Email: [Your Email]
          Website: [Your Portfolio Link]
          Instagram: [@YourHandle]
          </p>
          <div className="mt-6 text-lg font-bold">NEW FASHION</div>
        </div>
      </div>
    </div>
  );
};

