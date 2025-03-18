import React from "react";

export const AboutMe2 = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#efe8e4] p-6 space-y-16">
        <div className="max-w-4xl w-full text-center space-y-6">
          <h2 className="text-6xl font-serif font-bold">ABOUT ME</h2>
          <p className="text-xl max-w-3xl mx-auto">
            You can give a brief description of the topic you want to talk about
            here. For example, if you want to talk about Mercury, you can say that
            it's the smallest planet in the entire Solar System.
          </p>
          <div className="grid grid-cols-3 gap-4 border border-black p-4 max-w-3xl mx-auto">
            <img
              src="/aboutme1.jpg"
              alt="Sketching design"
              className="w-full h-48 object-cover border"
            />
            <img
              src="/aboutme2.jpg"
              alt="Cutting fabric"
              className="w-full h-48 object-cover border"
            />
            <img
              src="/aboutme3.jpg"
              alt="Pattern making"
              className="w-full h-48 object-cover border"
            />
          </div>
        </div>
      </div>
    );
  };