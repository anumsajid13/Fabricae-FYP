import { useEffect, forwardRef, useState } from "react";
import * as fabric from "fabric";
import { Image } from "fabric";

const EditorCanvas = forwardRef(({ canvas, setCurrentFilter }, ref) => {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [activeObject, setActiveObject] = useState(null);

  // Define the desired canvas size
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;

  useEffect(() => {
    if (!canvas) return;

    // Resize the Fabric.js canvas to match the desired dimensions
    canvas.setWidth(CANVAS_WIDTH);
    canvas.setHeight(CANVAS_HEIGHT);
    canvas.renderAll(); // Update the rendering

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
      setActiveObject(obj);
    }

    function handleRightClick(e) {
      e.preventDefault();
      const pointer = canvas.getPointer(e);

      if (activeObject && activeObject.type === "image") {
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
        });
      } else {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    }

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

    //  Ensure `canvas.wrapperEl` exists before adding event listener
    if (canvas.wrapperEl) {
      canvas.wrapperEl.addEventListener("contextmenu", handleRightClick);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
      canvas.off({
        "selection:created": handleSelection,
        "selection:updated": handleSelection,
        "selection:cleared": handleSelection,
        "mouse:down": handleCanvasClick,
      });

      // ✅ Ensure `canvas.wrapperEl` exists before removing event listener
      if (canvas.wrapperEl) {
        canvas.wrapperEl.removeEventListener("contextmenu", handleRightClick);
      }
    };
  }, [canvas, setCurrentFilter, activeObject]);


  const duplicateImage = async () => {
    if (activeObject && activeObject.type.toLowerCase() === "image") {
      const { left, top } = activeObject;
      const clonedImg = await Image.fromURL(activeObject.getSrc());
      clonedImg.set({
        left: (left || 0) + 100,
        top: (top || 0) + 100,
        scaleX: activeObject.scaleX,
        scaleY: activeObject.scaleY,
      });
      canvas.add(clonedImg);
      canvas.setActiveObject(clonedImg);
      canvas.renderAll();

      // Deselect the object after duplication
      canvas.discardActiveObject();
      canvas.renderAll(); // Re-render to clear the selection
    } else {
      console.warn("Active object is not an image or does not exist.");
    }

    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  return (
    <div className="left-[18%] mt-[4rem] relative ">
      {/* Canvas Wrapper with Fixed Size */}
      <div
        className="border border-gray-300 shadow-md"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <canvas ref={ref}></canvas>
      </div>

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
