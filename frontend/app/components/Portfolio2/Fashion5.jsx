import React from "react";

export const WhatIDo = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4"> {/* Reduced padding */}
        <div className="max-w-4xl w-full grid grid-cols-2 gap-6 items-center border border-black p-4 h-96 overflow-y-auto"> {/* Reduced gap, padding, and added overflow-y-auto */}
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold">WHAT I DO</h2> {/* Reduced font size */}
            <p className="text-base mt-3"> {/* Reduced font size and margin */}
              Venus has a beautiful name and is the second planet from the Sun.
              It’s terribly hot—even hotter than Mercury—and its atmosphere is
              extremely poisonous. It’s the second-brightest natural object in the
              night sky after the Moon.
            </p>
            <p className="text-base mt-3"> {/* Reduced font size and margin */}
              It’s the closest planet to the Sun and the smallest one in the Solar
              System—it’s only a bit larger than our Moon. The planet’s name has
              nothing to do with the liquid metal, since Mercury was named after
              the Roman messenger god.
            </p>
          </div>
          <div className="border border-black p-1">
            <img
              src="/what i do.jpg"
              alt="Fashion model"
              className="w-full h-48 object-cover border"
            />
          </div>
        </div>
      </div>
    );
  };
