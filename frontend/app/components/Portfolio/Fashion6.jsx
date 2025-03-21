import React, { useState, useEffect, useRef,forwardRef,
  useImperativeHandle, } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const PortfolioSection =  forwardRef((props, ref) => {
  const {
    handleTextSelection,
    registerComponent,
    applyStyle,
    getPageState,
    updatePageState,
    selectedPage,
    getElementPosition,
    updateElementPosition,
    loadstate, setLoadState
  } = useFashionStore();

  const pageId = `fashion-portfolio-${selectedPage}`;
  const pageState = getPageState(pageId);

  // Component ID for this component
  const componentId = "fashion-collab";
  const [bgColor, setBgColor] = useState("#a3846f");
  const [backgroundImage, setBackgroundImage] = useState(
    pageState.backgroundImage || "/Picture7.jpg"
  );

  // State for images in the grid
  const [smallImages, setSmallImages] = useState(
    pageState.smallImages || [
      "/Picture17.jpg",
      "/Picture18.jpg",
      "/Picture19.jpg",
      "/Picture20.jpg",
    ]
  );

  const [activeDraggable, setActiveDraggable] = useState(null);
  const backgroundInputRef = useRef(null);
  const innerContainerInputRef = useRef(null);
  const [innerContainerImage, setInnerContainerImage] = useState(
    pageState.innerContainerImage || null
  );
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(null); // 'background' or specific image index
  const [activeSmallImageIndex, setActiveSmallImageIndex] = useState(null);

  // State for text content
  const [heading, setHeading] = useState(
    pageState.heading || "Contact & Social Media"
  );
  const [description, setDescription] = useState(
    pageState.description ||
      "Email: [Your Email]\nWebsite: [Your Portfolio Link]\nInstagram: [@YourHandle]"
  );

  // State for styled text content
  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      heading: {
        text: heading,
        segments: [{ text: heading, styles: {} }],
      },
      description: {
        text: description,
        segments: [{ text: description, styles: {} }],
      },
    };
  });

  // Register this component with context when it mounts
  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, []);

  // Update page state whenever any state changes
  useEffect(() => {
    updatePageState(pageId, {
      backgroundImage,
      heading,
      description,
      styledContent,
      innerContainerImage,
      smallImages,
    });
  }, [
    backgroundImage,
    heading,
    description,
    styledContent,
    innerContainerImage,
    smallImages,
    pageId,
    updatePageState,
  ]);

    // Expose the save function to the parent
       useImperativeHandle(ref, () => ({
        saveState ,
      }));

  const saveState = async () => {
    try {
      const username = localStorage.getItem("userEmail");

      if (!username) {
        console.error("Username not found in local storage");
        return;
      }
      const portfolioId = 1; // Hardcoded portfolioId
      const pageId = 6; // Hardcoded pageId

      const stateToSave = {
        username,
        portfolioId,
        pageId,
        backgroundImage,
        innerContainerImage,
        smallImages,
        bgColor,
        heading,
        description,
        styledContent,
        elementPositions: {
          heading: getElementPosition(componentId, "heading"),
          description: getElementPosition(componentId, "description"),
          ...smallImages.reduce((acc, _, index) => {
            acc[`smallImage1-${index}`] = getElementPosition(
              componentId,
              `smallImage1-${index}`
            );
            return acc;
          }, {}),
        },
      };

      const response = await fetch("http://localhost:5000/api/save-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          username: username,
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
      const username = localStorage.getItem("userEmail");
      if (!username) {
        console.error("Username not found in local storage");
        return;
      }

      const portfolioId = 1; // Hardcoded portfolioId
      const pageId = 6; // Hardcoded pageId

      const response = await fetch(
        `http://localhost:5000/api/load-portfolio?username=${username}&portfolioId=${portfolioId}&pageId=${pageId}`,
        {
          method: "GET",
          headers: {
            username: username,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to load portfolio");

      const savedStateArray = await response.json();
      const savedState = savedStateArray[0];

      if (!savedState || typeof savedState !== "object") {
        console.error("Invalid state loaded:", savedState);
        return;
      }

      // Update the component's state with the loaded data
      if (savedState.backgroundImage) setBackgroundImage(savedState.backgroundImage);
      if (savedState.innerContainerImage) setInnerContainerImage(savedState.innerContainerImage);
      if (savedState.smallImages) setSmallImages(savedState.smallImages);
      if (savedState.bgColor) setBgColor(savedState.bgColor);
      if (savedState.heading) setHeading(savedState.heading);
      if (savedState.description) setDescription(savedState.description);
      if (savedState.styledContent) setStyledContent(savedState.styledContent);

      // Update element positions if they exist
      if (savedState.elementPositions) {
        Object.keys(savedState.elementPositions).forEach((key) => {
          updateElementPosition(componentId, key, savedState.elementPositions[key]);
        });
      }

      console.log("Portfolio loaded successfully");
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };


  useEffect(() => {
      if (loadstate) {
        const loadPortfolioState = async () => {
          await loadState(); // Call your existing loadState function
          setLoadState(false); // Reset loadState to false after loading

        };
        loadPortfolioState();

      }
    }, [loadState, setLoadState]);

  const handleDragStart = (key) => {
    setActiveDraggable(key);
  };

  const handleImageClick = (index) => {
    setShowImageOptions(index); // Set the index of the image being edited
  };

  const handleCloseModal = () => {
    setShowImageOptions(null);
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
      case "heading":
        setHeading(newText);
        break;
      case "description":
        setDescription(newText);
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

      // Find the container element for this text type
      const textContainer = e.currentTarget;

      // Calculate the absolute offsets by traversing the text nodes
      let absoluteStartOffset = 0;
      let absoluteEndOffset = 0;
      let foundStart = false;
      let foundEnd = false;

      // Recursive function to traverse text nodes and calculate offsets
      const traverseNodes = (node, offset = 0) => {
        if (foundStart && foundEnd) return offset;

        if (node.nodeType === Node.TEXT_NODE) {
          const nodeLength = node.textContent.length;

          // Check if this node contains the start of the selection
          if (!foundStart && node === range.startContainer) {
            absoluteStartOffset = offset + range.startOffset;
            foundStart = true;
          }

          // Check if this node contains the end of the selection
          if (!foundEnd && node === range.endContainer) {
            absoluteEndOffset = offset + range.endOffset;
            foundEnd = true;
          }

          return offset + nodeLength;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          let currentOffset = offset;
          for (let i = 0; i < node.childNodes.length; i++) {
            currentOffset = traverseNodes(node.childNodes[i], currentOffset);
          }
          return currentOffset;
        }

        return offset;
      };

      traverseNodes(textContainer);

      console.log('Selection offsets:', absoluteStartOffset, absoluteEndOffset);

      const selectedText = {
        text,
        type,
        startOffset: absoluteStartOffset,
        endOffset: absoluteEndOffset,
        componentId, // Include the component ID
      };

      console.log('Selected text is', selectedText);
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
      if (editingField === type && content) {
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

  const [editingField, setEditingField] = useState(null);

  return (
    <div
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
      className="w-[828px] bg-cover bg-center min-h-screen flex flex-col items-center justify-center cursor-pointer portfolio-page"
      onClick={() => setActiveDraggable(null)} // Click outside to deactivate
      onDoubleClick={handleDoubleClickBackground}
    >
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
        className="text-white w-[90%] min-w-[500px] h-[400px] bg-opacity-90 p-8 flex flex-row items-center"
        style={{
          backgroundColor: bgColor,
          height: "400px",
          marginLeft: "110px",
          marginRight: "110px",
          backgroundImage: innerContainerImage
            ? `url('${innerContainerImage}')`
            : "none",
        }}
        onDoubleClick={handleDoubleClickInnerContainer}
      >
        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 md:w-2/3">
          {smallImages.map((image, index) => {
            const imagePosition = getElementPosition(
              componentId,
              `smallImage1-${index}`
            );
            return (
              <Draggable
                key={index}
                disabled={activeDraggable !== `smallImage1-${index}`}
                defaultPosition={{ x: imagePosition.x, y: imagePosition.y }}
                onStop={(e, data) => {
                  updateElementPosition(componentId, `smallImage1-${index}`, {
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
                  maxConstraints={[300, 300]}
                  axis="both"
                  resizeHandles={
                    activeDraggable === `smallImage1-${index}`
                      ? ["se", "sw", "ne", "nw"]
                      : []
                  }
                  onResizeStop={(e, { size }) => {
                    updateElementPosition(componentId, `smallImage1-${index}`, {
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
                      handleDragStart(`smallImage1-${index}`);
                    }}
                  >
                    <img
                      src={image}
                      alt={`Model ${index + 1}`}
                      className="rounded-lg w-full h-50 object-cover"
                    />
                  </div>
                </ResizableBox>
              </Draggable>
            );
          })}
        </div>

        {/* Text Content */}
        <div className="text-white p-6 text-center">
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
                className="relative cursor-move text-justify"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("heading");
                }}
              >
                <EditableText
                  content={styledContent.heading}
                  type="heading"
                  className="text-3xl font-bold text-white cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>

          <Draggable
            disabled={activeDraggable !== "description"}
            defaultPosition={{
              x: getElementPosition(componentId, "description").x,
              y: getElementPosition(componentId, "description").y,
            }}
            onStop={(e, data) => {
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
                className="relative text-justify cursor-move"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("description");
                }}
              >
                <EditableText
                  content={styledContent.description}
                  type="description"
                  className="mt-4 text-white text-sm cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>
        </div>
      </div>

      {/* Image Options Modal */}
      {showImageOptions !== null && (
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
