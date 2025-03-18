import React from "react";

export const ProjectInDepth = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4">
        <div className="max-w-4xl w-full border border-black p-4">
          <h2 className="text-4xl font-serif font-bold text-center">
            PROJECT 1: IN DEPTH
          </h2>
          <div className="grid grid-cols-2 gap-8 mt-6"> {/* Increased gap between columns */}
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-black w-32 h-32 flex items-center justify-center">
                <img
                  src="/image1.jpg"
                  alt="Image 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="border border-black w-32 h-32 flex items-center justify-center">
                <img
                  src="/image2.jpg"
                  alt="Image 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="border border-black w-32 h-32 flex items-center justify-center">
                <img
                  src="/image3.jpg"
                  alt="Image 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="border border-black w-32 h-32 flex items-center justify-center">
                <img
                  src="/image4.jpg"
                  alt="Image 4"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Text Content */}
            <div className="flex flex-col justify-center pl-6"> {/* Added left padding for gap */}
              <h3 className="text-2xl italic font-serif">Jupiter</h3>
              <p className="text-lg">It’s the biggest planet in the Solar System</p>
              <h3 className="text-2xl italic font-serif mt-4">Saturn</h3>
              <p className="text-lg">Saturn is a gas giant and has several rings</p>
            </div>
          </div>
        </div>
      </div>
    );
  };