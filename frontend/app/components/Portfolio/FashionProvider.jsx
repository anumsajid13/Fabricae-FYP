import { create } from "zustand";

export const useFashionStore = create((set, get) => ({
  // State for selected text information
  selection: {
    text: "",
    type: null,
    componentId: null,
    startOffset: 0,
    endOffset: 0,
  },

  // Component registry to track registered components and their methods
  componentRegistry: {},

  // Function to handle text selection
  handleTextSelection: (selectedText) => {
    console.log("Selection saved:", selectedText);
    set({
      selection: {
        text: selectedText.text,
        type: selectedText.type,
        componentId: selectedText.componentId,
        startOffset: selectedText.startOffset,
        endOffset: selectedText.endOffset,
      },
    });
  },

  // Function to register a component
  registerComponent: (componentId, methods) => {
    set((state) => ({
      componentRegistry: { ...state.componentRegistry, [componentId]: methods },
    }));
  },

  // Function to apply styles
  applyStyle: (type, style) => {
    const { selection, componentRegistry } = get();
    const componentId = selection.componentId;
    
    console.log(`Applying style to component ${componentId}, type ${type}:`, style);
    console.log("Using saved selection:", selection);
    
    if (componentId && componentRegistry[componentId]) {
      // Pass the saved selection offsets to the component's updateStyles method
      componentRegistry[componentId].updateStyles(type, style, selection.startOffset, selection.endOffset);
    } else {
      console.error("Cannot find component to apply style:", componentId);
      console.log("Available components:", Object.keys(componentRegistry));
    }
  },
}));
