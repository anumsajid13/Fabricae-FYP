import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const Fashion = () => {
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
  const [heading, setHeading] = useState(pageState.heading || "Project 1 [ Mood Board ]");
  const [editingField, setEditingField] = useState(null);
  const backgroundInputRef = useRef(null);
  const innerContainerInputRef = useRef(null);
  const [smallImages, setSmallImages] = useState(
    pageState.smallImages || [
      "/colorPalette.jpg",
      "/moodBoard.jpg",
      "/inspo.jpg",
    ]
  );
  const [smallImageTexts, setSmallImageTexts] = useState(
    pageState.smallImageTexts || ["Color palette", "Fabric Textures", "Inspiration"]
  );
  const [activeSmallImageIndex, setActiveSmallImageIndex] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(null); // 'background' or 'smallImage'
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeDraggable, setActiveDraggable] = useState(null);

  // Register this component with context
  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, []);

  // Update page state whenever any state changes
  useEffect(() => {
    updatePageState(pageId, {
      heading,
      smallImages,
      smallImageTexts,
      backgroundImage,
      innerContainerImage,
    });
  }, [
    heading,
    smallImages,
    smallImageTexts,
    backgroundImage,
    innerContainerImage,
    pageId,
    updatePageState,
  ]);

  const handleDragStart = (key) => {
    setActiveDraggable(key);
  };

  // Handle background image upload
  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
    // Close the modal after setting the image
    setShowImageOptions(null);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    if (showImageOptions === "background") {
      setBackgroundImage(imageUrl); // Update background image
    } else if (showImageOptions === "inner") {
      setInnerContainerImage(imageUrl); // Update model image
    } else if (showImageOptions === "smallImage") {
      handleSelectSmallImageFromGallery(imageUrl); // Update small image
    }
    setShowGalleryModal(false); // Close the gallery modal
    setShowImageOptions(null);
  };

  // Handle inner container image upload
  const handleInnerContainerImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setInnerContainerImage(imageUrl);

      // Reset input field to allow the same file to be selected again
      e.target.value = "";
    }
    // Close the modal after setting the image
    setShowImageOptions(null);
  };

  // Handle small image upload
  const handleSmallImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSmallImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index] = imageUrl;
        return updatedImages;
      });
      // Close the modal after setting the image
      setShowImageOptions(null);
    }
    e.target.value = ""; // Reset the file input
  };

  // Handle small image selection from gallery
  const handleSelectSmallImageFromGallery = (imageUrl) => {
    setSmallImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[activeSmallImageIndex] = imageUrl;
      return updatedImages;
    });
    setShowGalleryModal(false);
    setShowImageOptions(null);
  };

  // Handle double-click to trigger file input for background
  const handleDoubleClickBackground = (e) => {
    e.stopPropagation();
    setShowImageOptions("background");
  };

  // Handle double-click to trigger file input for inner container
  const handleDoubleClickInnerContainer = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowImageOptions("inner");
  };

  // Handle double-click to trigger file input for small images
  const handleDoubleClickSmallImage = (e, index) => {
    e.stopPropagation();
    setActiveSmallImageIndex(index);
    setShowImageOptions("smallImage");
  };

  // Handle text change for heading or small image texts
  const handleTextChange = (e, type, index) => {
    const newText = e.target.value;
    if (type === "heading") {
      setHeading(newText);
    } else if (type === "smallImageText") {
      setSmallImageTexts((prevTexts) => {
        const updatedTexts = [...prevTexts];
        updatedTexts[index] = newText;
        return updatedTexts;
      });
    }
  };

  // Handle local text selection for styling
  const handleLocalTextSelection = (e, type) => {
    if (editingField) return;

    const selection = window.getSelection();
    const text = selection.toString();

    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;

      const selectedText = {
        text,
        type,
        startOffset,
        endOffset,
        componentId,
      };

      handleTextSelection(selectedText);
    }
  };

  // Update styles for selected text
  const updateStyles = (type, styles) => {
    setStyledContent((prev) => {
      const content = prev[type];
      if (!content) return prev;

      // Get current selection from context
      const selection = {
        startOffset: 0,
        endOffset: content.text.length,
        ...(window.getSelection && {
          startOffset: window.getSelection().getRangeAt(0).startOffset,
          endOffset: window.getSelection().getRangeAt(0).endOffset,
        }),
      };

      const { startOffset, endOffset } = selection;

      const newSegments = [];
      let currentOffset = 0;

      content.segments.forEach((segment) => {
        const segmentLength = segment.text.length;

        if (currentOffset + segmentLength <= startOffset) {
          newSegments.push(segment);
        } else if (currentOffset >= endOffset) {
          newSegments.push(segment);
        } else {
          if (currentOffset < startOffset) {
            newSegments.push({
              text: segment.text.substring(0, startOffset - currentOffset),
              styles: { ...segment.styles },
            });
          }

          newSegments.push({
            text: segment.text.substring(
              Math.max(0, startOffset - currentOffset),
              Math.min(segmentLength, endOffset - currentOffset)
            ),
            styles: { ...segment.styles, ...styles },
          });

          if (currentOffset + segmentLength > endOffset) {
            newSegments.push({
              text: segment.text.substring(endOffset - currentOffset),
              styles: { ...segment.styles },
            });
          }
        }

        currentOffset += segmentLength;
      });

      return {
        ...prev,
        [type]: {
          text: content.text,
          segments: newSegments,
        },
      };
    });
  };

  // EditableText component for rendering and editing text
  const EditableText = ({ content, type, index, className }) => {
    const [localValue, setLocalValue] = useState(content);

    useEffect(() => {
      if (editingField === `${type}-${index}`) {
        setLocalValue(content);
      }
    }, [editingField, type, index, content]);

    const handleInputChange = (e) => {
      setLocalValue(e.target.value);
    };

    const handleInputBlur = () => {
      handleTextChange({ target: { value: localValue } }, type, index);
      setEditingField(null);
    };

    const handleInputKeyDown = (e) => {
      if (e.key === "Enter") {
        handleInputBlur();
      }
    };

    return (
      <div
        className={`relative w-full ${className}`}
        onClick={() => setEditingField(`${type}-${index}`)}
      >
        {editingField === `${type}-${index}` ? (
          <input
            type="text"
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            autoFocus
            className="bg-transparent border-b border-white focus:outline-none w-full text-white"
          />
        ) : (
          <span className="text-white">{content}</span>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
      className="w-[828px] bg-cover bg-center min-h-screen flex flex-col items-center justify-center cursor-pointer portfolio-page"
      onDoubleClick={handleDoubleClickBackground}
      onClick={() => setActiveDraggable(null)}
    >
      {/* File input for background image */}
      <input
        type="file"
        accept="image/*"
        ref={backgroundInputRef}
        className="hidden"
        onChange={handleBackgroundImageUpload}
      />

      {/* File input for inner container image */}
      <input
        type="file"
        accept="image/*"
        ref={innerContainerInputRef}
        className="hidden"
        onChange={handleInnerContainerImageUpload}
      />

      {/* Inner Container */}
      <div
        className="w-[90%] min-w-[500px] h-[400px] bg-opacity-90 p-8 flex flex-col items-center"
        style={{
          backgroundColor: bgColor,
          marginLeft: "110px",
          marginRight: "110px",
          backgroundImage: innerContainerImage
            ? `url('${innerContainerImage}')`
            : "none",
        }}
        onDoubleClick={handleDoubleClickInnerContainer}
      >
        {/* Heading - Draggable and Resizable */}
        <Draggable
          disabled={activeDraggable !== "heading"}
          defaultPosition={{
            x: getElementPosition(componentId, "heading").x,
            y: getElementPosition(componentId, "heading").y,
          }}
          onStop={(e, data) => {
            updateElementPosition(componentId, "heading", {
              x: data.x,
              y: data.y,
              width: getElementPosition(componentId, "heading").width,
              height: getElementPosition(componentId, "heading").height,
            });
          }}
        >
          <ResizableBox
            width={getElementPosition(componentId, "heading").width}
            height={getElementPosition(componentId, "heading").height}
            minConstraints={[150, 50]}
            maxConstraints={[500, 200]}
            axis="both"
            resizeHandles={activeDraggable === "heading" ? ["se", "sw", "ne", "nw"] : []}
            onResizeStop={(e, { size }) => {
              updateElementPosition(componentId, "heading", {
                x: getElementPosition(componentId, "heading").x,
                y: getElementPosition(componentId, "heading").y,
                width: size.width,
                height: size.height,
              });
            }}
          >
            <div
              className="relative text-center cursor-move"
              onClick={(e) => {
                e.stopPropagation();
                handleDragStart("heading");
              }}
            >
              <EditableText
                content={heading}
                type="heading"
                index={0}
                className="text-4xl font-bold cursor-text text-center w-full"
              />
            </div>
          </ResizableBox>
        </Draggable>

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-8 mt-8">
          {smallImages.map((img, index) => {
            const imagePosition = getElementPosition(componentId, `smallImage-${index}`);
            return (
              <Draggable
                key={index}
                disabled={activeDraggable !== `smallImage-${index}`}
                defaultPosition={{ x: imagePosition.x, y: imagePosition.y }}
                onStop={(e, data) => {
                  updateElementPosition(componentId, `smallImage-${index}`, {
                    x: data.x,
                    y: data.y,
                    width: imagePosition.width,
                    height: imagePosition.height,
                  });
                }}
              >
                <ResizableBox
                  width={imagePosition.width}
                  height={imagePosition.height}
                  minConstraints={[100, 100]}
                  maxConstraints={[800, 800]}
                  axis="both"
                  resizeHandles={
                    activeDraggable === `smallImage-${index}` ? ["se", "sw", "ne", "nw"] : []
                  }
                  onResizeStop={(e, { size }) => {
                    updateElementPosition(componentId, `smallImage-${index}`, {
                      x: imagePosition.x,
                      y: imagePosition.y,
                      width: size.width,
                      height: size.height,
                    });
                  }}
                >
                  <div
                    className="flex flex-col items-center cursor-pointer relative"
                    onDoubleClick={(e) => handleDoubleClickSmallImage(e, index)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDragStart(`smallImage-${index}`);
                    }}
                  >
                    <img
                      src={img}
                      alt={`Fashion ${index}`}
                      className="rounded-lg w-40 h-40 object-cover"
                    />
                    <EditableText
                      content={smallImageTexts[index]}
                      type="smallImageText"
                      index={index}
                      className="text-white text-center mt-4"
                    />
                  </div>
                </ResizableBox>
              </Draggable>
            );
          })}
        </div>
      </div>

      {/* Image Options Modal */}
      {showImageOptions && (
        <ImageOptionsModal
          onClose={() => setShowImageOptions(null)}
          onChooseFromComputer={() => {
            if (showImageOptions === "background") {
              backgroundInputRef.current.click();
            } else if (showImageOptions === "inner") {
              innerContainerInputRef.current.click();
            } else if (showImageOptions === "smallImage") {
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*";
              fileInput.onchange = (e) => handleSmallImageUpload(e, activeSmallImageIndex);
              fileInput.click();
            }
          }}
          onChooseFromGallery={() => setShowGalleryModal(true)}
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