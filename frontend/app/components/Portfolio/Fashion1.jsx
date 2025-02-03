import React, { useState, useRef } from "react";

const FashionPortfolio = () => {
  // States for editable content
  const [quote, setQuote] = useState("Fashion is the armor to survive the reality of everyday life.");
  const [title, setTitle] = useState("Fashion Portfolio");
  const [backgroundImage, setBackgroundImage] = useState("/Picture7.jpg");
  const [modelImage, setModelImage] = useState("/Picture1.jpg");
  const [label, setLabel] = useState("New Fashion");

  // Refs for hidden file inputs
  const backgroundInputRef = useRef(null);
  const modelInputRef = useRef(null);

  // Handle image uploads
  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#fdf3e5] to-[#fad9b7]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
        onClick={() => backgroundInputRef.current.click()}
      ></div>

      {/* Hidden file input for background */}
      <input
        type="file"
        accept="image/*"
        ref={backgroundInputRef}
        style={{ display: "none" }}
        onChange={(e) => handleImageUpload(e, setBackgroundImage)}
      />

      {/* Overlay */}
      <div className="relative flex items-center justify-center h-full">
        {/* Editable Text Overlay */}
        <div className="relative z-10 text-center">
          <blockquote className="text-white italic text-lg md:text-xl lg:text-2xl mb-8">
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="bg-transparent text-center text-white italic w-full outline-none"
            />
          </blockquote>
          <h1 className="text-6xl md:text-8xl font-serif text-white tracking-wide leading-tight">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-center text-white font-serif w-full outline-none"
            />
          </h1>
        </div>

        {/* Editable Image Card */}
        <div className="absolute top-1/4 right-10 flex justify-end">
          <div
            className="relative max-h-[calc(100%-4rem)]"
            onClick={() => modelInputRef.current.click()}
          >
            {/* Background Shadow */}
            <div className="absolute -inset-5 bg-[#9a7752] rounded-lg"></div>
            {/* Fashion Model Image */}
            <img
              src={modelImage}
              alt="New Fashion"
              className="relative z-20 object-cover rounded-lg shadow-lg max-h-96 w-auto"
            />
            {/* Hidden file input for model image */}
            <input
              type="file"
              accept="image/*"
              ref={modelInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, setModelImage)}
            />
            {/* Editable Label */}
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="absolute bottom-4 right-4 z-30 bg-white text-[#9a7752] font-bold px-4 py-1 text-xs uppercase tracking-wide rounded outline-none text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionPortfolio;
