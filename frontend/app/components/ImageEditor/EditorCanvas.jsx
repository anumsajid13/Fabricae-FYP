import { useEffect, forwardRef, useState } from "react";
import * as fabric from "fabric";
import { Image} from 'fabric';

const EditorCanvas = forwardRef(({ canvas, setCurrentFilter }, ref) => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [activeObject, setActiveObject] = useState(null);

  useEffect(() => {
    if (!canvas) return;

    function handleKeyDown(e) {
      if (e.key === "Delete") {
        for (const obj of canvas.getActiveObjects()) {
          canvas.remove(obj);
          canvas.discardActiveObject();
        }
      }
    }

    function handleSelection(e) {
      const obj = e.selected?.length === 1 ? e.selected[0] : null;
      const filter = obj?.filters?.at(0);
      setCurrentFilter(filter ? filter.type.toLowerCase() : null);
      setActiveObject(obj); // Save the active object
    }

    // Right-click event to show the context menu
    function handleRightClick(e) {
      e.preventDefault(); // Prevent the default context menu
      const pointer = canvas.getPointer(e);

      if (activeObject && activeObject.type === "image") {
        setContextMenu({
          visible: true,
          x: e.clientX, // Position the context menu
          y: e.clientY,
        });
      } else {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    }

    // Close context menu on canvas click
    function handleCanvasClick() {
      setContextMenu({ visible: false, x: 0, y: 0 });
    }

    document.addEventListener("keydown", handleKeyDown, false);
    canvas.on({
      "selection:created": handleSelection,
      "selection:updated": handleSelection,
      "selection:cleared": handleSelection,
      "mouse:down": handleCanvasClick,
    });
    canvas.wrapperEl.addEventListener("contextmenu", handleRightClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
      canvas.off({
        "selection:created": handleSelection,
        "selection:updated": handleSelection,
        "selection:cleared": handleSelection,
        "mouse:down": handleCanvasClick,
      });
      canvas.wrapperEl.removeEventListener("contextmenu", handleRightClick);
    };
  }, [canvas, setCurrentFilter, activeObject]);

  // Function to duplicate the image
  const duplicateImage = async() => {
    console.log("activeObject",activeObject)
    console.log("activeObject.type",activeObject.type.toLowerCase())
    if (activeObject && activeObject.type.toLowerCase() === "image") {
      
      const { src, left, top } = activeObject;
      const clonedImg = await Image.fromURL(activeObject.getSrc());
        clonedImg.set({
          left: (left || 0) + 100,
          top: (top || 0) + 100,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
        });
        console.log("clonedImg",clonedImg)
        canvas.add(clonedImg);
        canvas.setActiveObject(clonedImg);
        canvas.renderAll();
        console.log("Cloned Image Added:", clonedImg);
   
    } else {
      console.warn("Active object is not an image or does not exist.");
    }
  
    setContextMenu({ visible: false, x: 0, y: 0 });
  };
  

  return (
    <div className="ml-[18rem] mt-[6rem] relative">
      {/* Canvas */}
      <canvas ref={ref} width="800" height="900"></canvas>

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <ul
          className="absolute bg-white border shadow-lg list-none p-2 rounded"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <li
            className="cursor-pointer hover:bg-gray-200 p-1"
            onClick={duplicateImage}
          >
            Duplicate
          </li>
        </ul>
      )}
    </div>
  );
});

export default EditorCanvas;
