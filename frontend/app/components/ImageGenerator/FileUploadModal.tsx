"use client";

import React, { useState } from "react";
import { BackgroundBeams } from "../ui/background-beams";
import FileUploadDemo from "./fileupload";
import Dropdown from "../ui/Dropdown";
import { ToastContainer } from 'react-toastify';

const FileUploadModal: React.FC = () => {
  
  return (
    <div className="h-full w-full rounded-md bg-black relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-1xl mx-auto p-4">
        <h1 className="mt-2 relative z-10 text-lg md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-customGreen to-customPurple text-center font-custom">
          Upload Your Sketch
        </h1>
        <br />
        <br />

       
        {/* File Upload Component */}
        <div className="mt-6 max-w-full mx-auto">
          <ToastContainer />
          <FileUploadDemo  />
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default FileUploadModal;
