import React, { useState, useEffect, useRef } from "react";
import { useFashionStore } from "./FashionProvider";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

export const FashionLayout  = () =>{
  const [backgroundImage, setBackgroundImage] = useState("/Picture7.jpg");
  const [heading, setHeading] = useState("Technical Drawings");
  const [description, setDescription] = useState(
    "Demonstrate your technical proficiency by including detailed technical drawings of your garments. Show measurements, seam placements, construction details, and any unique features that make your designs stand out."
  );
  const [editingField, setEditingField] = useState(null);
  const [bgColor, setBgColor] = useState("#a3846f");
  const backgroundInputRef = useRef(null);
  const [activeDraggable, setActiveDraggable] = useState(null);

  // Store text with styling information
  const [styledContent, setStyledContent] = useState({
    heading: {
      text: heading,
      segments: [{ text: heading, styles: {} }]
    },
    description: {
      text: description,
      segments: [{ text: description, styles: {} }]
    }
  });

  // Access fashion context
  const { handleTextSelection, registerComponent } = useFashionStore();

  // Component ID for this component
  const componentId = "fashion-layout";

  // Register this component with context
  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles
    });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  const handleDragStart = (key) => {
    setActiveDraggable(key);
  };

  const handleTextChange = (e, type) => {
    const newText = e.target.value;

    // Update both the direct state and the styled content
    if (type === 'heading') {
      setHeading(newText);
    } else if (type === 'description') {
      setDescription(newText);
    }

    setStyledContent(prev => ({
      ...prev,
      [type]: {
        text: newText,
        segments: [{ text: newText, styles: {} }]
      }
    }));
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
        componentId // Include the component ID
      };

      // Send selection to the global context
      handleTextSelection(selectedText);
    }
  };

  const updateStyles = (type, styles) => {
    setStyledContent(prev => {
      const content = prev[type];
      if (!content) return prev;

      // Get current selection from context
      const selection = {
        startOffset: 0,
        endOffset: content.text.length,
        ...window.getSelection && {
          startOffset: window.getSelection().getRangeAt(0).startOffset,
          endOffset: window.getSelection().getRangeAt(0).endOffset
        }
      };

      const { startOffset, endOffset } = selection;

      const newSegments = [];
      let currentOffset = 0;

      content.segments.forEach(segment => {
        const segmentLength = segment.text.length;

        if (currentOffset + segmentLength <= startOffset) {
          newSegments.push(segment);
        } else if (currentOffset >= endOffset) {
          newSegments.push(segment);
        } else {
          if (currentOffset < startOffset) {
            newSegments.push({
              text: segment.text.substring(0, startOffset - currentOffset),
              styles: { ...segment.styles }
            });
          }

          newSegments.push({
            text: segment.text.substring(
              Math.max(0, startOffset - currentOffset),
              Math.min(segmentLength, endOffset - currentOffset)
            ),
            styles: { ...segment.styles, ...styles }
          });

          if (currentOffset + segmentLength > endOffset) {
            newSegments.push({
              text: segment.text.substring(endOffset - currentOffset),
              styles: { ...segment.styles }
            });
          }
        }

        currentOffset += segmentLength;
      });

      return {
        ...prev,
        [type]: {
          text: content.text,
          segments: newSegments
        }
      };
    });
  };

  const EditableText = ({ content, type, className }) => {
    if (editingField === type) {
      return (
        <textarea
          value={content.text}
          onChange={(e) => handleTextChange(e, type)}
          onBlur={() => setEditingField(null)}
          autoFocus
          className={`bg-transparent border border-white focus:outline-none w-full ${className}`}
        />
      );
    }

    return (
      <div
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

  const handleColorChange = () => {
    // Toggle between a few colors
    const colors = ['#a3846f', '#616852', '#B4707E', '#434242'];
    const currentIndex = colors.indexOf(bgColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setBgColor(colors[nextIndex]);
  };

  return (
    <div
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      className="bg-cover bg-center min-h-screen flex items-center justify-center cursor-pointer portfolio-page"
      onClick={() => backgroundInputRef.current.click()}
    >
      <input
        type="file"
        accept="image/*"
        ref={backgroundInputRef}
        className="hidden"
        onChange={handleImageUpload}
      />

      <div
        className="w-[80%] bg-opacity-90 p-8 flex flex-col md:flex-row gap-6"
        style={{ backgroundColor: bgColor }}
      >
        {/* Left Section with Images */}
        <div className="grid grid-cols-2 gap-4 flex-1 ">
          <img src="/Picture8.jpg" alt="Fashion 1" className="rounded-lg" />
          <img src="/Picture9.jpg" alt="Fashion 2" className="rounded-lg" />
          <img src="/Picture10.jpg" alt="Fashion 3" className="rounded-lg" />
          <img src="/Picture11.jpg" alt="Fashion 4" className="rounded-lg" />
        </div>

        {/* Right Section with Text */}
        <div className="flex-1 text-white">
          <EditableText
            content={styledContent.heading}
            type="heading"
            className="text-3xl font-bold mb-4 cursor-text"
          />

          <EditableText
            content={styledContent.description}
            type="description"
            className="text-lg cursor-text"
          />

          <button
            onClick={handleColorChange}
            className="mt-4 px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Change Background Color
          </button>
        </div>
      </div>
    </div>
  );
};

