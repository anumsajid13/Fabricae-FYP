"use client";

import React from "react";
import { PluginContent } from "../components/Portfolio/MainEditor";
import NavBar2 from "../components/ImageGenerator/NavBar2";
import { PortfolioProvider } from "../components/SelectPortfolio/PortfolioContext"; // Import PortfolioProvider

const Page = () => {
  return (
    <PortfolioProvider>
        <div>
          <NavBar2 />
          <PluginContent />
        </div>
    </PortfolioProvider>
  );
};

export default Page;