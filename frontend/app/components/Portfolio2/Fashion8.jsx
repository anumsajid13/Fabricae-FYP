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

export const MyWorkArea1 = forwardRef((props, ref) => {
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

  const pageId = `MyWorkArea1-${selectedPage}`;
  const pageState = getPageState(pageId);
  const componentId = "MyWorkArea1";

  // Initialize state from pageState if it exists, otherwise use defaults
  const [title, setTitle] = useState(pageState?.title || "- APPAREL DESIGNER -");
  const [quote, setQuote] = useState(pageState?.quote || "MY WORK-Area 1");

  const [year, setYear] = useState(pageState?.year || "- 2022 -");
  const [images, setImages] = useState(pageState?.images || ["/mywork.jpg"]);

  const [activeSmallImageIndex, setActiveSmallImageIndex] = useState(null);
  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      title: { text: title, segments: [{ text: title, styles: {} }] },
      quote: { text: quote, segments: [{ text: quote, styles: {} }] },

      year: { text: year, segments: [{ text: year, styles: {} }] },
    };
  });

  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, [registerComponent]);

  useEffect(() => {
    updatePageState(pageId, {
      title,
      quote,
      year,
      images,
      styledContent,
      elementPositions: {
        title: getElementPosition(componentId, "title"),
        quote: getElementPosition(componentId, "quote"),
        year: getElementPosition(componentId, "year"),
        image1: getElementPosition(componentId, "image1"),
      },
    });
  }, [
    title,
    quote,
    year,
    images,
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
      const pageId = 8;

      const stateToSave = {
        portfolioId,
        pageId,
        username,
        title,
        quote,
        year,
        images,
        styledContent,
        elementPositions: {
          title: getElementPosition(componentId, "title"),
          quote: getElementPosition(componentId, "quote"),
          year: getElementPosition(componentId, "year"),
          image1: getElementPosition(componentId, "image1"),
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
      const pageId = 8;

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

      if (savedState.title) setTitle(savedState.title);
      if (savedState.quote) setQuote(savedState.quote);
      if (savedState.year) setYear(savedState.year);
      if (savedState.images) setImages(savedState.images);

      if (savedState.styledContent) {
        const loadedStyledContent = {
          title: savedState.styledContent.title || {
            text: savedState.title || title,
            segments: [{ text: savedState.title || title, styles: {} }],
          },
          quote: savedState.styledContent.quote || {
            text: savedState.quote || quote,
            segments: [{ text: savedState.quote || quote, styles: {} }],
          },

          year: savedState.styledContent.year || {
            text: savedState.year || year,
            segments: [{ text: savedState.year || year, styles: {} }],
          },
        };
        setStyledContent(loadedStyledContent);
      }

      if (savedState.elementPositions) {
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
      }

      console.log("Portfolio loaded successfully");
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const handleDoubleClickSmallImage = (e, index) => {
    e.stopPropagation();
    setActiveSmallImageIndex(index);
    setShowImageOptions("smallImage");
  };

  const handleCloseModal = () => {
    setShowImageOptions(null);
  };

  const handleChooseFromComputer = (type) => {
    if (type === "smallImage") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = handleSmallImageUpload;
      fileInput.click();
    }
    setShowImageOptions(null);
  };

  const handleSmallImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[activeSmallImageIndex] = imageUrl;
        return updatedImages;
      });
    }
    e.target.value = "";
  };

  const handleSelectSmallImageFromGallery = (imageUrl) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[activeSmallImageIndex] = imageUrl;
      return updatedImages;
    });
    setShowGalleryModal(false);
    setShowImageOptions(null);
  };

  const handleChooseFromGallery = (type) => {
    setShowGalleryModal(true);
    setShowImageOptions(type);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    if (showImageOptions === "smallImage") {
      handleSelectSmallImageFromGallery(imageUrl);
    }
    setShowGalleryModal(false);
    setShowImageOptions(null);
  };

  const titlePosition = getElementPosition(componentId, "title");
  const quotePosition = getElementPosition(componentId, "quote");
  const yearPosition = getElementPosition(componentId, "year");
  const image1Position = getElementPosition(componentId, "image1");

  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, []);

  useEffect(() => {
    updatePageState(pageId, {
      title,
      quote,
      year,
      images,
      styledContent,
    });
  }, [title, quote, year, images, styledContent, pageId, updatePageState]);

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
      case "title":
        setTitle(newText);
        break;
      case "quote":
        setQuote(newText);
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
    <div className="w-[830px] flex justify-center items-center min-h-screen bg-[#efe8e4] p-4" onClick={() => setActiveDraggable(null)}>
      <div className="max-w-3xl w-full grid grid-cols-2 gap-6 items-center border border-black p-4 h-96">
        {/* Left Section - Image */}
        <div>
          {images.map((src, index) => (
            <Draggable
              key={index}
              disabled={activeDraggable !== `image${index + 1}`}
              defaultPosition={{
                x: getElementPosition(componentId, `image${index + 1}`).x,
                y: getElementPosition(componentId, `image${index + 1}`).y,
              }}
              onStop={(e, data) => {
                updateElementPosition(componentId, `image${index + 1}`, {
                  x: data.x,
                  y: data.y,
                  width: getElementPosition(componentId, `image${index + 1}`)
                    .width,
                  height: getElementPosition(componentId, `image${index + 1}`)
                    .height,
                });
              }}
            >
              <ResizableBox
                width={
                  getElementPosition(componentId, `image${index + 1}`).width
                }
                height={
                  getElementPosition(componentId, `image${index + 1}`).height
                }
                minConstraints={[100, 100]}
                maxConstraints={[400, 400]}
                axis="both"
                resizeHandles={
                  activeDraggable === `image${index + 1}`
                    ? ["se", "sw", "ne", "nw"]
                    : []
                }
                onResizeStop={(e, { size }) => {
                  updateElementPosition(componentId, `image${index + 1}`, {
                    x: getElementPosition(componentId, `image${index + 1}`).x,
                    y: getElementPosition(componentId, `image${index + 1}`).y,
                    width: size.width,
                    height: size.height,
                  });
                }}
              >
                <div className="relative w-full h-full">
                  <img
                    src={src}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover border cursor-pointer"
                    onDoubleClick={(e) => handleDoubleClickSmallImage(e, index)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDragStart(`image${index + 1}`);
                    }}
                  />
                </div>
              </ResizableBox>
            </Draggable>
          ))}
        </div>
        {/* Right Section - Text */}
        <div className="text-center">
          <Draggable
            disabled={activeDraggable !== "title"}
            defaultPosition={{ x: titlePosition.x, y: titlePosition.y }}
            onStop={(e, data) => {
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
                  className="italic text-gray-600 text-base cursor-text"
                />
              </div>
            </ResizableBox>
          </Draggable>

          <Draggable
            disabled={activeDraggable !== "quote"}
            defaultPosition={{ x: quotePosition.x, y: quotePosition.y }}
            onStop={(e, data) => {
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
                className="relative text-center cursor-move"
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
                  className="text-4xl font-serif font-bold italic  text-black"
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Editable Year */}
          <Draggable
            disabled={activeDraggable !== "year"}
            defaultPosition={{ x: yearPosition.x, y: yearPosition.y }}
            onStop={(e, data) => {
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
                  className="italic text-gray-600 text-base mt-3 cursor-text"
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
