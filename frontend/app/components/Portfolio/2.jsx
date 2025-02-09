import React from "react";

const FashionLayout = () => {

    
  return (

<div
  style={{ backgroundImage: "url('/Picture7.jpg')" }}
  className="bg-cover bg-center min-h-screen flex items-center justify-center"
>

<div className="w-[80%] bg-[#a3846f] bg-opacity-90 p-8 flex flex-col md:flex-row gap-6">
{/* Left Section with Images */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          <img src="/Picture8.jpg" alt="Fashion 1" className="rounded-lg" />
          <img src="/Picture9.jpg" alt="Fashion 2" className="rounded-lg" />
          <img src="/Picture10.jpg" alt="Fashion 3" className="rounded-lg" />
          <img src="/Picture11.jpg" alt="Fashion 4" className="rounded-lg" />
        </div>
        {/* Right Section with Text */}
        <div className="flex-1 text-white">
          <h2 className="text-3xl font-bold mb-4">Technical Drawings</h2>
          <p className="text-lg">
            Demonstrate your technical proficiency by including detailed
            technical drawings of your garments. Show measurements, seam
            placements, construction details, and any unique features that make
            your designs stand out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FashionLayout;
