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

export const AboutMe = forwardRef((props, ref) => {
  const [activeDraggable, setActiveDraggable] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const imageInputRef = useRef(null);
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

  const pageId = `about-me-${selectedPage}`;
  const pageState = getPageState(pageId);
  console.log(pageId)

  // Initialize state from pageState if it exists, otherwise use defaults
  const [name, setName] = useState(pageState?.name || "- SUSAN BONES -");
  const [description, setDescription] = useState(
    pageState?.description || "You can enter a subtitle here if you need it"
  );
  const [year, setYear] = useState(pageState?.year || "2022");
  const [title, setTitle] = useState(pageState?.title || "ABOUT ME");
  const [label, setLabel] = useState(pageState?.label || "01");
  const [modelImage, setModelImage] = useState(
    pageState?.modelImage || "/fourth.jpg"
  );

  // Initialize styled content from pageState if it exists
  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      name: { text: name, segments: [{ text: name, styles: {} }] },
      description: { text: description, segments: [{ text: description, styles: {} }] },
      year: { text: year, segments: [{ text: year, styles: {} }] },
      title: { text: title, segments: [{ text: title, styles: {} }] },
      label: { text: label, segments: [{ text: label, styles: {} }] },
    };
  });

  // Component ID for this component
  const componentId = "about-me";

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
      description,
      year,
      title,
      label,
      modelImage,
      styledContent,
      elementPositions: {
        name: getElementPosition(componentId, "name"),
        description: getElementPosition(componentId, "description"),
        year: getElementPosition(componentId, "year"),
        title: getElementPosition(componentId, "title"),
        label: getElementPosition(componentId, "label"),
        image: getElementPosition(componentId, "image"),
      },
    });
  }, [
    name,
    description,
    year,
    title,
    label,
    modelImage,
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

      const portfolioId = 2; // Hardcoded portfolioId
      const pageId = 2; // Hardcoded pageId

      const stateToSave = {
        portfolioId, // Include portfolioId in the request body
        pageId, // Include pageId in the request body
        username, // Include username in the request body
        name,
        description,
        year,
        title,
        label,
        modelImage,
        styledContent,
        elementPositions: {
          name: getElementPosition(componentId, "name"),
          description: getElementPosition(componentId, "description"),
          year: getElementPosition(componentId, "year"),
          title: getElementPosition(componentId, "title"),
          label: getElementPosition(componentId, "label"),
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

      //if (!response.ok) throw new Error("Failed to save portfolio");
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

      const portfolioId = 2;
      const pageId = 2;

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

      console.log("Name in savedState:", savedState.name);

      if (!savedState || typeof savedState !== "object") {
        console.error("Invalid state loaded:", savedState);
        return;
      }

      // Update states with loaded data
      if (savedState.name) setName(savedState.name);
      if (savedState.description) setDescription(savedState.description);
      if (savedState.year) setYear(savedState.year);
      if (savedState.title) setTitle(savedState.title);
      if (savedState.label) setLabel(savedState.label);
      if (savedState.modelImage) setModelImage(savedState.modelImage);

      // Ensure styledContent is properly structured before setting it
      if (savedState.styledContent) {
        const loadedStyledContent = {
          name: savedState.styledContent.name || {
            text: savedState.name || name,
            segments: [{ text: savedState.name || name, styles: {} }],
          },
          description: savedState.styledContent.description || {
            text: savedState.description || description,
            segments: [{ text: savedState.description || description, styles: {} }],
          },
          year: savedState.styledContent.year || {
            text: savedState.year || year,
            segments: [{ text: savedState.year || year, styles: {} }],
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
        if (savedState.elementPositions.name) {
          updateElementPosition(
            componentId,
            "name",
            savedState.elementPositions.name
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
        if (savedState.elementPositions.title) {
          updateElementPosition(
            componentId,
            "title",
            savedState.elementPositions.title
          );
        }
        if (savedState.elementPositions.label) {
          updateElementPosition(
            componentId,
            "label",
            savedState.elementPositions.label
          );
        }
        if (savedState.elementPositions.image) {
          updateElementPosition(
            componentId,
            "image",
            savedState.elementPositions.image
          );
        }
      }

      console.log("Portfolio loaded successfully");
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "model") {
        setModelImage(imageUrl); // Update model image
        updatePageState(pageId, { modelImage: imageUrl }); // Update global state
      }
    }
  };

  const handleImageClick = (type) => {
    console.log("Image click type:", type);
    setShowImageOptions(type);
  };

  const handleCloseModal = () => {
    setShowImageOptions(null);
  };

  const handleChooseFromComputer = (type) => {
    // Use existing refs to trigger file input
    if (type === "model") {
      imageInputRef.current.click();
    }
    setShowImageOptions(null); // Close the modal
  };

  const handleChooseFromGallery = (type) => {
    setShowGalleryModal(true); // Show the gallery modal
    setShowImageOptions(type);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    if (showImageOptions === "model") {
      setModelImage(imageUrl); // Update model image
      updatePageState(pageId, { modelImage: imageUrl });
    }
    setShowGalleryModal(false); // Close the gallery modal
    setShowImageOptions(null);
  };

  useEffect(() => {
    console.log("Page State:", pageState); // Log the pageState to see if it's being retrieved correctly
  }, [pageState]);

  const handleSave = () => {
    saveState();
  };

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
      case "description":
        setDescription(newText);
        break;
      case "year":
        setYear(newText);
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

  const namePosition = getElementPosition(componentId, "name");
  const descriptionPosition = getElementPosition(componentId, "description");
  const yearPosition = getElementPosition(componentId, "year");
  const titlePosition = getElementPosition(componentId, "title");
  const labelPosition = getElementPosition(componentId, "label");
  const imagePosition = getElementPosition(componentId, "modelImage");

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6"
    onClick={() => setActiveDraggable(null)}>
      <div className="max-w-4xl w-full grid grid-cols-2 gap-8 items-center">
        {/* Left Section - Image */}
        <div className="border border-black p-1">
          <Draggable
            disabled={activeDraggable !== "modelImage"}
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
                className="relative w-full h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("image");
                }}
              >
                <img
                  src={modelImage}
                  alt="Designer portrait"
                  className="w-3/4 h-[100%] object-cover border mx-auto cursor-pointer"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleImageClick("model");
                  }}
                />

                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "model")} // Pass the type
                />
              </div>
            </ResizableBox>
          </Draggable>
        </div>

        {/* Right Section - Text */}
        <div className="text-center">
          <Draggable
            disabled={activeDraggable !== "name"}

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
            <div
              className="relative cursor-cursor"
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
                className="italic text-gray-600 text-xl cursor-cursor"
              />
            </div>
          </Draggable>

          <Draggable
            disabled={activeDraggable !== "label"}

            defaultPosition={{ x: labelPosition.x, y: labelPosition.y }}
            onStop={(e, data) => {
              console.log("Updating label position:", { x: data.x, y: data.y });
              updateElementPosition(componentId, "label", {
                x: data.x,
                y: data.y,
                width: labelPosition.width,
                height: labelPosition.height,
              });
            }}
          >
            <div
              className="border border-black inline-block p-4 mt-4 relative cursor-cursor"
              onClick={(e) => {
                e.stopPropagation();
                handleDragStart("label");
              }}
            >
              <EditableText
                content={
                  styledContent?.label || {
                    text: label,
                    segments: [{ text: label, styles: {} }],
                  }
                }
                type="label"
                className="text-5xl font-bold"
              />
            </div>
          </Draggable>

          <Draggable
            disabled={activeDraggable !== "title"}

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
            <div
              className="relative cursor-cursor"
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
                className="text-6xl font-serif font-bold mt-4"
              />
            </div>
          </Draggable>

          <Draggable
            disabled={activeDraggable !== "description"}

            defaultPosition={{ x: descriptionPosition.x, y: descriptionPosition.y }}
            onStop={(e, data) => {
              console.log("Updating description position:", { x: data.x, y: data.y });
              updateElementPosition(componentId, "description", {
                x: data.x,
                y: data.y,
                width: descriptionPosition.width,
                height: descriptionPosition.height,
              });
            }}
          >
            <div
              className="relative cursor-cursor"
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
                className="text-xl mt-4"
              />
            </div>
          </Draggable>

          <Draggable
            disabled={activeDraggable !== "year"}

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
            <div
              className="relative cursor-cursor"
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
                className="italic mt-6 text-gray-600 text-xl"
              />
            </div>
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
});