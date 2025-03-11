import React, { useState, useRef, useEffect, useContext } from "react";
import "./style.css"; // Make sure you have this CSS file
import {FashionPortfolio} from "./Fashion1.jsx"; // Your main component
import {FashionLayout} from "./Fashion2.jsx";
import {Fashion} from "./Fashion3.jsx";
import {FabricMaterialSelection} from "./Fashion4.jsx";
import {SketchesIllustrations} from "./Fashion5.jsx";
import {PortfolioSection} from "./Fashion6.jsx";
import { FashionProvider, useFashion } from "./FashionContext.jsx";
import { ApparelPortfolio, AboutMe, AboutMe2, MyServices, WhatIDo, Research, Resume, MyWorkArea1, ProjectInDepth, Project1 } from "../Portfolio2/Fashion1.jsx"
import { PortfolioContext } from '../SelectPortfolio/PortfolioContext.jsx';

// Inner component that uses the Fashion context
 export const  PluginContent =()=> {
  // State to track the selected slide/component
  const [selectedSlide, setSelectedSlide] = useState(1);
  const [scale, setScale] = useState(1); // Scale state for zoom functionality
  const componentRef = useRef(null); // Reference to the component for fullscreen

  const [fontSize, setFontSize] = useState(16); // Default font size is 16px
  
  // Add state to track which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Get context functions
  const { selection, applyStyle } = useFashion();

  const { selectedPortfolio } = useContext(PortfolioContext);

  // Create a map where each number points to an array of components from a specific folder
  const componentsMap = {
    1: [
      <FashionPortfolio />,
      <FashionLayout />,
      <Fashion />,
      <FabricMaterialSelection />,
      <SketchesIllustrations />,
      <PortfolioSection />
    ],
    2: [
      <ApparelPortfolio />,
      <AboutMe />,
      <AboutMe2 />,
      <MyServices />,
      <WhatIDo />,
      <Research />,
      <Resume />,
      <MyWorkArea1 />,
      <ProjectInDepth />,
      <Project1 />
    ]
  };

  // Default to portfolio 1 if selectedPortfolio is not set or not in the map
  const portfolioId = selectedPortfolio && componentsMap[selectedPortfolio] 
    ? selectedPortfolio 
    : 1;
  
  // Get the components for the current portfolio
  const currentPortfolioComponents = componentsMap[portfolioId];
  
  // Get total slides for the current portfolio
  const totalSlides = currentPortfolioComponents.length;

  // Ensure selectedSlide is valid for current portfolio
  useEffect(() => {
    if (selectedSlide > totalSlides) {
      setSelectedSlide(1);
    }
  }, [portfolioId, totalSlides, selectedSlide]);

  // Function to handle slide selection
  const handleSlideClick = (slide) => {
    if (slide <= totalSlides) {
      setSelectedSlide(slide);
    }
  };

  // Function to handle next/previous slide
  const handleNext = () => {
    setSelectedSlide((prev) => (prev < totalSlides ? prev + 1 : prev));
  };

  const handlePrevious = () => {
    setSelectedSlide((prev) => (prev > 1 ? prev - 1 : prev));
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
    console.log('type and value is:', type, value);
    console.log('current selection:', selection);

    // Check if we have a valid selection
    if (!selection?.type) {
      console.log('No valid selection found', type);
      return;
    }

    // Use the context's applyStyle function
    switch (type) {
      case 'font':
        applyStyle(selection.type, { fontFamily: value });
        break;
      case 'size':
        applyStyle(selection.type, { fontSize: value });
        break;
      case 'color':
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
    if (!e.target.closest('details')) {
      setOpenDropdown(null);
    }
  };

  // Add click event listener to document to detect clicks outside dropdown
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div id="webcrumbs">
      <div className="w-[1510px] bg-[#E7E4D8] shadow-xl p-6">
        <div className="flex gap-6">
          <div className="w-[300px] bg-[#434242] rounded-lg p-4">
            <div className="text-lg font-semibold mb-4 text-[#E7E4D8]">Customize your Portfolio</div>
            <div className="h-[600px] overflow-y-auto space-y-3">
              {currentPortfolioComponents.map((_, index) => {
                const slideNumber = index + 1;
                return (
                  <div key={slideNumber} className="group cursor-pointer" onClick={() => handleSlideClick(slideNumber)}>
                    <div className={`bg-[#E7E4D8] rounded-lg p-3 border-2 ${selectedSlide === slideNumber ? 'border-[#B4707E]' : 'border-transparent'} hover:border-[#B4707E] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}>
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined ${selectedSlide === slideNumber ? 'text-[#822538]' : 'text-[#616852]'} group-hover:text-[#822538]`}>slideshow</span>
                        <div>
                          <div className="font-medium text-[#434242]">Page {slideNumber}</div>
                          <div className="text-sm text-[#616852]">Component {slideNumber}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-[#434242] rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200">
                    <span className="material-symbols-outlined text-[#E7E4D8] hover:text-[#434242] " onClick={handleZoomIn}>zoom_in</span>
                  </button>
                  <button 
                    className="p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200"
                    disabled={scale <= 1} // Disable the button when at original scale
                  >
                    <span 
                      className={`material-symbols-outlined text-[#E7E4D8] hover:text-[#434242] ${scale <= 1 ? 'opacity-50' : ''}`} 
                      onClick={handleZoomOut}
                    >
                      zoom_out
                    </span>
                  </button>
                  <button className="p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200">
                    <span className="material-symbols-outlined text-[#E7E4D8] hover:text-[#434242]" onClick={handleFullscreen}>fullscreen</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">

                <button className="flex items-center gap-2 p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200 text-[#E7E4D8] hover:text-[#434242]">
                                        <span className="material-symbols-outlined">save</span>
                                        <span className="text-sm">Save</span>
                                    </button>
                                    <button className="flex items-center gap-2 p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200 text-[#E7E4D8] hover:text-[#434242]">
                                        <span className="material-symbols-outlined">download</span>
                                        <span className="text-sm">Download</span>
                                    </button>
                                    <details 
  className="relative" 
  open={openDropdown === 'font'}
  onClick={(e) => {
    e.preventDefault(); // Prevent the default toggle behavior
    handleDropdownToggle('font');
  }}
>
  <summary className="list-none cursor-pointer">
    <div className="flex items-center gap-2 p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200 text-[#E7E4D8] hover:text-[#434242]">
      <span className="material-symbols-outlined">text_format</span>
      <span className="text-sm">Font</span>
    </div>
  </summary>
  {openDropdown === 'font' && (
    <div className="absolute top-full left-0 mt-2 w-48 bg-[#E7E4D8] rounded-lg shadow-lg p-2 z-10">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from closing dropdown
            handleApplyStyle('font', 'Arial');
            setOpenDropdown(null);
          }}
        >
          Arial
        </button>
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('font', 'Times New Roman');
            setOpenDropdown(null);
          }}
        >
          Times New Roman
        </button>
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('font', 'Helvetica');
            setOpenDropdown(null);
          }}
        >
          Helvetica
        </button>
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('font', 'Georgia');
            setOpenDropdown(null);
          }}
        >
          Georgia
        </button>
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('font', 'Verdana');
            setOpenDropdown(null);
          }}
        >
          Verdana
        </button>
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('font', 'Courier New');
            setOpenDropdown(null);
          }}
        >
          Courier New
        </button>
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('font', 'Trebuchet MS');
            setOpenDropdown(null);
          }}
        >
          Trebuchet MS
        </button>
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('font', 'Garamond');
            setOpenDropdown(null);
          }}
        >
          Garamond
        </button>
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('font', 'Palatino');
            setOpenDropdown(null);
          }}
        >
          Palatino
        </button>
        <button 
          className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('font', 'Baskerville');
            setOpenDropdown(null);
          }}
        >
          Baskerville
        </button>
      </div>
    </div>
  )}
</details>

<details 
  className="relative"
  open={openDropdown === 'size'}
  onClick={(e) => {
    e.preventDefault();
    handleDropdownToggle('size');
  }}
>
  <summary className="list-none cursor-pointer">
    <div className="flex items-center gap-2 p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200 text-[#E7E4D8] hover:text-[#434242]">
      <span className="material-symbols-outlined">format_size</span>
      <span className="text-sm">Size</span>
    </div>
  </summary>
  {openDropdown === 'size' && (
    <div 
      className="absolute top-full left-0 mt-2 w-64 bg-[#E7E4D8] rounded-lg shadow-lg p-4 z-10"
      onClick={(e) => e.stopPropagation()} // Stop propagation for the entire dropdown content
    >
      <div className="space-y-4">
        {/* Slider for font size */}
        <div className="space-y-2">
          <label htmlFor="font-size-slider" className="text-sm font-medium text-[#434242]">
            Font Size: {fontSize}px
          </label>
          <input
            id="font-size-slider"
            type="range"
            min="8"
            max="72"
            value={fontSize}
            onChange={(e) => {
              e.stopPropagation();
              setFontSize(parseInt(e.target.value));
            }}
            onMouseDown={(e) => e.stopPropagation()} // Stop propagation on mouse down
            onMouseUp={(e) => e.stopPropagation()} // Stop propagation on mouse up
            className="w-full h-2 bg-[#B4707E] rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        {/* Direct input for specific font size */}
        <div className="flex items-center gap-2">
          <label htmlFor="font-size-input" className="text-sm font-medium text-[#434242]">
            Custom Size:
          </label>
          <input
            id="font-size-input"
            type="number"
            min="1"
            max="200"
            value={fontSize}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              setFontSize(parseInt(e.target.value) || 1);
            }}
            className="w-16 px-2 py-1 border border-[#616852] rounded-md focus:outline-none focus:ring-1 focus:ring-[#B4707E]"
          />
          <span className="text-sm text-[#434242]">px</span>
        </div>
        
        {/* Apply button */}
        <button
          className="w-full text-center p-2 bg-[#616852] text-[#E7E4D8] hover:bg-[#B4707E] rounded-lg transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyStyle('size', `${fontSize}px`);
            setOpenDropdown(null); // Now explicitly close the dropdown when clicking Apply
          }}
        >
          Apply Font Size
        </button>
      </div>
    </div>
  )}
</details>

<details 
  className="relative"
  open={openDropdown === 'color'}
  onClick={(e) => {
    e.preventDefault();
    handleDropdownToggle('color');
  }}
>
  <summary className="list-none cursor-pointer">
    <div className="flex items-center gap-2 p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200 text-[#E7E4D8] hover:text-[#434242]">
      <span className="material-symbols-outlined">palette</span>
      <span className="text-sm">Color</span>
    </div>
  </summary>
  {openDropdown === 'color' && (
    <div 
      className="absolute top-full right-0 mt-2 w-80 bg-[#E7E4D8] rounded-lg shadow-lg p-4 pr-12 z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-4">
        {/* Color categories */}
        <div>
          <h3 className="text-sm font-medium text-[#434242] mb-2">Brand Colors</h3>
          <div className="grid grid-cols-6 gap-2">
            <button 
              className="w-8 h-8 rounded-full bg-[#822538] hover:ring-2 ring-offset-2 ring-[#822538]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#822538');
                setOpenDropdown(null);
              }}
              title="Burgundy"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#B4707E] hover:ring-2 ring-offset-2 ring-[#B4707E]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#B4707E');
                setOpenDropdown(null);
              }}
              title="Rose"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#616852] hover:ring-2 ring-offset-2 ring-[#616852]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#616852');
                setOpenDropdown(null);
              }}
              title="Olive"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#434242] hover:ring-2 ring-offset-2 ring-[#434242]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#434242');
                setOpenDropdown(null);
              }}
              title="Charcoal"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#9a7752] hover:ring-2 ring-offset-2 ring-[#9a7752]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#9a7752');
                setOpenDropdown(null);
              }}
              title="Brown"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#E7E4D8] hover:ring-2 ring-offset-2 ring-[#E7E4D8] border border-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#E7E4D8');
                setOpenDropdown(null);
              }}
              title="Cream"
            />
          </div>
        </div>
        
        {/* Neutral Colors */}
        <div>
          <h3 className="text-sm font-medium text-[#434242] mb-2">Neutral Colors</h3>
          <div className="grid grid-cols-6 gap-2">
            <button 
              className="w-8 h-8 rounded-full bg-white hover:ring-2 ring-offset-2 ring-gray-300 border border-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#FFFFFF');
                setOpenDropdown(null);
              }}
              title="White"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#F5F5F5] hover:ring-2 ring-offset-2 ring-gray-300 border border-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#F5F5F5');
                setOpenDropdown(null);
              }}
              title="Off White"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#E0E0E0] hover:ring-2 ring-offset-2 ring-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#E0E0E0');
                setOpenDropdown(null);
              }}
              title="Light Gray"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#9E9E9E] hover:ring-2 ring-offset-2 ring-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#9E9E9E');
                setOpenDropdown(null);
              }}
              title="Medium Gray"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#616161] hover:ring-2 ring-offset-2 ring-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#616161');
                setOpenDropdown(null);
              }}
              title="Dark Gray"
            />
            <button 
              className="w-8 h-8 rounded-full bg-black hover:ring-2 ring-offset-2 ring-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#000000');
                setOpenDropdown(null);
              }}
              title="Black"
            />
          </div>
        </div>
        
        {/* Important/Accent Colors */}
        <div>
          <h3 className="text-sm font-medium text-[#434242] mb-2">Accent Colors</h3>
          <div className="grid grid-cols-6 gap-2">
            <button 
              className="w-8 h-8 rounded-full bg-[#F44336] hover:ring-2 ring-offset-2 ring-[#F44336]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#F44336');
                setOpenDropdown(null);
              }}
              title="Red"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#2196F3] hover:ring-2 ring-offset-2 ring-[#2196F3]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#2196F3');
                setOpenDropdown(null);
              }}
              title="Blue"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#4CAF50] hover:ring-2 ring-offset-2 ring-[#4CAF50]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#4CAF50');
                setOpenDropdown(null);
              }}
              title="Green"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#FFC107] hover:ring-2 ring-offset-2 ring-[#FFC107]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#FFC107');
                setOpenDropdown(null);
              }}
              title="Yellow"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#9C27B0] hover:ring-2 ring-offset-2 ring-[#9C27B0]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#9C27B0');
                setOpenDropdown(null);
              }}
              title="Purple"
            />
            <button 
              className="w-8 h-8 rounded-full bg-[#FF9800] hover:ring-2 ring-offset-2 ring-[#FF9800]"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyStyle('color', '#FF9800');
                setOpenDropdown(null);
              }}
              title="Orange"
            />
          </div>
        </div>
      </div>
    </div>
  )}
</details>
                </div>
              </div>
            </div>
            
            <div className="bg-[#434242] rounded-lg h-[540px] p-8 container">
              <div className="bg-[#E7E4D8] h-full rounded-lg shadow-lg p-6 flex items-center justify-center overflow-hidden"
                ref={componentRef} // Attach ref to this div
                style={{ transform: `scale(${scale})`, transformOrigin: "center" }} // Apply scaling
              >
                <div className="w-full h-full flex items-center justify-center">
                {currentPortfolioComponents[selectedSlide - 1]}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 px-8">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#434242] text-[#E7E4D8] rounded-lg hover:bg-[#616852] transition-colors duration-200"
                onClick={handlePrevious}
                disabled={selectedSlide === 1}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span>Previous</span>
              </button>
              <div className="text-[#434242] font-medium">Page {selectedSlide} of {totalSlides}</div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#434242] text-[#E7E4D8] rounded-lg hover:bg-[#616852] transition-colors duration-200"
                onClick={handleNext}
                disabled={selectedSlide === totalSlides}
              >
                <span>Next</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

