"use client";

import Image from "next/image";
import { FaSave } from "react-icons/fa";
import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Ensure this is defined elsewhere in your project
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

type Card = {
  title: string;
  src: string;
};

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <ToastContainer /> 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-9xl mx-auto md:px-8 w-[88%] mt-10">
        {cards.map((card, index) => (
          <CardComponent
            key={card.title}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </div>
    </>
  );
}

const CardComponent = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: Card; 
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative overflow-hidden w-full h-60 md:h-96 transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
      style={{ backgroundColor: "black" }} 
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        className="object-cover"
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-xl md:text-2xl font-medium text-white">
          {card.title}
        </div>
      </div>
    </div>
  )
);

CardComponent.displayName = "CardComponent"; 
