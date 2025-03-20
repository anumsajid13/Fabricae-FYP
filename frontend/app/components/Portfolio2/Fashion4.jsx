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

export const MyServices = forwardRef((props, ref) => {
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
  } = useFashionStore();

  const pageId = `my-services-${selectedPage}`;
  const pageState = getPageState(pageId);

  // Initialize state from pageState if it exists, otherwise use defaults
  const [heading, setHeading] = useState(pageState?.heading || "MY SERVICES");
  const [label1, setLabel1] = useState(pageState?.label1 || "Mercury");
  const [label2, setLabel2] = useState(pageState?.label2 || "Venus");
  const [label3, setLabel3] = useState(pageState?.label3 || "Mars");
  const [label4, setLabel4] = useState(pageState?.label4 || "Jupiter");
  const [label5, setLabel5] = useState(pageState?.label5 || "Saturn");
  const [label6, setLabel6] = useState(pageState?.label6 || "Neptune");
  const [description1, setDescription1] = useState(
    pageState?.description1 || "It’s the closest planet to the Sun"
  );
  const [description2, setDescription2] = useState(
    pageState?.description2 || "Venus is the second planet from the Sun"
  );
  const [description3, setDescription3] = useState(
    pageState?.description3 || "Mars is actually a very cold place"
  );
  const [description4, setDescription4] = useState(
    pageState?.description4 || "Jupiter is the biggest planet of them all"
  );
  const [description5, setDescription5] = useState(
    pageState?.description5 || "It’s composed of hydrogen and helium"
  );
  const [description6, setDescription6] = useState(
    pageState?.description6 || "It’s the farthest planet from the Sun"
  );
  const [image1, setImage1] = useState(pageState?.image1 || "/service1.png");
  const [image2, setImage2] = useState(pageState?.image2 || "/service2.png");
  const [image3, setImage3] = useState(pageState?.image3 || "/service3.png");
  const [image4, setImage4] = useState(pageState?.image4 || "/service4.png");
  const [image5, setImage5] = useState(pageState?.image5 || "/service5.png");
  const [image6, setImage6] = useState(pageState?.image6 || "/service5.png");

  const [activeSmallImageIndex, setActiveSmallImageIndex] = useState(null);
  const [styledContent, setStyledContent] = useState(() => {
    if (pageState?.styledContent) {
      return pageState.styledContent;
    }
    return {
      heading: { text: heading, segments: [{ text: heading, styles: {} }] },
      label1: { text: label1, segments: [{ text: label1, styles: {} }] },
      label2: { text: label2, segments: [{ text: label2, styles: {} }] },
      label3: { text: label3, segments: [{ text: label3, styles: {} }] },
      label4: { text: label4, segments: [{ text: label4, styles: {} }] },
      label5: { text: label5, segments: [{ text: label5, styles: {} }] },
      label6: { text: label6, segments: [{ text: label6, styles: {} }] },
      description1: {
        text: description1,
        segments: [{ text: description1, styles: {} }],
      },
      description2: {
        text: description2,
        segments: [{ text: description2, styles: {} }],
      },
      description3: {
        text: description3,
        segments: [{ text: description3, styles: {} }],
      },
      description4: {
        text: description4,
        segments: [{ text: description4, styles: {} }],
      },
      description5: {
        text: description5,
        segments: [{ text: description5, styles: {} }],
      },
      description6: {
        text: description6,
        segments: [{ text: description6, styles: {} }],
      },
    };
  });

  const componentId = "my-services";

  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, [registerComponent]);

  useEffect(() => {
    updatePageState(pageId, {
      heading,
      label1,
      label2,
      label3,
      label4,
      label5,
      label6,
      description1,
      description2,
      description3,
      description4,
      description5,
      description6,
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      styledContent,
      elementPositions: {
        heading: getElementPosition(componentId, "heading"),
        label1: getElementPosition(componentId, "label1"),
        label2: getElementPosition(componentId, "label2"),
        label3: getElementPosition(componentId, "label3"),
        label4: getElementPosition(componentId, "label4"),
        label5: getElementPosition(componentId, "label5"),
        label6: getElementPosition(componentId, "label6"),
      },
    });
  }, [
    heading,
    label1,
    label2,
    label3,
    label4,
    label5,
    label6,
    description1,
    description2,
    description3,
    description4,
    description5,
    description6,
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
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
      const pageId = 4;

      const stateToSave = {
        portfolioId,
        pageId,
        username,
        heading,
        label1,
        label2,
        label3,
        label4,
        label5,
        label6,
        description1,
        description2,
        description3,
        description4,
        description5,
        description6,
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        styledContent,
        elementPositions: {
          heading: getElementPosition(componentId, "heading"),
          label1: getElementPosition(componentId, "label1"),
          label2: getElementPosition(componentId, "label2"),
          label3: getElementPosition(componentId, "label3"),
          label4: getElementPosition(componentId, "label4"),
          label5: getElementPosition(componentId, "label5"),
          label6: getElementPosition(componentId, "label6"),
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
      const pageId = 4;

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

      if (savedState.heading) setHeading(savedState.heading);
      if (savedState.label1) setLabel1(savedState.label1);
      if (savedState.label2) setLabel2(savedState.label2);
      if (savedState.label3) setLabel3(savedState.label3);
      if (savedState.label4) setLabel4(savedState.label4);
      if (savedState.label5) setLabel5(savedState.label5);
      if (savedState.label6) setLabel6(savedState.label6);
      if (savedState.description1) setDescription1(savedState.description1);
      if (savedState.description2) setDescription2(savedState.description2);
      if (savedState.description3) setDescription3(savedState.description3);
      if (savedState.description4) setDescription4(savedState.description4);
      if (savedState.description5) setDescription5(savedState.description5);
      if (savedState.description6) setDescription6(savedState.description6);
      if (savedState.image1) setImage1(savedState.image1);
      if (savedState.image2) setImage2(savedState.image2);
      if (savedState.image3) setImage3(savedState.image3);
      if (savedState.image4) setImage4(savedState.image4);
      if (savedState.image5) setImage5(savedState.image5);
      if (savedState.image6) setImage6(savedState.image6);

      if (savedState.styledContent) {
        const loadedStyledContent = {
          heading: savedState.styledContent.heading || {
            text: savedState.heading || heading,
            segments: [{ text: savedState.heading || heading, styles: {} }],
          },
          label1: savedState.styledContent.label1 || {
            text: savedState.label1 || label1,
            segments: [{ text: savedState.label1 || label1, styles: {} }],
          },
          label2: savedState.styledContent.label2 || {
            text: savedState.label2 || label2,
            segments: [{ text: savedState.label2 || label2, styles: {} }],
          },
          label3: savedState.styledContent.label3 || {
            text: savedState.label3 || label3,
            segments: [{ text: savedState.label3 || label3, styles: {} }],
          },
          label4: savedState.styledContent.label4 || {
            text: savedState.label4 || label4,
            segments: [{ text: savedState.label4 || label4, styles: {} }],
          },
          label5: savedState.styledContent.label5 || {
            text: savedState.label5 || label5,
            segments: [{ text: savedState.label5 || label5, styles: {} }],
          },
          label6: savedState.styledContent.label6 || {
            text: savedState.label6 || label6,
            segments: [{ text: savedState.label6 || label6, styles: {} }],
          },
          description1: savedState.styledContent.description1 || {
            text: savedState.description1 || description1,
            segments: [
              { text: savedState.description1 || description1, styles: {} },
            ],
          },
          description2: savedState.styledContent.description2 || {
            text: savedState.description2 || description2,
            segments: [
              { text: savedState.description2 || description2, styles: {} },
            ],
          },
          description3: savedState.styledContent.description3 || {
            text: savedState.description3 || description3,
            segments: [
              { text: savedState.description3 || description3, styles: {} },
            ],
          },
          description4: savedState.styledContent.description4 || {
            text: savedState.description4 || description4,
            segments: [
              { text: savedState.description4 || description4, styles: {} },
            ],
          },
          description5: savedState.styledContent.description5 || {
            text: savedState.description5 || description5,
            segments: [
              { text: savedState.description5 || description5, styles: {} },
            ],
          },
          description6: savedState.styledContent.description6 || {
            text: savedState.description6 || description6,
            segments: [
              { text: savedState.description6 || description6, styles: {} },
            ],
          },
        };
        setStyledContent(loadedStyledContent);
      }

      if (savedState.elementPositions) {
        if (savedState.elementPositions.heading) {
          updateElementPosition(
            componentId,
            "heading",
            savedState.elementPositions.heading
          );
        }
        if (savedState.elementPositions.label1) {
          updateElementPosition(
            componentId,
            "label1",
            savedState.elementPositions.label1
          );
        }
        if (savedState.elementPositions.label2) {
          updateElementPosition(
            componentId,
            "label2",
            savedState.elementPositions.label2
          );
        }
        if (savedState.elementPositions.label3) {
          updateElementPosition(
            componentId,
            "label3",
            savedState.elementPositions.label3
          );
        }
        if (savedState.elementPositions.label4) {
          updateElementPosition(
            componentId,
            "label4",
            savedState.elementPositions.label4
          );
        }
        if (savedState.elementPositions.label5) {
          updateElementPosition(
            componentId,
            "label5",
            savedState.elementPositions.label5
          );
        }
        if (savedState.elementPositions.label6) {
          updateElementPosition(
            componentId,
            "label6",
            savedState.elementPositions.label6
          );
        }
        if (savedState.elementPositions.description1) {
          updateElementPosition(
            componentId,
            "description1",
            savedState.elementPositions.description1
          );
        }
        if (savedState.elementPositions.description2) {
          updateElementPosition(
            componentId,
            "description2",
            savedState.elementPositions.description2
          );
        }
        if (savedState.elementPositions.description3) {
          updateElementPosition(
            componentId,
            "description3",
            savedState.elementPositions.description3
          );
        }
        if (savedState.elementPositions.description4) {
          updateElementPosition(
            componentId,
            "description4",
            savedState.elementPositions.description4
          );
        }
        if (savedState.elementPositions.description5) {
          updateElementPosition(
            componentId,
            "description5",
            savedState.elementPositions.description5
          );
        }
        if (savedState.elementPositions.description6) {
          updateElementPosition(
            componentId,
            "description6",
            savedState.elementPositions.description6
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
        if (savedState.elementPositions.image4) {
          updateElementPosition(
            componentId,
            "image4",
            savedState.elementPositions.image4
          );
        }
        if (savedState.elementPositions.image5) {
          updateElementPosition(
            componentId,
            "image5",
            savedState.elementPositions.image5
          );
        }
        if (savedState.elementPositions.image6) {
          updateElementPosition(
            componentId,
            "image6",
            savedState.elementPositions.image6
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
      switch (activeSmallImageIndex) {
        case 0:
          setImage1(imageUrl);
          break;
        case 1:
          setImage2(imageUrl);
          break;
        case 2:
          setImage3(imageUrl);
          break;
        case 3:
          setImage4(imageUrl);
          break;
        case 4:
          setImage5(imageUrl);
          break;
        case 5:
          setImage6(imageUrl);
          break;
        default:
          console.error("Invalid image index:", activeSmallImageIndex);
      }
    }
    e.target.value = ""; // Reset the file input
  };

  const handleSelectSmallImageFromGallery = (imageUrl) => {
    switch (activeSmallImageIndex) {
      case 0:
        setImage1(imageUrl);
        break;
      case 1:
        setImage2(imageUrl);
        break;
      case 2:
        setImage3(imageUrl);
        break;
      case 3:
        setImage4(imageUrl);
        break;
      case 4:
        setImage5(imageUrl);
        break;
      case 5:
        setImage6(imageUrl);
        break;
      default:
        console.error("Invalid image index:", activeSmallImageIndex);
    }
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

  const handleSave = () => {
    saveState();
  };

  const headingPosition = getElementPosition(componentId, "heading");
  const label1Position = getElementPosition(componentId, "label1");
  const label2Position = getElementPosition(componentId, "label2");
  const label3Position = getElementPosition(componentId, "label3");
  const label4Position = getElementPosition(componentId, "label4");
  const label5Position = getElementPosition(componentId, "label5");
  const label6Position = getElementPosition(componentId, "label6");

  useEffect(() => {
    registerComponent(componentId, {
      updateStyles: updateStyles,
    });
  }, []);

  useEffect(() => {
    updatePageState(pageId, {
      heading,
      label1,
      label2,
      label3,
      label4,
      label5,
      label6,
      description1,
      description2,
      description3,
      description4,
      description5,
      description6,
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      styledContent,
    });
  }, [
    heading,
    label1,
    label2,
    label3,
    label4,
    label5,
    label6,
    description1,
    description2,
    description3,
    description4,
    description5,
    description6,
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    styledContent,
    pageId,
    updatePageState,
  ]);

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
      case "heading":
        setHeading(newText);
        break;
      case "label1":
        setLabel1(newText);
        break;
      case "label2":
        setLabel2(newText);
        break;
      case "label3":
        setLabel3(newText);
        break;
      case "label4":
        setLabel4(newText);
        break;
      case "label5":
        setLabel5(newText);
        break;
      case "label6":
        setLabel6(newText);
        break;
      case "description1":
        setDescription1(newText);
        break;
      case "description2":
        setDescription2(newText);
        break;
      case "description3":
        setDescription3(newText);
        break;
      case "description4":
        setDescription4(newText);
        break;
      case "description5":
        setDescription5(newText);
        break;
      case "description6":
        setDescription6(newText);
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
    loadState();
  }, []);

  const services = [
    {
      id: "label1",
      label: label1,
      description: description1,
      image: image1,
      position: label1Position,
      setImage: setImage1,
    },
    {
      id: "label2",
      label: label2,
      description: description2,
      image: image2,
      position: label2Position,
      setImage: setImage2,
    },
    {
      id: "label3",
      label: label3,
      description: description3,
      image: image3,
      position: label3Position,
      setImage: setImage3,
    },
    {
      id: "label4",
      label: label4,
      description: description4,
      image: image4,
      position: label4Position,
      setImage: setImage4,
    },
    {
      id: "label5",
      label: label5,
      description: description5,
      image: image5,
      position: label5Position,
      setImage: setImage5,
    },
    {
      id: "label6",
      label: label6,
      description: description6,
      image: image6,
      position: label6Position,
      setImage: setImage6,
    },
  ];

  return (
    <div
      className="w-[830px] flex flex-col items-center min-h-screen bg-[#efe8e4] p-6 space-y-8"
      onClick={() => setActiveDraggable(null)}
    >
      {/* Heading */}
      <Draggable
        disabled={activeDraggable !== "heading"}
        defaultPosition={{ x: headingPosition.x, y: headingPosition.y }}
        onStop={(e, data) => {
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
          maxConstraints={[600, 200]}
          axis="both"
          resizeHandles={
            activeDraggable === "heading" ? ["se", "sw", "ne", "nw"] : []
          }
          onResizeStop={(e, { size }) => {
            updateElementPosition(componentId, "heading", {
              x: headingPosition.x,
              y: headingPosition.y,
              width: size.width,
              height: size.height,
            });
          }}
        >
          <div
            style={{ transform: "none" }}
            className="relative text-center cursor-move"
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
              className="text-6xl font-serif font-bold cursor-text"
            />
          </div>
        </ResizableBox>
      </Draggable>

      {/* Services Grid */}
 <div className="grid grid-cols-3 gap-5 max-w-5xl w-full text-center">
    {services.map((service, index) => (
      <Draggable
        key={service.id}
        disabled={activeDraggable !== service.id}
        defaultPosition={{ x: service.position.x, y: service.position.y }}
        onStop={(e, data) => {
          updateElementPosition(componentId, service.id, {
            x: data.x,
            y: data.y,
            width: service.position.width,
            height: service.position.height,
          });
        }}
      >
        <ResizableBox
          width={service.position.width}
          height={service.position.height}
          minConstraints={[100, 50]}
          maxConstraints={[400, 200]}
          axis="both"
          resizeHandles={
            activeDraggable === service.id ? ["se", "sw", "ne", "nw"] : []
          }
          onResizeStop={(e, { size }) => {
            updateElementPosition(componentId, service.id, {
              x: service.position.x,
              y: service.position.y,
              width: size.width,
              height: size.height,
            });
          }}
        >
          <div
            className="relative flex flex-col items-center cursor-pointer"
            style={{ position: "relative", zIndex: 3 }}
            onClick={(e) => {
              e.stopPropagation();
              handleDragStart(service.id);
            }}
          >
            <img
              src={service.image}
              alt={service.label}
              className="w-20 h-20 border border-black p-2"
              onDoubleClick={(e) => handleDoubleClickSmallImage(e, index)}
            />
            <EditableText
              content={
                styledContent?.[service.id] || {
                  text: service.label,
                  segments: [{ text: service.label, styles: {} }],
                }
              }
              type={service.id}
              className="text-2xl font-serif italic mt-2 cursor-text"
            />
            <EditableText
              content={
                styledContent?.[`description${index + 1}`] || {
                  text: service.description,
                  segments: [{ text: service.description, styles: {} }],
                }
              }
              type={`description${index + 1}`}
              className="text-lg mt-2 cursor-text"
            />
          </div>
        </ResizableBox>
      </Draggable>
    ))}
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