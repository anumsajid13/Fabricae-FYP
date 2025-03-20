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
  portfolioId: 2, // Default portfolio ID

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

  // State to track positions and sizes of elements
  elementPositions: {
    "fashion-portfolio": {
      quote: { x: 130, y: 80, width: 380, height: 100 },
      title: { x: 10, y: 0, width: 800, height: 150 },
      image: { x: 10, y: -3, width: 300, height: 400 },
    },
    "fashion-layout": {
      // Default positions and sizes for small images, heading, and description
      "smallImage-0": { x: 0, y: 0, width: 130, height: 130 },
      "smallImage-1": { x: 0, y: 0, width: 130, height: 130 },
      "smallImage-2": { x: 0, y: 0, width: 130, height: 130 },
      "smallImage-3": { x: 0, y: 0, width: 130, height: 130 },
      heading: { x: 0, y: 0, width: 400, height: 50 },
      description: { x: -30, y: 0, width: 380, height: 200 },
    },
    "fashion-project": {
      "smallImage-0": { x: 0, y: 0, width: 150, height: 120 },
      "smallImage-1": { x: 0, y: 0, width: 150, height: 120 },
      "smallImage-2": { x: 0, y: 0, width: 150, height: 120 },
      heading: { x: 0, y: 0, width: 420, height: 50 },
    },
    "fashion-design": {
      model1: { x: -30, y: 50, width: 200, height: 400 },
      model2: { x: 40, y: 50, width: 150, height: 100 },
      model3: { x: 55, y: 50, width: 150, height: 100 },
      model4: { x: 40, y: 50, width: 310, height: 200 },
      model5: { x: 80, y: 50, width: 250, height: 400 },
    },
    "fashion-work": {
      heading: { x: 0, y: 0, width: 400, height: 50 },
      description: { x: 0, y: 60, width: 400, height: 150 },
      illustration: { x: 10, y: -100, width: 250, height: 150 },
    },
    "fashion-collab": {
      "smallImage1-0": { x: 130, y: 0, width: 130, height: 200 },
      "smallImage1-1": { x: -150, y: 0, width: 150, height: 200 },
      "smallImage1-2": { x: 25, y: 50, width: 100, height: 100 },
      "smallImage1-3": { x: 130, y: -56, width: 120, height: 50 },
      heading: { x: 30, y: 0, width: 250, height: 50 },
      description: { x: 30, y: 0, width: 150, height: 150 },
    },
    "apparel-portfolio": {
      name: { x: 100, y: 70, width: 200, height: 50 },
      title: { x: 10, y: 60, width: 400, height: 100 },
      quote: { x: 10, y: 110, width: 300, height: 50 },
      description: { x: 10, y: 110, width: 400, height: 150 },
      year: { x: 100, y: -20, width: 150, height: 50 },
      image1: { x: 0, y: 0, width: 340, height: 140 },
      image2: { x: 0, y: 0, width: 340, height: 140 },
      image3: { x: 0, y: 0, width: 340, height: 140 },
    },
    "about-me": {
      name: { x: 0, y: 0, width: 200, height: 50 },
      description: { x: 0, y: 0, width: 400, height: 100 },
      year: { x: 0, y: 0, width: 150, height: 50 },
      title: { x: 0, y: 0, width: 500, height: 100 },
      label: { x: 0, y: 0, width: 100, height: 100 },
      modelImage: { x: -20, y: 0, width: 400, height: 350 },
    },
    "about-me-2": {
    heading: { x: 150, y: -20, width: 500, height: 100 },
    description: { x: 0, y: -20, width: 800, height: 150 },
    image1: { x: 5, y: 0, width: 200, height: 200 },
    image2: { x: 5, y: 0, width: 200, height: 200 },
    image3: { x: 5, y: 0, width: 200, height: 200 },
    },
    "my-services": {
      heading: { x: 0, y: 90, width: 600, height: 100 },
      label1 : { x: 0, y: 50, width: 200, height: 50 },
      label2 : { x: 0, y: 50, width: 200, height: 50 },
      label3 : { x: 0, y: 50, width: 200, height: 50 },
      label4 : { x: 0, y: 190, width: 200, height: 50 },
      label5 : { x: 0, y: 190, width: 200, height: 50 },
      label6 : { x: 0, y: 190, width: 200, height: 50 },
    },
    "what-i-do": {
      heading: { x: 0, y: -50, width: 300, height: 50 },
      description: { x: 0, y: -20, width: 350, height: 100 },
      modelImage: { x: 0, y: 0, width: 335, height: 300 },
    },
    "research": {
      heading: { x: 200, y: 0, width: 300, height: 50 },
      description: { x: 0, y: 0, width: 700, height: 50 },
      label1: { x: 0, y: 0, width: 700, height: 50 },
      label2: { x: 0, y: 0, width: 700, height: 50 },
      image1: { x: 10, y: 0, width: 335, height: 150 },
      image2: { x: 10, y: 0, width: 335, height: 150 },
    },

  },

  // Function to update the position and size of an element
  updateElementPosition: (componentId, elementType, position) => {
    set((state) => ({
      elementPositions: {
        ...state.elementPositions,
        [componentId]: {
          ...(state.elementPositions[componentId] || {}),
          [elementType]: position,
        },
      },
    }));
  },

  // Function to get the position and size of an element
  getElementPosition: (componentId, elementType) => {
    return (
      get().elementPositions[componentId]?.[elementType] || {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
    );
  },

  // Existing state and actions
  componentsMap: {
    1: [
      "FashionPortfolio",
      "FashionLayout",
      "Fashion",
      "FabricMaterialSelection",
      "SketchesIllustrations",
      "PortfolioSection",
    ],
    2: [
      "ApparelPortfolio",
      "AboutMe",
      "AboutMe2",
      "MyServices",
      "WhatIDo",
      "Research",
      "Resume",
      "MyWorkArea1",
      "ProjectInDepth",
      "Project1",
      "ContactMe",
    ],
    3: [
      "PortfolioHeader",
      "ResumePage",
      "CollectionHeader",
      "FashionMoodBoard",
      "ResearchWork",
      "FashionCollection",
      "CollectionPage",
      "ContactMe1",
    ]
  },

  // Function to get components for the current portfolio
  getComponents: (portfolioId) => {
    const { componentsMap } = get();
    return componentsMap[portfolioId] || [];
  },

  // Function to duplicate a page
  duplicatePage: () => {
    const { portfolioId, selectedPage, componentsMap, setSelectedPage } = get();

    const currentComponents = componentsMap[portfolioId];
    const currentComponent = currentComponents[selectedPage - 1];

    const updatedComponents = [
      ...currentComponents.slice(0, selectedPage),
      currentComponent, // Duplicated component
      ...currentComponents.slice(selectedPage),
    ];

    set({
      componentsMap: {
        ...componentsMap,
        [portfolioId]: updatedComponents,
      },
    });

    setSelectedPage(selectedPage + 1);
  },
  loadstate: false,
  setLoadState: (state) => set({ loadstate: state }),


}));
