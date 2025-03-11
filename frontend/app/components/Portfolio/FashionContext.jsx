import React, { createContext, useContext, useState, useRef } from "react";

// Create the Fashion context
const FashionContext = createContext();

// Custom hook to use the Fashion context
export const useFashion = () => {
  const context = useContext(FashionContext);
  if (!context) {
    throw new Error("useFashion must be used within a FashionProvider");
  }
  return context;
};

// Provider component
export const FashionProvider = ({ children }) => {
  // State to store the currently selected text and its information
  const [selection, setSelection] = useState({
    text: "",
    type: null,
    componentId: null,
    startOffset: 0,
    endOffset: 0
  });

  // Registry to keep track of all components and their methods
  const componentRegistry = useRef({});

  // Function to handle text selection
  const handleTextSelection = (selectedText) => {
    console.log("Selection saved:", selectedText);
    setSelection({
      text: selectedText.text,
      type: selectedText.type,
      componentId: selectedText.componentId,
      startOffset: selectedText.startOffset,
      endOffset: selectedText.endOffset
    });
  };

  // Function to register a component
  const registerComponent = (componentId, methods) => {
    componentRegistry.current[componentId] = methods;
  };

  const applyStyle = (type, style) => {
    // Find the component that has the current selection
    const componentId = selection.componentId;
    console.log(`Applying style to component ${componentId}, type ${type}:`, style);
    console.log("Using saved selection:", selection);
    
    if (componentId && componentRegistry.current[componentId]) {
      // Pass the saved selection offsets to the component's updateStyles method
      componentRegistry.current[componentId].updateStyles(type, style, selection.startOffset, selection.endOffset);
    } else {
      console.error("Cannot find component to apply style:", componentId);
      console.log("Available components:", Object.keys(componentRegistry.current));
    }
  };

  // Value to be provided by the context
  const value = {
    selection,
    handleTextSelection,
    registerComponent,
    applyStyle
  };

  return (
    <FashionContext.Provider value={value}>
      {children}
    </FashionContext.Provider>
  );
};