'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BottomBar = () => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-[50px] shadow-2xl p-4 sm:p-6 flex items-center justify-around w-11/12 sm:w-3/5">
      {/* Chat Section */}
      <div className="flex items-center transition-opacity duration-300">
        <Image 
          src="/chat.png"
          alt="Chat Icon"
          width={30} 
          height={30}
          className="mr-2"
        />
        <p className="text-gray-700 cursor-pointer text-sm sm:text-lg">Chat</p>
      </div>
      <div className="border-l-2 border-black h-6 mx-4" />

      {/* Profile Section */}
      <div className="flex items-center transition-opacity duration-300">
        <Image 
          src="/profile.png"
          alt="Profile Icon"
          width={30}
          height={30}
          className="mr-2"
        />
        <p className="text-gray-700 cursor-pointer text-sm sm:text-lg">Profile</p>
      </div>
      <div className="border-l-2 border-black h-6 mx-4" />

      {/* Create Section */}
      <div className="flex items-center transition-opacity duration-300">
        <Image 
          src="/create.png"
          alt="Create Icon"
          width={30} 
          height={30}
          className="mr-2"
        />
        <Link href='/ImageGenerator'>
          <p className="text-gray-700 cursor-pointer text-sm sm:text-lg">Create</p>
        </Link>      
      </div>
    </div>
  );
};

export default BottomBar;
