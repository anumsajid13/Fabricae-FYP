import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { ChromePicker } from "react-color";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const FashionLayout = () => {
  // Access fashion context
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
  const componentId = "fashion-layout";
  const [backgroundImage, setBackgroundImage] = useState(
    pageState.backgroundImage || "/Picture7.jpg"
  );
  const [innerContainerImage, setInnerContainerImage] = useState(
    pageState.innerContainerImage || null
  );
  const [bgColor, setBgColor] = useState("#a3846f");
  const [heading, setHeading] = useState(pageState.heading || "About Me");
  const [description, setDescription] = useState(
    pageState.description || [
      "My work is inspired by [Culture, Art etc.]",
      "I believe in creating fashion that is [Sustainable, Timeless, Experimental etc.]",
      "Each piece tells a story and is designed with [Craftsmanship, Ethical practices]",
    ]
  );
  const [editingField, setEditingField] = useState(null);
  const backgroundInputRef = useRef(null);
  const innerContainerInputRef = useRef(null);
  const [smallImages, setSmallImages] = useState(
    pageState.smallImages || [
      "/Picture8.jpg",
      "/Picture9.jpg",
      "/Picture10.jpg",
      "/Picture11.jpg",
    ]
  );
  const [activeSmallImageIndex, setActiveSmallImageIndex] = useState(null);

  const [showImageOptions, setShowImageOptions] = useState(null); // 'background' or 'model'

  // Store text with styling information
  const [styledContent, setStyledContent] = useState({
    heading: {
      text: heading,
      segments: [{ text: heading, styles: {} }],
    },
    description: {
      text: description.join("\n"), // Join array into a single string for editing
      segments: [{ text: description.join("\n"), styles: {} }],
    },
  });
  const [activeDraggable, setActiveDraggable] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

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
      description,
      backgroundImage,
      innerContainerImage,
      smallImages,
      styledContent,
    });
  }, [
    heading,
    description,
    backgroundImage,
    innerContainerImage,
    smallImages,
    styledContent,
    pageId,
    updatePageState,
  ]);

  const handleDragStart = (key) => {
    setActiveDraggable(key);
  };

  // Handle small image upload
  const handleSmallImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSmallImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[activeSmallImageIndex] = imageUrl; // Update the specific small image
        return updatedImages;
      });
    }
    e.target.value = ""; // Reset the file input
  };

  // Handle small image selection from gallery
  const handleSelectSmallImageFromGallery = (imageUrl) => {
    setSmallImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[activeSmallImageIndex] = imageUrl; // Update the specific small image
      return updatedImages;
    });
    setShowGalleryModal(false); // Close the gallery modal
    setShowImageOptions(null); // Close the options modal
  };

  // Handle text change for heading or description
  const handleTextChange = (e, type) => {
    const newText = e.target.value;

    if (type === "heading") {
      setHeading(newText);
    } else if (type === "description") {
      setDescription(newText.split("\n")); // Split text into array for bullet points
    }

    setStyledContent((prev) => ({
      ...prev,
      [type]: {
        text: newText,
        segments: [{ text: newText, styles: {} }],
      },
    }));
  };

  // Handle local text selection for styling
  const handleLocalTextSelection = (e, type) => {
    if (editingField) return; // Don't handle selection while editing

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
        componentId, // Include the component ID
      };

      // Send selection to the global context
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
  const EditableText = ({ content, type, className }) => {
    const textRef = useRef(null);
    const inputRef = useRef(null);
    const [localValue, setLocalValue] = useState("");

    useEffect(() => {
      if (editingField === type) {
        setLocalValue(content.text);
      }
    }, [editingField, type, content.text]);

    const handleInputChange = (e) => {
      setLocalValue(e.target.value);
    };

    const handleInputBlur = () => {
      handleTextChange({ target: { value: localValue } }, type);
      setEditingField(null);
    };

    const handleInputKeyDown = (e) => {
      if (e.key === "Enter" && type === "heading") {
        handleInputBlur();
      }
    };

    return (
      <div
        className={`relative w-full ${className}`}
        style={{
          minHeight: type === "heading" ? "50px" : "200px", // Ensures height doesn't collapse
          position: "relative",
          overflow: "hidden", // Prevent overflow
        }}
      >
        {editingField === type ? (
          type === "heading" ? (
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
              className="bg-transparent border-b border-white focus:outline-none w-full"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%", // Take up full height
              }}
            />
          ) : (
            <textarea
              ref={inputRef}
              value={localValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              autoFocus
              className="bg-transparent border border-white focus:outline-none w-full"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%", // Take up full height
              }}
            />
          )
        ) : (
          <div
            ref={textRef}
            className="cursor-text w-full"
            onClick={() => setEditingField(type)}
            style={{
              minHeight: type === "heading" ? "50px" : "80px", // Reserves space even when not editing
              overflow: "hidden", // Prevent overflow
            }}
          >
            {type === "description" ? (
              <ul className="list-disc pl-5">
                {content.text.split("\n").map((line, index) => (
                  <li key={index} style={content.segments[0]?.styles}>
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <span style={content.segments[0]?.styles}>{content.text}</span>
            )}
          </div>
        )}
      </div>
    );
  };
  // Handle background image upload
  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
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
  };

  // Handle double-click to trigger file input for background
  const handleDoubleClickBackground = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowImageOptions("background");
  };

  // Handle double-click to trigger file input for inner container
  const handleDoubleClickInnerContainer = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowImageOptions("inner");
  };

  // Handle double-click to trigger file input for small images
  const handleDoubleClickSmallImage = (e, index) => {
    e.stopPropagation(); // Prevent event bubbling
    setActiveSmallImageIndex(index); // Set the active small image index
    setShowImageOptions("smallImage");
  };

  const handleCloseModal = () => {
    setShowImageOptions(null);
  };

  const handleChooseFromComputer = (type) => {
    // Use existing refs to trigger file input
    if (type === "background") {
      backgroundInputRef.current.click();
    } else if (type === "inner") {
      innerContainerInputRef.current.click();
    } else if (type === "smallImage") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = handleSmallImageUpload; // Handle small image upload
      fileInput.click();
    }
    setShowImageOptions(null); // Close the modal
  };

  const handleChooseFromGallery = (type) => {
    setShowGalleryModal(true); // Show the gallery modal
    setShowImageOptions(type);
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

  return (
    <div
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
      className="bg-cover bg-center min-h-screen flex flex-row items-center justify-center cursor-pointer portfolio-page"
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

      <div
        className="w-[90%] bg-opacity-90 p-8 flex flex-row md:flex-row gap-6"
        style={{
          backgroundColor: bgColor,
          height: "400px",
          backgroundImage: innerContainerImage
            ? `url('${innerContainerImage}')`
            : "none",
        }}
        onDoubleClick={handleDoubleClickInnerContainer}
      >
        {/* Left Section with Images */}
        <div
          className="grid grid-cols-2 grid-rows-2 gap-8"
          style={{ flex: "0 0 40%", height: "100%" }}
        >
          {smallImages.map((img, index) => {
            const imagePosition = getElementPosition(
              componentId,
              `smallImage-${index}`
            );
            return (
              <Draggable
                key={index}
                disabled={activeDraggable !== `smallImage-${index}`}
                defaultPosition={{ x: imagePosition.x, y: imagePosition.y }}
                onStop={(e, data) => {
                  console.log(`Updating smallImage-${index} position:`, {
                    x: data.x,
                    y: data.y,
                  });
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
                  minConstraints={[100, 500]}
                  maxConstraints={[300, 500]}
                  axis="both"
                  resizeHandles={
                    activeDraggable === `smallImage-${index}`
                      ? ["se", "sw", "ne", "nw"]
                      : []
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
                    className="col-span-1 row-span-1 cursor-pointer relative"
                    onDoubleClick={(e) => handleDoubleClickSmallImage(e, index)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDragStart(`smallImage-${index}`);
                    }}
                  >
                    <img
                      src={img}
                      alt={`Fashion ${index}`}
                      className="rounded-lg w-full h-full object-cover"
                      style={{ maxHeight: "130px", minWidth: "130px" }} // Adjust image height
                    />
                  </div>
                </ResizableBox>
              </Draggable>
            );
          })}
        </div>

        {/* Right Section with Text */}
        <div
          className="flex-1 text-white flex flex-col items-center gap-4"
          style={{ width: "100%" }}
        >
          {/* Heading - Draggable and Resizable */}
          <div className="relative w-full z-20">
            <Draggable
              disabled={activeDraggable !== "heading"}
              defaultPosition={{
                x: getElementPosition(componentId, "heading").x,
                y: getElementPosition(componentId, "heading").y,
              }}
              onStop={(e, data) => {
                console.log("Updating heading position:", {
                  x: data.x,
                  y: data.y,
                });
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
                resizeHandles={
                  activeDraggable === "heading" ? ["se", "sw", "ne", "nw"] : []
                }
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
                    content={styledContent.heading}
                    type="heading"
                    className="text-4xl font-bold cursor-text text-center w-full"
                  />
                </div>
              </ResizableBox>
            </Draggable>
          </div>

          {/* Description - Draggable and Resizable */}
          <div className="relative w-full z-20">
            <Draggable
              disabled={activeDraggable !== "description"}
              defaultPosition={{
                x: getElementPosition(componentId, "description").x,
                y: getElementPosition(componentId, "description").y,
              }}
              onStop={(e, data) => {
                console.log("Updating description position:", {
                  x: data.x,
                  y: data.y,
                });
                updateElementPosition(componentId, "description", {
                  x: data.x,
                  y: data.y,
                  width: getElementPosition(componentId, "description").width,
                  height: getElementPosition(componentId, "description").height,
                });
              }}
            >
              <ResizableBox
                width={getElementPosition(componentId, "description").width}
                height={getElementPosition(componentId, "description").height}
                minConstraints={[200, 100]}
                maxConstraints={[600, 300]}
                axis="both"
                resizeHandles={
                  activeDraggable === "description"
                    ? ["se", "sw", "ne", "nw"]
                    : []
                }
                onResizeStop={(e, { size }) => {
                  updateElementPosition(componentId, "description", {
                    x: getElementPosition(componentId, "description").x,
                    y: getElementPosition(componentId, "description").y,
                    width: size.width,
                    height: size.height,
                  });
                }}
              >
                <div
                  className="relative text-center cursor-move"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDragStart("description");
                  }}
                >
                  <EditableText
                    content={styledContent.description}
                    type="description"
                    className="text-lg cursor-text justify-center ml-10 w-full text-justify"
                    style={{ whiteSpace: "pre-wrap" }} // Ensure text wraps properly
                  />
                </div>
              </ResizableBox>
            </Draggable>
          </div>
        </div>
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
