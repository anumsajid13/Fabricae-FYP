import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GalleryModal } from "./GalleryModal";
import { ImageOptionsModal } from "./ImageOptionsModal";

export const PortfolioSection = () => {
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

  // Component ID for this component
  const componentId = "fashion-collab";
  const [bgColor, setBgColor] = useState("#a3846f");
  const [backgroundImage, setBackgroundImage] = useState(
    pageState.backgroundImage || "/Picture7.jpg"
  );

  // State for images in the grid
  const [images, setImages] = useState([
    "/Picture17.jpg",
    "/Picture18.jpg",
    "/Picture19.jpg",
    "/Picture20.jpg",
  ]);

  const [activeDraggable, setActiveDraggable] = useState(null);
  const backgroundInputRef = useRef(null);
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
    if (pageState.styledContent) {
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
      images,
    });
  }, [
    backgroundImage,
    heading,
    description,
    styledContent,
    images,
    pageId,
    updatePageState,
  ]);

  const handleDragStart = (key) => {
    setActiveDraggable(key);
  };

  const handleImageClick = (index) => {
    setShowImageOptions(index); // Set the index of the image being edited
  };

  const handleCloseModal = () => {
    setShowImageOptions(null);
  };

  const handleChooseFromComputer = (type) => {
    if (type === "background") {
      backgroundInputRef.current.click();
    }
    setShowImageOptions(null); // Close the modal
  };

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleChooseFromGallery = (type) => {
    setShowGalleryModal(true); // Show the gallery modal
    setShowImageOptions(type);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    if (typeof showImageOptions === "number") {
      // Update the specific image in the grid
      const newImages = [...images];
      newImages[showImageOptions] = imageUrl;
      setImages(newImages);
    } else if (showImageOptions === "background") {
      setBackgroundImage(imageUrl); // Update background image
    }
    setShowGalleryModal(false); // Close the gallery modal
    setShowImageOptions(null);
  };

  // Handle text change for heading or description
  const handleTextChange = (e, type) => {
    const newText = e.target.value;

    if (type === "heading") {
      setHeading(newText);
    } else if (type === "description") {
      setDescription(newText);
    }

    setStyledContent((prev) => ({
      ...prev,
      [type]: {
        text: newText,
        segments: [{ text: newText, styles: {} }],
      },
    }));
  };

  // Handle local text selection for styling
  const handleLocalTextSelection = (e, type) => {
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

      // Send selection to the global context
      handleTextSelection(selectedText);
    }
  };

  // Update styles for selected text
  const updateStyles = (type, styles) => {
    setStyledContent((prev) => {
      const content = prev[type];
      if (!content) return prev;

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;

      const newSegments = [];
      let currentOffset = 0;

      content.segments.forEach((segment) => {
        const segmentLength = segment.text.length;

        if (currentOffset + segmentLength <= startOffset) {
          newSegments.push(segment);
        } else if (currentOffset >= endOffset) {
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

          if (currentOffset + segmentLength > endOffset) {
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

  // EditableText component for rendering and editing text
  const EditableText = ({ content, type, className }) => {
    const textRef = useRef(null);
    const inputRef = useRef(null);
    const [localValue, setLocalValue] = useState(content.text);

    useEffect(() => {
      if (editingField === type) {
        setLocalValue(content.text);
      }
    }, [editingField, type, content.text]);

    const handleInputChange = (e) => {
      setLocalValue(e.target.value);
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

  const [editingField, setEditingField] = useState(null);

  return (
    <div
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
      className="w-[828px] bg-cover bg-center min-h-screen flex flex-col items-center justify-center cursor-pointer portfolio-page"
      onClick={() => setActiveDraggable(null)} // Click outside to deactivate
    >
      <input
        type="file"
        accept="image/*"
        ref={backgroundInputRef}
        className="hidden"
        onChange={(e) => handleImageUpload(e, setBackgroundImage)}
      />

      <div
        className="text-white w-[90%] min-w-[500px] h-[400px] bg-opacity-90 p-8 flex flex-row items-center"
        style={{
          backgroundColor: bgColor,
          height: "400px",
          marginLeft: "110px",
          marginRight: "110px",
        }}
      >
        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 md:w-2/3">
          {images.map((image, index) => {
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
                    onDoubleClick={() => handleImageClick(index)}
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
                className="relative text-center cursor-move"
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
                activeDraggable === "description" ? ["se", "sw", "ne", "nw"] : []
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
                className="relative text-center cursor-move"
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
          onChooseFromComputer={() => handleChooseFromComputer(showImageOptions)}
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