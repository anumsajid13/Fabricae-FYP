import React from "react";

export const MyWorkArea1 = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4"> {/* Reduced padding */}
        <div className="max-w-4xl w-full grid grid-cols-2 gap-6 items-center border border-black p-4 h-96 overflow-y-auto"> {/* Reduced gap, padding, and added overflow-y-auto */}
          {/* Left Section - Image */}
          <div>
            <img
              src="/mywork.jpg"
              alt="Fashion Design Work"
              className="w-full h-48 object-cover border"
            />
          </div>
          {/* Right Section - Text */}
          <div className="text-center">
            <p className="italic text-gray-600 text-base">- SUSAN BONES -</p> {/* Reduced font size */}
            <h2 className="text-4xl font-serif font-bold"> {/* Reduced font size */}
              MY WORK - <span className="italic">Area 1</span>
            </h2>
            <p className="italic text-gray-600 text-base mt-3">- 2022 -</p> {/* Reduced font size and margin */}
          </div>
        </div>
      </div>
    );
  };