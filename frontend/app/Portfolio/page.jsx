"use client"

import React from "react";
import { MyPlugin } from "../components/Portfolio/Wow"; // Ensure correct path
import NavBar2 from "../components/ImageGenerator/NavBar2";

const Page = () => {
  return (
    <div>
      <NavBar2/>
      <MyPlugin />
    </div>
  );
};

export default Page;
