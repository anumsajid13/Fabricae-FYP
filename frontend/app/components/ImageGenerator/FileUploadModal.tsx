"use client";

import React, { useState } from "react";
import { BackgroundBeams } from "../ui/background-beams";
import FileUploadDemo from "./fileupload";
import Dropdown from "../ui/Dropdown";
import { ToastContainer } from 'react-toastify';

const FileUploadModal: React.FC = () => {
  
  return (
    <div className="h-[570px] w-full rounded-md bg-[#E7E4D8] relative flex flex-col items-center justify-center antialiased">
    {/* Background Video */}
    <video
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
      src="/Gradient.mp4"
      autoPlay
      loop
      muted
    ></video>

    {/* Main Content */}
    <div className="relative z-10 max-w-1xl mx-auto p-4 ">
      <h1 className="font-semibold mt-9 text-lg md:text-6xl bg-clip-text text-white text-center font-custom">
        Upload Your Sketch
      </h1>
      <br />
      <br />

      {/* File Upload Component */}
      <div className="max-w-full mx-auto">
        <ToastContainer />
        <FileUploadDemo />
      </div>
    </div>

    {/* Background Beams */}
    {/* <BackgroundBeams /> */}
  </div>
  
  );
};

export default FileUploadModal;
