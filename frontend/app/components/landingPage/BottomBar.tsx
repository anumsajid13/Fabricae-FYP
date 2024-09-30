// components/landingPage/BottomBar.js
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
const BottomBar = () => {
 

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-[50px] shadow-2xl p-6 flex items-center justify-around w-3/5">
      {/* Chat Section */}
      <div className={`flex items-center transition-opacity duration-300 `}>
        <Image 
          src="/chat.png" // Replace with your chat icon SVG file name
          alt="Chat Icon"
          width={50} 
          height={50}
        />
        <p className="text-gray-700 cursor-pointer">Chat</p>
      </div>
      <div className={`border-l-2 border-black h-6 mx-4 transition-opacity duration-300 `} />

      {/* Profile Section */}
      <div className={`flex items-center transition-opacity duration-300 `}>
        <Image 
          src="/profile.png" // Replace with your profile icon SVG file name
          alt="Profile Icon"
          width={50}
          height={50}
        />
        <p className="text-gray-700 cursor-pointer">Profile</p>
      </div>
      <div className={`border-l-2 border-black h-6 mx-4 transition-opacity duration-300 `} />

         {/* Chat Section */}
      <div className={`flex items-center transition-opacity duration-300 `}>
        <Image 
          src="/profile.png" // Replace with your profile icon SVG file name
          alt="Create Icon"
          width={50}
          height={50}
        />
        <Link href='/ImageGenerator'>
        <p className="text-gray-700 cursor-pointer">Create</p>
        </Link>      
      </div>
    
    </div>
  );
};

export default BottomBar;
