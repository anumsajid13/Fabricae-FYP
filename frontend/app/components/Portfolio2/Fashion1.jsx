import React from "react";

export const ApparelPortfolio = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
      <div className="max-w-4xl w-full grid grid-cols-2 gap-8 items-center">
        {/* Left Section */}
        <div className="text-left">
          <p className="italic text-gray-600 text-center text-xl">
            - SUSAN BONES -
          </p>
          <h1 className="text-6xl font-serif font-bold leading-tight">
            APPAREL DESIGNER
          </h1>
          <h2 className="text-5xl italic font-serif mt-2">Portfolio</h2>
          <p className="text-xl mt-4">Here is where your presentation begins</p>
          <p className="italic mt-6 text-gray-600 text-center text-xl">
            - 2022 -
          </p>
        </div>
        {/* Right Section */}
        <div className="border border-black p-2">
          <div className="grid grid-rows-3 gap-2">
            <img
              src="/first.jpg"
              alt="Model on stairs"
              className="w-full h-36 object-cover border"
            />
            <img
              src="/second.jpg"
              alt="Close-up fabric"
              className="w-full h-36 object-cover border"
            />
            <img
              src="/third.jpg"
              alt="Decorative vase"
              className="w-full h-36 object-cover border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AboutMe = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
      <div className="max-w-4xl w-full grid grid-cols-2 gap-8 items-center">
        {/* Left Section - Image */}
        <div className="border border-black p-2">
          <img
            src="/fourth.jpg"
            alt="Designer portrait"
            className="w-full h-auto object-cover border"
          />
        </div>
        {/* Right Section - Text */}
        <div className="text-center">
          <p className="italic text-gray-600 text-xl">- SUSAN BONES -</p>
          <div className="border border-black inline-block p-4 mt-4">
            <p className="text-5xl font-bold">01</p>
          </div>
          <h2 className="text-6xl font-serif font-bold mt-4">ABOUT ME</h2>
          <p className="text-xl mt-4">
            You can enter a subtitle here if you need it
          </p>
          <p className="italic mt-6 text-gray-600 text-xl">- 2022 -</p>
        </div>
      </div>
    </div>
  );
};

{
  /* Second About Me Section */
}

export const AboutMe2 = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#efe8e4] p-6 space-y-16">
      <div className="max-w-4xl w-full text-center space-y-6 pb-16">
        <h2 className="text-6xl font-serif font-bold">ABOUT ME</h2>
        <p className="text-xl max-w-3xl mx-auto">
          You can give a brief description of the topic you want to talk about
          here. For example, if you want to talk about Mercury, you can say that
          it's the smallest planet in the entire Solar System.
        </p>
        <div className="grid grid-cols-3 gap-4 border border-black p-4 max-w-3xl mx-auto">
          <img
            src="/aboutme1.jpg"
            alt="Sketching design"
            className="w-full h-48 object-cover border"
          />
          <img
            src="/aboutme2.jpg"
            alt="Cutting fabric"
            className="w-full h-48 object-cover border"
          />
          <img
            src="/aboutme3.jpg"
            alt="Pattern making"
            className="w-full h-48 object-cover border"
          />
        </div>
      </div>
    </div>
  );
};

export const MyServices = () => {
  const services = [
    {
      name: "Mercury",
      description: "It’s the closest planet to the Sun",
      image: "/service1.png",
    },
    {
      name: "Venus",
      description: "Venus is the second planet from the Sun",
      image: "/service2.png",
    },
    {
      name: "Mars",
      description: "Mars is actually a very cold place",
      image: "/service3.png",
    },
    {
      name: "Jupiter",
      description: "Jupiter is the biggest planet of them all",
      image: "/service4.png",
    },
    {
      name: "Saturn",
      description: "It’s composed of hydrogen and helium",
      image: "/service5.png",
    },
    {
      name: "Neptune",
      description: "It’s the farthest planet from the Sun",
      image: "/service5.png",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#efe8e4] p-6 space-y-8">
      <h2 className="text-6xl font-serif font-bold">MY SERVICES</h2>
      <div className="grid grid-cols-3 gap-8 max-w-5xl w-full text-center">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={service.image}
              alt={service.name}
              className="w-20 h-20 border border-black p-2"
            />
            <h3 className="text-2xl font-serif italic mt-4">{service.name}</h3>
            <p className="text-lg mt-2">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const WhatIDo = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
      <div className="max-w-4xl w-full grid grid-cols-2 gap-8 items-center border border-black p-6">
        <div className="text-center">
          <h2 className="text-6xl font-serif font-bold">WHAT I DO</h2>
          <p className="text-xl mt-4">
            Venus has a beautiful name and is the second planet from the Sun.
            It’s terribly hot—even hotter than Mercury—and its atmosphere is
            extremely poisonous. It’s the second-brightest natural object in the
            night sky after the Moon.
          </p>
          <p className="text-xl mt-4">
            It’s the closest planet to the Sun and the smallest one in the Solar
            System—it’s only a bit larger than our Moon. The planet’s name has
            nothing to do with the liquid metal, since Mercury was named after
            the Roman messenger god.
          </p>
        </div>
        <div className="border border-black p-2">
          <img
            src="/what i do.jpg"
            alt="Fashion model"
            className="w-full h-auto object-cover border"
          />
        </div>
      </div>
    </div>
  );
};

export const Research = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
      <div className="max-w-4xl w-full border border-black p-6 text-center">
        <h2 className="text-6xl font-serif font-bold">RESEARCH</h2>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <img
            src="/research1.jpg"
            alt="Research process 1"
            className="w-full h-auto object-cover border"
          />
          <img
            src="/research2.jpg"
            alt="Research process 2"
            className="w-full h-auto object-cover border"
          />
        </div>
        <p className="text-xl mt-6">
          New collection design inspiration can come from a variety of
          unexpected places. By focusing on the two sorts of research for the
          design process, you can follow this formula:
        </p>
        <ul className="text-xl text-left list-disc list-inside mt-4">
          <li>
            Gathering the resources, which include fabrics, trims, and
            fastenings, to create concrete, practical aspects for your
            collection.
          </li>
          <li>
            Establishing the concept, which is the visual inspiration for the
            design process. This will assist you in creating a unique persona
            for your creative endeavors.
          </li>
        </ul>
      </div>
    </div>
  );
};

export const Resume = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
      <div className="max-w-4xl w-full border border-black p-6 text-center">
        <h2 className="text-6xl font-serif font-bold">MY RESUME</h2>
        <div className="grid grid-cols-3 gap-6 mt-8">
          {/* Education */}
          <div>
            <h3 className="text-3xl italic font-serif">Education</h3>
            <p className="text-xl font-bold mt-4">2007 - 2011</p>
            <p>Mention the institution</p>
            <p>List your studies here</p>
          </div>
          {/* Experience */}
          <div>
            <h3 className="text-3xl italic font-serif">Experience</h3>
            <p className="text-xl font-bold mt-4">2018 - 2022</p>
            <p>Mention the company</p>
            <p>Describe your job here</p>
          </div>
          {/* Skills */}
          <div>
            <h3 className="text-3xl italic font-serif">Skills</h3>
            <ul className="list-disc list-inside text-left mt-4">
              <li>Pattern making</li>
              <li>Construction</li>
              <li>Fashion design</li>
              <li>Apparel design</li>
              <li>Design software</li>
              <li>Accessories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MyWorkArea1 = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
      <div className="max-w-4xl w-full grid grid-cols-2 gap-8 items-center border border-black p-6">
        {/* Left Section - Image */}
        <div>
          <img
            src="/mywork.jpg"
            alt="Fashion Design Work"
            className="w-full h-auto object-cover border"
          />
        </div>
        {/* Right Section - Text */}
        <div className="text-center">
          <p className="italic text-gray-600 text-xl">- SUSAN BONES -</p>
          <h2 className="text-5xl font-serif font-bold">
            MY WORK - <span className="italic">Area 1</span>
          </h2>
          <p className="italic text-gray-600 text-xl mt-4">- 2022 -</p>
        </div>
      </div>
    </div>
  );
};

export const ProjectInDepth = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
      <div className="max-w-4xl w-full border border-black p-6">
        <h2 className="text-5xl font-serif font-bold text-center">
          PROJECT 1: IN DEPTH
        </h2>
        <div className="grid grid-cols-2 gap-6 mt-8">
          {/* Image placeholders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-black w-32 h-32"></div>
            <div className="border border-black w-32 h-32"></div>
            <div className="border border-black w-32 h-32"></div>
          </div>
          {/* Text Content */}
          <div>
            <h3 className="text-2xl italic font-serif">Jupiter</h3>
            <p>It’s the biggest planet in the Solar System</p>
            <h3 className="text-2xl italic font-serif mt-4">Saturn</h3>
            <p>Saturn is a gas giant and has several rings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Project1 = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-6">
      <div className="max-w-4xl w-full border border-black p-6">
        <h2 className="text-5xl font-serif font-bold text-center">PROJECT 1</h2>
        <p className="text-center text-xl mt-4">
          Jupiter is a gas giant and the biggest planet in the Solar System.
          It's the fourth-brightest object in the night sky. It was named after
          the Roman god of the skies and lightning.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8 border border-black p-2">
          <img
            src="/pro1.jpg"
            alt="Fashion Design Work 1"
            className="w-full h-auto object-cover border"
          />
          <img
            src="/pro2.jpg"
            alt="Fashion Design Work 2"
            className="w-full h-auto object-cover border"
          />
        </div>
      </div>
    </div>
  );
};
