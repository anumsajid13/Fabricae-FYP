import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useFashionStore } from "./FashionProvider";
import { ImageOptionsModal } from "./ImageOptionsModal";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";

export const FashionPortfolio = () => {
  const [activeDraggable, setActiveDraggable] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const backgroundInputRef = useRef(null);
  const modelInputRef = useRef(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(null); // 'background' or 'model'

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

  // Initialize state from pageState if it exists, otherwise use defaults
  const [quote, setQuote] = useState(
    pageState?.quote ||
      "Fashion is the armor to survive the reality of everyday life"
  );
  const [title, setTitle] = useState(pageState?.title || "Fashion Portfolio");
  const [backgroundImage, setBackgroundImage] = useState(
    pageState?.backgroundImage || "/Picture7.jpg"
  );
  const [modelImage, setModelImage] = useState(
    pageState?.modelImage || "/Picture1.jpg"
  );
  const [label, setLabel] = useState(pageState?.label || "Your Name");

  // Initialize styled content from pageState if it exists
  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      quote: { text: quote, segments: [{ text: quote, styles: {} }] },
      title: { text: title, segments: [{ text: title, styles: {} }] },
      label: { text: label, segments: [{ text: label, styles: {} }] },
    };
  });

  // Component ID for this component
  const componentId = "fashion-portfolio";

  // Register this component with context when it mounts
  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, [registerComponent]);

  // Update page state whenever any state changes
  useEffect(() => {
    updatePageState(pageId, {
      quote,
      title,
      backgroundImage,
      modelImage,
      label,
      styledContent,
      elementPositions: {
        quote: getElementPosition(componentId, "quote"),
        title: getElementPosition(componentId, "title"),
        image: getElementPosition(componentId, "image"),
      },
    });
  }, [
    quote,
    title,
    backgroundImage,
    modelImage,
    label,
    styledContent,
    pageId,
    updatePageState,
    getElementPosition,
  ]);


  // // Store saveState function in Zustand on mount with a more specific dependency array
  // useEffect(() => {
  //   console.log('Registering save function');
  //   setSavePortfolioState(() => saveState);

  //   // For debugging, add a timeout to verify registration
  //   setTimeout(() => {
  //     const { savePortfolioState } = useFashionStore.getState();
  //     console.log('Save function registered and accessible:', !!savePortfolioState);
  //   }, 500);

  //   return () => {
  //     // Optional: Clear the function when component unmounts
  //     console.log('Clearing save function');
  //     setSavePortfolioState(() => () => console.warn("Component unmounted, save function cleared"));
  //   };
  // }, []); // Empty depe


  const saveState = async () => {
    try {
      console.log("saveState function called");

      const username = localStorage.getItem("userEmail");

      if (!username) {
        console.error("Username not found in local storage");
        return;
      }

      const portfolioId = 1; // Hardcoded portfolioId
      const pageId = 1; // Hardcoded pageId

      const stateToSave = {
        portfolioId, // Include portfolioId in the request body
        pageId, // Include pageId in the request body
        username, // Include username in the request body
        quote,
        title,
        backgroundImage,
        modelImage,
        label,
        styledContent,
        elementPositions: {
          quote: getElementPosition(componentId, "quote"),
          title: getElementPosition(componentId, "title"),
          image: getElementPosition(componentId, "image"),
        },
      };

      console.log("State to save:", stateToSave);

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
      console.error("Error in saveState function:", error);
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
      const pageId = 1; // Hardcoded pageId

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
      const savedState = savedStateArray[0];
      console.log("Loaded state from API:", savedState);

      console.log("Quote in savedState:", savedState.quote);

      if (!savedState || typeof savedState !== "object") {
        console.error("Invalid state loaded:", savedState);
        return;
      }

      // Update states with loaded data
      if (savedState.quote) setQuote(savedState.quote);
      if (savedState.title) setTitle(savedState.title);
      if (savedState.backgroundImage) setBackgroundImage(savedState.backgroundImage);
      if (savedState.modelImage) setModelImage(savedState.modelImage);
      if (savedState.label) setLabel(savedState.label);

      // Ensure styledContent is properly structured before setting it
      if (savedState.styledContent) {
        const loadedStyledContent = {
          quote: savedState.styledContent.quote || {
            text: savedState.quote || quote,
            segments: [{ text: savedState.quote || quote, styles: {} }],
          },
          title: savedState.styledContent.title || {
            text: savedState.title || title,
            segments: [{ text: savedState.title || title, styles: {} }],
          },
          label: savedState.styledContent.label || {
            text: savedState.label || label,
            segments: [{ text: savedState.label || label, styles: {} }],
          },
        };
        console.log("Setting styled content to:", loadedStyledContent);
        setStyledContent(loadedStyledContent);
      }

      // Update element positions if they exist
      if (savedState.elementPositions) {
        if (savedState.elementPositions.quote) {
          updateElementPosition(componentId, "quote", savedState.elementPositions.quote);
        }
        if (savedState.elementPositions.title) {
          updateElementPosition(componentId, "title", savedState.elementPositions.title);
        }
        if (savedState.elementPositions.image) {
          updateElementPosition(componentId, "image", savedState.elementPositions.image);
        }
      }

      console.log("Portfolio loaded successfully");
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  // Handle background image upload
  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

   // Handle double-click to trigger file input for background
   const handleDoubleClickBackground = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowImageOptions("background");
  };

  const handleImageClick = (type) => {
    setShowImageOptions(type);
  };

  const handleCloseModal = () => {
    setShowImageOptions(null);
  };

  const handleChooseFromComputer = (type) => {
    // Use existing refs to trigger file input
    if (type === "background") {
      backgroundInputRef.current.click();
    } else if (type === "model") {
      modelInputRef.current.click();
    }
    setShowImageOptions(null); // Close the modal
  };

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // Replace the existing image
    }
  };
  const handleChooseFromGallery = (type) => {
    setShowGalleryModal(true); // Show the gallery modal
    setShowImageOptions(type);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    if (showImageOptions === "background") {
      setBackgroundImage(imageUrl); // Update background image
    } else if (showImageOptions === "model") {
      setModelImage(imageUrl); // Update model image
    }
    setShowGalleryModal(false); // Close the gallery modal
    setShowImageOptions(null);
  };

  const handleSave = () => {
    saveState();
  };

  // Update page state whenever any state changes
  useEffect(() => {
    updatePageState(pageId, {
      quote,
      title,
      backgroundImage,
      modelImage,
      label,
      styledContent,
      elementPositions: {
        quote: getElementPosition(componentId, "quote"),
        title: getElementPosition(componentId, "title"),
        image: getElementPosition(componentId, "image"),
      },
    });
  }, [
    quote,
    title,
    backgroundImage,
    modelImage,
    label,
    styledContent,
    pageId,
    updatePageState,
    getElementPosition,
    ,
  ]);

  const quotePosition = getElementPosition(componentId, "quote");
  const titlePosition = getElementPosition(componentId, "title");
  const imagePosition = getElementPosition(componentId, "image");

  // Register this component with context when it mounts
  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });

    // No need for a cleanup function as the component registry persists
  }, []);

  // Update page state whenever any state changes
  useEffect(() => {
    updatePageState(pageId, {
      quote,
      title,
      backgroundImage,
      modelImage,
      label,
      // Also save styled content to preserve formatting
      styledContent,
    });
  }, [
    quote,
    title,
    backgroundImage,
    modelImage,
    label,
    styledContent,
    pageId,
    updatePageState,
  ]);

  const handleDragStart = (key) => {
    setActiveDraggable(key);
  };

  const handleTextChange = (e, type) => {
    const newText = e.target.value;

    setStyledContent((prev) => {
      const content = prev[type];

      if (!content) return prev;

      const oldSegments = content.segments || [{ text: content.text, styles: {} }];
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
      if (editingField === type) {
        setLocalValue(content.text);
      }
    }, [editingField, type, content.text]);

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

    if (editingField === type) {
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



  // Load portfolio state when the component mounts
  useEffect(() => {
    loadState();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
      className="max-w-[830px] relative w-full h-screen bg-gradient-to-br from-[#fdf3e5] to-[#fad9b7] cursor-pointer portfolio-page"
      onClick={() => setActiveDraggable(null)}
      onDoubleClick={handleDoubleClickBackground}
    >
      <input
        type="file"
        accept="image/*"
        ref={backgroundInputRef}
        className="hidden"
        onChange={handleBackgroundImageUpload}
      />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80 cursor-pointer"
        style={{ backgroundImage: `url('${backgroundImage}')`, zIndex: 1 }}
        onClick={() => handleImageClick("background")}
      ></div>



      <div
        className="relative flex flex-col items-center justify-center h-full"
        style={{ zIndex: 2 }}
      >
        <div className="relative w-full z-20">
          <button className="text-black" onClick={handleSave}>
            Save
          </button>

          <Draggable
            disabled={activeDraggable !== "quote"}
            bounds={{ left: 0, top: -100, right: 500, bottom: 280 }}
            defaultPosition={{ x: quotePosition.x, y: quotePosition.y }}
            onStop={(e, data) => {
              console.log("Updating quote position:", { x: data.x, y: data.y });
              // Update the position in the global state
              updateElementPosition(componentId, "quote", {
                x: data.x,
                y: data.y,
                width: quotePosition.width,
                height: quotePosition.height,
              });
            }}
          >
            <ResizableBox
              width={quotePosition.width}
              height={quotePosition.height}
              minConstraints={[150, 50]}
              maxConstraints={[500, 200]}
              axis="both"
              resizeHandles={
                activeDraggable === "quote" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                // Update the size in the global state
                updateElementPosition(componentId, "quote", {
                  x: quotePosition.x, // Keep the existing x position
                  y: quotePosition.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                style={{ transform: "none" }}
                className="relative text-center cursor-move"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("quote");
                }}
              >
                <EditableText
                  content={
                    styledContent?.quote || {
                      text: quote,
                      segments: [{ text: quote, styles: {} }],
                    }
                  }
                  type="quote"
                  className="text-white italic text-sm md:text-lg lg:text-xl mb-8 cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>

          <Draggable
            disabled={activeDraggable !== "title"}
            bounds={{ left: 0, top: -150, right: 500, bottom: 180 }}
            defaultPosition={{ x: titlePosition.x, y: titlePosition.y }}
            onStop={(e, data) => {
              console.log("Updating title position:", { x: data.x, y: data.y });
              updateElementPosition(componentId, "title", {
                x: data.x,
                y: data.y,
                width: titlePosition.width,
                height: titlePosition.height,
              });
            }}
          >
            <ResizableBox
              width={titlePosition.width}
              height={titlePosition.height}
              minConstraints={[200, 50]}
              maxConstraints={[600, 300]}
              axis="both"
              resizeHandles={
                activeDraggable === "title" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                console.log("Updating title size:", size);
                updateElementPosition(componentId, "title", {
                  x: titlePosition.x,
                  y: titlePosition.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative text-center cursor-move"
                style={{ position: "relative", zIndex: 3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("title");
                }}
              >
                <EditableText
                  content={
                    styledContent?.title || {
                      text: title,
                      segments: [{ text: title, styles: {} }],
                    }
                  }
                  type="title"
                  className="text-4xl md:text-6xl lg:text-8xl font-serif text-white tracking-wide leading-tight mx-auto cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>
        </div>

        <div className="absolute w-full h-full" style={{ zIndex: 10 }}>
          <Draggable
            disabled={activeDraggable !== "image"}
            bounds="parent"
            defaultPosition={{ x: imagePosition.x, y: imagePosition.y }}
            onStop={(e, data) => {
              console.log("Updating image position:", { x: data.x, y: data.y });
              updateElementPosition(componentId, "image", {
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
              minConstraints={[150, 200]}
              maxConstraints={[500, 600]}
              axis="both"
              resizeHandles={
                activeDraggable === "image" ? ["se", "sw", "ne", "nw"] : []
              }
              className="absolute top-[11rem] right-10"
              onResizeStop={(e, { size }) => {
                console.log("Updating image size:", size);
                updateElementPosition(componentId, "image", {
                  x: imagePosition.x,
                  y: imagePosition.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("image");
                }}
              >
                <div className="absolute -inset-5 bg-[#9a7752] rounded-lg"></div>
                <img
                  src={modelImage}
                  alt="New Fashion"
                  className="relative object-cover rounded-lg shadow-lg max-h-96 w-auto cursor-pointer"
                  onDoubleClick={(e) => {
                    //e.stopPropagation();
                    handleImageClick("model");
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={modelInputRef}
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setModelImage)}
                />

                <EditableText
                  content={
                    styledContent?.label || {
                      text: label,
                      segments: [{ text: label, styles: {} }],
                    }
                  }
                  type="label"
                  className="absolute bottom-4 right-4 bg-white text-[#9a7752] font-bold px-4 py-1 text-xs uppercase tracking-wide rounded cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>
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
