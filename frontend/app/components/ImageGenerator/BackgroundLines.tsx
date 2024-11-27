"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "../ui/background-beams";
import { PlaceholdersAndVanishInputDemo } from "../ImageGenerator/searchbar";
import FileUploadModal from "../ImageGenerator/FileUploadModal";
import Link from "next/link";

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
      <div className="max-w-1xl mx-auto p-4">
        <h1 className=" mt-10 relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-customGreen to-customPurple text-center font-custom">
          Let's Design Patterns!
        </h1>
        <br></br>
        <p className="text-black max-w-lg mx-auto my-2 text-sm text-center relative z-10">
        Welcome to Fabricae, your go-to platform for innovative design solutions. 
        We offer scalable and customizable tools to help you bring 
        your creative visions to life. Whether you&apos;re crafting stunning graphics, 
        developing unique patterns, or building captivating projects, Fabricae is here 
        to support your creative journey.

        </p>
        <br></br>
        <PlaceholdersAndVanishInputDemo />
        <Link href="/SketchToImage">
        <p
          className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10 underline cursor-pointer"
          onClick={openModal}
        >
          want to convert your own pencil sketch?
        </p>
        </Link>
      </div>
      <BackgroundBeams />
    </div>
  );
}
