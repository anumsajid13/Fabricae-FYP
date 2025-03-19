import React from "react";

export const AboutMe = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
        <div className="max-w-4xl w-full grid grid-cols-2 gap-8 items-center">
          {/* Left Section - Image */}
          <div className="border border-black p-1"> {/* Reduced padding */}
            <img
              src="/fourth.jpg"
              alt="Designer portrait"
              className="w-3/4 h-auto object-cover border mx-auto" // Reduced width and centered
            />
          </div>
          {/* Right Section - Text */}
          <div className="text-center">
            <p className="italic text-gray-600 text-xl">- SUSAN BONES -</p>
            <div className="border border-black inline-block p-4 mt-4">
              <p className="text-5xl font-bold">01</p>
            </div>
            <h2 className="text-6xl font-serif font-bold mt-4">ABOUT ME</h2>
            <p className="text-xl mt-4">
              You can enter a subtitle here if you need it
            </p>
            <p className="italic mt-6 text-gray-600 text-xl">- 2022 -</p>
          </div>
        </div>
      </div>
    );
  };