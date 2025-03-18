import React from "react";

export const ApparelPortfolio = () => {

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
      <div className="max-w-4xl w-full grid grid-cols-2 gap-8 items-center">
        {/* Left Section */}
        <div className="text-left">
          <p className="italic text-gray-600 text-center text-xl">
            - SUSAN BONES -
          </p>
          <h1 className="text-6xl font-serif font-bold leading-tight">
            APPAREL DESIGNER
          </h1>
          <h2 className="text-5xl italic font-serif mt-2">Portfolio</h2>
          <p className="text-xl mt-4">Here is where your presentation begins</p>
          <p className="italic mt-6 text-gray-600 text-center text-xl">
            - 2022 -
          </p>
        </div>
        {/* Right Section */}
        <div className="border border-black p-2">
          <div className="grid grid-rows-3 gap-2">
            <img
              src="/first.jpg"
              alt="Model on stairs"
              className="w-full h-36 object-cover border"
            />
            <img
              src="/second.jpg"
              alt="Close-up fabric"
              className="w-full h-36 object-cover border"
            />
            <img
              src="/third.jpg"
              alt="Decorative vase"
              className="w-full h-36 object-cover border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
