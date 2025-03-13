import React, { useState, useRef, useEffect } from "react";
import { useFashionStore } from "./FashionProvider";
import { ImageOptionsModal } from "./ImageOptionsModal"; // Import the component
import { useFashion } from "./FashionContext";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";


export const  FashionPortfolio =() =>  {
  const [quote, setQuote] = useState("Fashion is the armor to survive the reality of everyday life.");
  const [title, setTitle] = useState("Fashion Portfolio");
  const [backgroundImage, setBackgroundImage] = useState("/Picture7.jpg");
  const [modelImage, setModelImage] = useState("/Picture1.jpg");
  const [label, setLabel] = useState("New Fashion");
  const [activeDraggable, setActiveDraggable] = useState(null);


  // Track which field is being edited
  const [editingField, setEditingField] = useState(null);

  // Store text with styling information
  const [styledContent, setStyledContent] = useState({
    quote: {
      text: quote,
      segments: [{ text: quote, styles: {} }]
    },
    title: {
      text: title,
      segments: [{ text: title, styles: {} }]
    },
    label: {
      text: label,
      segments: [{ text: label, styles: {} }]
    }
  });

  const backgroundInputRef = useRef(null);
  const modelInputRef = useRef(null);

  // Access the fashion context
  const { handleTextSelection, registerComponent } = useFashion();

  // Component ID for this component
  const componentId = "fashion-portfolio";

  // Register this component with context when it mounts
  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles
    });

    // No need for a cleanup function as the component registry persists
  }, []);

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleDragStart = (key) => {
    setActiveDraggable(key);
  };


  const handleTextChange = (e, type) => {
    const newText = e.target.value;

    // Update both the direct state and the styled content
    switch(type) {
      case 'quote':
        setQuote(newText);
        break;
      case 'title':
        setTitle(newText);
        break;
      case 'label':
        setLabel(newText);
        break;
      default:
        break;
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

// This updated function should replace the existing updateStyles function in FashionPortfolio.jsx
const updateStyles = (type, styles, savedStartOffset, savedEndOffset) => {
  console.log("Updating styles for", type, "with", styles);
  console.log("Using saved offsets:", savedStartOffset, savedEndOffset);

  setStyledContent(prev => {
    const content = prev[type];

    if (!content) return prev;

    // Use the saved offsets from the context instead of trying to get them from the current selection
    let startOffset = savedStartOffset !== undefined ? savedStartOffset : 0;
    let endOffset = savedEndOffset !== undefined ? savedEndOffset : content.text.length;

    console.log("Applying style from offset", startOffset, "to", endOffset);

    // Create new segments based on the selection
    const newSegments = [];
    let currentOffset = 0;

    content.segments.forEach(segment => {
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
            styles: { ...segment.styles }
          });
        }

        // Add the selected part with new styles
        newSegments.push({
          text: segment.text.substring(
            Math.max(0, startOffset - currentOffset),
            Math.min(segmentLength, endOffset - currentOffset)
          ),
          styles: { ...segment.styles, ...styles }
        });

        // Add part after selection if it exists
        if (segmentEnd > endOffset) {
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

// Also update the registerComponent line in the useEffect in FashionPortfolio.jsx to:
useEffect(() => {
  registerComponent(componentId, {
    updateStyles: updateStyles
  });
}, []);


const EditableText = ({ content, type, className }) => {
  const textRef = useRef(null);
  const inputRef = useRef(null);
  const [localValue, setLocalValue] = useState('');

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
    if (e.key === 'Enter') {
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
          width: '100%',
          boxSizing: 'border-box',
          display: 'block',
          whiteSpace: 'pre'
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

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#fdf3e5] to-[#fad9b7] portfolio-page">
    <div className="relative w-full h-screen bg-gradient-to-br from-[#fdf3e5] to-[#fad9b7]"
    onClick={() => setActiveDraggable(null)} >

      <div
        className="absolute inset-0 bg-cover bg-center opacity-80 cursor-pointer"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
        onClick={() => handleImageClick('background')}

      ></div>

      <input
        type="file"
        accept="image/*"
        ref={backgroundInputRef}
        className="hidden"
        onChange={(e) => handleImageUpload(e, setBackgroundImage)}

      />

      <div className="relative flex flex-col items-center justify-center h-full">
      <Draggable disabled={activeDraggable !== "quote"} bounds="parent">
        <ResizableBox
        width={400}
        height={50}
        minConstraints={[150, 50]}
        maxConstraints={[500, 200]}
        axis="both"
        resizeHandles={activeDraggable === "quote" ? ["se", "sw", "ne", "nw"] : []}
      >
          <div style={{ transform: "none" }} className="relative z-50 text-center cursor-move"  onClick={(e) => {
                e.stopPropagation();
                handleDragStart("quote");
              }}>

          <EditableText
            content={styledContent.quote}
            type="quote"
            className="text-white italic text-sm md:text-lg lg:text-xl mb-8 cursor-text"
          />

        </div>
        </ResizableBox>
        </Draggable>

        <Draggable disabled={activeDraggable !== "title"}  bounds="parent">
        <ResizableBox
      width={800}
      height={150}
      minConstraints={[200, 50]}
      maxConstraints={[600, 300]}
      axis="both"
      resizeHandles={activeDraggable === "title" ? ["se", "sw", "ne", "nw"] : []}
    >
        <div className="relative z-50 text-center cursor-move"
         onClick={(e) => {
                e.stopPropagation();
                handleDragStart("title");
              }}>
          <EditableText
            content={styledContent.title}
            type="title"
            className="text-4xl md:text-6xl lg:text-8xl font-serif text-white tracking-wide leading-tight mx-auto cursor-text"
          />
      </div>
      </ResizableBox>
      </Draggable>


      <Draggable disabled={activeDraggable !== "image"} bounds="parent">
      <ResizableBox
          width={300}
          height={200}
          minConstraints={[150, 200]}
          maxConstraints={[500, 600]}
          axis="both"
          resizeHandles={activeDraggable === "image" ? ["se", "sw", "ne", "nw"] : []}
          className="absolute top-[3rem] right-10 flex justify-end"
        >
       <div className="absolute top-1/4 right-10 flex justify-end"
       onClick={(e) => {
        e.stopPropagation();
        handleDragStart("image");
      }}>
          <div className="relative max-h-[calc(100%-4rem)]">
            <div className="absolute -inset-5 bg-[#9a7752] rounded-lg z-10"></div>
            <img
              src={modelImage}
              alt="New Fashion"
              className="relative z-20 object-cover rounded-lg shadow-lg max-h-96 w-auto cursor-pointer"
              onClick={() => handleImageClick('model')}
              />
            <input
              type="file"
              accept="image/*"
              ref={modelInputRef}
              className="hidden"
              onChange={(e) => handleImageUpload(e, setModelImage)}
              />
            <EditableText
              content={styledContent.label}
              type="label"
              className="absolute bottom-4 right-4 z-30 bg-white text-[#9a7752] font-bold px-4 py-1 text-xs uppercase tracking-wide rounded cursor-text"
            />
          </div>
        </div>
        </ResizableBox>
      </Draggable>
      </div>
    </div>
  );
};

