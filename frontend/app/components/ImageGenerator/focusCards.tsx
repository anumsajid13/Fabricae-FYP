"use client";
import React, { useEffect, useState } from "react";
import { FocusCards } from "../ui/focus-cards"; 
import './global.css';
import { useCardsStore } from "../../store/useCardsStore";

// Define the interface for the PromptDesign
interface PromptDesign {
  title: string;
  imageUrl: string;
  creationDate: Date;
  username: string;
  patternType: string;
  prompt: string;
}

export function FocusCardsDemo() {
  const [selectedTab, setSelectedTab] = useState<'explore' | 'myDesigns'>('explore');
  const [isDescending, setIsDescending] = useState<boolean>(true);
  const { cards, setCards, updateCards } = useCardsStore();

  // Flag to control the fetch call
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/prompt-designs/retrieve");
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data: PromptDesign[] = await response.json();

        // Filter out duplicate cards based on imageUrl before setting the state
        const newCards = data.filter(card => !cards.some(existingCard => existingCard.imageUrl === card.imageUrl));

        setCards(newCards);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, [hasFetched, setCards]);

  
  const sortCards = () => {
    if (!cards) return;
  
    const sortedCards = [...cards].sort((a, b) => {
      const dateA = new Date(a.creationDate).getTime();
      const dateB = new Date(b.creationDate).getTime();
      return isDescending ? dateB - dateA : dateA - dateB;
    });
  
    // Ensure uniqueness and add cache busting to imageUrl
    const uniqueCards = sortedCards.filter((card, index, self) =>
      index === self.findIndex((t) => t.imageUrl === card.imageUrl)
    );
  
    // Append a timestamp to each image URL to prevent caching
    const updatedCards = uniqueCards.map(card => ({
      ...card,
      imageUrl: `${card.imageUrl}?${new Date().getTime()}` // Cache busting
    }));
  
    console.log("Number of unique cards:", updatedCards.length);
    setCards(updatedCards); // Update state with cache-busted URLs
    setIsDescending(!isDescending);
  };
  
  const handleCardDelete = (title: string) => {
    console.log("Deleting card:", title);
    updateCards((prevCards) => {
      if (!Array.isArray(prevCards)) return prevCards;

      return prevCards.filter((card) => card.title !== title);
    });
  };

  return (
    <div className="bg-[#E7E4D8] min-h-screen py-8">
      <div className="flex justify-center items-center mb-4 relative">
        <button
          onClick={() => setSelectedTab('explore')}
          className={`text-[#822538] mx-2  ${selectedTab === 'explore' ? 'font-bold' : ''}`}
        >
          EXPLORE
        </button>

        <div className="vertical-line"></div>

        <button
          onClick={() => setSelectedTab('myDesigns')}
          className={`text-[#822538] mx-2 ${selectedTab === 'myDesigns' ? 'font-bold' : ''}`}
        >
          MY DESIGNS
        </button>
      </div>

      <div className="flex justify-end px-32">
        <button onClick={sortCards} className="ml-4">
          <img src='/sort (2).png' alt="Sort" className="w-12 h-12" />
        </button>
      </div>

      {selectedTab === 'myDesigns' ? (
        <FocusCards
          cards={cards.map(card => ({
            title: card.title,
            src: card.imageUrl,
            key: card.imageUrl, 
          }))}
          onDelete={handleCardDelete}
        />
      ) : (
        <div className="text-[#822538] text-center">
          <h2>Nothing To Show Yet</h2>
        </div>
      )}
    </div>
  );
}
