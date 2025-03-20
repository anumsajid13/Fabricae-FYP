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

export const ContactMe = forwardRef((props, ref) => {
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

  const pageId = `ContactMe-${selectedPage}`;
  const pageState = getPageState(pageId);

  // Initialize state from pageState if it exists, otherwise use defaults
  const [heading, setHeading] = useState(pageState?.heading || "CONTACT ME");
  const [description1, setDescription1] = useState(
    pageState?.description1 ||
      "If you're interested in collaborating or have any questions, feel free to reach out! I'd love to hear from you."
  );
  const [label1, setLabel1] = useState(
    pageState?.label1 || "example@example.com"
  );
  const [label2, setLabel2] = useState(
    pageState?.label2 || "https://www.linkedin.com/in/example"
  );
  const [label3, setLabel3] = useState(
    pageState?.label3 ||
      "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision."
  );
  const [label4, setLabel4] = useState(pageState?.label4 || "Email");
  const [label5, setLabel5] = useState(pageState?.label5 || "Linkedin");

  const [activeSmallImageIndex, setActiveSmallImageIndex] = useState(null);
  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      heading: { text: heading, segments: [{ text: heading, styles: {} }] },
      label1: { text: label1, segments: [{ text: label1, styles: {} }] },
      label2: { text: label2, segments: [{ text: label2, styles: {} }] },
      label3: { text: label3, segments: [{ text: label3, styles: {} }] },
      label4: { text: label4, segments: [{ text: label4, styles: {} }] },
      label5: { text: label5, segments: [{ text: label5, styles: {} }] },
      description1: {
        text: description1,
        segments: [{ text: description1, styles: {} }],
      },
    };
  });

  const componentId = "ContactMe";

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
      label3,
      label4,
      label5,
      description1,

      styledContent,
      elementPositions: {
        heading: getElementPosition(componentId, "heading"),
        label1: getElementPosition(componentId, "label1"),
        label2: getElementPosition(componentId, "label2"),
        label3: getElementPosition(componentId, "label3"),
        label4: getElementPosition(componentId, "label4"),
        label5: getElementPosition(componentId, "label5"),
        description1: getElementPosition(componentId, "description1"),
      },
    });
  }, [
    heading,
    label1,
    label2,
    label3,
    label4,
    label5,
    description1,

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
      const pageId = 11;

      const stateToSave = {
        portfolioId,
        pageId,
        username,
        heading,
        label1,
        label2,
        label3,
        label4,
        label5,

        styledContent,
        elementPositions: {
          heading: getElementPosition(componentId, "heading"),
          label1: getElementPosition(componentId, "label1"),
          label2: getElementPosition(componentId, "label2"),
          label3: getElementPosition(componentId, "label3"),
          label4: getElementPosition(componentId, "label4"),
          label5: getElementPosition(componentId, "label5"),
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
      const pageId = 11;

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
      if (savedState.label3) setLabel3(savedState.label3);
      if (savedState.label4) setLabel4(savedState.label4);
      if (savedState.label5) setLabel5(savedState.label5);
      if (savedState.description1) setDescription1(savedState.description1);

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
          label3: savedState.styledContent.label3 || {
            text: savedState.label3 || label3,
            segments: [{ text: savedState.label3 || label3, styles: {} }],
          },
          label4: savedState.styledContent.label4 || {
            text: savedState.label4 || label4,
            segments: [{ text: savedState.label4 || label4, styles: {} }],
          },
          label5: savedState.styledContent.label5 || {
            text: savedState.label5 || label5,
            segments: [{ text: savedState.label5 || label5, styles: {} }],
          },

          description1: savedState.styledContent.description1 || {
            text: savedState.description1 || description1,
            segments: [
              { text: savedState.description1 || description1, styles: {} },
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
        if (savedState.elementPositions.label3) {
          updateElementPosition(
            componentId,
            "label3",
            savedState.elementPositions.label3
          );
        }
        if (savedState.elementPositions.label4) {
          updateElementPosition(
            componentId,
            "label4",
            savedState.elementPositions.label4
          );
        }
        if (savedState.elementPositions.label5) {
          updateElementPosition(
            componentId,
            "label5",
            savedState.elementPositions.label5
          );
        }

        if (savedState.elementPositions.description1) {
          updateElementPosition(
            componentId,
            "description1",
            savedState.elementPositions.description1
          );
        }
      }

      console.log("Portfolio loaded successfully");
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const headingPosition = getElementPosition(componentId, "heading");
  const label1Position = getElementPosition(componentId, "label1");
  const label2Position = getElementPosition(componentId, "label2");
  const label3Position = getElementPosition(componentId, "label3");
  const label4Position = getElementPosition(componentId, "label4");
  const label5Position = getElementPosition(componentId, "label5");
  const description1Position = getElementPosition(componentId, "description1");

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
      label3,
      label4,
      label5,

      description1,

      styledContent,
    });
  }, [
    heading,
    label1,
    label2,
    label3,
    label4,
    label5,
    description1,

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
      case "label3":
        setLabel3(newText);
        break;
      case "label4":
        setLabel4(newText);
        break;
      case "label5":
        setLabel5(newText);
        break;

      case "description1":
        setDescription1(newText);
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
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4">
      <div className="max-w-4xl w-full border border-black p-4 h-96 ">
        {" "}
        {/* Heading */}
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
              style={{ transform: "none" }}
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
                className="text-3xl font-serif font-bold text-center cursor-text"
              />
            </div>
          </ResizableBox>
        </Draggable>
        {/* Call-to-Action Message */}
        <Draggable
          disabled={activeDraggable !== "description1"}
          defaultPosition={{
            x: description1Position.x,
            y: description1Position.y,
          }}
          onStop={(e, data) => {
            updateElementPosition(componentId, "description1", {
              x: data.x,
              y: data.y,
              width: description1.width,
              height: description1.height,
            });
          }}
        >
          <ResizableBox
            width={description1.width}
            height={description1.height}
            minConstraints={[200, 50]}
            maxConstraints={[600, 200]}
            axis="both"
            resizeHandles={
              activeDraggable === "description1" ? ["se", "sw", "ne", "nw"] : []
            }
            onResizeStop={(e, { size }) => {
              updateElementPosition(componentId, "description1", {
                x: description1Position.x,
                y: description1Position.y,
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
                handleDragStart("description1");
              }}
            >
              <EditableText
                content={
                  styledContent?.description1 || {
                    text: description1,
                    segments: [{ text: description1, styles: {} }],
                  }
                }
                type="description1"
                className="text-center text-base mt-3 cursor-text"
              />
            </div>
          </ResizableBox>
        </Draggable>
        {/* Contact Information */}
        <div className="mt-4 space-y-3">
          {/* Email Section */}
          <div className="text-center">
            <Draggable
              disabled={activeDraggable !== "label4"}
              defaultPosition={{ x: label4Position.x, y: label4Position.y }}
              onStop={(e, data) => {
                updateElementPosition(componentId, "label4", {
                  x: data.x,
                  y: data.y,
                  width: label4Position.width,
                  height: label4Position.height,
                });
              }}
            >
              <ResizableBox
                width={label4Position.width}
                height={label4Position.height}
                minConstraints={[200, 50]}
                maxConstraints={[600, 200]}
                axis="both"
                resizeHandles={
                  activeDraggable === "label4" ? ["se", "sw", "ne", "nw"] : []
                }
                onResizeStop={(e, { size }) => {
                  updateElementPosition(componentId, "label4", {
                    x: label4Position.x,
                    y: label4Position.y,
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
                    handleDragStart("label4");
                  }}
                >
                  <EditableText
                    content={
                      styledContent?.label4 || {
                        text: label4,
                        segments: [{ text: heading, styles: {} }],
                      }
                    }
                    type="label4"
                    className="text-xl font-serif font-bold cursor-text"
                  />
                </div>
              </ResizableBox>
            </Draggable>

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
                maxConstraints={[600, 200]}
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
                  style={{ transform: "none" }}
                  className="relative text-center cursor-move"
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
                    className="text-base text-blue-600 hover:underline"
                  />
                </div>
              </ResizableBox>
            </Draggable>
          </div>
          {/* LinkedIn Section */}
          <div className="text-center">
            <Draggable
              disabled={activeDraggable !== "label5"}
              defaultPosition={{ x: label5Position.x, y: label5Position.y }}
              onStop={(e, data) => {
                updateElementPosition(componentId, "label5", {
                  x: data.x,
                  y: data.y,
                  width: label5Position.width,
                  height: label5Position.height,
                });
              }}
            >
              <ResizableBox
                width={label5Position.width}
                height={label5Position.height}
                minConstraints={[200, 50]}
                maxConstraints={[600, 200]}
                axis="both"
                resizeHandles={
                  activeDraggable === "label5" ? ["se", "sw", "ne", "nw"] : []
                }
                onResizeStop={(e, { size }) => {
                  updateElementPosition(componentId, "label5", {
                    x: label5Position.x,
                    y: label5Position.y,
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
                    handleDragStart("label5");
                  }}
                >
                  <EditableText
                    content={
                      styledContent?.label5 || {
                        text: label5,
                        segments: [{ text: label5, styles: {} }],
                      }
                    }
                    type="label5"
                    className="text-xl font-serif font-bold cursor-text"
                  />
                </div>
              </ResizableBox>
            </Draggable>

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
                maxConstraints={[600, 200]}
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
                  style={{ transform: "none" }}
                  className="relative text-center cursor-move"
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
                    className="text-base text-blue-600 hover:underline cursor-text"
                  />
                </div>
              </ResizableBox>
            </Draggable>
          </div>
          {/* Additional Information */}
          <div className="text-center">
            <Draggable
              disabled={activeDraggable !== "label3"}
              defaultPosition={{ x: label3Position.x, y: label3Position.y }}
              onStop={(e, data) => {
                updateElementPosition(componentId, "label3", {
                  x: data.x,
                  y: data.y,
                  width: label3Position.width,
                  height: label3Position.height,
                });
              }}
            >
              <ResizableBox
                width={label3Position.width}
                height={label3Position.height}
                minConstraints={[200, 50]}
                maxConstraints={[600, 200]}
                axis="both"
                resizeHandles={
                  activeDraggable === "label3" ? ["se", "sw", "ne", "nw"] : []
                }
                onResizeStop={(e, { size }) => {
                  updateElementPosition(componentId, "label3", {
                    x: label3Position.x,
                    y: label3Position.y,
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
                    handleDragStart("label3");
                  }}
                >
                  <EditableText
                    content={
                      styledContent?.label3 || {
                        text: label3,
                        segments: [{ text: label3, styles: {} }],
                      }
                    }
                    type="label3"
                    className="text-base cursor-text"
                  />
                </div>
              </ResizableBox>
            </Draggable>
          </div>
        </div>
      </div>
    </div>
  );
});
