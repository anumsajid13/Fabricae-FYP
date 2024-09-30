// components/landingPage/Body.js
import Image from "next/image";
import React from 'react';

export default function Body() {
  return (
    <div className="w-full custom-height overflow-hidden bg-slate-700 flex">
      <div className="w-3/5 bg-black flex flex-col justify-center items-start p-8"> {/* 60% width with a different background color */}
        <div className="flex items-center mb-4 custom-left-margin" style={{ fontFamily: 'Agrandir' }}>
          <h1 className="text-white text-5xl font-normal">
            Create,
          </h1>
          <Image 
            src="/image.png" // Replace with your small image path
            alt="Small Icon" // Provide an alt text for accessibility
            width={200} // Set the width of the small image
            height={200} // Set the height of the small image
            className="ml-2" // Add margin-left for spacing
          />
        </div>
        <h2 className="text-white text-5xl font-normal mb-4 custom-left-margin" style={{ fontFamily: 'Agrandir' }}>
          customize, and
        </h2>
        <h3 className="text-white text-5xl font-normal mb-4 custom-left-margin" style={{ fontFamily: 'Agrandir' }}>
          connect—your design
        </h3>
        <h4 className="text-white text-5xl font-normal custom-left-margin" style={{ fontFamily: 'Agrandir' }}>
          journey starts here.
        </h4>

          {/* Paragraph */}
          <p className="text-white text-base font-thin mt-4 custom-left-margin" style={{ fontFamily: 'PP Telegraf' }}>
          Building a design takes time and effort. With our app, you can create stunning designs, customize them to perfection, and connect with the right opportunities. Success is a journey, and we’re here to help you every step of the way.
        </p>

          {/* Flex container for "Learn more" text and icon */}
        <div className="flex items-center mt-4 custom-left-margin">
          <p className="text-white text-base font-normal cursor-pointer" style={{ fontFamily: 'PP Telegraf', textDecoration: 'underline', textDecorationColor: 'white' }}>
            Learn more
          </p>
          <Image 
            src="/scroll.png" // Replace with your icon image path
            alt="Learn More Icon" // Provide an alt text for accessibility
            width={40} // Set the width of the icon
            height={40} // Set the height of the icon
            className="ml-2" // Add margin-left for spacing
          />
        </div>

      </div>
      <div className="relative w-2/5"> {/* Make the div relative for positioning the image */}
        <Image 
          src="/Fabricae.jpg" // Replace with your image path
          alt="Cover Image" // Provide an alt text for accessibility
          layout="fill" // This will make the image fill the parent div
          objectFit="cover" // This ensures the image covers the div without distortion
          className="bg-black" // Add this class if you want a fallback color
        />
      </div>
    </div>
  );
}
