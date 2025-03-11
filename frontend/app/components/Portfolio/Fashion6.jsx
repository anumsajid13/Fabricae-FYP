import React from "react";

export const PortfolioSection =() => {
  return (
    <div className="bg-[url('/Picture7.jpg')] bg-cover bg-center min-h-screen flex justify-center items-center">
      <div className="bg-[#c2a18a] p-6 rounded-lg shadow-lg max-w-7xl flex flex-col md:flex-row items-center bg-opacity-80 h-[700px]">
        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 md:w-2/3">
          <div className="row-span-2">
            <img
              src="/Picture17.jpg"
              alt="Model 1"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <img
            src="/Picture18.jpg"
            alt="Model 2"
            className="w-full h-40 object-cover rounded-lg"
          />
          <img
            src="/Picture19.jpg"
            alt="Model 3"
            className="w-full h-40 object-cover rounded-lg"
          />
          <img
            src="/Picture20.jpg"
            alt="Model 4"
            className="col-span-2 w-full h-40 object-cover rounded-lg"
          />
        </div>

        {/* Text Content */}
        <div className="md:w-1/3 text-white p-6 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white">Client Work or Collaborations</h2>
          <p className="mt-4 text-white text-sm">
            If you have worked with clients or collaborated with other brands or artists,
            showcase the projects and highlight your role and contribution.
            Include any press clippings or media coverage related to these collaborations.
          </p>
          <div className="mt-6 text-lg font-bold">NEW FASHION</div>
        </div>
      </div>
    </div>
  );
};

