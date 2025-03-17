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
  const [modelImage1, setModelImage1] = useState(
    pageState.modelImage1 || "/Picture12.jpg"
  );
  const [modelImage2, setModelImage2] = useState(
    pageState.modelImage2 || "/Picture13.jpg"
  );
  const [modelImage3, setModelImage3] = useState(
    pageState.modelImage3 || "/Picture14.jpg"
  );
  const [modelImage4, setModelImage4] = useState(
    pageState.modelImage4 || "/Picture15.jpg"
  );
  const [modelImage5, setModelImage5] = useState(
    pageState.modelImage5 || "/Picture16.jpg"
  );

  const [activeDraggable, setActiveDraggable] = useState(null);
  const backgroundInputRef = useRef(null);
  const modelInputRef1 = useRef(null);
  const modelInputRef2 = useRef(null);
  const modelInputRef3 = useRef(null);
  const modelInputRef4 = useRef(null);
  const modelInputRef5 = useRef(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(null); // 'background' or 'model'
  const [activeModelImageIndex, setActiveModelImageIndex] = useState(null);

  // Update page state whenever any state changes
  useEffect(() => {
    updatePageState(pageId, {
      backgroundImage,
      modelImage1,
      modelImage2,
      modelImage3,
      modelImage4,
      modelImage5,
    });
  }, [
    backgroundImage,
    modelImage1,
    modelImage2,
    modelImage3,
    modelImage4,
    modelImage5,
    pageId,
    updatePageState,
  ]);

  const handleDragStart = (key) => {
    setActiveDraggable(key);
  };

  const handleImageClick = (type) => {
    setShowImageOptions(type);
  };

  const handleCloseModal = () => {
    setShowImageOptions(null);
  };

  const handleChooseFromComputer = (type) => {
    if (type === "background") {
      backgroundInputRef.current.click();
    } else if (type === "model1") {
      modelInputRef1.current.click();
    } else if (type === "model2") {
      modelInputRef2.current.click();
    } else if (type === "model3") {
      modelInputRef3.current.click();
    } else if (type === "model4") {
      modelInputRef4.current.click();
    } else if (type === "model5") {
      modelInputRef5.current.click();
    }
    setShowImageOptions(null); // Close the modal
  };

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleChooseFromGallery = (type) => {
    setShowGalleryModal(true); // Show the gallery modal
    setShowImageOptions(type);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    if (showImageOptions === "background") {
      setBackgroundImage(imageUrl); // Update background image
    } else if (showImageOptions === "model1") {
      setModelImage1(imageUrl); // Update model image 1
    } else if (showImageOptions === "model2") {
      setModelImage2(imageUrl); // Update model image 2
    } else if (showImageOptions === "model3") {
      setModelImage3(imageUrl); // Update model image 3
    } else if (showImageOptions === "model4") {
      setModelImage4(imageUrl); // Update model image 4
    } else if (showImageOptions === "model5") {
      setModelImage5(imageUrl); // Update model image 5
    }
    setShowGalleryModal(false); // Close the gallery modal
    setShowImageOptions(null);
  };

  // Function to handle image click and enable dragging/resizing
  const handleImageActivate = (key) => {
    setActiveDraggable(key);
  };

  return (
    <div
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
      className="w-[828px] bg-cover bg-center min-h-screen flex flex-col items-center justify-center cursor-pointer portfolio-page"
      onClick={() => setActiveDraggable(null)} // Click outside to deactivate
    >
      <input
        type="file"
        accept="image/*"
        ref={backgroundInputRef}
        className="hidden"
        onChange={(e) => handleImageUpload(e, setBackgroundImage)}
      />

      <input
        type="file"
        accept="image/*"
        ref={modelInputRef1}
        className="hidden"
        onChange={(e) => handleImageUpload(e, setModelImage1)}
      />

      <input
        type="file"
        accept="image/*"
        ref={modelInputRef2}
        className="hidden"
        onChange={(e) => handleImageUpload(e, setModelImage2)}
      />

      <input
        type="file"
        accept="image/*"
        ref={modelInputRef3}
        className="hidden"
        onChange={(e) => handleImageUpload(e, setModelImage3)}
      />

      <input
        type="file"
        accept="image/*"
        ref={modelInputRef4}
        className="hidden"
        onChange={(e) => handleImageUpload(e, setModelImage4)}
      />

      <input
        type="file"
        accept="image/*"
        ref={modelInputRef5}
        className="hidden"
        onChange={(e) => handleImageUpload(e, setModelImage5)}
      />

      <div
        className="text-white w-[90%] min-w-[500px] h-[400px] bg-opacity-90 p-8 flex flex-row items-center"
        style={{
          backgroundColor: bgColor,
          height: "400px",
          marginLeft: "110px",
          marginRight: "110px",
        }}
      >
        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 md:w-2/3">
          {/* Model Image 1 */}
          <div className="row-span-2">
            <Draggable
              disabled={activeDraggable !== "model1"}
              defaultPosition={{
                x: getElementPosition(componentId, "model1").x,
                y: getElementPosition(componentId, "model1").y,
              }}
              onStop={(e, data) => {
                updateElementPosition(componentId, "model1", {
                  x: data.x,
                  y: data.y,
                  width: getElementPosition(componentId, "model1").width,
                  height: getElementPosition(componentId, "model1").height,
                });
              }}
            >
              <ResizableBox
                width={getElementPosition(componentId, "model1").width}
                height={getElementPosition(componentId, "model1").height}
                minConstraints={[100, 200]}
                maxConstraints={[400, 600]}
                axis="both"
                resizeHandles={
                  activeDraggable === "model1" ? ["se", "sw", "ne", "nw"] : []
                }
                onResizeStop={(e, { size }) => {
                  updateElementPosition(componentId, "model1", {
                    x: getElementPosition(componentId, "model1").x,
                    y: getElementPosition(componentId, "model1").y,
                    width: size.width,
                    height: size.height,
                  });
                }}
              >
                <img
                  src={modelImage1}
                  alt="Model 1"
                  className="w-full h-80 object-cover rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageActivate("model1");
                  }}
                  onDoubleClick={() => handleImageClick("model1")}
                />
              </ResizableBox>
            </Draggable>
          </div>

          {/* Model Image 2 */}
          <Draggable
            disabled={activeDraggable !== "model2"}
            defaultPosition={{
              x: getElementPosition(componentId, "model2").x,
              y: getElementPosition(componentId, "model2").y,
            }}
            onStop={(e, data) => {
              updateElementPosition(componentId, "model2", {
                x: data.x,
                y: data.y,
                width: getElementPosition(componentId, "model2").width,
                height: getElementPosition(componentId, "model2").height,
              });
            }}
          >
            <ResizableBox
              width={getElementPosition(componentId, "model2").width}
              height={getElementPosition(componentId, "model2").height}
              minConstraints={[100, 100]}
              maxConstraints={[400, 400]}
              axis="both"
              resizeHandles={
                activeDraggable === "model2" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "model2", {
                  x: getElementPosition(componentId, "model2").x,
                  y: getElementPosition(componentId, "model2").y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <img
                src={modelImage2}
                alt="Model 2"
                className="w-full h-40 object-cover rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageActivate("model2");
                }}
                onDoubleClick={() => handleImageClick("model2")}
              />
            </ResizableBox>
          </Draggable>

          {/* Model Image 3 */}
          <Draggable
            disabled={activeDraggable !== "model3"}
            defaultPosition={{
              x: getElementPosition(componentId, "model3").x,
              y: getElementPosition(componentId, "model3").y,
            }}
            onStop={(e, data) => {
              updateElementPosition(componentId, "model3", {
                x: data.x,
                y: data.y,
                width: getElementPosition(componentId, "model3").width,
                height: getElementPosition(componentId, "model3").height,
              });
            }}
          >
            <ResizableBox
              width={getElementPosition(componentId, "model3").width}
              height={getElementPosition(componentId, "model3").height}
              minConstraints={[100, 100]}
              maxConstraints={[400, 400]}
              axis="both"
              resizeHandles={
                activeDraggable === "model3" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "model3", {
                  x: getElementPosition(componentId, "model3").x,
                  y: getElementPosition(componentId, "model3").y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <img
                src={modelImage3}
                alt="Model 3"
                className="w-full h-40 object-cover rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageActivate("model3");
                }}
                onDoubleClick={() => handleImageClick("model3")}
              />
            </ResizableBox>
          </Draggable>

          {/* Model Image 4 */}
          <Draggable
            disabled={activeDraggable !== "model4"}
            defaultPosition={{
              x: getElementPosition(componentId, "model4").x,
              y: getElementPosition(componentId, "model4").y,
            }}
            onStop={(e, data) => {
              updateElementPosition(componentId, "model4", {
                x: data.x,
                y: data.y,
                width: getElementPosition(componentId, "model4").width,
                height: getElementPosition(componentId, "model4").height,
              });
            }}
          >
            <ResizableBox
              width={getElementPosition(componentId, "model4").width}
              height={getElementPosition(componentId, "model4").height}
              minConstraints={[200, 100]}
              maxConstraints={[800, 400]}
              axis="both"
              resizeHandles={
                activeDraggable === "model4" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "model4", {
                  x: getElementPosition(componentId, "model4").x,
                  y: getElementPosition(componentId, "model4").y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <img
                src={modelImage4}
                alt="Model 4"
                className="col-span-2 w-full h-40 object-cover rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageActivate("model4");
                }}
                onDoubleClick={() => handleImageClick("model4")}
              />
            </ResizableBox>
          </Draggable>
        </div>

        {/* Model Image 5 */}
        <Draggable
          disabled={activeDraggable !== "model5"}
          defaultPosition={{
            x: getElementPosition(componentId, "model5").x,
            y: getElementPosition(componentId, "model5").y,
          }}
          onStop={(e, data) => {
            updateElementPosition(componentId, "model5", {
              x: data.x,
              y: data.y,
              width: getElementPosition(componentId, "model5").width,
              height: getElementPosition(componentId, "model5").height,
            });
          }}
        >
          <ResizableBox
            width={getElementPosition(componentId, "model5").width}
            height={getElementPosition(componentId, "model5").height}
            minConstraints={[100, 200]}
            maxConstraints={[400, 600]}
            axis="both"
            resizeHandles={
              activeDraggable === "model5" ? ["se", "sw", "ne", "nw"] : []
            }
            onResizeStop={(e, { size }) => {
              updateElementPosition(componentId, "model5", {
                x: getElementPosition(componentId, "model5").x,
                y: getElementPosition(componentId, "model5").y,
                width: size.width,
                height: size.height,
              });
            }}
          >
            <img
              src={modelImage5}
              alt="Model 5"
              className="ms-6 col-span-2 w-40 h-80 object-cover rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleImageActivate("model5");
              }}
              onDoubleClick={() => handleImageClick("model5")}
            />
          </ResizableBox>
        </Draggable>
      </div>

      {/* Image Options Modal */}
      {showImageOptions && (
        <ImageOptionsModal
          onClose={handleCloseModal}
          onChooseFromComputer={() =>
            handleChooseFromComputer(showImageOptions)
          }
          onChooseFromGallery={() => handleChooseFromGallery(showImageOptions)}
        />
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <GalleryModal
          onClose={() => setShowGalleryModal(false)}
          onSelectImage={handleSelectImageFromGallery}
        />
      )}
    </div>
  );
};
