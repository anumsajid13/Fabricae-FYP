import {create} from 'zustand';

// Define the type for a card
export interface PromptDesign {
    title: string;
    imageUrl: string;
    creationDate: Date;
    username: string;
    patternType: string;
    prompt: string;
  
}

// Define the store's state and actions
interface CardsState {
  cards: PromptDesign[]; // State to hold cards
  setCards: (cards: PromptDesign[]) => void; // Action to set cards
  updateCards: (updater: (cards: PromptDesign[]) => PromptDesign[]) => void
}

// Create the store
export const useCardsStore = create<CardsState>((set) => ({
  cards: [], // Initial state
  setCards: (cards) => set({ cards }),
  updateCards: (updater) => set((state) => ({ cards: updater(state.cards) })),
}));
