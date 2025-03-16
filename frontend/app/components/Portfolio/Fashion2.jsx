import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { ChromePicker } from "react-color";

export const FashionLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState("/Picture7.jpg");
  const [innerContainerImage, setInnerContainerImage] = useState(null);
  const [bgColor, setBgColor] = useState("#a3846f");
  const [heading, setHeading] = useState("My Vision");
  const [description, setDescription] = useState([
    "- My work is inspired by [Culture, Art, Nature etc.]",
    "- I believe in creating fashion that is [Sustainable, Timeless, Experimental etc.]",
    "- Each piece tells a story and is designed with [Craftsmanship, Ethical practices]",
  ]);
  const [editingField, setEditingField] = useState(null);
  const backgroundInputRef = useRef(null);
  const innerContainerInputRef = useRef(null);
  const [smallImages, setSmallImages] = useState([
    "/Picture8.jpg",
    "/Picture9.jpg",
    "/Picture10.jpg",
    "/Picture11.jpg",
  ]);
  const [activeDraggable, setActiveDraggable] = useState(null);

  // Store text with styling information
  const [styledContent, setStyledContent] = useState({
    heading: {
      text: heading,
      segments: [{ text: heading, styles: {} }],
    },
    description: {
      text: description.join("\n"), // Join array into a single string for editing
      segments: [{ text: description.join("\n"), styles: {} }],
    },
  });

  // Access fashion context
  const { handleTextSelection, registerComponent } = useFashionStore();

  // Component ID for this component
  const componentId = "fashion-layout";

  // Register this component with context
  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, []);

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
    }
    e.target.value = ""; // Reset the file input
  };

  // Handle text change for heading or description
  const handleTextChange = (e, type) => {
    const newText = e.target.value;

    if (type === "heading") {
      setHeading(newText);
    } else if (type === "description") {
      setDescription(newText.split("\n")); // Split text into array for bullet points
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

  // Update styles for selected text
  const updateStyles = (type, styles) => {
    setStyledContent((prev) => {
      const content = prev[type];
      if (!content) return prev;

      // Get current selection from context
      const selection = {
        startOffset: 0,
        endOffset: content.text.length,
        ...(window.getSelection && {
          startOffset: window.getSelection().getRangeAt(0).startOffset,
          endOffset: window.getSelection().getRangeAt(0).endOffset,
        }),
      };

      const { startOffset, endOffset } = selection;

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
    const [localValue, setLocalValue] = useState("");

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
      if (e.key === "Enter" && type === "heading") {
        handleInputBlur();
      }
    };

    return (
      <div
        className={`relative w-full ${className}`}
        style={{
          minHeight: type === "heading" ? "50px" : "80px", // Ensures height doesn't collapse
          position: "relative",
        }}
      >
        {editingField === type ? (
          type === "heading" ? (
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
              className="bg-transparent border-b border-white focus:outline-none w-full"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50px",
              }}
            />
          ) : (
            <textarea
              ref={inputRef}
              value={localValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              autoFocus
              className="bg-transparent border border-white focus:outline-none w-full"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                minHeight: "80px",
                maxHeight: "150px",
                resize: "none",
                overflow: "hidden",
              }}
            />
          )
        ) : (
          <div
            ref={textRef}
            className="cursor-text w-full"
            onClick={() => setEditingField(type)}
            style={{
              minHeight: type === "heading" ? "50px" : "80px", // Reserves space even when not editing
            }}
          >
            {content.segments.map((segment, index) => (
              <span key={index} style={segment.styles}>
                {segment.text}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };




  // Handle background image upload
  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
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
  };


  // Handle double-click to trigger file input for background
  const handleDoubleClickBackground = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    backgroundInputRef.current.click();
  };

   // Handle double-click to trigger file input for inner container
   const handleDoubleClickInnerContainer = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    innerContainerInputRef.current.click();
  };

  // Handle double-click to trigger file input for small images
  const handleDoubleClickSmallImage = (e, index) => {
    e.stopPropagation(); // Prevent event bubbling
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => handleSmallImageUpload(e, index);
    fileInput.click();
  };

  return (
    <div
      style={{
        backgroundImage: `url('${backgroundImage}')`
      }}
      className="bg-cover bg-center min-h-screen flex items-center justify-center cursor-pointer portfolio-page"
      onDoubleClick={handleDoubleClickBackground} // Trigger file input on double-click
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

<div className="w-[80%] bg-opacity-90 p-8 flex flex-col md:flex-row gap-6"
     style={{ backgroundColor: bgColor, height: "390px", backgroundImage: innerContainerImage ? `url('${innerContainerImage}')` : "none" }}
     onDoubleClick={handleDoubleClickInnerContainer}>

  {/* Left Section with Images */}
  <div className="grid grid-cols-2 grid-rows-2 gap-4" style={{ flex: "0 0 auto" }}>
    {smallImages.map((img, index) => (
      <div key={index} className="col-span-1 row-span-1 cursor-pointer">
        <img src={img} alt={`Fashion ${index}`} className="rounded-lg w-full h-full object-cover" />
      </div>
    ))}
  </div>

{/* Right Section with Text */}
<div className="flex-1 text-white flex flex-col items-center gap-4">
  {/* Heading - Fixed Position */}
  <div className="w-full flex justify-center" style={{ minHeight: "50px" }}>
    <EditableText
      content={styledContent.heading}
      type="heading"
      className="text-4xl font-bold cursor-text text-center w-full"
    />
  </div>

  {/* Description - Prevent Overflow */}
  <div className="w-full flex justify-center" >
    <EditableText
      content={styledContent.description}
      type="description"
      className="text-lg cursor-text text-center w-full"
    />
  </div>
</div>


</div>

    </div>
  );
};