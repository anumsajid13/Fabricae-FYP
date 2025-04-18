import React, { useState, useEffect, useRef,  forwardRef,
  useImperativeHandle, } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const Fashion =  forwardRef((props, ref) => {
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

  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      heading: {
        text: heading,
        segments: [{ text: heading, styles: {} }],
      },
      smallImageTexts: Array(smallImages.length).fill({ text: "", segments: [{ text: "", styles: {} }] }),
    };
  });

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
      styledContent,
    });
  }, [
    heading,
    smallImages,
    smallImageTexts,
    backgroundImage,
    innerContainerImage,
    styledContent,
    pageId,
    updatePageState,
  ]);

    // Expose the save function to the parent
    useImperativeHandle(ref, () => ({
      saveState ,
    }));


  // Save the current state to the backend
  const saveState = async () => {
    try {
      console.log("handleSave function called");

      const username = localStorage.getItem("userEmail"); // Get username from local storage

      if (!username) {
        console.error("Username not found in local storage");
        return;
      }

      const portfolioId = 1; // Hardcoded portfolioId
      const pageId = 3; // Hardcoded pageId

      const stateToSave = {
        username,
        portfolioId,
        pageId,
        backgroundImage,
        modelImage: innerContainerImage,
        styledContent,
        elementPositions: {
          heading: getElementPosition(componentId, "heading"),
          smallImages: smallImages.map((_, index) =>
            getElementPosition(componentId, `smallImage-${index}`)
          ),
        },
        smallImages,
        smallImageTexts,
        heading,
        bgColor,
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

      const portfolioId = 1; // Hardcoded portfolioId
      const pageId = 3; // Hardcoded pageId

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
      console.log('aaas', savedStateArray);
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
      if (savedState.smallImageTexts) setSmallImageTexts(savedState.smallImageTexts); // Load smallImageTexts
      if (savedState.heading) setHeading(savedState.heading);
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

  setStyledContent((prev) => {
    if (type === "heading") {
      return {
        ...prev,
        heading: {
          text: newText,
          segments: [{ text: newText, styles: prev.heading.segments[0]?.styles || {} }],
        },
      };
    } else if (type === "smallImageTexts") {
      const updatedSmallImageTexts = [...prev.smallImageTexts];
      updatedSmallImageTexts[index] = {
        text: newText,
        segments: [{ text: newText, styles: updatedSmallImageTexts[index].segments[0]?.styles || {} }],
      };
      return {
        ...prev,
        smallImageTexts: updatedSmallImageTexts,
      };
    }
    return prev;
  });

  // Update plain text state
  if (type === "heading") {
    setHeading(newText);
  } else if (type === "smallImageTexts") {
    setSmallImageTexts((prevTexts) => {
      const updatedTexts = [...prevTexts];
      updatedTexts[index] = newText;
      return updatedTexts;
    });
  }
};

// Handle local text selection for styling
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

// Update styles for selected text
const updateStyles = (type, styles, savedStartOffset, savedEndOffset, index) => {
  setStyledContent((prev) => {
    const content = type === "heading" ? prev.heading : prev.smallImageTexts[index];

    if (!content) return prev;

    const newSegments = [];
    let currentOffset = 0;

    content.segments.forEach((segment) => {
      const segmentLength = segment.text.length;

      if (currentOffset + segmentLength <= savedStartOffset) {
        newSegments.push(segment);
      } else if (currentOffset >= savedEndOffset) {
        newSegments.push(segment);
      } else {
        if (currentOffset < savedStartOffset) {
          newSegments.push({
            text: segment.text.substring(0, savedStartOffset - currentOffset),
            styles: { ...segment.styles },
          });
        }

        newSegments.push({
          text: segment.text.substring(
            Math.max(0, savedStartOffset - currentOffset),
            Math.min(segmentLength, savedEndOffset - currentOffset)
          ),
          styles: { ...segment.styles, ...styles },
        });

        if (currentOffset + segmentLength > savedEndOffset) {
          newSegments.push({
            text: segment.text.substring(savedEndOffset - currentOffset),
            styles: { ...segment.styles },
          });
        }
      }

      currentOffset += segmentLength;
    });

    if (type === "heading") {
      return {
        ...prev,
        heading: {
          text: content.text,
          segments: newSegments,
        },
      };
    } else {
      const updatedSmallImageTexts = [...prev.smallImageTexts];
      updatedSmallImageTexts[index] = {
        text: content.text,
        segments: newSegments,
      };
      return {
        ...prev,
        smallImageTexts: updatedSmallImageTexts,
      };
    }
  });
};

// EditableText component for rendering and editing text
const EditableText = ({ content, type, index, className }) => {
  const [localValue, setLocalValue] = useState("");

  useEffect(() => {
    if (editingField === `${type}-${index}` && content) {
      setLocalValue(content.text);
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

  if (!content || !content.segments) return null;

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
        <div onMouseUp={(e) => handleLocalTextSelection(e, type, index)}>
          {content.segments.map((segment, i) => (
            <span key={i} style={segment.styles}>
              {segment.text}
            </span>
          ))}
        </div>
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
        className="text-white w-[90%] min-w-[500px] h-[400px] bg-opacity-90 p-8 flex flex-col items-center"
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
                content={styledContent.heading}
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
                      ccontent={styledContent.smallImageTexts?.[index] || { text: "", segments: [{ text: "", styles: {} }] }}
                      type="smallImageTexts"
                      index={index}
                      className="text-white text-center cursor-text mt-4"
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
});