import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";

const FashionPortfolio = forwardRef(({ onTextSelect }, ref) => {
  const [quote, setQuote] = useState("Fashion is the armor to survive the reality of everyday life.");
  const [title, setTitle] = useState("Fashion Portfolio");
  const [backgroundImage, setBackgroundImage] = useState("/Picture7.jpg");
  const [modelImage, setModelImage] = useState("/Picture1.jpg");
  const [label, setLabel] = useState("New Fashion");
  
  const [styledContent, setStyledContent] = useState({
    quote: { text: quote, styles: {} },
    title: { text: title, styles: {} },
    label: { text: label, styles: {} }
  });

  const backgroundInputRef = useRef(null);
  const modelInputRef = useRef(null);

  // Expose the updateStyles method to parent components
  useImperativeHandle(ref, () => ({
    updateStyles(type, styles) {
      updateStyles(type, styles);
    }
  }));

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleTextSelection = (e, type) => {
    const selection = window.getSelection();
    const text = selection.toString();
    
    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = {
        text: text,
        range: range,
        element: e.target.tagName,
        type: type
      };
      
      onTextSelect(selectedText);
    }
  };

  const updateStyles = (type, styles) => {
    setStyledContent(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        styles: {
          ...prev[type].styles,
          ...styles
        }
      }
    }));
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#fdf3e5] to-[#fad9b7]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
        onClick={() => backgroundInputRef.current.click()}
      ></div>

      <input
        type="file"
        accept="image/*"
        ref={backgroundInputRef}
        style={{ display: "none" }}
        onChange={(e) => handleImageUpload(e, setBackgroundImage)}
      />

      <div className="relative flex items-center justify-center h-full">
        <div className="relative z-30 text-center">
          <div 
            className="text-white italic text-sm md:text-lg lg:text-xl mb-8"
            style={styledContent.quote.styles}
            onMouseUp={(e) => handleTextSelection(e, 'quote')}
          >
            {quote}
          </div>

          <div 
            className="text-4xl md:text-6xl lg:text-8xl font-serif text-white tracking-wide leading-tight mx-auto"
            style={styledContent.title.styles}
            onMouseUp={(e) => handleTextSelection(e, 'title')}
          >
            {title}
          </div>
        </div>

        <div className="absolute top-1/4 right-10 flex justify-end">
          <div className="relative max-h-[calc(100%-4rem)]" onClick={() => modelInputRef.current.click()}>
            <div className="absolute -inset-5 bg-[#9a7752] rounded-lg z-10"></div>
            <img
              src={modelImage}
              alt="New Fashion"
              className="relative z-20 object-cover rounded-lg shadow-lg max-h-96 w-auto"
            />
            <input
              type="file"
              accept="image/*"
              ref={modelInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, setModelImage)}
            />
            <div
              className="absolute bottom-4 right-4 z-30 bg-white text-[#9a7752] font-bold px-4 py-1 text-xs uppercase tracking-wide rounded"
              style={styledContent.label.styles}
              onMouseUp={(e) => handleTextSelection(e, 'label')}
            >
              {label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FashionPortfolio;
