"use client"
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const logout = () => {
    useAuthStore.getState().removeToken(); // Call removeToken from Zustand store
    console.log("Logged out and token removed");
  };

  return (
    <nav className="bg-[#E7E4D8] border-gray-200 dark:bg-gray-900 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto ">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center  rtl:space-x-reverse">
          <Image 
            src="/F (Logo).svg" 
            alt="Fabricae Logo" 
            width={70} 
            height={50} 
          />
          <span className="self-center text-2xl font-custom font-bold whitespace-nowrap text-black">
            FABRICAE
          </span>
        </Link>

        {/* Right Section (Profile & Hamburger) */}
        <div className="flex items-center space-x-6">
          {/* Profile Icon */}
          <Image 
            src="/profile-user.png" 
            alt="Profile" 
            width={40} 
            height={35} 
            className="cursor-pointer"
          />

          {/* Hamburger Icon */}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <img 
             style={{height:"40px"}}
             src="/icons8-hamburger-menu.svg"
            >
            </img>
            {/* <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-6 h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg> */}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 w-64 h-full bg-[#822538] text-black z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <button onClick={toggleSidebar} className="absolute top-4 right-4 text-black focus:outline-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-6 h-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sidebar Links */}
        <ul className="mt-10 space-y-6 text-center">
          <li>
            <Link href="/" className="text-lg hover:text-customGreen">Home</Link>
          </li>
          <li>
            <Link href="/explore" className="text-lg hover:text-customGreen">Explore</Link>
          </li>
          <li>
            <Link href="/contact" className="text-lg hover:text-customGreen">Contact Us</Link>
          </li>
          <li>
            {/* Log Out Link */}
            <button
              onClick={() => {
                logout(); // Trigger the logout function
                toggleSidebar(); // Optionally close the sidebar
              }}
              className="text-lg hover:text-customGreen"
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
