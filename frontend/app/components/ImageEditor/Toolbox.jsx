import { useEffect, useState } from 'react';
import { Image, IText, filters,Rect } from 'fabric';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFont, faPencilAlt, faTrash, faDownload,faRotate,faExchangeAlt,faCrop,faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { SwapColor } from "../../../colorSwapFilter";
import * as fabric from "fabric";
import { SketchPicker } from "react-color";


const Toolbox = ({ canvas, currentFilter, setCurrentFilter }) => {
  const [drawingMode, setDrawingMode] = useState(false);
  const [sourceColor, setSourceColor] = useState("#ffffff");
  const [destinationColor, setDestinationColor] = useState("#000000");
  const [swapFiltersVisible, setSwapFiltersVisible] = useState(false);
  const [filtersMenuVisible, setFiltersMenuVisible] = useState(false);
  const [filterPreviews, setFilterPreviews] = useState({});

  const fileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const image = await Image.fromURL(e.target.result);
      image.scale(0.5);
      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (!canvas) return;

    const applySwapFiters = () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;

      activeObject.filters = activeObject.filters || [];

      const swapColorFilter = new SwapColor();
      swapColorFilter.colorSource = sourceColor;
      swapColorFilter.colorDestination = destinationColor;

      activeObject.filters = activeObject.filters.filter(
        (filter) => !(filter instanceof SwapColor)
      );
      activeObject.filters.push(swapColorFilter);

      activeObject.applyFilters();
      canvas.renderAll();
    };

    function getSelectedFilter() {
      switch(currentFilter) {
        case 'sepia':
          return new filters.Sepia();
        case 'brownie':
          return new filters.Brownie();
        case 'invert':
          return new filters.Invert();
        case 'polaroid':
          return new filters.Polaroid();
        case 'grayscale':
          return new filters.Grayscale();
        default:
          return null;
      }
    }
  
    function addFilter(){

      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;

      activeObject.filters = activeObject.filters || [];
  
      // Handle grayscale filter
      if (currentFilter === "grayscale") {
        const filter = getSelectedFilter();
        activeObject.filters=filter ? [filter] : [];
      }
  
      // Handle sepia filter
      if (currentFilter === "sepia") {
        const filter = getSelectedFilter();
        activeObject.filters=filter ? [filter] : [];
      }

      // Handle brownie filter
      if (currentFilter === "brownie") {
        const filter = getSelectedFilter();
        activeObject.filters=filter ? [filter] : [];
      }

      // Handle polaroid filter
      if (currentFilter === "polaroid") {
        const filter = getSelectedFilter();
        activeObject.filters=filter ? [filter] : [];
      }

       // Handle invert filter
       if (currentFilter === "invert") {
        const filter = getSelectedFilter();
        activeObject.filters=filter ? [filter] : [];
      }
  
      activeObject.applyFilters();
      canvas.renderAll();
  
    }
  
    if(swapFiltersVisible && sourceColor)
      applySwapFiters();

    if(filtersMenuVisible)
      addFilter();
  }, [sourceColor, destinationColor, currentFilter, canvas]);

  useEffect(() => {
    if (!canvas) return;

    const handleCanvasClick = (e) => {
      const pointer = canvas.getPointer(e.e);
      const context = canvas.getContext("2d");

      const pixelData = context.getImageData(
        pointer.x * canvas.getZoom(),
        pointer.y * canvas.getZoom(),
        1,
        1
      ).data;

      const clickedColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
      setSourceColor(clickedColor);
    };

    canvas.on("mouse:down", handleCanvasClick);

    return () => {
      canvas.off("mouse:down", handleCanvasClick);
    };
  }, [canvas]);

  const toggleDrawingMode = () => {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setDrawingMode(canvas.isDrawingMode);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = "photo_editor_image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

 
   

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all?")) {
      canvas.remove(...canvas.getObjects());
    }
  };

 

  
  

  const toggleFiltersMenu = () => {
    setFiltersMenuVisible(!filtersMenuVisible);
  };

  const toggleSwapFiltersBox = () => {
    setSwapFiltersVisible(!swapFiltersVisible);

   // applySwapFiters();
  };


  const [rotationMenuVisible, setRotationMenuVisible] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const toggleRotationMenu = () => {
    setRotationMenuVisible(!rotationMenuVisible);
  };

  const applyRotation = (angle) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.rotate(angle);
    canvas.renderAll();
  };

  const rotate90 = (direction) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const currentAngle = activeObject.angle || 0;
    applyRotation(direction === "cw" ? currentAngle + 90 : currentAngle - 90);
  };

  const flipObject = (axis) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if (axis === "X") activeObject.flipX = !activeObject.flipX;
    if (axis === "Y") activeObject.flipY = !activeObject.flipY;
    canvas.renderAll();
  };


  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Toggle Crop Mode
  const toggleCropMode = () => {
  setIsCropping(!isCropping);

  if (!isCropping) {
    // Save the currently selected image
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
      setSelectedImage(activeObject);

      // Enter Crop Mode: Add a selection rectangle
      const rect = new fabric.Rect({
        left: activeObject.left + 50,
        top: activeObject.top + 50,
        width: 100,
        height: 100,
        fill: 'rgba(0,0,0,0.3)',
        stroke: 'black',
        strokeWidth: 1,
        selectable: true,
        cornerSize: 8,
        hasRotatingPoint: false,
      });
      setCropRect(rect);
      canvas.add(rect);
      canvas.setActiveObject(rect);
    } else {
      alert('Please select an image to crop.');
      setIsCropping(false);
    }
  } else {
    // Exit Crop Mode: Remove selection rectangle
    if (cropRect) {
      canvas.remove(cropRect);
      setCropRect(null);
    }
  }
  canvas.renderAll();
  };

  const applyCrop = async () => {
    console.log("selectedImage", selectedImage);
    console.log("cropRect", cropRect);
  
    if (selectedImage && cropRect) {
      console.log("heyyy11");
      const { left, top, width, height } = cropRect.getBoundingRect();
      const imageLeft = selectedImage.left;
      const imageTop = selectedImage.top;
      const scaleX = selectedImage.scaleX || 1;
      const scaleY = selectedImage.scaleY || 1;
  
      // Calculate cropping offsets relative to the image
      const cropX = (left - imageLeft) / scaleX;
      const cropY = (top - imageTop) / scaleY;
      const cropWidth = width / scaleX;
      const cropHeight = height / scaleY;
  
      // Get the original image element
      const originalImage = selectedImage._element;
  
      // Create a canvas for cropping
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      tempCanvas.width = cropWidth;
      tempCanvas.height = cropHeight;
  
      // Draw the cropped part of the image onto the temp canvas
      ctx.drawImage(
        originalImage,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
  
      // Convert the temp canvas to a data URL
      const croppedDataURL = tempCanvas.toDataURL();
      console.log("croppedDataURL", croppedDataURL);
  
      try {
        // Wait for the image to load
        const croppedImg = await Image.fromURL(croppedDataURL);
        croppedImg.set({
          left: left,
          top: top,
          scaleX: selectedImage.scaleX,
          scaleY: selectedImage.scaleY,
        });
  
        // Remove the original image from the canvas
        canvas.remove(selectedImage);
  
        // Add the cropped image
        canvas.add(croppedImg);
        canvas.centerObject(croppedImg);
        canvas.setActiveObject(croppedImg);
  
        // Remove the crop rectangle
        canvas.remove(cropRect);
        setCropRect(null);
        setIsCropping(false);
  
        // Update the canvas to reflect the changes
        canvas.renderAll();
      } catch (error) {
        console.error("Error loading cropped image:", error);
      }
    } else {
      alert('Please select an image and define a crop area.');
    }
  };


   // Static images for filter previews
   const filterImages = {
    sepia: "/sepia.PNG",
    brownie: "/brownie.PNG",
    invert: "/invert.PNG",
    polaroid: "/polaroid.PNG",
    grayscale: "/grayscale.PNG",
  };


  return (

      <div className="flex flex-col items-start space-y-6 p-4 bg-[#822538] shadow-md rounded-xl fixed top-[7rem] left-2 h-[calc(90vh-4rem)]">
        
        <label className="space-x-2 cursor-pointer bg-transparent text-gray-700 hover:bg-gray-400 flex items-center p-1.5 rounded mt-6">
          <FontAwesomeIcon icon={faImage} size="xl" style={{color: "black"}}  />
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={fileHandler}
            className="hidden"
          />
        </label>
  
        <button
          title="Drawing mode"
          onClick={toggleDrawingMode}
          className={`flex items-center p-2 ${
            drawingMode
              ? "bg-transparent text-white hover:bg-gray-400"
              : "bg-transparent text-gray-700 hover:bg-gray-400"
          } rounded`}
        >
          <FontAwesomeIcon icon={faPencilAlt} size="xl" style={{color: "black"}}/>
        </button>
  
        {/* Filters Icon */}
        <button
          title="Filters"
          onClick={toggleFiltersMenu}
          className="flex items-center p-2 bg-transparent text-white rounded hover:bg-gray-400"
        >
           <FontAwesomeIcon icon={faWandMagicSparkles} size="xl" style={{color: "black"}} />
          {/* <img src='/Filter.PNG' className='w-10'></img> */}
        </button>
  
         {/* Filters Sub-Menu */}
         {filtersMenuVisible && (
          <div className="absolute bg-transparent p-4 shadow-md rounded-xl grid grid-cols- gap-4 top-[0rem] left-20 w-auto h-[calc(87vh-4rem)]">
            {Object.entries(filterImages).map(([filterName, imgSrc]) => (
              <div key={filterName} className="flex flex-col items-center">
                <button 
                  onClick={() => setCurrentFilter(filterName)} 
                  className="w-[80px] h-[80px] bg-gray-200 rounded shadow-md flex justify-center items-center hover:bg-gray-300"
                >
                  <img src={imgSrc} alt={filterName} className="w-full h-full rounded" />
                </button>
                <span className="text-black mt-2 text-sm capitalize">{filterName}</span>
              </div>
            ))}
          </div>
        )}

  

      
  
        {/* Swap Filters Icon */}
        <button
          title="Swap Filters"
          onClick={toggleSwapFiltersBox}
          className="flex items-center p-2 bg-transparent text-white rounded hover:bg-gray-400"
        >
          {/* <FontAwesomeIcon icon={faExchangeAlt} /> */}
          <img src='/Frame.png' className='w-8'></img>
        </button>
  
        {/* Swap Filters Box */}
        {swapFiltersVisible && (
          <div className="absolute bottom-0 left-[5rem] bg-transparent p-3 shadow-lg rounded-xl space-y-3 w-[180px]">
            {/* <h3 className="text-gray-800 font-semibold text-md text-center">Swap Colors</h3> */}

            <div className="flex flex-col space-y-3">
              {/* Source Color Picker */}
              <div className="flex flex-col items-center">
                <span className="text-gray-600 text-xs">Source Color</span>
                <div className="w-full flex justify-center items-center">
                  <SketchPicker
                    color={sourceColor}
                    onChangeComplete={(color) => setSourceColor(color.hex)}
                    className="shadow-md rounded-lg w-[170px]"
                    width="170px"
                  />
                </div>
              </div>

              {/* Destination Color Picker */}
              <div className="flex flex-col items-center">
                <span className="text-gray-600 text-xs">Destination Color</span>
                <div className="w-full flex justify-center items-center">
                  <SketchPicker
                    color={destinationColor}
                    onChangeComplete={(color) => setDestinationColor(color.hex)}
                    className="shadow-md rounded-lg w-[170px]"
                    width="170px"
                  />
                </div>
              </div>
            </div>

            {/* <button
              onClick={() => setCurrentFilter("swapColor")}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-full text-center text-sm"
            >
              Apply Swap
            </button> */}
          </div>
        )}
        {/* Rotation Menu Button for 90° Rotations & Flips */}
        <button
        title="Rotate"
        onClick={toggleRotationMenu}
        className="flex items-center p-2 bg-transparent text-white rounded hover:bg-gray-400 "
      >
      <FontAwesomeIcon icon={faRotate} size="xl" style={{color: "black"}}/>
      </button>

      {/* Rotation Menu Popup (For Quick 90° Rotations & Flips) */}
      {rotationMenuVisible && (
        <div className="absolute top-16 left-[5rem] bg-transparent p-6 shadow-xl rounded-xl space-y-7 w-[11rem]">

          <button
            onClick={() => rotate90("cw")}
            className="p-3 w-[6rem] bg-gradient-to-r from-[#c55f74] to-[#822538] text-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-md flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
            +90°
          </button>

          <button
            onClick={() => rotate90("ccw")}
            className="p-3 w-[6rem] bg-gradient-to-r from-[#c55f74] to-[#822538] text-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-md flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2 rotate-180" />
            -90°
          </button>

          <button
            onClick={() => flipObject("X")}
            className="p-3 w-[6rem] bg-gradient-to-r from-[#c55f74] to-[#822538] text-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-md flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
            Flip X
          </button>

          <button
            onClick={() => flipObject("Y")}
            className="p-3 w-[6rem] bg-gradient-to-r from-[#c55f74] to-[#822538] text-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-md flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
            Flip Y
          </button>
        </div>
      )}


      {/* Fixed Rotation Slider (Always Visible at Bottom of Canvas) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[600px] bg-transparent p-3 rounded-xl shadow-lg flex flex-col items-center">
        <label className="text-[#822538] text-lg font-semibold mb-2">
          Rotate: {rotationAngle}°
        </label>
        <input
          type="range"
          min="-180"
          max="180"
          value={rotationAngle}
          onChange={(e) => {
            const angle = parseInt(e.target.value, 10);
            setRotationAngle(angle);
            applyRotation(angle);
          }}
          className="w-full cursor-pointer custom-slider"
        />
      </div>

        {/* Custom CSS for Slider Styling */}
        <style jsx>{`
          .custom-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            background: linear-gradient(to right, gray, #822538); 
            border-radius: 5px;
            outline: none;
            transition: background 0.15s ease-in-out;
          }

          .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            background: #ffffff; /* White thumb */
            border-radius: 50%;
            box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.6);
            cursor: pointer;
          }

          .custom-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #ffffff; /* White thumb */
            border-radius: 50%;
            box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.6);
            cursor: pointer;
          }
        `}</style>

        <button
          title="Clear all objects"
          onClick={clearAll}
          className="flex items-center p-2 bg-transparent text-white rounded hover:bg-gray-400"
        >
          <FontAwesomeIcon icon={faTrash} size="xl" style={{color: "black"}} />
        </button>
        <button
          title="Download as image"
          onClick={downloadImage}
          className="flex items-center p-2 bg-transparent text-white rounded hover:bg-gray-400"
        >
          <FontAwesomeIcon icon={faDownload} size="xl" style={{color: "black"}}/>
        </button>


        <button
        title="Crop Mode"
        onClick={toggleCropMode}
        className={`flex items-center p-2 ${
          isCropping
            ? 'bg-transparent text-white'
            : 'bg-transparent text-gray-700 hover:bg-gray-400'
        } rounded`}
      >
        <FontAwesomeIcon icon={faCrop} size="xl" style={{color: "black"}}/>
      </button>

      {isCropping && (
        <button
          title="Apply Crop"
          onClick={applyCrop}
          className="fixed bottom-14 right-15 p-3 ml-72 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-lg transition-transform transform hover:scale-105"
        >
          Apply Crop
        </button>
      )}
      </div>



      

  );
};

export default Toolbox;
