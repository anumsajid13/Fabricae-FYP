"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "../ui/background-beams";
import { PlaceholdersAndVanishInputDemo } from "../ImageGenerator/searchbar";
import FileUploadModal from "../ImageGenerator/FileUploadModal";
import Link from "next/link";

export function BackgroundBeamsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typedPrompt, setTypedPrompt] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handlePromptChange = (input: string) => {
    setTypedPrompt(input);
  };

  return (
    <div className="h-full w-full rounded-md bg-[#E7E4D8] relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-1xl mx-auto p-4">
        <h1 className="mt-10 relative z-10 text-lg md:text-7xl bg-clip-text text-black text-center font-custom">
          Let's Design Patterns!
        </h1>
        <br />
        <p className="text-black max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          {typedPrompt || (
            <>
              Welcome to Fabricae, your go-to platform for innovative design
              solutions. We offer scalable and customizable tools to help you
              bring your creative visions to life. Whether you&apos;re crafting
              stunning graphics, developing unique patterns, or building
              captivating projects, Fabricae is here to support your creative
              journey.
            </>
          )}
        </p>
        <br />
        <PlaceholdersAndVanishInputDemo onPromptChange={handlePromptChange} />
        <Link href="/SketchToImage">
          <p
            className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10 underline cursor-pointer"
            onClick={openModal}
          >
            Want to convert your own pencil sketch?
          </p>
        </Link>
      </div>
      <BackgroundBeams />
    </div>
  );
}
