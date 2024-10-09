"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "../ui/background-beams";
import { PlaceholdersAndVanishInputDemo } from "../ImageGenerator/searchbar";
import FileUploadModal from "../ImageGenerator/FileUploadModal";

export function BackgroundBeamsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-full w-full rounded-md bg-black relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className=" mt-10 relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          Let's Design Motifs!
        </h1>
        <br></br>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
        Welcome to Fabricae, your go-to platform for innovative design solutions. 
        We offer reliable, scalable, and customizable tools to help you bring 
        your creative visions to life. Whether you&apos;re crafting stunning graphics, 
        developing unique patterns, or building captivating projects, Fabricae is here 
        to support your creative journey.

        </p>
        <br></br>
        <PlaceholdersAndVanishInputDemo />

        <p
          className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10 underline cursor-pointer"
          onClick={openModal}
        >
          want to convert your own pencil sketch?
        </p>
      </div>
      <BackgroundBeams />

      {/* File Upload Modal */}
      <FileUploadModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
