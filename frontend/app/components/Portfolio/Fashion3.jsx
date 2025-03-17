import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const Fashion =  () => {
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
      const componentId = "fashion-project";
      const [backgroundImage, setBackgroundImage] = useState(
        pageState.backgroundImage || "/Picture7.jpg"
      );
       const [innerContainerImage, setInnerContainerImage] = useState(
          pageState.innerContainerImage || null
        );
        const [bgColor, setBgColor] = useState("#a3846f");

        return (
          <div
            style={{
              backgroundImage: `url('${backgroundImage}')`,
            }}
            className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center cursor-pointer portfolio-page"
          >
            {/* Inner Container */}
            <div
              className="w-[90%] min-w-[380px] bg-opacity-90 p-8 flex flex-col items-center"
              style={{
                backgroundColor: bgColor,
                marginLeft: "110px",
                marginRight: "110px",
              }}
            >
              {/* Heading (now positioned above the grid) */}
              <h2 className="text-4xl font-bold text-white mb-4">Project 1 [ Mood Board ]</h2>

              {/* Image Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Image + Text 1 */}
                <div className="flex flex-col items-center">
                  <img
                    src="/colorPalette.jpg"
                    alt="colorPalette"
                    className="rounded-lg w-40 h-40 object-cover"
                  />
                  <p className="text-white text-center mt-4">Color palette</p>
                </div>

                {/* Image + Text 2 */}
                <div className="flex flex-col items-center">
                  <img
                    src="/moodBoard.jpg"
                    alt="moodBoard"
                    className="rounded-lg w-40 h-40 object-cover"
                  />
                  <p className="text-white text-center mt-4">Fabric Textures</p>
                </div>

                {/* Image + Text 3 */}
                <div className="flex flex-col items-center">
                  <img
                    src="/inspo.jpg"
                    alt="inspo"
                    className="rounded-lg w-40 h-40 object-cover"
                  />
                  <p className="text-white text-center mt-4">Inspiration</p>
                </div>
              </div>
            </div>
          </div>
        );
};

