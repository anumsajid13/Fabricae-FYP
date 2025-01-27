"use client";
import Image from "next/image";
import React from 'react';

export default function Body() {
  return (
    <div style={{marginLeft:"5%"}}className="font-[Agrandir] w-full h-auto overflow-hidden bg-[#E7E4D8] flex flex-col lg:flex-row  lg:justify-center gap-[0%]"> {/* Flex direction changes based on screen size */}
      
      {/* Text Section */}
      <div style={{ marginTop:"-7%"}}className="lg:w-3/5 w-full  flex flex-col justify-center items-start p-8"> {/* Full width on small screens */}
        <div className="flex items-center mb-4 font-custom"    style={{height:"10%"}}>
          <h1 className="text-[#822538]  text-7xl ">
            Create
          </h1>
          <Image
            src="/image.svg"
            alt="Small Icon"
            width={200}
            height={50}
            className="ml-2"
          />
        </div>
        <h4 className="text-[#822538]  text-7xl font-custom"  >
          customize, and
        </h4>
        <h4 className="text-black text-6xl font-custom" >
          <span className="text-[#822538]">connect </span>—your design
        </h4>
        <h4 className="text-black text-6xl font-custom " >
          journey starts here.
        </h4>

        <p className="text-black text-base mt-4  font-para font-normal" >
          Building a design takes time and effort. With our app, you can create stunning designs, customize them to perfection, and connect with the right opportunities. Success is a journey, and we’re here to help you every step of the way.
        </p>

        <div className="flex items-center mt-4 ">
          <p className="text-black text-base  cursor-pointer font-custom" style={{ textDecoration: 'underline', textDecorationColor: 'black' }}>
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
      <div style={{marginRight:"-25%"}}className="relative lg:w-[90%] w-full h-auto lg:h-auto lg:mt-2 hidden lg:block  "> {/* Image hidden on small screens */}
        <Image 
          src="/landing1.svg"
          alt="Cover Image"
          width={1000}
          height={700}
          className="bg-[#E7E4D8]"
        />
      </div>
    </div>
  );
}
