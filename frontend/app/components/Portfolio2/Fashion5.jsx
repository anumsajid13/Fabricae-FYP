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

export const WhatIDo = forwardRef((props, ref) => {
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
    loadstate, setLoadState
  } = useFashionStore();

  const pageId = `what-i-do-${selectedPage}`;
  const pageState = getPageState(pageId);

  // Initialize state from pageState if it exists, otherwise use defaults
  const [heading, setHeading] = useState(
    pageState?.heading || "WHAT I DO"
  );
  const [description, setDescription] = useState(
    pageState?.description ||
      "Venus has a beautiful name and is the second planet from the Sun. It’s terribly hot—even hotter than Mercury—and its atmosphere is extremely poisonous. It’s the second-brightest natural object in the night sky after the Moon."
  );
  const [modelImage, setModelImage] = useState(
    pageState?.modelImage || "/what i do.jpg"
  );

  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      heading: { text: heading, segments: [{ text: heading, styles: {} }] },
      description: {
        text: description,
        segments: [{ text: description, styles: {} }],
      },
    };
  });

  const componentId = "what-i-do";

  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, [registerComponent]);

  useEffect(() => {
    updatePageState(pageId, {
      heading,
      description,
      modelImage,
      styledContent,
      elementPositions: {
        heading: getElementPosition(componentId, "heading"),
        description: getElementPosition(componentId, "description"),
        modelImage: getElementPosition(componentId, "modelImage"),
      },
    });
  }, [
    heading,
    description,
    modelImage,
    styledContent,
    pageId,
    updatePageState,
    getElementPosition,
  ]);

  useImperativeHandle(ref, () => ({
    saveState,
  }));

  const saveState = async () => {
    try {
      const username = localStorage.getItem("userEmail");
      if (!username) {
        console.error("Username not found in local storage");
        return;
      }

      const portfolioId = 2;
      const pageId = 5;

      const stateToSave = {
        portfolioId,
        pageId,
        username,
        heading,
        description,
        modelImage,
        styledContent,
        elementPositions: {
          heading: getElementPosition(componentId, "heading"),
          description: getElementPosition(componentId, "description"),
          modelImage: getElementPosition(componentId, "modelImage"),
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

      const result = await response.json();
      console.log("Portfolio saved successfully:", result);
    } catch (error) {
      console.error("Error in saveState function:", error);
    }
  };

  const loadState = async () => {
    try {
      const username = localStorage.getItem("userEmail");
      if (!username) {
        console.error("Username not found in local storage");
        return;
      }

      const portfolioId = 2;
      const pageId = 5;

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

      if (savedState.heading) setHeading(savedState.heading);
      if (savedState.description) setDescription(savedState.description);
      if (savedState.modelImage) setModelImage(savedState.modelImage);

      if (savedState.styledContent) {
        const loadedStyledContent = {
          heading: savedState.styledContent.heading || {
            text: savedState.heading || heading,
            segments: [{ text: savedState.heading || heading, styles: {} }],
          },
          description: savedState.styledContent.description || {
            text: savedState.description || description,
            segments: [
              { text: savedState.description || description, styles: {} },
            ],
          },
        };
        setStyledContent(loadedStyledContent);
      }

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
        if (savedState.elementPositions.modelImage) {
          updateElementPosition(
            componentId,
            "modelImage",
            savedState.elementPositions.modelImage
          );
        }
      }

      console.log("Portfolio loaded successfully");
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const handleDoubleClickImage = (e) => {
    e.stopPropagation();
    setShowImageOptions("modelImage");
  };

  const handleCloseModal = () => {
    setShowImageOptions(null);
  };

  const handleChooseFromComputer = (type) => {
    if (type === "modelImage") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = handleImageUpload;
      fileInput.click();
    }
    setShowImageOptions(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setModelImage(imageUrl);
    }
    e.target.value = "";
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    setModelImage(imageUrl);
    setShowGalleryModal(false);
    setShowImageOptions(null);
  };

  const handleChooseFromGallery = (type) => {
    setShowGalleryModal(true);
    setShowImageOptions(type);
  };

  const handleSave = () => {
    saveState();
  };

  const headingPosition = getElementPosition(componentId, "heading");
  const descriptionPosition = getElementPosition(componentId, "description");
  const modelImagePosition = getElementPosition(componentId, "modelImage");

  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, []);

  useEffect(() => {
    updatePageState(pageId, {
      heading,
      description,
      modelImage,
      styledContent,
    });
  }, [
    heading,
    description,
    modelImage,
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

  const updateStyles = (type, styles, savedStartOffset, savedEndOffset) => {
    setStyledContent((prev) => {
      const content = prev[type];

      if (!content) return prev;

      let startOffset = savedStartOffset !== undefined ? savedStartOffset : 0;
      let endOffset =
        savedEndOffset !== undefined ? savedEndOffset : content.text.length;

      const newSegments = [];
      let currentOffset = 0;

      content.segments.forEach((segment) => {
        const segmentLength = segment.text.length;
        const segmentEnd = currentOffset + segmentLength;

        if (segmentEnd <= startOffset || currentOffset >= endOffset) {
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

    useEffect(() => {
      if (editingField === type) {
        setLocalValue(content.text);
      }
    }, [editingField, type, content.text]);

    const handleInputChange = (e) => {
      const newText = e.target.value;
      setLocalValue(newText);
    };

    const handleInputBlur = () => {
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

  useEffect(() => {
      if (loadstate) {
        const loadPortfolioState = async () => {
          await loadState(); // Call your existing loadState function
          setLoadState(false); // Reset loadState to false after loading

        };
        loadPortfolioState();

      }
    }, [loadState, setLoadState]);
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4"
      onClick={() => setActiveDraggable(null)}
    >
      <div className="max-w-4xl w-full grid grid-cols-2 gap-6 items-center border border-black p-4 h-96">
        {/* Left Section */}
        <div className="text-center">
          {/* Editable Heading */}
          <Draggable
            disabled={activeDraggable !== "heading"}
            defaultPosition={{ x: headingPosition.x, y: headingPosition.y }}
            onStop={(e, data) => {
              updateElementPosition(componentId, "heading", {
                x: data.x,
                y: data.y,
                width: headingPosition.width,
                height: headingPosition.height,
              });
            }}
          >
            <ResizableBox
              width={headingPosition.width}
              height={headingPosition.height}
              minConstraints={[200, 50]}
              maxConstraints={[600, 200]}
              axis="both"
              resizeHandles={
                activeDraggable === "heading" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "heading", {
                  x: headingPosition.x,
                  y: headingPosition.y,
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
                  content={
                    styledContent?.heading || {
                      text: heading,
                      segments: [{ text: heading, styles: {} }],
                    }
                  }
                  type="heading"
                  className="text-4xl font-serif font-bold cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Editable Description */}
          <Draggable
            disabled={activeDraggable !== "description"}
            defaultPosition={{ x: descriptionPosition.x, y: descriptionPosition.y }}
            onStop={(e, data) => {
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
                activeDraggable === "description" ? ["se", "sw", "ne", "nw"] : []
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
                  className="text-base mt-3 cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>
        </div>

        {/* Right Section */}
        <div className="border border-black p-1">
          <Draggable
            disabled={activeDraggable !== "modelImage"}
            defaultPosition={{ x: modelImagePosition.x, y: modelImagePosition.y }}
            onStop={(e, data) => {
              updateElementPosition(componentId, "modelImage", {
                x: data.x,
                y: data.y,
                width: modelImagePosition.width,
                height: modelImagePosition.height,
              });
            }}
          >
            <ResizableBox
              width={modelImagePosition.width}
              height={modelImagePosition.height}
              minConstraints={[100, 100]}
              maxConstraints={[400, 400]}
              axis="both"
              resizeHandles={
                activeDraggable === "modelImage" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "modelImage", {
                  x: modelImagePosition.x,
                  y: modelImagePosition.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div className="relative w-full h-full aspect-square">
                <img
                  src={modelImage}
                  alt="Fashion model"
                  className="w-full h-full object-cover border cursor-pointer"
                  onDoubleClick={handleDoubleClickImage}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDragStart("modelImage");
                  }}
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