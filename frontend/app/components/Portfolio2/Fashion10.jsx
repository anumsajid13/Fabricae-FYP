import React from "react";

export const Project1 = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4"> {/* Reduced padding */}
        <div className="max-w-4xl w-full border border-black p-4 h-96 "> {/* Reduced padding and added overflow-y-auto */}
          <h2 className="text-4xl font-serif font-bold text-center">PROJECT 1</h2> {/* Reduced font size */}
          <p className="text-center text-lg mt-3"> {/* Reduced font size and margin */}
            Jupiter is a gas giant and the biggest planet in the Solar System.
            It's the fourth-brightest object in the night sky. It was named after
            the Roman god of the skies and lightning.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6 border border-black p-2"> {/* Reduced margin-top and padding */}
            <img
              src="/pro1.jpg"
              alt="Fashion Design Work 1"
              className="w-full h-48 object-cover border"
            />
            <img
              src="/pro2.jpg"
              alt="Fashion Design Work 2"
              className="w-full h-48 object-cover border"
            />
          </div>
        </div>
      </div>
    );
  };