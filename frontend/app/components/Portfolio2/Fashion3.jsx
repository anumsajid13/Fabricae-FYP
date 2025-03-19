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

export const AboutMe2 = forwardRef((props, ref) => {
  const [activeDraggable, setActiveDraggable] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const image1InputRef = useRef(null);
  const image2InputRef = useRef(null);
  const image3InputRef = useRef(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(null); // 'image1', 'image2', or 'image3'

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

  const pageId = `about-me-2-${selectedPage}`;
  const pageState = getPageState(pageId);
  console.log(pageId)

  // Initialize state from pageState if it exists, otherwise use defaults
  const [heading, setHeading] = useState(
    pageState?.heading || "ABOUT ME"
  );
  const [description, setDescription] = useState(
    pageState?.description ||
      "You can give a brief description of the topic you want to talk about here. For example, if you want to talk about minimalist design, you can say that it's one of the most impactful approaches of design."
  );
  const [image1, setImage1] = useState(pageState?.image1 || "/aboutme1.jpg");
  const [image2, setImage2] = useState(pageState?.image2 || "/aboutme2.jpg");
  const [image3, setImage3] = useState(pageState?.image3 || "/aboutme3.jpg");

  // Initialize styled content from pageState if it exists
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

  // Component ID for this component
  const componentId = "about-me-2";

  // Register this component with context when it mounts
  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, [registerComponent]);

  // Update page state whenever any state changes
  useEffect(() => {
    updatePageState(pageId, {
      heading,
      description,
      image1,
      image2,
      image3,
      styledContent,
      elementPositions: {
        heading: getElementPosition(componentId, "heading"),
        description: getElementPosition(componentId, "description"),
        image1: getElementPosition(componentId, "image1"),
        image2: getElementPosition(componentId, "image2"),
        image3: getElementPosition(componentId, "image3"),
      },
    });
  }, [
    heading,
    description,
    image1,
    image2,
    image3,
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

      const portfolioId = 2;
      const pageId = 3;

      const stateToSave = {
        portfolioId, // Include portfolioId in the request body
        pageId, // Include pageId in the request body
        username, // Include username in the request body
        heading,
        description,
        image1,
        image2,
        image3,
        styledContent,
        elementPositions: {
          heading: getElementPosition(componentId, "heading"),
          description: getElementPosition(componentId, "description"),
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

      const portfolioId = 2;
      const pageId = 3;

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
      if (savedState.heading) setHeading(savedState.heading);
      if (savedState.description) setDescription(savedState.description);
      if (savedState.image1) setImage1(savedState.image1);
      if (savedState.image2) setImage2(savedState.image2);
      if (savedState.image3) setImage3(savedState.image3);

      // Ensure styledContent is properly structured before setting it
      if (savedState.styledContent) {
        setStyledContent(savedState.styledContent);
      } else {
        setStyledContent({
          heading: {
            text: savedState.heading || heading,
            segments: [{ text: savedState.heading || heading, styles: {} }],
          },
          description: {
            text: savedState.description || description,
            segments: [{ text: savedState.description || description, styles: {} }],
          },
        });
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

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      switch (type) {
        case "image1":
          setImage1(imageUrl);
          updatePageState(pageId, { image1: imageUrl });
          break;
        case "image2":
          setImage2(imageUrl);
          updatePageState(pageId, { image2: imageUrl });
          break;
        case "image3":
          setImage3(imageUrl);
          updatePageState(pageId, { image3: imageUrl });
          break;
        default:
          break;
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
    switch (type) {
      case "image1":
        image1InputRef.current.click();
        break;
      case "image2":
        image2InputRef.current.click();
        break;
      case "image3":
        image3InputRef.current.click();
        break;
      default:
        break;
    }
    setShowImageOptions(null); // Close the modal
  };

  const handleChooseFromGallery = (type) => {
    setShowGalleryModal(true); // Show the gallery modal
    setShowImageOptions(type);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    switch (showImageOptions) {
      case "image1":
        setImage1(imageUrl);
        updatePageState(pageId, { image1: imageUrl });
        break;
      case "image2":
        setImage2(imageUrl);
        updatePageState(pageId, { image2: imageUrl });
        break;
      case "image3":
        setImage3(imageUrl);
        updatePageState(pageId, { image3: imageUrl });
        break;
      default:
        break;
    }
    setShowGalleryModal(false); // Close the gallery modal
    setShowImageOptions(null);
  };

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

  const headingPosition = getElementPosition(componentId, "heading");
  const descriptionPosition = getElementPosition(componentId, "description");
  const image1Position = getElementPosition(componentId, "image1");
  const image2Position = getElementPosition(componentId, "image2");
  const image3Position = getElementPosition(componentId, "image3");

  return (
    <div className="w-[830px] flex flex-col items-center justify-center min-h-screen bg-[#efe8e4] p-6"  onClick={() => setActiveDraggable(null)}>
      <div className="max-w-4xl w-full text-center">
        {/* Heading */}
        <Draggable
          disabled={activeDraggable !== "heading"}
          defaultPosition={{ x: headingPosition.x, y: headingPosition.y }}
          onStop={(e, data) => {
            console.log("Updating heading position:", { x: data.x, y: data.y });
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
            maxConstraints={[600, 150]}
            axis="both"
            resizeHandles={
              activeDraggable === "heading" ? ["se", "sw", "ne", "nw"] : []
            }
            onResizeStop={(e, { size }) => {
              console.log("Updating heading size:", size);
              updateElementPosition(componentId, "heading", {
                x: headingPosition.x,
                y: headingPosition.y,
                width: size.width,
                height: size.height,
              });
            }}
          >
            <div
              className="relative pointer-cursor"
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
                className="text-6xl font-serif font-bold"
              />
            </div>
          </ResizableBox>
        </Draggable>

        {/* Description */}
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
          <ResizableBox
            width={descriptionPosition.width}
            height={descriptionPosition.height}
            minConstraints={[300, 50]}
            maxConstraints={[800, 200]}
            axis="both"
            resizeHandles={
              activeDraggable === "description" ? ["se", "sw", "ne", "nw"] : []
            }
            onResizeStop={(e, { size }) => {
              console.log("Updating description size:", size);
              updateElementPosition(componentId, "description", {
                x: descriptionPosition.x,
                y: descriptionPosition.y,
                width: size.width,
                height: size.height,
              });
            }}
          >
            <div
              className="relative pointer-cursor"
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
                className="text-xl max-w-3xl mx-auto"
              />
            </div>
          </ResizableBox>
        </Draggable>

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 border border-black p-4 max-w-3xl mx-auto -mt-8">
          {/* Image 1 */}
          <Draggable
            disabled={activeDraggable !== "image1"}

            defaultPosition={{ x: image1Position.x, y: image1Position.y }}
            onStop={(e, data) => {
              console.log("Updating image1 position:", { x: data.x, y: data.y });
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
              maxConstraints={[300, 300]}
              axis="both"
              resizeHandles={
                activeDraggable === "image1" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                console.log("Updating image1 size:", size);
                updateElementPosition(componentId, "image1", {
                  x: image1Position.x,
                  y: image1Position.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("image1");
                }}
              >
                <img
                  src={image1}
                  alt="Sketching design"
                  className="w-full h-48 object-cover border cursor-pointer"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleImageClick("image1");
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={image1InputRef}
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "image1")}
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Image 2 */}
          <Draggable
            disabled={activeDraggable !== "image2"}

            defaultPosition={{ x: image2Position.x, y: image2Position.y }}
            onStop={(e, data) => {
              console.log("Updating image2 position:", { x: data.x, y: data.y });
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
              maxConstraints={[300, 300]}
              axis="both"
              resizeHandles={
                activeDraggable === "image2" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                console.log("Updating image2 size:", size);
                updateElementPosition(componentId, "image2", {
                  x: image2Position.x,
                  y: image2Position.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("image2");
                }}
              >
                <img
                  src={image2}
                  alt="Cutting fabric"
                  className="w-full h-48 object-cover border cursor-pointer"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleImageClick("image2");
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={image2InputRef}
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "image2")}
                />
              </div>
            </ResizableBox>
          </Draggable>

          {/* Image 3 */}
          <Draggable
            disabled={activeDraggable !== "image3"}

            defaultPosition={{ x: image3Position.x, y: image3Position.y }}
            onStop={(e, data) => {
              console.log("Updating image3 position:", { x: data.x, y: data.y });
              updateElementPosition(componentId, "image3", {
                x: data.x,
                y: data.y,
                width: image3Position.width,
                height: image3Position.height,
              });
            }}
          >
            <ResizableBox
              width={image3Position.width}
              height={image3Position.height}
              minConstraints={[100, 100]}
              maxConstraints={[300, 300]}
              axis="both"
              resizeHandles={
                activeDraggable === "image3" ? ["se", "sw", "ne", "nw"] : []
              }
              onResizeStop={(e, { size }) => {
                console.log("Updating image3 size:", size);
                updateElementPosition(componentId, "image3", {
                  x: image3Position.x,
                  y: image3Position.y,
                  width: size.width,
                  height: size.height,
                });
              }}
            >
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDragStart("image3");
                }}
              >
                <img
                  src={image3}
                  alt="Pattern making"
                  className="w-full h-48 object-cover border cursor-pointer"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleImageClick("image3");
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={image3InputRef}
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "image3")}
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
});