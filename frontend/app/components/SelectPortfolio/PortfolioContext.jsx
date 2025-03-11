"use client"
import { createContext, useState } from 'react';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  
  return (
    <PortfolioContext.Provider value={{ selectedPortfolio, setSelectedPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};