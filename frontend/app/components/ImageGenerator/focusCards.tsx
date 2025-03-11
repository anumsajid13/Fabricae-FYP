"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { FocusCards } from "../ui/focus-cards"; 
import './global.css';
import { useCardsStore } from "../../store/useCardsStore";
import { useSelectedCardsStore} from "../../store/selectedCardsStore"

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
  const { selectedCards, setSelectedCards, updateSelectedCards } = useSelectedCardsStore();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;
    const username = localStorage.getItem("userEmail");
    
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/prompt-designs/retrieve-by-username/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data: PromptDesign[] = await response.json();

        // Filter out duplicate cards based on both imageUrl and title
        const uniqueCards = data.reduce((acc: PromptDesign[], current) => {
          const isDuplicate = acc.some(card => 
            card.imageUrl === current.imageUrl || card.title === current.title
          );
          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []);

        setCards(uniqueCards);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, [hasFetched, setCards, selectedCards]);

  const sortCards = () => {
    if (!cards) return;
  
    const sortedCards = [...cards].sort((a, b) => {
      const dateA = new Date(a.creationDate).getTime();
      const dateB = new Date(b.creationDate).getTime();
      return isDescending ? dateB - dateA : dateA - dateB;
    });
  
    // Generate unique keys for each card
    const updatedCards = sortedCards.map(card => ({
      ...card,
      imageUrl: `${card.imageUrl}?${new Date().getTime()}`, // Cache busting
      key: `${card.title}-${card.imageUrl}` // Create a composite key
    }));
  
    console.log("Number of unique cards:", updatedCards.length);
    setCards(updatedCards);
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
          className={`text-[#822538] mx-2  ${selectedTab === 'explore' ? 'font-bold' : ''} hover:text-[#822538]`}
        >
          EXPLORE
        </button>

        <div className="border-l-2 border-[#822538] h-10 mx-4"></div>

        <button
          onClick={() => setSelectedTab('myDesigns')}
          className={`text-[#822538] mx-2 ${selectedTab === 'myDesigns' ? 'font-bold' : ''} hover:text-[#822538]`}
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
            key: `${card.title}-${card.imageUrl}`, // Use composite key
          }))}
          onDelete={handleCardDelete}
        />
      ) : (
        <div className="text-[#822538] text-center">
          <h2>Nothing To Show Yet</h2>
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        {selectedCards.length > 0 && (
          <Link href="/3DModels">
            <img 
              src="/nextButton.png" 
              alt="Next"
              className="w-16 h-16 cursor-pointer transition-transform transform hover:scale-110"
            />
          </Link>
        )}
      </div>
    </div>
  );
}