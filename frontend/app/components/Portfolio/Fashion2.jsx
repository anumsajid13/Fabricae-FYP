import React, { useState, useEffect, useRef,  forwardRef,
  useImperativeHandle, } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { ChromePicker } from "react-color";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const FashionLayout  = forwardRef((props, ref) => {
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
  const [heading, setHeading] = useState(pageState?.heading || "About Me");
  const [description, setDescription] = useState(
    pageState?.description ||

          "My work is inspired by [Culture, Art etc.I believe in creating fashion that is [Sustainable, Timeless, Experimental etc.]. Each piece tells a story and is designed with [Craftsmanship, Ethical practices]",

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
    const [styledContent, setStyledContent] = useState(() => {
      if (pageState?.styledContent) {
        return pageState.styledContent;
      }
      return {
        heading: { text: heading, segments: [{ text: heading, styles: {} }] },
        description: { text: description, segments: [{ text: description, styles: {} }] },

      };
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

    setStyledContent((prev) => {
      const content = prev[type];

      if (!content) return prev;

      const oldSegments = content.segments || [
        { text: content.text, styles: {} },
      ];
      const newSegments = [];

      let remainingText = newText;
      let index = 0;

      // Preserve styles for as many characters as possible
      for (let segment of oldSegments) {
        if (remainingText.length === 0) break;

        const segmentText = segment.text;
        const lengthToCopy = Math.min(segmentText.length, remainingText.length);

        newSegments.push({
          text: remainingText.substring(0, lengthToCopy),
          styles: { ...segment.styles },
        });

        remainingText = remainingText.substring(lengthToCopy);
        index += lengthToCopy;
      }

      // If there's any remaining text, add it as a new unstyled segment
      if (remainingText.length > 0) {
        newSegments.push({ text: remainingText, styles: {} });
      }

      return {
        ...prev,
        [type]: {
          text: newText,
          segments: newSegments,
        },
      };
    });

    // Update the plain text state as well
    switch (type) {
      case "quote":
        setQuote(newText);
        break;
      case "title":
        setTitle(newText);
        break;
      case "label":
        setLabel(newText);
        break;
      default:
        break;
    }
  };

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

  // This updated function should replace the existing updateStyles function in FashionPortfolio.jsx
  const updateStyles = (type, styles, savedStartOffset, savedEndOffset) => {
    console.log("Updating styles for", type, "with", styles);
    console.log("Using saved offsets:", savedStartOffset, savedEndOffset);

    setStyledContent((prev) => {
      const content = prev[type];

      if (!content) return prev;

      // Use the saved offsets from the context instead of trying to get them from the current selection
      let startOffset = savedStartOffset !== undefined ? savedStartOffset : 0;
      let endOffset =
       
        savedEndOffset !== undefined ? savedEndOffset : content.text.length;

      console.log("Applying style from offset", startOffset, "to", endOffset);

      // Create new segments based on the selection
      const newSegments = [];
      let currentOffset = 0;

      content.segments.forEach((segment) => {
        const segmentLength = segment.text.length;
        const segmentEnd = currentOffset + segmentLength;

        if (segmentEnd <= startOffset || currentOffset >= endOffset) {
          // This segment is completely outside the selection
          newSegments.push(segment);
        } else {
          // This segment overlaps with the selection

          // Add part before selection if it exists
          if (currentOffset < startOffset) {
            newSegments.push({
              text: segment.text.substring(0, startOffset - currentOffset),
              styles: { ...segment.styles },
            });
          }

          // Add the selected part with new styles
          newSegments.push({
            text: segment.text.substring(
              Math.max(0, startOffset - currentOffset),
              Math.min(segmentLength, endOffset - currentOffset)
            ),
            styles: { ...segment.styles, ...styles },
          });

          // Add part after selection if it exists
          if (segmentEnd > endOffset) {
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

  const EditableText = ({ content, type, className }) => {
    const textRef = useRef(null);
    const inputRef = useRef(null);
    const [localValue, setLocalValue] = useState("");

    // Initialize local value when editing starts
    useEffect(() => {
      if (editingField === type  && content) {
        setLocalValue(content.text);
      }
    }, [editingField, type, content]);

    const handleInputChange = (e) => {
      const newText = e.target.value;
      setLocalValue(newText);

      // Only update the parent state when input loses focus
      // This prevents re-rendering during typing
    };

    const handleInputBlur = () => {
      // Update the parent state with final value
      handleTextChange({ target: { value: localValue } }, type);
      setEditingField(null);
    };

    const handleInputKeyDown = (e) => {
      if (e.key === "Enter") {
        handleInputBlur();
      }
    };

    if (editingField === type && content) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
          className={`bg-transparent border-b border-white focus:outline-none ${className}`}
          style={{
            width: "100%",
            boxSizing: "border-box",
            display: "block",
            whiteSpace: "pre",
          }}
        />
      );
    }

    if (!content || !content.segments) return null;

    return (
      <div
        ref={textRef}
        className={className}
        onMouseUp={(e) => handleLocalTextSelection(e, type)}
        onClick={() => setEditingField(type)}
      >
        {content.segments.map((segment, index) => (
          <span key={index} style={segment.styles}>
            {segment.text}
          </span>
        ))}
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

  
  // Expose the save function to the parent
  useImperativeHandle(ref, () => ({
    saveState ,
  }));


  const saveState = async () => {
    try {
      console.log("handleSave function called");

      const username = localStorage.getItem("userEmail"); // Get username from local storage

      if (!username) {
        console.error("Username not found in local storage");
        return;
      }

      const portfolioId = 1; // Hardcoded portfolioId
      const pageId = 2; // Hardcoded pageId

      const stateToSave = {
        username,
        portfolioId,
        pageId,
        backgroundImage,
        modelImage: innerContainerImage,
        styledContent,
        elementPositions: {
          heading: getElementPosition(componentId, "heading"),
          description: getElementPosition(componentId, "description"),
          smallImages: smallImages.map((_, index) =>
            getElementPosition(componentId, `smallImage-${index}`)
          ),
        },
        smallImages,
        heading,
        description,
        bgColor
      };

      console.log("State to save:", stateToSave);

      // Send the state to the backend
      const response = await fetch("http://localhost:5000/api/save-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          username: username, // Send username in headers
        },
        body: JSON.stringify(stateToSave),
      });

      if (!response.ok) throw new Error("Failed to save portfolio");
      const result = await response.json();
      console.log("Portfolio saved successfully:", result);
    } catch (error) {
      console.error("Error in handleSave function:", error);
    }
  };

  const loadState = async () => {
    try {
      console.log("Attempting to load portfolio state");

      const username = localStorage.getItem("userEmail");
      if (!username) {
        console.error("Username not found in local storage");
        return;
      }

      const portfolioId = "1"; // Hardcoded portfolioId
      const pageId = "2"; // Hardcoded pageId

      const response = await fetch(
        `http://localhost:5000/api/load-portfolio?username=${username}&portfolioId=${portfolioId}&pageId=${pageId}`,
        {
          method: "GET",
          headers: {
            username: username, // Send username in headers
          },
        }
      );

      console.log("Response status:", response.status);
      if (!response.ok) throw new Error("Failed to load portfolio");

      const savedStateArray = await response.json();
      console.log("aaas", savedStateArray);
      const savedState = savedStateArray[0];
      console.log("Loaded state from API:", savedState);

      console.log("Quote in savedState:", savedState.quote);

      if (!savedState || typeof savedState !== "object") {
        console.error("Invalid state loaded:", savedState);
        return;
      }

      // Update the component's state with the loaded data
      if (savedState.backgroundImage)
        setBackgroundImage(savedState.backgroundImage);
      if (savedState.modelImage) setInnerContainerImage(savedState.modelImage);
      if (savedState.smallImages) setSmallImages(savedState.smallImages);
      if (savedState.heading) setHeading(savedState.heading);
      if (savedState.description) setDescription(savedState.description);
      if (savedState.bgColor) setBgColor(savedState.bgColor);

      // Update styledContent if it exists
      if (savedState.styledContent) {
        setStyledContent(savedState.styledContent);
      }

      // Update element positions if they exist
      if (savedState.elementPositions) {
        if (savedState.elementPositions.heading) {
          updateElementPosition(
            componentId,
            "heading",
            savedState.elementPositions.heading
          );
        }
        if (savedState.elementPositions.description) {
          updateElementPosition(
            componentId,
            "description",
            savedState.elementPositions.description
          );
        }
        if (savedState.elementPositions.smallImages) {
          savedState.elementPositions.smallImages.forEach((position, index) => {
            updateElementPosition(componentId, `smallImage-${index}`, position);
          });
        }
      }

      console.log("Portfolio loaded successfully");
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  // Load portfolio state when the component mounts
  useEffect(() => {
    loadState();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
      className="w-[828px] bg-cover bg-center min-h-screen flex flex-row items-center justify-center cursor-pointer portfolio-page"
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
});
