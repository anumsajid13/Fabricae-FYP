import React from "react";

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
