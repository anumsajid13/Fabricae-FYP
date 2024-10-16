import Image from "next/image";
import React from 'react';

export default function Body() {
  return (
    <div className="w-full h-auto overflow-hidden bg-black flex flex-col lg:flex-row  lg:justify-center gap-[0%]"> {/* Flex direction changes based on screen size */}
      
      {/* Text Section */}
      <div className="lg:w-3/5 w-full  flex flex-col justify-center items-start p-8"> {/* Full width on small screens */}
        <div className="flex items-center mb-4 font-custom">
          <h1 className="text-white text-7xl ">
            Create,
          </h1>
          <Image
            src="/image.png"
            alt="Small Icon"
            width={200}
            height={200}
            className="ml-2"
          />
        </div>
        <h2 className="text-white text-7xl mb-4 font-custom " >
          customize, and
        </h2>
        <h3 className="text-white text-6xl mb-4 font-custom" >
          connect—your design
        </h3>
        <h4 className="text-white text-6xl font-custom " >
          journey starts here.
        </h4>

        <p className="text-white text-base mt-4 font-custom3" >
          Building a design takes time and effort. With our app, you can create stunning designs, customize them <br/>to perfection, and connect with the right opportunities. Success is a journey, and we’re here to help you every step of the way.
        </p>

        <div className="flex items-center mt-4 ">
          <p className="text-white text-base  cursor-pointer font-custom3" style={{ textDecoration: 'underline', textDecorationColor: 'white' }}>
            Learn more
          </p>
          <Image 
            src="/scroll.png"
            alt="Learn More Icon"
            width={40}
            height={40}
            className="ml-2"
          />
        </div>
      </div>

      {/* Image Section: Hidden on smaller screens */}
      <div className="relative lg:w-[30%] w-full h-96 lg:h-auto lg:mt-2 hidden lg:block  "> {/* Image hidden on small screens */}
        <Image 
          src="/landing.svg"
          alt="Cover Image"
          width={500}
          height={300}
          className="bg-black"
        />
      </div>
    </div>
  );
}
