import React, { useState, useRef } from "react";
import "./style.css"; // Make sure you have this CSS file
import FashionPortfolio from "./Fashion1.jsx"; // Your main component
import FashionLayout from "./Fashion2.jsx";
import Fashion from "./Fashion3.jsx";
import FabricMaterialSelection from "./Fashion4.jsx";
import SketchesIllustrations from "./Fashion5.jsx";
import PortfolioSection from "./Fashion6.jsx";

export const MyPlugin = () => {
  // State to track the selected slide/component
  const [selectedSlide, setSelectedSlide] = useState(1);
  const [scale, setScale] = useState(1); // Scale state for zoom functionality
  const componentRef = useRef(null); // Reference to the component for fullscreen

  const fashionPortfolioRef = useRef(null); // Create a ref for FashionPortfolio

// Add the missing selectedText state
const [selectedText, setSelectedText] = useState(null);
const [selection, setSelection] = useState({
  range: null,
  text: ''
});
  // A mapping of slide numbers to component components
  const componentsMap = {
	1: <FashionPortfolio ref={fashionPortfolioRef} onTextSelect={(selectedText) => {
        console.log('Selected text in MyPlugin:', selectedText);
      }} />, // Pass the ref here,
    2: <FashionLayout />,
    3: <Fashion/>,
	4 : <FabricMaterialSelection/>,
	5: <SketchesIllustrations/>,
	6: <PortfolioSection/>,

    // Add more components as needed
  };

  // Get slide numbers dynamically from the keys of componentsMap
  const slideNumbers = Object.keys(componentsMap).map(Number);

  // Function to handle slide selection
  const handleSlideClick = (slide) => {
    setSelectedSlide(slide);
  };

  // Function to handle next/previous slide
  const handleNext = () => {
    setSelectedSlide((prev) => (prev < Object.keys(componentsMap).length ? prev + 1 : prev));
  };

  const handlePrevious = () => {
    setSelectedSlide((prev) => (prev > 1 ? prev - 1 : prev));
  };

// Function to zoom in
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

  const applyStyle = (type, value) => {

	console.log ( 'ww',type,value)
    if (!selection?.type) {
      console.log('No valid selection found',type);
      return;
    }

    // Call updateStyles on the FashionPortfolio instance
    if (fashionPortfolioRef.current) {
      switch (type) {
        case 'font':
          fashionPortfolioRef.current.updateStyles(selection.type, { fontFamily: value });
          break;
        case 'size':
          const sizes = { small: '14px', medium: '16px', large: '18px' };
          fashionPortfolioRef.current.updateStyles(selection.type, { fontSize: sizes[value] });
          break;
        case 'color':
          fashionPortfolioRef.current.updateStyles(selection.type, { color: value });
          break;
        default:
          break;
      }
    }
  };

 
  return (
    <div id="webcrumbs">
      <div className="w-[1510px] bg-[#E7E4D8] shadow-xl p-6">
        <div className="flex gap-6">
          <div className="w-[300px] bg-[#434242] rounded-lg p-4">
            <div className="text-lg font-semibold mb-4 text-[#E7E4D8]">Customize your Portfolio</div>
            <div className="h-[600px] overflow-y-auto space-y-3">
              {slideNumbers.map((slide) => (
                <div key={slide} className="group cursor-pointer" onClick={() => handleSlideClick(slide)}>
                  <div className="bg-[#E7E4D8] rounded-lg p-3 border-2 border-transparent hover:border-[#B4707E] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#616852] group-hover:text-[#822538]">slideshow</span>
                      <div>
                        <div className="font-medium text-[#434242]">Slide {slide}</div>
                        <div className="text-sm text-[#616852]">Lorem ipsum dolor sit amet</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                    <span className="material-symbols-outlined text-[#E7E4D8] hover:text-[#434242]"onClick={handleFullscreen}>fullscreen</span>
                  </button>
                </div>

				<div className="flex items-center gap-4">
				<details className="relative">
                  <summary className="list-none cursor-pointer">
                    <div className="flex items-center gap-2 p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200 text-[#E7E4D8] hover:text-[#434242]">
                      <span className="material-symbols-outlined">text_format</span>
                      <span className="text-sm">Font</span>
                    </div>
                  </summary>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#E7E4D8] rounded-lg shadow-lg p-2 z-10">
                    <div className="space-y-2">
                      <button 
                        className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
                        onClick={() => applyStyle('font', 'Arial')}
                      >
                        Arial
                      </button>
                      <button 
                        className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
                        onClick={() => applyStyle('font', 'Times New Roman')}
                      >
                        Times New Roman
                      </button>
                      <button 
                        className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
                        onClick={() => applyStyle('font', 'Helvetica')}
                      >
                        Helvetica
                      </button>
                    </div>
                  </div>
                </details>

                <details className="relative">
                  <summary className="list-none cursor-pointer">
                    <div className="flex items-center gap-2 p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200 text-[#E7E4D8] hover:text-[#434242]">
                      <span className="material-symbols-outlined">format_size</span>
                      <span className="text-sm">Size</span>
                    </div>
                  </summary>
                  <div className="absolute top-full left-0 mt-2 w-32 bg-[#E7E4D8] rounded-lg shadow-lg p-2 z-10">
                    <div className="space-y-2">
                      <button 
                        className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
                        onClick={() => applyStyle('size', 'small')}
                      >
                        Small
                      </button>
                      <button 
                        className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
                        onClick={() => applyStyle('size', 'medium')}
                      >
                        Medium
                      </button>
                      <button 
                        className="w-full text-left p-2 hover:bg-[#B4707E] hover:text-[#E7E4D8] rounded-lg"
                        onClick={() => applyStyle('size', 'large')}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </details>

                <details className="relative">
                  <summary className="list-none cursor-pointer">
                    <div className="flex items-center gap-2 p-2 hover:bg-[#E7E4D8] rounded-lg transition-colors duration-200 text-[#E7E4D8] hover:text-[#434242]">
                      <span className="material-symbols-outlined">palette</span>
                      <span className="text-sm">Color</span>
                    </div>
                  </summary>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#E7E4D8] rounded-lg shadow-lg p-2 z-10">
                    <div className="grid grid-cols-4 gap-2">
                      <button 
                        className="w-8 h-8 rounded-full bg-[#822538] hover:ring-2 ring-offset-2 ring-[#822538]"
                        onClick={() => applyStyle('color', '#822538')}
                      />
                      <button 
                        className="w-8 h-8 rounded-full bg-[#B4707E] hover:ring-2 ring-offset-2 ring-[#B4707E]"
                        onClick={() => applyStyle('color', '#B4707E')}
                      />
                      <button 
                        className="w-8 h-8 rounded-full bg-[#616852] hover:ring-2 ring-offset-2 ring-[#616852]"
                        onClick={() => applyStyle('color', '#616852')}
                      />
                      <button 
                        className="w-8 h-8 rounded-full bg-[#434242] hover:ring-2 ring-offset-2 ring-[#434242]"
                        onClick={() => applyStyle('color', '#434242')}
                      />
                    </div>
                  </div>
                </details>
              </div>
            </div>
			</div>
               
            <div className="bg-[#434242] rounded-lg h-[540px] p-8 container">
              <div className="bg-[#E7E4D8] h-full rounded-lg shadow-lg p-6 flex items-center justify-center overflow-hidden "
			  ref={componentRef} // Attach ref to this div
                style={{ transform: `scale(${scale})`, transformOrigin: "center" }} // Apply scaling
               >
                <div className="w-full h-full flex items-center justify-center">
                  {componentsMap[selectedSlide]} {/* Render the selected component */}
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
              <div className="text-[#434242] font-medium">Slide {selectedSlide} of {Object.keys(componentsMap).length}</div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#434242] text-[#E7E4D8] rounded-lg hover:bg-[#616852] transition-colors duration-200"
                onClick={handleNext}
                disabled={selectedSlide === Object.keys(componentsMap).length}
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
