"use client"; // Add this at the top

import { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import Image from 'next/image';
import { FiMenu } from 'react-icons/fi';  // Icon for hamburger menu
import { AiOutlineClose } from 'react-icons/ai';  // Icon for closing the sidebar

export default function NavBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to toggle sidebar

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Navbar className="relative px-6 py-2 bg-black flex items-center justify-center" style={{ height: '80px' }}>
        {/* Brand Section */}
        <NavbarBrand className="absolute left-0 flex items-center">
          <Image 
            src="/button.png" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12" 
          />
          <Link className="ml-2 text-xl font-bold text-[#CDFB7C]" href="/" style={{ letterSpacing: '0.05em' }}>
            FABRICAE
          </Link>
        </NavbarBrand>

        {/* Center Section */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex"> {/* Hidden on small screens */}
          <NavbarContent className="flex gap-8"> 
            <NavbarItem>
              <Link className="text-white text-md sm:text-md" href="#">
                Home
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link href="#" aria-current="page" className="text-md sm:text-md uppercase" style={{ color: '#CDFB7C', letterSpacing: '0.1em' }}>
                Explore
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link className="text-white text-md sm:text-md" href="#">
                Contact us
              </Link>
            </NavbarItem>
          </NavbarContent>
        </div>

        {/* Right Section */}
        <div className="absolute right-0 flex items-center gap-4">
          {/* Log In button will now be shown conditionally */}
          <NavbarItem className="hidden lg:flex">
            <Link href="#">
              <Button 
                className="text-white border border-white rounded-full text-md sm:text-md px-6 py-2" 
                style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                Log In
              </Button>
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Button 
              as={Link} 
              href="#" 
              className="text-black border border-white bg-white rounded-full text-md sm:text-md px-6 py-2"
            >
              Sign Up
            </Button>
          </NavbarItem>

          {/* Hamburger Menu for Small Screens */}
          <div className="md:hidden flex items-center">
            <FiMenu size={24} className="text-white cursor-pointer" onClick={toggleSidebar} />
          </div>
        </div>
      </Navbar>

      {/* Sidebar (only visible on small screens) */}
      <div className={`fixed top-0 right-0 h-full bg-black text-white z-50 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`} style={{ width: '75%' }}> {/* Increased width */}
        <div className="flex justify-end p-4">
          <AiOutlineClose size={24} className="cursor-pointer" onClick={toggleSidebar} />
        </div>
        <div className="flex flex-col items-center gap-8 mt-10">
          <Link className="text-white text-lg" href="#" onClick={toggleSidebar}>
            Home
          </Link>
          <Link className="text-white text-lg" href="#" onClick={toggleSidebar}>
            Explore
          </Link>
          <Link className="text-white text-lg" href="#" onClick={toggleSidebar}>
            Contact us
          </Link>
          {/* Log In button added to the sidebar */}
          <Link href="#">
            <Button 
              className="text-white border border-white rounded-full text-xs sm:text-md px-6 py-2" 
              style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
