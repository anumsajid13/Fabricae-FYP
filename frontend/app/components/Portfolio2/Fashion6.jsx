import React from "react";

export const Research = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4"> {/* Reduced padding */}
        <div className="max-w-3xl w-full border border-black p-3 text-center h-96 overflow-y-auto"> {/* Added overflow-y-auto for scrollable content */}
          <h2 className="text-3xl font-serif font-bold">RESEARCH</h2> {/* Reduced font size */}
          <div className="grid grid-cols-2 gap-2 mt-3"> {/* Reduced gap and margin */}
            <img
              src="/research1.jpg"
              alt="Research process 1"
              className="w-full h-24 object-cover border"
            />
            <img
              src="/research2.jpg"
              alt="Research process 2"
              className="w-full h-24 object-cover border"
            />
          </div>
          <p className="text-sm mt-3"> {/* Reduced font size and margin */}
            New collection design inspiration can come from a variety of
            unexpected places. By focusing on the two sorts of research for the
            design process, you can follow this formula:
          </p>
          <ul className="text-sm text-left list-disc list-inside mt-2"> {/* Reduced font size and margin */}
            <li>
              Gathering the resources, which include fabrics, trims, and
              fastenings, to create concrete, practical aspects for your
              collection.
            </li>
            <li>
              Establishing the concept, which is the visual inspiration for the
              design process. This will assist you in creating a unique persona
              for your creative endeavors.
            </li>
          </ul>
        </div>
      </div>
    );
  };