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
        <div className="border border-black p-1"> {/* Reduced padding */}
          <img
            src="/fourth.jpg"
            alt="Designer portrait"
            className="w-3/4 h-auto object-cover border mx-auto" // Reduced width and centered
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#efe8e4] p-6 space-y-16">
      <div className="max-w-4xl w-full text-center space-y-6">
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
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4"> {/* Reduced padding */}
      <div className="max-w-4xl w-full grid grid-cols-2 gap-6 items-center border border-black p-4 h-96 overflow-y-auto"> {/* Reduced gap, padding, and added overflow-y-auto */}
        <div className="text-center">
          <h2 className="text-4xl font-serif font-bold">WHAT I DO</h2> {/* Reduced font size */}
          <p className="text-base mt-3"> {/* Reduced font size and margin */}
            Venus has a beautiful name and is the second planet from the Sun.
            It’s terribly hot—even hotter than Mercury—and its atmosphere is
            extremely poisonous. It’s the second-brightest natural object in the
            night sky after the Moon.
          </p>
          <p className="text-base mt-3"> {/* Reduced font size and margin */}
            It’s the closest planet to the Sun and the smallest one in the Solar
            System—it’s only a bit larger than our Moon. The planet’s name has
            nothing to do with the liquid metal, since Mercury was named after
            the Roman messenger god.
          </p>
        </div>
        <div className="border border-black p-1"> 
          <img
            src="/what i do.jpg"
            alt="Fashion model"
            className="w-full h-48 object-cover border"
          />
        </div>
      </div>
    </div>
  );
};

export const Research = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4"> {/* Reduced padding */}
      <div className="max-w-3xl w-full border border-black p-3 text-center h-96 overflow-y-auto"> {/* Added overflow-y-auto for scrollable content */}
        <h2 className="text-3xl font-serif font-bold">RESEARCH</h2> {/* Reduced font size */}
        <div className="grid grid-cols-2 gap-2 mt-3"> {/* Reduced gap and margin */}
          <img
            src="/research1.jpg"
            alt="Research process 1"
            className="w-full h-24 object-cover border" 
          />
          <img
            src="/research2.jpg"
            alt="Research process 2"
            className="w-full h-24 object-cover border" 
          />
        </div>
        <p className="text-sm mt-3"> {/* Reduced font size and margin */}
          New collection design inspiration can come from a variety of
          unexpected places. By focusing on the two sorts of research for the
          design process, you can follow this formula:
        </p>
        <ul className="text-sm text-left list-disc list-inside mt-2"> {/* Reduced font size and margin */}
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
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4"> {/* Reduced padding */}
      <div className="max-w-4xl w-full grid grid-cols-2 gap-6 items-center border border-black p-4 h-96 overflow-y-auto"> {/* Reduced gap, padding, and added overflow-y-auto */}
        {/* Left Section - Image */}
        <div>
          <img
            src="/mywork.jpg"
            alt="Fashion Design Work"
            className="w-full h-48 object-cover border" 
          />
        </div>
        {/* Right Section - Text */}
        <div className="text-center">
          <p className="italic text-gray-600 text-base">- SUSAN BONES -</p> {/* Reduced font size */}
          <h2 className="text-4xl font-serif font-bold"> {/* Reduced font size */}
            MY WORK - <span className="italic">Area 1</span>
          </h2>
          <p className="italic text-gray-600 text-base mt-3">- 2022 -</p> {/* Reduced font size and margin */}
        </div>
      </div>
    </div>
  );
};

export const ProjectInDepth = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4">
      <div className="max-w-4xl w-full border border-black p-4">
        <h2 className="text-4xl font-serif font-bold text-center">
          PROJECT 1: IN DEPTH
        </h2>
        <div className="grid grid-cols-2 gap-8 mt-6"> {/* Increased gap between columns */}
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-black w-32 h-32 flex items-center justify-center">
              <img
                src="/image1.jpg" 
                alt="Image 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="border border-black w-32 h-32 flex items-center justify-center">
              <img
                src="/image2.jpg" 
                alt="Image 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="border border-black w-32 h-32 flex items-center justify-center">
              <img
                src="/image3.jpg" 
                alt="Image 3"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="border border-black w-32 h-32 flex items-center justify-center">
              <img
                src="/image4.jpg" 
                alt="Image 4"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Text Content */}
          <div className="flex flex-col justify-center pl-6"> {/* Added left padding for gap */}
            <h3 className="text-2xl italic font-serif">Jupiter</h3>
            <p className="text-lg">It’s the biggest planet in the Solar System</p>
            <h3 className="text-2xl italic font-serif mt-4">Saturn</h3>
            <p className="text-lg">Saturn is a gas giant and has several rings</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export const Project1 = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4"> {/* Reduced padding */}
      <div className="max-w-4xl w-full border border-black p-4 h-96 "> {/* Reduced padding and added overflow-y-auto */}
        <h2 className="text-4xl font-serif font-bold text-center">PROJECT 1</h2> {/* Reduced font size */}
        <p className="text-center text-lg mt-3"> {/* Reduced font size and margin */}
          Jupiter is a gas giant and the biggest planet in the Solar System.
          It's the fourth-brightest object in the night sky. It was named after
          the Roman god of the skies and lightning.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6 border border-black p-2"> {/* Reduced margin-top and padding */}
          <img
            src="/pro1.jpg"
            alt="Fashion Design Work 1"
            className="w-full h-48 object-cover border" 
          />
          <img
            src="/pro2.jpg"
            alt="Fashion Design Work 2"
            className="w-full h-48 object-cover border" 
          />
        </div>
      </div>
    </div>
  );
};

export const ContactMe = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4">
      <div className="max-w-4xl w-full border border-black p-4 h-96 "> {/* Reduced padding and added overflow-y-auto */}
        {/* Heading */}
        <h2 className="text-3xl font-serif font-bold text-center">CONTACT ME</h2> {/* Reduced font size */}

        {/* Call-to-Action Message */}
        <p className="text-center text-base mt-3"> {/* Reduced font size and margin */}
          If you're interested in collaborating or have any questions, feel free to reach out! I'd love to hear from you.
        </p>

        {/* Contact Information */}
        <div className="mt-4 space-y-3"> {/* Reduced margin and gap */}
          {/* Email Section */}
          <div className="text-center">
            <h3 className="text-xl font-serif font-bold">Email</h3> {/* Reduced font size */}
            <a
              href="mailto:example@example.com"
              className="text-base text-blue-600 hover:underline"
            >
              example@example.com
            </a>
          </div>

          {/* LinkedIn Section */}
          <div className="text-center">
            <h3 className="text-xl font-serif font-bold">LinkedIn</h3> {/* Reduced font size */}
            <a
              href="https://www.linkedin.com/in/example"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-blue-600 hover:underline" 
            >
              linkedin.com/in/example
            </a>
          </div>

          {/* Additional Information */}
          <div className="text-center">
            <h3 className="text-xl font-serif font-bold">Let's Connect</h3> {/* Reduced font size */}
            <p className="text-base"> {/* Reduced font size */}
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
          </div>
        </div>

        {/* Optional: Social Media Icons */}
        <div className="flex justify-center mt-4 space-x-3"> {/* Reduced margin and gap */}
          <a
            href="https://twitter.com/example"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5" 
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.94 13.94 0 011.67 3.148a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.934 4.934 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 14.01-7.507 14.01-14.013 0-.213-.005-.426-.015-.637A10.025 10.025 0 0024 4.557z" />
            </svg>
          </a>
          <a
            href="https://github.com/example"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5" 
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.042.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};