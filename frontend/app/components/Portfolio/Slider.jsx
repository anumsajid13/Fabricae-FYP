import React, { useState } from 'react';
import FashionPortfolio from '../components/Portfolio/Fashion1';
import FashionLayout from '../components/Portfolio/2';
import Fashion from '../components/Portfolio/3';
import FabricMaterialSelection from '../components/Portfolio/4';
import SketchesIllustrations from '../components/Portfolio/5';
import PortfolioSection from '../components/Portfolio/6';

const PortfolioSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const components = [
    <FashionPortfolio key="1" />,
    <FashionLayout key="2" />,
    <Fashion key="3" />,
    <FabricMaterialSelection key="4" />,
    <SketchesIllustrations key="5" />,
    <PortfolioSection key="6" />,
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? components.length - 1 : prevSlide - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === components.length - 1 ? 0 : prevSlide + 1));
  };

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <button
        className="absolute left-4 text-white text-4xl z-10 focus:outline-none"
        onClick={handlePrevSlide}
      >
        &#8249;
      </button>
      <div className="grid grid-cols-1 gap-4 w-full max-w-6xl transform scale-25 md:scale-50 lg:scale-75">
        {components.map((component, index) => (
          <div
            key={index}
            className={`relative bg-gray-200 p-4 rounded-lg shadow-lg ${
              index === currentSlide ? 'opacity-100' : 'opacity-25'
            }`}
          >
            <div className="absolute top-2 left-2 text-white font-bold">{index + 1}</div>
            {component}
          </div>
        ))}
      </div>
      <button
        className="absolute right-4 text-white text-4xl z-10 focus:outline-none"
        onClick={handleNextSlide}
      >
        &#8250;
      </button>
    </div>
  );
};

export default PortfolioSlider;