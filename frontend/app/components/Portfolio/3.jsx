import React from "react";

const Fashion = () => {
  return (
    <div className="bg-[url('/Picture7.jpg')] bg-cover bg-center min-h-screen flex items-center justify-center">
      <div className="w-[80%] bg-[#a3846f] bg-opacity-90 p-8 flex flex-col md:flex-row gap-6">
        {/* Left Section with Image */}
        <div className="flex-1 flex justify-center">
          <img src="/Picture5.jpg" alt="Fashion Introduction" className="rounded-lg" />
        </div>
        {/* Right Section with Text */}
        <div className="flex-1 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Introduction</h2>
          <p className="text-lg">
            Start with a brief introduction about yourself as a fashion designer,
            highlighting your background, education, and relevant experience.
            Include a professional photo or a creative self-portrait to personalize
            your portfolio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fashion;
