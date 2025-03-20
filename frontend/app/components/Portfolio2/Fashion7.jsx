import React from "react";

export const Resume = () => {
    return (
      <div className="w-[830px] flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
        <div className="max-w-4xl w-full border border-black p-6 text-center">
          <h2 className="text-6xl font-serif font-bold">MY RESUME</h2>
          <div className="grid grid-cols-3 gap-6 mt-8">
            {/* Education */}
            <div>
              <h3 className="text-3xl italic font-serif">Education</h3>
              <p className="text-xl font-bold mt-4">2007 - 2011</p>
              <p>Mention the institution</p>
              <p>List your studies here</p>
            </div>
            {/* Experience */}
            <div>
              <h3 className="text-3xl italic font-serif">Experience</h3>
              <p className="text-xl font-bold mt-4">2018 - 2022</p>
              <p>Mention the company</p>
              <p>Describe your job here</p>
            </div>
            {/* Skills */}
            <div>
              <h3 className="text-3xl italic font-serif">Skills</h3>
              <ul className="list-disc list-inside text-left mt-4">
                <li>Pattern making</li>
                <li>Construction</li>
                <li>Fashion design</li>
                <li>Apparel design</li>
                <li>Design software</li>
                <li>Accessories</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };