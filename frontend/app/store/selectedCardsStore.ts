import {create} from 'zustand';

export interface Card {
    title: string;
    src: string;
  
}

interface SelectedCardsState {
  selectedCards: Card[]; // State to hold cards
  setSelectedCards: (cards: Card[]) => void; // Action to set cards
  updateSelectedCards: (updater: (cards: Card[]) => Card[]) => void
}

// Create the store
export const useSelectedCardsStore = create<SelectedCardsState>((set) => ({
  selectedCards: [], // Initial state
  setSelectedCards: (selectedCards) => set({ selectedCards }),
  updateSelectedCards: (updater) => set((state) => ({ selectedCards: updater(state.selectedCards) })),
}));
