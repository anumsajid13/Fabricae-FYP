"use client";
import React, { useEffect, useState } from "react"; // Ensure React is imported
import { FocusCards } from "../ui/focus-cards"; // Import your FocusCards component
import './global.css';
import sortIcon from '../path/to/your/sort-icon.png'; // Import your sorting icon

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
  const [cards, setCards] = useState<PromptDesign[]>([]); // Store PromptDesign objects
  const [selectedTab, setSelectedTab] = useState<'explore' | 'myDesigns'>('explore'); // State for the selected tab
  const [isDescending, setIsDescending] = useState<boolean>(true); // State for sort order

  useEffect(() => {
    // Function to fetch data from the API
    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/prompt-designs/retrieve"); // Call your API route
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data: PromptDesign[] = await response.json(); // Use the PromptDesign interface
        setCards(data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards(); // Invoke the fetch function
  }, []); // Empty dependency array to run once on mount

  // Function to sort cards by creationDate
  const sortCards = () => {
    const sortedCards = [...cards].sort((a, b) => {
      const dateA = new Date(a.creationDate).getTime();
      const dateB = new Date(b.creationDate).getTime();
      return isDescending ? dateB - dateA : dateA - dateB; // Sort based on the current order
    });
    setCards(sortedCards);
    setIsDescending(!isDescending); // Toggle the sort order
  };

  return (
    <div className="bg-black min-h-screen py-8">
      {/* Toggle buttons for Explore and My Designs */}
      <div className="flex justify-center items-center mb-4 relative">
        <button
          onClick={() => setSelectedTab('explore')}
          className={`mx-2 text-[rgba(205, 251, 124, 1)] ${selectedTab === 'explore' ? 'font-bold' : ''}`}
        >
          EXPLORE
        </button>
  
        {/* Vertical Line */}
        <div className="vertical-line"></div>
  
        <button
          onClick={() => setSelectedTab('myDesigns')}
          className={`mx-2 text-[rgba(205, 251, 124, 1)] ${selectedTab === 'myDesigns' ? 'font-bold' : ''}`}
        >
          MY DESIGNS
        </button>

       
      </div>
      <div className="flex justify-end px-32"> {/* Use flex to align items */}
        {/* Sorting Icon */}
        <button onClick={sortCards} className="ml-4"> {/* Margin-left for spacing */}
          <img src='/sort.png' alt="Sort" className="w-10 h-10" /> {/* Adjust size as needed */}
        </button>
      </div>
  
      {/* Conditional rendering based on selected tab */}
      {selectedTab === 'myDesigns' ? (
        <FocusCards cards={cards.map(card => ({ title: card.title, src: card.imageUrl }))} /> // Show FocusCards when "My Designs" is selected
      ) : (
        <div className="text-white text-center"> {/* Empty div for Explore */}
          <h2>Nothing To Show Yet</h2>
        </div>
      )}
    </div>
  );
}
