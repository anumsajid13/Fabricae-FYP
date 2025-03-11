"use client";

import React from "react";
import { PluginContent } from "../components/Portfolio/MainEditor";
import NavBar2 from "../components/ImageGenerator/NavBar2";
import { PortfolioProvider } from "../components/SelectPortfolio/PortfolioContext"; // Import PortfolioProvider
import { FashionProvider } from "../components/Portfolio/FashionContext"; // Import FashionProvider

const Page = () => {
  return (
    <PortfolioProvider>
      <FashionProvider>
        <div>
          <NavBar2 />
          <PluginContent />
        </div>
      </FashionProvider>
    </PortfolioProvider>
  );
};

export default Page;