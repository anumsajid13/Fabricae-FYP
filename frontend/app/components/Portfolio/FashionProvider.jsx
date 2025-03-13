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

  // State for portfolio ID
  portfolioId: 1, // Default portfolio ID

  // Function to set portfolio ID
  setPortfolioId: (id) => {
    set({ portfolioId: id });
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

    console.log(
      `Applying style to component ${componentId}, type ${type}:`,
      style
    );
    console.log("Using saved selection:", selection);

    if (componentId && componentRegistry[componentId]) {
      // Pass the saved selection offsets to the component's updateStyles method
      componentRegistry[componentId].updateStyles(
        type,
        style,
        selection.startOffset,
        selection.endOffset
      );
    } else {
      console.error("Cannot find component to apply style:", componentId);
      console.log("Available components:", Object.keys(componentRegistry));
    }
  },

  // Add image state tracking
  imageStates: {}, // Will store image URLs by component and image type

  // Function to update an image
  updateImage: (componentId, imageType, imageUrl) => {
    set((state) => {
      const portfolioId = state.portfolioId;
      const componentKey = `${componentId}-${portfolioId}`;

      return {
        imageStates: {
          ...state.imageStates,
          [componentKey]: {
            ...(state.imageStates[componentKey] || {}),
            [imageType]: imageUrl,
          },
        },
      };
    });
  },

  // Function to clear an image for a component
  clearImage: (componentId, imageType) => {
    set((state) => {
      const portfolioId = state.portfolioId;
      const componentKey = `${componentId}-${portfolioId}`;

      const updatedImageStates = { ...state.imageStates };
      if (updatedImageStates[componentKey]) {
        delete updatedImageStates[componentKey][imageType];
      }

      return { imageStates: updatedImageStates };
    });
  },

  // Function to get stored image for a component
  getStoredImage: (componentId, imageType) => {
    const { imageStates, portfolioId } = get();
    const componentKey = `${componentId}-${portfolioId}`;
    return imageStates[componentKey]?.[imageType];
  },

  // Stores modifications for each page by ID
  pageStates: {},

  // Function to update page modifications
  updatePageState: (pageId, modifications) => {
    set((state) => ({
      pageStates: {
        ...state.pageStates,
        [pageId]: {
          ...(state.pageStates[pageId] || {}), // Preserve existing modifications
          ...modifications, // Add new modifications
        },
      },
    }));
  },

  // Function to get page modifications
  getPageState: (pageId) => {
    return get().pageStates[pageId] || {};
  },

  // Default selected page
  selectedPage: 1,

  // Function to set the selected page
  setSelectedPage: (pageId) => {
    set({ selectedPage: pageId });
  },
}));