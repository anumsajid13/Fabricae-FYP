import React, { useState, useRef, useEffect } from "react";
import "./style.css"; // Make sure you have this CSS file

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOM from "react-dom/client";
import { useFashionStore } from "./FashionProvider";
import { componentsMapping } from "./componentsMapping"; // Import the mapping
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MainEditor1 = () => {
  const [scale, setScale] = useState(1); // Scale state for zoom functionality
  const componentRef = useRef(null); // Reference to the component for fullscreen

  const [fontSize, setFontSize] = useState(16); // Default font size is 16px

  const [selectedFont, setSelectedFont] = useState("Roboto"); // Default font is Roboto

  // Add state to track which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Add a new state to track the input value separately from the actual font size
  const [fontSizeInput, setFontSizeInput] = useState("16");

  const [animatePage, setAnimatePage] = useState(false);

  // Get Zustand store state and actions
  const {
    selection,
    applyStyle,
    portfolioId,
    selectedPage,
    setSelectedPage,
    getComponents,
    duplicatePage,
    savePortfolioState,
  } = useFashionStore();

  // Get the component names for the current portfolio
  const componentNames = getComponents(portfolioId);

  // Resolve components using the mapping
  const currentPortfolioComponents = componentNames.map(
    (name) => componentsMapping[name]
  );

  // Add this near the top of your component with other useState declarations
  const childRefs = useRef([]);

  // Create refs for all components
  useEffect(() => {
    // Initialize refs array with the right length
    childRefs.current = Array(currentPortfolioComponents.length)
      .fill(null)
      .map((_, i) => childRefs.current[i] || React.createRef());
  }, [currentPortfolioComponents.length]);

  // Updated downloadPDF function that can both download and return blob
  const downloadPDF = async (shouldDownload = true) => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      console.error('downloadPDF can only be called on the client side');
      return null;
    }

    const toastMessage = shouldDownload ? "Generating PDF... Please wait." : "Generating and uploading PDF... Please wait.";

    toast.info(toastMessage, {
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: "colored",
      style: {
        backgroundColor: "#616852",
        color: "#ffffff",
      },
    });

    try {
      // Save the current page so we can return to it later
      const originalSelectedPage = selectedPage;

      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [960, 540], // Match the exact dimensions of your portfolio viewer
      });

      // Get a reference to the portfolio content container
      const portfolioContainer = document.querySelector(
        ".bg-white.mt-11.shadow-lg.rounded-sm"
      );

      if (!portfolioContainer) {
        throw new Error("Could not find portfolio container element");
      }

      // Generate screenshots of each page
      for (
        let i = 0;
        i < Math.min(totalSlides, currentPortfolioComponents.length);
        i++
      ) {
        console.log(
          `Processing page ${i + 1} of ${currentPortfolioComponents.length}`
        );

        // Change to the current page
        setSelectedPage(i + 1);

        // Wait for the component to render
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Take a screenshot of the current page
        const canvas = await html2canvas(portfolioContainer, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        // Add a new page to the PDF (except for the first page)
        if (i > 0) {
          pdf.addPage([960, 540], "landscape");
        }

        // Add the screenshot to the PDF
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, "JPEG", 0, 0, 960, 540);

        console.log(`Added page ${i + 1} to PDF`);
      }

      // Return to the original page
      setSelectedPage(originalSelectedPage);

      if (shouldDownload) {
        // Save the PDF
        pdf.save("portfolio.pdf");
        console.log("PDF saved successfully");

        // Dismiss the loading toast
        toast.dismiss();
        toast.success("PDF generated successfully!", {
          autoClose: 3000,
        });

        return null; // No blob needed for download
      } else {
        // Return PDF as blob for upload
        console.log("PDF blob generated successfully");
        return pdf.output('blob');
      }

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss();
      toast.error("Error generating PDF. Please try again.", {
        autoClose: 3000,
      });
      throw error;
    }
  };

  // Updated handleSave function to save all components and upload PDF
  const handleSave = async () => {
    console.log("Save button clicked");

    // // Check if we're on the client side
    // if (typeof window === 'undefined') {
    //   console.error('handleSave can only be called on the client side');
    //   return;
    // }

    // Call the save function of each child component
    childRefs.current.forEach((ref, index) => {
      if (ref && ref.current) {
        console.log(`Saving component ${index + 1}`);
        ref.current.saveState();
      } else {
        console.log(`Ref for component ${index + 1} is not available`);
      }
    });

    // Save the portfolio state
    //savePortfolioState();

    // Generate and upload PDF
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error("Email not found. Please log in again.");
        return;
      }

      // Generate PDF blob (without downloading)
      const pdfBlob = await downloadPDF(false);

      if (!pdfBlob) {
        throw new Error("Failed to generate PDF blob");
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('pdf', pdfBlob, 'portfolio.pdf');

      // Upload to backend
      const response = await fetch(`http://localhost:5000/api/users/profile/${email}/portfolio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('PDF uploaded successfully:', result);

      // Dismiss loading toast and show success
      toast.dismiss();
      toast.success("Portfolio saved and PDF uploaded successfully!", {
        autoClose: 3000,
      });

    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.dismiss();
      toast.error("Error uploading PDF. Please try again.", {
        autoClose: 3000,
      });
    }
  };

  // Get total slides for the current portfolio
  const totalSlides = currentPortfolioComponents.length;

  // Ensure selectedPage is valid for current portfolio
  useEffect(() => {
    if (selectedPage > totalSlides) {
      setSelectedPage(1);
    }
  }, [portfolioId, totalSlides, selectedPage]);

  const handleNext = () => {
    console.log("Current Page:", selectedPage); // Log current page
    console.log("Total Slides:", totalSlides); // Log total slides

    if (selectedPage < totalSlides) {
      const nextPage = selectedPage + 1;
      console.log("Next Page:", nextPage); // Log next page
      setSelectedPage(nextPage); // Pass the new value directly
    } else {
      console.log("Already on the last page");
    }
  };

  useEffect(() => {
    console.log("Selected Page Updated:", selectedPage);
  }, [selectedPage]);

  const handlePrevious = () => {
    console.log("Current Page:", selectedPage); // Log current page
    console.log("Total Slides:", totalSlides); // Log total slides

    if (selectedPage > 1) {
      const previousPage = selectedPage - 1;
      console.log("Previous Page:", previousPage); // Log previous page
      setSelectedPage(previousPage); // Pass the new value directly
    } else {
      console.log("Already on the first page");
    }
  };

  // Update the handleFontSizeChange function to handle input without immediate validation
  const handleFontSizeChange = (e) => {
    // Get the input value
    const inputValue = e.target.value;

    // Allow empty string or numbers only
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      setFontSizeInput(inputValue);
    }
  };

  // Function to handle font size input blur (when user leaves the input)
  const handleFontSizeBlur = (e) => {
    // If the input is empty or invalid, reset to the current fontSize
    if (e.target.value === "" || isNaN(parseInt(e.target.value, 10))) {
      setFontSizeInput(fontSize.toString());
      return;
    }

    // Parse the input as a number
    const newSize = parseInt(e.target.value, 10);

    // Clamp the value between 8 and 120
    const clampedSize = Math.min(120, Math.max(8, newSize));

    // Update both the display input and the actual font size
    setFontSizeInput(clampedSize.toString());
    setFontSize(clampedSize);

    // Apply the new font size to the selected text
    if (selection?.type) {
      handleApplyStyle("size", `${clampedSize}px`);
    }
  };

  // Add a function to handle when user presses Enter key
  const handleFontSizeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur(); // Trigger the blur event to apply the changes
    }
  };

  // Function to zoom in
  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1); // Increase scale by 0.1
  };

  // Modified zoom out function
  const handleZoomOut = () => {
    setScale((prevScale) => {
      // Only allow zoom out if we're currently zoomed in (scale > 1)
      if (prevScale > 1) {
        return prevScale - 0.1;
      }
      // If we're at original scale or somehow below it, maintain original scale
      return 1;
    });
  };

  // Function to toggle fullscreen
  const handleFullscreen = () => {
    if (componentRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        componentRef.current.requestFullscreen();
      }
    }
  };

  // Updated applyStyle function that uses the context
  const handleApplyStyle = (type, value) => {
    console.log("type and value is:", type, value);
    console.log("current selection:", selection);

    // Check if we have a valid selection
    if (!selection?.type) {
      console.log("No valid selection found", type);
      return;
    }

    // Use the context's applyStyle function
    switch (type) {
      case "font":
        applyStyle(selection.type, { fontFamily: value });
        setSelectedFont(value); // Update the selected font state
        setOpenDropdown(null); // Close the dropdown
        break;
        break;
      case "size":
        applyStyle(selection.type, { fontSize: value });
        break;
      case "color":
        applyStyle(selection.type, { color: value });
        break;
      default:
        break;
    }
  };

  // Function to handle dropdown toggle
  const handleDropdownToggle = (dropdownName) => {
    if (openDropdown === dropdownName) {
      // If clicking the same dropdown, close it
      setOpenDropdown(null);
    } else {
      // Otherwise, open the clicked dropdown and close any other open dropdown
      setOpenDropdown(dropdownName);
    }
  };

  // Function to close dropdown when clicking outside
  const handleClickOutside = (e) => {
    // If the click is outside dropdown areas, close any open dropdown
    if (!e.target.closest("details")) {
      setOpenDropdown(null);
    }
  };

  // Add click event listener to document to detect clicks outside dropdown
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDuplicatePage = () => {
    duplicatePage(); // Call the Zustand action
    setAnimatePage(true); // Trigger animation
    setTimeout(() => setAnimatePage(false), 1000); // Reset after 1 second
  };

  // For the download button, call it like this:
  const handleDownloadClick = () => {
    downloadPDF(true); // This will download the PDF
  };

  return (
    <div id="webcrumbs">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="flex h-[700px] bg-[#E7E4D8] shadow-lg overflow-hidden">
        {/* Left Sidebar - Toolbar */}
        <div className="w-[280px] bg-[#434242] p-4 flex flex-col">
          <h2 className="text-xl font-normal font-custom mb-6 text-white">
            Portfolio Tools
          </h2>

          {/* Fixed height container with all tools in a compact layout */}
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* Top tools section */}
            <div className="space-y-5">
              {/* Font Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Font
                </label>
                <details className="relative w-full">
                  <summary className="flex items-center justify-between w-full p-3 bg-[#b4707e] rounded-full cursor-pointer hover:bg-[#c9c6bc] transition-colors duration-300">
                    <span className="pl-2 text-white">{selectedFont}</span>
                    <span className="material-symbols-outlined pr-2 text-white">
                      arrow_drop_down
                    </span>
                  </summary>
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#e7e4d8] rounded-md shadow-lg z-10">
                    <ul className="py-1">
                      <li
                        className="px-3 py-2 hover:bg-[#e7e4d8] cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyStyle("font", "Arial");
                          setOpenDropdown(null);
                        }}
                      >
                        Arial
                      </li>
                      <li
                        className="px-3 py-2 hover:bg-[#e7e4d8] cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyStyle("font", "Times New Roman");
                          setOpenDropdown(null);
                        }}
                      >
                        Times New Roman
                      </li>
                      <li
                        className="px-3 py-2 hover:bg-[#e7e4d8] cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyStyle("font", "Roboto");
                          setOpenDropdown(null);
                        }}
                      >
                        Roboto
                      </li>
                      <li
                        className="px-3 py-2 hover:bg-[#e7e4d8] cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyStyle("font", "Open Sans");
                          setOpenDropdown(null);
                        }}
                      >
                        Open Sans
                      </li>
                      <li
                        className="px-3 py-2 hover:bg-[#e7e4d8] cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyStyle("font", "Montserrat");
                          setOpenDropdown(null);
                        }}
                      >
                        Montserrat
                      </li>
                    </ul>
                  </div>
                </details>
              </div>

              {/* Font Size */}
              {/* Font Size - MODIFIED TO ALLOW DIRECT INPUT */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Font Size
                </label>
                <div className="flex items-center">
                  <button
                    className="p-2 bg-[#b4707e] rounded-l-full hover:bg-[#c9c6bc] transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSize = Math.max(8, fontSize - 1); // Decrease font size (min 8px)
                      setFontSize(newSize);
                      // Apply the new font size to the selected text
                      if (selection?.type) {
                        handleApplyStyle("size", `${newSize}px`);
                      }
                    }}
                  >
                    <span className="material-symbols-outlined text-sm text-white">
                      remove
                    </span>
                  </button>
                  <input
                    type="text"
                    value={fontSizeInput}
                    onChange={handleFontSizeChange}
                    onBlur={handleFontSizeBlur}
                    onKeyDown={handleFontSizeKeyDown}
                    className="w-16 text-center py-2 text-black bg-[#e7e4d8] border-t border-b border-[#e7e4d8] outline-none"
                    aria-label="Font size input"
                  />
                  <span className="bg-[#e7e4d8] py-2 pr-2 text-black">px</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSize = Math.min(120, fontSize + 1); // Increase font size (max 120px)
                      setFontSize(newSize);
                      // Apply the new font size to the selected text
                      if (selection?.type) {
                        handleApplyStyle("size", `${newSize}px`);
                      }
                    }}
                    className="p-2 bg-[#b4707e] rounded-r-full hover:bg-[#c9c6bc] transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-sm text-white">
                      add
                    </span>
                  </button>
                </div>
              </div>
              {/* Color Options */}
              <div
                open={openDropdown === "color"}
                onClick={(e) => {
                  e.preventDefault();
                  handleDropdownToggle("color");
                }}
              >
                <label className="block text-sm font-medium mb-2 text-white">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-[#ffffff]"
                    onClick={(e) => {
                      handleApplyStyle("color", "#ffffff");
                    }}
                  ></div>

                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-[#000000]"
                    onClick={(e) => {
                      handleApplyStyle("color", "#000000"); // Apply black color
                    }}
                  ></div>
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-[#e7e4d8]"
                    onClick={(e) => {
                      handleApplyStyle("color", "#e7e4d8");
                    }}
                  ></div>
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-[#616852]"
                    onClick={(e) => {
                      handleApplyStyle("color", "#616852");
                    }}
                  ></div>
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-[#b4707e]"
                    onClick={(e) => {
                      handleApplyStyle("color", "#b4707e");
                    }}
                  ></div>
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-[#822538]"
                    onClick={(e) => {
                      handleApplyStyle("color", "#822538");
                    }}
                  ></div>
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-purple-500"
                    onClick={(e) => {
                      handleApplyStyle("color", "#a855f7");
                    }}
                  ></div>
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-pink-500"
                    onClick={(e) => {
                      handleApplyStyle("color", "#ec4899");
                    }}
                  ></div>
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-teal-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyStyle("color", "#14b8a6");
                    }}
                  ></div>
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md bg-orange-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyStyle("color", "#f97316");
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bottom tools section - always visible */}
            <div className="space-y-5 mt-auto">
              {/* Action Buttons */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Actions
                </label>
                <div className="grid grid-cols-2 gap-3 text-white">
                  <button
                    className="flex items-center justify-center
                   gap-1 py-2 bg-[#b4707e] rounded-full hover:bg-[#c9c6bc]
                   transition-colors duration-300 text-sm"
                    onClick={handleDuplicatePage}
                  >
                    <span className="material-symbols-outlined text-sm text-white">
                      content_copy
                    </span>
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={handleFullscreen}
                    className="flex items-center justify-center gap-1 py-2 bg-[#b4707e] rounded-full hover:bg-[#c9c6bc] transition-colors duration-300 text-sm"
                  >
                    <span className="material-symbols-outlined text-sm text-white">
                      fullscreen
                    </span>
                    <span>Fullscreen</span>
                  </button>
                </div>
              </div>

              {/* Zoom Controls - Guaranteed to be visible */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Zoom
                </label>
                <div className="flex items-center ">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-[#b4707e] rounded-l-full hover:bg-[#c9c6bc] transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-sm text-white">
                      zoom_out
                    </span>
                  </button>
                  <span className=" text-black px-4 py-2 bg-[#e7e4d8] border-t border-b border-[#e7e4d8]">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-[#b4707e] rounded-r-full hover:bg-[#c9c6bc] transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-sm text-white">
                      zoom_in
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Document Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Document Viewer Header */}
          <div className="bg-[#434242] p-4 border-b flex justify-between items-center">
            <h1 className="text-xl font-custom font-normal text-white">
              Portfolio Viewer
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadClick}
                className="p-2 bg-[#434242] rounded-md hover:bg-[#616852] transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-white">
                  download
                </span>
              </button>

              <button
                onClick={handleSave}
                className="p-2 bg-[#434242] rounded-md hover:bg-[#616852] transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-white">
                  save
                </span>
              </button>
            </div>
          </div>

          {/* Document Viewer Content */}
          <div className="flex-1 bg-[#e7e4d8]/30 p-8 flex items-center justify-center overflow-hidden">
            <div className="bg-white mt-11 shadow-lg rounded-sm w-[960px] h-[540px] transform transition-transform duration-300 hover:shadow-xl scale-90 border border-[#434242]/10">
              <div
                className={`h-full p-8 overflow-auto ${
                  animatePage ? "animate-bounce duration-1000" : ""
                }`}
              >
                <div className="hidden">
                  {/* Hidden container to hold all components so refs are connected */}
                  {currentPortfolioComponents.map((Component, index) => (
                    <Component
                      key={index}
                      ref={childRefs.current[index]}
                      style={{ display: "none" }} // Hide from view
                    />
                  ))}
                </div>
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center",
                  }}
                  className="w-full h-full flex items-center justify-center"
                  ref={componentRef}
                >
                  {React.createElement(
                    currentPortfolioComponents[selectedPage - 1],
                    {
                      ref: childRefs.current[selectedPage - 1],
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="bg-[#E7E4D8] p-4 border-t border-gray-200 flex justify-center items-center">
            <div className="flex items-center gap-8 max-w-md w-full">
              <button
                className="px-4 text-white py-2 bg-[#b4707e] rounded-md hover:bg-[#50563f]
              transition-colors duration-300 flex items-center gap-1"
                onClick={handlePrevious}
                disabled={selectedPage === 1}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Previous
              </button>
              <div className="text-[#434242] font-medium">
                Page {selectedPage} of {totalSlides}
              </div>
              <button
                className="text-white px-4 py-2 bg-[#b4707e] rounded-md
               hover:bg-[#50563f] transition-colors duration-300 flex items-center gap-1"
                onClick={handleNext}
                disabled={selectedPage === totalSlides}
              >
                Next
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};