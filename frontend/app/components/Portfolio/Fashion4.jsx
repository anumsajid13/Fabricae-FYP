import React from "react";

export const  FabricMaterialSelection = () =>{
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/Picture7.jpg')" }}
    >
      <div className="bg-[#b4967a] p-8 m-16 rounded-lg grid md:grid-cols-2">
      <div className="text-white">
          <h1 className="text-4xl font-semibold mb-4">Fabric and Material Selection</h1>
          <p className="text-lg mb-6">
            Present a selection of fabric swatches, material samples, and texture
            references that you have chosen for your collection. Explain why you
            selected these materials and how they contribute to the overall aesthetic
            and functionality of your designs.
          </p>
          <h2 className="font-bold text-xl">NEW FASHION</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/Picture12.jpg"
            alt="Fashion 1"
            className="rounded-lg object-cover w-full h-full"
          />
          <img
            src="/Picture13.jpg"
            alt="Fashion 2"
            className="rounded-lg object-cover w-full h-full"
          />
          <img
            src="/Picture14.jpg"
            alt="Fashion 3"
            className="rounded-lg object-cover w-full h-full"
          />
          <img
            src="/Picture15.jpg"
            alt="Fashion 4"
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

