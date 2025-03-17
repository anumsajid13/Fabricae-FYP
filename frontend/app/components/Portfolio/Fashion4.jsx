import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const FabricMaterialSelection = () => {
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
    const componentId = "fashion-design";
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
                src="/Picture12.jpg"
                alt="Model 1"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <img
              src="/Picture13.jpg"
              alt="Model 2"
              className="w-full h-40 object-cover rounded-lg"
            />
            <img
              src="/Picture14.jpg"
              alt="Model 3"
              className="w-full h-40 object-cover rounded-lg"
            />
            <img
              src="/Picture15.jpg"
              alt="Model 4"
              className="col-span-2 w-full h-40 object-cover rounded-lg"
            />
          </div>

          <img
              src="/Picture15.jpg"
              alt="Model 4"
              className="ms-6 col-span-2 w-40 h-80 object-cover rounded-lg"
            />
        </div>
      </div>
    );
};