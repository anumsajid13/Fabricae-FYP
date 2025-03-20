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

export const Research = forwardRef((props, ref) => {
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

  const pageId = `research-${selectedPage}`;
  const pageState = getPageState(pageId);

  // Initialize state from pageState if it exists, otherwise use defaults
  const [heading, setHeading] = useState(
    pageState?.heading || "RESEARCH"
  );
  const [label1, setLabel1] = useState(
    pageState?.label1 ||
      " - Gathering the resources, which include fabrics, trims, and fastenings, to create concrete, practical aspects for your collection."
  );
  const [label2, setLabel2] = useState(
    pageState?.label2 ||
      " - Establishing the concept, which is the visual inspiration for the design process."
  );
  const [description, setDescription] = useState(
    pageState?.description ||
      "New collection design inspiration can come from a variety of unexpected places. By focusing on the two sorts of research for the design process, you can follow this formula:"
  );
  const [image1, setImage1] = useState(pageState?.image1 || "/research1.jpg");
  const [image2, setImage2] = useState(pageState?.image2 || "/research2.jpg");

  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      heading: { text: heading, segments: [{ text: heading, styles: {} }] },
      label1: { text: label1, segments: [{ text: label1, styles: {} }] },
      label2: { text: label2, segments: [{ text: label2, styles: {} }] },
      description: {
        text: description,
        segments: [{ text: description, styles: {} }],
      },
    };
  });

  const componentId = "research";

  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, [registerComponent]);

  useEffect(() => {
    updatePageState(pageId, {
      heading,
      label1,
      label2,
      description,
      image1,
      image2,
      styledContent,
      elementPositions: {
        heading: getElementPosition(componentId, "heading"),
        label1: getElementPosition(componentId, "label1"),
        label2: getElementPosition(componentId, "label2"),
        description: getElementPosition(componentId, "description"),
        image1: getElementPosition(componentId, "image1"),
        image2: getElementPosition(componentId, "image2"),
      },
    });
  }, [
    heading,
    label1,
    label2,
    description,
    image1,
    image2,
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
      const pageId = 6;

      const stateToSave = {
        portfolioId,
        pageId,
        username,
        heading,
        label1,
        label2,
        description,
        image1,
        image2,
        styledContent,
        elementPositions: {
          heading: getElementPosition(componentId, "heading"),
          label1: getElementPosition(componentId, "label1"),
          label2: getElementPosition(componentId, "label2"),
          description: getElementPosition(componentId, "description"),
          image1: getElementPosition(componentId, "image1"),
          image2: getElementPosition(componentId, "image2"),
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
      const pageId = 6;

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
      if (savedState.label1) setLabel1(savedState.label1);
      if (savedState.label2) setLabel2(savedState.label2);
      if (savedState.description) setDescription(savedState.description);
      if (savedState.image1) setImage1(savedState.image1);
      if (savedState.image2) setImage2(savedState.image2);

      if (savedState.styledContent) {
        const loadedStyledContent = {
          heading: savedState.styledContent.heading || {
            text: savedState.heading || heading,
            segments: [{ text: savedState.heading || heading, styles: {} }],
          },
          label1: savedState.styledContent.label1 || {
            text: savedState.label1 || label1,
            segments: [{ text: savedState.label1 || label1, styles: {} }],
          },
          label2: savedState.styledContent.label2 || {
            text: savedState.label2 || label2,
            segments: [{ text: savedState.label2 || label2, styles: {} }],
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
        if (savedState.elementPositions.label1) {
          updateElementPosition(
            componentId,
            "label1",
            savedState.elementPositions.label1
          );
        }
        if (savedState.elementPositions.label2) {
          updateElementPosition(
            componentId,
            "label2",
            savedState.elementPositions.label2
          );
        }
        if (savedState.elementPositions.description) {
          updateElementPosition(
            componentId,
            "description",
            savedState.elementPositions.description
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
      }

      console.log("Portfolio loaded successfully");
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const handleDoubleClickImage = (e, index) => {
    e.stopPropagation();
    setShowImageOptions(index === 0 ? "image1" : "image2");
  };

  const handleCloseModal = () => {
    setShowImageOptions(null);
  };

  const handleChooseFromComputer = (type) => {
    if (type === "image1" || type === "image2") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e) => handleImageUpload(e, type);
      fileInput.click();
    }
    setShowImageOptions(null);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "image1") {
        setImage1(imageUrl);
      } else if (type === "image2") {
        setImage2(imageUrl);
      }
    }
    e.target.value = "";
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    if (showImageOptions === "image1") {
      setImage1(imageUrl);
    } else if (showImageOptions === "image2") {
      setImage2(imageUrl);
    }
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
  const label1Position = getElementPosition(componentId, "label1");
  const label2Position = getElementPosition(componentId, "label2");
  const descriptionPosition = getElementPosition(componentId, "description");
  const image1Position = getElementPosition(componentId, "image1");
  const image2Position = getElementPosition(componentId, "image2");

  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, []);

  useEffect(() => {
    updatePageState(pageId, {
      heading,
      label1,
      label2,
      description,
      image1,
      image2,
      styledContent,
    });
  }, [
    heading,
    label1,
    label2,
    description,
    image1,
    image2,
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
      case "label1":
        setLabel1(newText);
        break;
      case "label2":
        setLabel2(newText);
        break;
      case "description":
        setDescription(newText);
        break;
      default:
        break;
    }
  };

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
    loadState();
  }, []);

  return (
    <div
      className="w-[830px] flex justify-center items-center min-h-screen bg-[#efe8e4] p-4" 
      onClick={() => setActiveDraggable(null)}
    >
      <div className="max-w-3xl w-full border border-black p-3 text-center h-96">
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
                className="text-3xl font-serif font-bold cursor-text"
              />
            </div>
          </ResizableBox>
        </Draggable>

        {/* Images Section */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {/* Image 1 */}
          <Draggable
            disabled={activeDraggable !== "image1"}
            defaultPosition={{ x: image1Position.x, y: image1Position.y }}
            onStop={(e, data) => {
              updateElementPosition(componentId, "image1", {
                x: data.x,
                y: data.y,
                width: image1Position.width,
                height: image1Position.height,
              });
            }}
          >
            <ResizableBox
              width={image1Position.width}
              height={image1Position.height}
              minConstraints={[100, 100]}
              maxConstraints={[400, 400]}
              axis="both"
              resizeHandles={
                activeDraggable === "image1" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "image1", {
                  x: image1Position.x,
                  y: image1Position.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div className="relative w-full h-full">
                <img
                  src={image1}
                  alt="Research process 1"
                  className="w-full h-full object-cover border cursor-pointer"
                  onDoubleClick={(e) => handleDoubleClickImage(e, 0)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDragStart("image1");
                  }}
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Image 2 */}
          <Draggable
            disabled={activeDraggable !== "image2"}
            defaultPosition={{ x: image2Position.x, y: image2Position.y }}
            onStop={(e, data) => {
              updateElementPosition(componentId, "image2", {
                x: data.x,
                y: data.y,
                width: image2Position.width,
                height: image2Position.height,
              });
            }}
          >
            <ResizableBox
              width={image2Position.width}
              height={image2Position.height}
              minConstraints={[100, 100]}
              maxConstraints={[400, 400]}
              axis="both"
              resizeHandles={
                activeDraggable === "image2" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "image2", {
                  x: image2Position.x,
                  y: image2Position.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div className="relative w-full h-full">
                <img
                  src={image2}
                  alt="Research process 2"
                  className="w-full h-full object-cover border cursor-pointer"
                  onDoubleClick={(e) => handleDoubleClickImage(e, 1)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDragStart("image2");
                  }}
                />
              </div>
            </ResizableBox>
          </Draggable>
        </div>

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
                className="text-sm mt-3 cursor-text"
              />
            </div>
          </ResizableBox>
        </Draggable>

        {/* Editable Labels */}
        <div className="text-sm text-left list-disc list-inside mt-2">
          {/* Label 1 */}
          <Draggable
            disabled={activeDraggable !== "label1"}
            defaultPosition={{ x: label1Position.x, y: label1Position.y }}
            onStop={(e, data) => {
              updateElementPosition(componentId, "label1", {
                x: data.x,
                y: data.y,
                width: label1Position.width,
                height: label1Position.height,
              });
            }}
          >
            <ResizableBox
              width={label1Position.width}
              height={label1Position.height}
              minConstraints={[200, 50]}
              maxConstraints={[600, 300]}
              axis="both"
              resizeHandles={
                activeDraggable === "label1" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "label1", {
                  x: label1Position.x,
                  y: label1Position.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative cursor-move"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("label1");
                }}
              >
                <EditableText
                  content={
                    styledContent?.label1 || {
                      text: label1,
                      segments: [{ text: label1, styles: {} }],
                    }
                  }
                  type="label1"
                  className="cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Label 2 */}
          <Draggable
            disabled={activeDraggable !== "label2"}
            defaultPosition={{ x: label2Position.x, y: label2Position.y }}
            onStop={(e, data) => {
              updateElementPosition(componentId, "label2", {
                x: data.x,
                y: data.y,
                width: label2Position.width,
                height: label2Position.height,
              });
            }}
          >
            <ResizableBox
              width={label2Position.width}
              height={label2Position.height}
              minConstraints={[200, 50]}
              maxConstraints={[600, 300]}
              axis="both"
              resizeHandles={
                activeDraggable === "label2" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                updateElementPosition(componentId, "label2", {
                  x: label2Position.x,
                  y: label2Position.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative cursor-move"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("label2");
                }}
              >
                <EditableText
                  content={
                    styledContent?.label2 || {
                      text: label2,
                      segments: [{ text: label2, styles: {} }],
                    }
                  }
                  type="label2"
                  className="cursor-text"
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