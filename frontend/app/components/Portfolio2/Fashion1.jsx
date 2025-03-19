import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useFashionStore } from "../Portfolio/FashionProvider";
import { ImageOptionsModal } from "../Portfolio/ImageOptionsModal";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "../Portfolio/GalleryModal";

export const ApparelPortfolio = forwardRef((props, ref) => {
  const [activeDraggable, setActiveDraggable] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(null);
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

  const pageId = `apparel-portfolio-${selectedPage}`;
  const pageState = getPageState(pageId);

  // Initialize state from pageState if it exists, otherwise use defaults
  const [name, setName] = useState(pageState?.name || "- SUSAN BONES -");
  const [title, setTitle] = useState(pageState?.title || "APPAREL DESIGNER");
  const [quote, setQuote] = useState(pageState?.quote || "Portfolio");
  const [description, setDescription] = useState(
    pageState?.description || "Here is where your presentation begins"
  );
  const [year, setYear] = useState(pageState?.year || "- 2022 -");
  const [images, setImages] = useState(
    pageState?.images || ["/first.jpg", "/second.jpg", "/third.jpg"]
  );

  const [activeSmallImageIndex, setActiveSmallImageIndex] = useState(null);
  // Initialize styled content from pageState if it exists
  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      name: { text: name, segments: [{ text: name, styles: {} }] },
      title: { text: title, segments: [{ text: title, styles: {} }] },
      quote: { text: quote, segments: [{ text: quote, styles: {} }] },
      description: {
        text: description,
        segments: [{ text: description, styles: {} }],
      },
      year: { text: year, segments: [{ text: year, styles: {} }] },
    };
  });

  // Component ID for this component
  const componentId = "apparel-portfolio";

  // Register this component with context when it mounts
  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, [registerComponent]);

  // Update page state whenever any state changes
  useEffect(() => {
    updatePageState(pageId, {
      name,
      title,
      quote,
      description,
      year,
      images,
      styledContent,
      elementPositions: {
        name: getElementPosition(componentId, "name"),
        title: getElementPosition(componentId, "title"),
        quote: getElementPosition(componentId, "quote"),
        description: getElementPosition(componentId, "description"),
        year: getElementPosition(componentId, "year"),
        image1: getElementPosition(componentId, "image1"),
        image2: getElementPosition(componentId, "image2"),
        image3: getElementPosition(componentId, "image3"),
      },
    });
  }, [
    name,
    title,
    quote,
    description,
    year,
    images,
    styledContent,
    pageId,
    updatePageState,
    getElementPosition,
  ]);

  // Expose the save function to the parent
  useImperativeHandle(ref, () => ({
    saveState,
  }));

  const saveState = async () => {
    try {
      console.log("saveState function called");

      const username = localStorage.getItem("userEmail");

      if (!username) {
        console.error("Username not found in local storage");
        return;
      }

      const portfolioId = 2; // Hardcoded portfolioId for the second portfolio
      const pageId = 1; // Hardcoded pageId

      const stateToSave = {
        portfolioId, // Include portfolioId in the request body
        pageId, // Include pageId in the request body
        username, // Include username in the request body
        name,
        title,
        quote,
        description,
        year,
        images,
        styledContent,
        elementPositions: {
          name: getElementPosition(componentId, "name"),
          title: getElementPosition(componentId, "title"),
          quote: getElementPosition(componentId, "quote"),
          description: getElementPosition(componentId, "description"),
          year: getElementPosition(componentId, "year"),
          image1: getElementPosition(componentId, "image1"),
          image2: getElementPosition(componentId, "image2"),
          image3: getElementPosition(componentId, "image3"),
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

      const portfolioId = 2; // Hardcoded portfolioId for the second portfolio
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

      if (!savedState || typeof savedState !== "object") {
        console.error("Invalid state loaded:", savedState);
        return;
      }

      // Update states with loaded data
      if (savedState.name) setName(savedState.name);
      if (savedState.title) setTitle(savedState.title);
      if (savedState.quote) setQuote(savedState.quote);
      if (savedState.description) setDescription(savedState.description);
      if (savedState.year) setYear(savedState.year);
      if (savedState.images) setImages(savedState.images);

      // Ensure styledContent is properly structured before setting it
      if (savedState.styledContent) {
        const loadedStyledContent = {
          name: savedState.styledContent.name || {
            text: savedState.name || name,
            segments: [{ text: savedState.name || name, styles: {} }],
          },
          title: savedState.styledContent.title || {
            text: savedState.title || title,
            segments: [{ text: savedState.title || title, styles: {} }],
          },
          quote: savedState.styledContent.quote || {
            text: savedState.quote || quote,
            segments: [{ text: savedState.quote || quote, styles: {} }],
          },
          description: savedState.styledContent.description || {
            text: savedState.description || description,
            segments: [
              { text: savedState.description || description, styles: {} },
            ],
          },
          year: savedState.styledContent.year || {
            text: savedState.year || year,
            segments: [{ text: savedState.year || year, styles: {} }],
          },
        };
        console.log("Setting styled content to:", loadedStyledContent);
        setStyledContent(loadedStyledContent);
      }

      // Update element positions if they exist
      if (savedState.elementPositions) {
        if (savedState.elementPositions.name) {
          updateElementPosition(
            componentId,
            "name",
            savedState.elementPositions.name
          );
        }
        if (savedState.elementPositions.title) {
          updateElementPosition(
            componentId,
            "title",
            savedState.elementPositions.title
          );
        }
        if (savedState.elementPositions.quote) {
          updateElementPosition(
            componentId,
            "quote",
            savedState.elementPositions.quote
          );
        }
        if (savedState.elementPositions.description) {
          updateElementPosition(
            componentId,
            "description",
            savedState.elementPositions.description
          );
        }
        if (savedState.elementPositions.year) {
          updateElementPosition(
            componentId,
            "year",
            savedState.elementPositions.year
          );
        }
        if (savedState.elementPositions.image1) {
          updateElementPosition(
            componentId,
            "image1",
            savedState.elementPositions.image1
          );
        }
        if (savedState.elementPositions.image2) {
          updateElementPosition(
            componentId,
            "image2",
            savedState.elementPositions.image2
          );
        }
        if (savedState.elementPositions.image3) {
          updateElementPosition(
            componentId,
            "image3",
            savedState.elementPositions.image3
          );
        }
      }

      console.log("Portfolio loaded successfully");
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
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
    if (type === "smallImage") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = handleSmallImageUpload; // Handle small image upload
      fileInput.click();
    }
    setShowImageOptions(null); // Close the modal
  };

  const handleSmallImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[activeSmallImageIndex] = imageUrl; // Update the specific small image
        return updatedImages;
      });
    }
    e.target.value = ""; // Reset the file input
  };

  // Handle small image selection from gallery
  const handleSelectSmallImageFromGallery = (imageUrl) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[activeSmallImageIndex] = imageUrl; // Update the specific small image
      return updatedImages;
    });
    setShowGalleryModal(false); // Close the gallery modal
    setShowImageOptions(null); // Close the options modal
  };

  const handleChooseFromGallery = (type) => {
    setShowGalleryModal(true); // Show the gallery modal
    setShowImageOptions(type);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    if (showImageOptions === "smallImage") {
      handleSelectSmallImageFromGallery(imageUrl); // Update small image
    }
    setShowGalleryModal(false); // Close the gallery modal
    setShowImageOptions(null);
  };

  const handleSave = () => {
    saveState();
  };

  const namePosition = getElementPosition(componentId, "name");
  const titlePosition = getElementPosition(componentId, "title");
  const quotePosition = getElementPosition(componentId, "quote");
  const descriptionPosition = getElementPosition(componentId, "description");
  const yearPosition = getElementPosition(componentId, "year");
  const image1Position = getElementPosition(componentId, "image1");
  const image2Position = getElementPosition(componentId, "image2");
  const image3Position = getElementPosition(componentId, "image3");

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
      name,
      title,
      quote,
      description,
      year,
      images,
      styledContent,
    });
  }, [
    name,
    title,
    quote,
    description,
    year,
    images,
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
      case "name":
        setName(newText);
        break;
      case "title":
        setTitle(newText);
        break;
      case "quote":
        setQuote(newText);
        break;
      case "description":
        setDescription(newText);
        break;
      case "year":
        setYear(newText);
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
      className="max-w-[942px] min-h-[780px] flex justify-center items-center min-h-screen bg-[#efe8e4] p-6 w-full"
      onClick={() => setActiveDraggable(null)}
    >
      <div className="max-w-4xl grid grid-cols-2 gap-8 items-center">
        {/* Left Section */}
        <div className="text-left">
          {/* Editable Name */}
          <Draggable
            disabled={activeDraggable !== "name"}
            bounds={{ left: 0, top: -100, right: 500, bottom: 280 }}
            defaultPosition={{ x: namePosition.x, y: namePosition.y }}
            onStop={(e, data) => {
              console.log("Updating name position:", { x: data.x, y: data.y });
              updateElementPosition(componentId, "name", {
                x: data.x,
                y: data.y,
                width: namePosition.width,
                height: namePosition.height,
              });
            }}
          >
            <ResizableBox
              width={namePosition.width}
              height={namePosition.height}
              minConstraints={[150, 50]}
              maxConstraints={[500, 200]}
              axis="both"
              resizeHandles={
                activeDraggable === "name" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "name", {
                  x: namePosition.x,
                  y: namePosition.y,
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
                  handleDragStart("name");
                }}
              >
                <EditableText
                  content={
                    styledContent?.name || {
                      text: name,
                      segments: [{ text: name, styles: {} }],
                    }
                  }
                  type="name"
                  className="italic text-gray-600 text-justify text-xl cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Editable Title */}
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
                updateElementPosition(componentId, "title", {
                  x: titlePosition.x,
                  y: titlePosition.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative text-justify cursor-move"
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
                  className="text-6xl font-serif font-bold leading-tight cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Editable quote */}
          <Draggable
            disabled={activeDraggable !== "quote"}
            bounds={{ left: 0, top: -150, right: 500, bottom: 180 }}
            defaultPosition={{ x: quotePosition.x, y: quotePosition.y }}
            onStop={(e, data) => {
              console.log("Updating quote position:", {
                x: data.x,
                y: data.y,
              });
              updateElementPosition(componentId, "quote", {
                x: data.x,
                y: data.y,
                width: squotePosition.width,
                height: quotePosition.height,
              });
            }}
          >
            <ResizableBox
              width={quotePosition.width}
              height={quotePosition.height}
              minConstraints={[200, 50]}
              maxConstraints={[600, 300]}
              axis="both"
              resizeHandles={
                activeDraggable === "quote" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "quote", {
                  x: quotePosition.x,
                  y: quotePosition.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative text-justify cursor-move"
                style={{ position: "relative", zIndex: 3 }}
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
                  className="text-5xl italic font-serif mt-2 cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Editable Description */}
          <Draggable
            disabled={activeDraggable !== "description"}
            bounds={{ left: 0, top: -150, right: 500, bottom: 180 }}
            defaultPosition={{
              x: descriptionPosition.x,
              y: descriptionPosition.y,
            }}
            onStop={(e, data) => {
              console.log("Updating description position:", {
                x: data.x,
                y: data.y,
              });
              updateElementPosition(componentId, "description", {
                x: data.x,
                y: data.y,
                width: descriptionPosition.width,
                height: descriptionPosition.height,
              });
            }}
          >
            <ResizableBox
              width={descriptionPosition.width}
              height={descriptionPosition.height}
              minConstraints={[200, 50]}
              maxConstraints={[600, 300]}
              axis="both"
              resizeHandles={
                activeDraggable === "description"
                  ? ["se", "sw", "ne", "nw"]
                  : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "description", {
                  x: descriptionPosition.x,
                  y: descriptionPosition.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative text-justify cursor-move"
                style={{ position: "relative", zIndex: 3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("description");
                }}
              >
                <EditableText
                  content={
                    styledContent?.description || {
                      text: description,
                      segments: [{ text: description, styles: {} }],
                    }
                  }
                  type="description"
                  className="text-xl mt-4 cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Editable Year */}
          <Draggable
            disabled={activeDraggable !== "year"}
            bounds={{ left: 0, top: -150, right: 500, bottom: 180 }}
            defaultPosition={{ x: yearPosition.x, y: yearPosition.y }}
            onStop={(e, data) => {
              console.log("Updating year position:", { x: data.x, y: data.y });
              updateElementPosition(componentId, "year", {
                x: data.x,
                y: data.y,
                width: yearPosition.width,
                height: yearPosition.height,
              });
            }}
          >
            <ResizableBox
              width={yearPosition.width}
              height={yearPosition.height}
              minConstraints={[200, 50]}
              maxConstraints={[600, 300]}
              axis="both"
              resizeHandles={
                activeDraggable === "year" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "year", {
                  x: yearPosition.x,
                  y: yearPosition.y,
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
                  handleDragStart("year");
                }}
              >
                <EditableText
                  content={
                    styledContent?.year || {
                      text: year,
                      segments: [{ text: year, styles: {} }],
                    }
                  }
                  type="year"
                  className="italic mt-6 text-gray-600 text-center text-xl cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>
        </div>

        {/* Right Section */}
        <div className="border border-black p-2">
          <div className="grid grid-rows-3 gap-2">
            {images.map((src, index) => (
              <Draggable key={index}>
                <ResizableBox
                  width={350}
                  height={150}
                  minConstraints={[100, 100]}
                  maxConstraints={[400, 400]}
                >
                  <div className="relative">
                    <img
                      src={src}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover border cursor-pointer"
                      onDoubleClick={(e) => handleDoubleClickSmallImage(e, index)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDragStart(`image-${index}`);
                      }}
                    />
                  </div>
                </ResizableBox>
              </Draggable>
            ))}
          </div>
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