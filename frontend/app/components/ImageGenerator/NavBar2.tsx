"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from "../../store/authStore";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname from the router

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    useAuthStore.getState().removeToken(); // Call removeToken from Zustand store
    console.log("Logged out and token removed");
  };

  const linkClasses = (linkPath: string) => {
    return pathname === linkPath
      ? "font-semibold block py-2 px-3 md:p-0 text-[#822538] rounded md:bg-transparent"
      : "font-semibold block py-2 px-3 md:p-0 text-black hover:text-[#822538] md:hover:bg-transparent";
  };

  return (
    <nav className="bg-[#E7E4D8] border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto py-1">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center rtl:space-x-reverse">
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

        {/* Center: Navbar Links */}
        <div className="flex flex-grow justify-center">
          <ul className="flex space-x-8 font-medium p-4 md:p-0 mt-4 md:mt-0">
            <li>
              <Link href="/" className={linkClasses("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/ImageGenerator" className={linkClasses("/ImageGenerator")}>
                Prompt
              </Link>
            </li>
            <li>
              <Link href="/SketchToImage" className={linkClasses("/SketchToImage")}>
                Sketch
              </Link>
            </li>
            <li>
              <Link href="/3DModels" className={linkClasses("/3DModels")}>
                3D Models
              </Link>
            </li>
          </ul>
        </div>

        {/* Right: Profile & Hamburger */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* Profile Icon */}
          <Link href="/Profile">
            <Image 
              src="/profile-user.png" 
              alt="Profile" 
              width={40} 
              height={35} 
              className="cursor-pointer"
            />
          </Link>
          {/* Hamburger Icon */}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <img 
              style={{ height: "30px" }}
              src="/icons8-hamburger-menu.svg"
            />
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
    <Link 
      href="/" 
      className={`text-lg ${pathname === "/" ? "text-black " : "hover:text-[#B4707E]"}`}
    >
      Home
    </Link>
  </li>
  <li>
    <Link 
      href="/explore" 
      className={`text-lg ${pathname === "/explore" ? "text-black " : "hover:text-[#B4707E]"}`}
    >
      Explore
    </Link>
  </li>
  <li>
    <Link 
      href="/contact" 
      className={`text-lg ${pathname === "/contact" ? "text-black ": "hover:text-[#B4707E]"}`}
    >
      Contact Us
    </Link>
  </li>
  <li>
    {/* Log Out Link */}
    <button
      onClick={() => {
        logout(); // Trigger the logout function
        toggleSidebar(); // Optionally close the sidebar
      }}
      className="text-lg hover:text-[#B4707E]"
    >
      Log Out
    </button>
  </li>
</ul>

      </div>
    </nav>
  );
}
