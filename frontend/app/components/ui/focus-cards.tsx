
"use client";
import { storage } from "../../firebase"; 
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { FaSave } from "react-icons/fa";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// Updated Card component with onSave handler
export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    onSave,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onSave: (card: any) => void; // Pass the card data for saving
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        className="object-cover absolute inset-0"
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
          {card.title}
        </div>
      </div>

      {/* Save icon that appears on hover */}
      {hovered === index && (
        <div
          className="absolute top-4 right-4 text-white cursor-pointer"
          onClick={() => onSave(card)} // Pass card data to onSave handler
        >
          <FaSave size={24} /> {/* Save icon */}
        </div>
      )}
    </div>
  )
);

Card.displayName = "Card";

type Card = {
  title: string;
  src: string;
};

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Handle save action
  // Handle save action
  const handleSave = async (card: Card) => {
    try {
      // Create a reference to the image in Firebase Storage
      const storageRef = ref(storage, `images/${card.title}`);

      // Fetch the image data as a Blob or a Data URL
      const response = await fetch(card.src);
      const blob = await response.blob();

      // Convert the Blob to a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // Upload the base64 string to Firebase Storage
        await uploadString(storageRef, base64String, "data_url");

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image saved. Firebase URL:", downloadURL);

        // Prepare the metadata to send to the backend
        const metadata = {
          title: card.title,
          imageUrl: downloadURL,
          username: "anum", 
          patternType: "prompt", 
        };

        // Send the metadata to your backend API
        const res = await fetch("http://localhost:5000/api/prompt-designs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadata),
        });

        if (!res.ok) {
          throw new Error("Failed to save prompt design in the database.");
        }

        const savedPromptDesign = await res.json();
        console.log("Prompt design saved:", savedPromptDesign);

        //success toast notification
        toast.success("Image successfully saved!");
      };
    } catch (error) {
      console.error("Error saving the image:", error);
    }
  };

  return (
     <>
      <ToastContainer /> 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-8xl mx-auto md:px-8 w-full mt-10">
        {cards.map((card, index) => (
          <Card
            key={card.title}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            onSave={handleSave} 
          />
        ))}
      </div>
    </>
  );
}
