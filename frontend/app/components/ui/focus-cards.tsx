"use client";

import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Ensure this is defined elsewhere in your project
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "./delete-modal"; // Import the new modal
import { useDisclosure } from "@nextui-org/react";

type Card = {
  title: string;
  src: string;
};

export function FocusCards({ cards, onDelete }: { cards: Card[]; onDelete: (title: string) => void}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleDeleteClick = (card: Card) => {
    setSelectedCard(card);
    onOpen(); // Open the modal
  };

  const handleConfirmDelete = async () => {
    if (selectedCard) {
      await handleDelete(selectedCard.title, selectedCard.src);
      onDelete(selectedCard.title);
      setSelectedCard(null);
    }
    onClose(); // Close the modal
  };

  return (
    <>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-9xl mx-auto md:px-8 w-[88%] mt-10 z-15">
        {cards.map((card, index) => (
          <CardComponent
            key={card.title}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            onDelete={handleDeleteClick} 
          />
        ))}
      </div>

      <DeleteConfirmationModal 
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

const CardComponent = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    onDelete, 
  }: {
    card: Card;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onDelete: (card: Card) => void; 
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
      <Image src={card.src} alt={card.title} fill className="object-cover" />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-xl md:text-2xl font-medium text-white">{card.title}</div>
      </div>

      {/* Delete Icon */}
      <div
        className={cn(
          "absolute top-2 right-2 transition-opacity duration-300 cursor-pointer transform hover:scale-110",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onDelete(card)} // Call delete handler
      >
        <FaTrash size={26} color={"#822538"} />
      </div>
    </div>
  )
);

CardComponent.displayName = "CardComponent";

// Function to handle deleting the design from both Firebase Storage and MongoDB
const handleDelete = async (title: string, src: string) => {
  try {

    // Proceed to delete the design from MongoDB
    const res = await fetch("http://localhost:5000/api/prompt-designs/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error("Failed to delete the design from the database.");
    }

    const response = await res.json();
    console.log("Design deleted from database:", response);

    toast.success("Design successfully deleted!");
  } catch (error) {
    console.error("Error deleting the design:", error);
    toast.error("Error deleting the design.");
  }
};
