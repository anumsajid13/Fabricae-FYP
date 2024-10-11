"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const BottomBar = () => {
  return (
    <div className="h-20 fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl py-4 px-3 flex items-center justify-around w-fit text-xl">
      {/* Chat Section */}
      <div className="flex items-center transition-opacity duration-300 px-8">
        <Image
          src="/chat.png"
          alt="Chat Icon"
          width={30}
          height={30}
          className="mr-2"
        />
        <p className="text-gray-700 cursor-pointer">Chat</p>
      </div>
      <div className="border-l-2 border-black h-6" />

      {/* Profile Section */}
      <div className="flex items-center transition-opacity duration-300 px-8">
        <Image
          src="/profile.png"
          alt="Profile Icon"
          width={30}
          height={30}
          className="mr-2"
        />
        <p className="text-gray-700 cursor-pointer">
          Profile
        </p>
      </div>
      <div className="border-l-2 border-black h-6" />

      {/* Create Section */}
      <div className="flex items-center transition-opacity duration-300 px-8">
        <Image
          src="/create.png"
          alt="Create Icon"
          width={30}
          height={30}
          className="mr-2"
        />
        <Link href="/ImageGenerator">
          <p className="text-gray-700 cursor-pointer">
            Create
          </p>
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
