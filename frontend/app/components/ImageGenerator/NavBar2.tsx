"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "../../store/authStore";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // 🚀 New: Logout Loader State
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    setIsLoggingOut(true); // 🔥 Show Loader
    setTimeout(() => {
      useAuthStore.getState().removeToken(); // Remove token
      console.log("Logged out and token removed");
      router.push("/"); // Redirect after logout
    }, 4000); // ⏳ 4-Second Delay
  };

  const linkClasses = (linkPath: string) =>
    pathname === linkPath
      ? "font-semibold block py-2 px-3 md:p-0 text-[#822538] rounded transition-all duration-300"
      : "font-semibold block py-2 px-3 md:p-0 text-black hover:text-[#822538] transition-all duration-300";

  return (
    <>
      {/* 🔹 Main Navbar */}
      <nav className="bg-[#E7E4D8] border-gray-200">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto py-2">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/F (Logo).svg" alt="Fabricae Logo" width={70} height={50} />
            <span className="text-2xl font-custom font-bold ml-2 text-black">FABRICAE</span>
          </Link>

          {/* Center: Navbar Links */}
          <div className="hidden md:flex space-x-8 font-medium font-custom">
            {[
              { label: "Prompt", path: "/ImageGenerator" },
              { label: "Sketch", path: "/SketchToImage" },
              { label: "Image Editor", path: "/ImageEditor" },
              { label: "3D Models", path: "/3DModels" },
              { label: "Portfolio", path: "/SelectPortfolio" },
            ].map((item) => (
              <Link key={item.path} href={item.path} className={linkClasses(item.path)}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Profile & Hamburger */}
          <div className="flex items-center space-x-6">
            <Link href="/Profile">
              <Image src="/profile-user.png" alt="Profile" width={40} height={35} className="cursor-pointer" />
            </Link>
            <button onClick={toggleSidebar} className="focus:outline-none">
              <img className="h-[30px] transition-transform hover:scale-110" src="/icons8-hamburger-menu.svg" />
            </button>
          </div>
        </div>

        {/* 🔹 Sidebar */}
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-[#822538] bg-opacity-90 backdrop-blur-lg shadow-lg z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out p-6`}
        >
          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Sidebar Links */}
          <ul className="mt-10 space-y-6 text-center">
            <li>
              <Link href="/" className={`text-lg ${pathname === "/" ? "text-gray-300" : "hover:text-gray-400"} transition-all`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/explore" className={`text-lg ${pathname === "/explore" ? "text-gray-300" : "hover:text-gray-400"} transition-all`}>
                Explore
              </Link>
            </li>
            <li>
              <Link href="/contact" className={`text-lg ${pathname === "/contact" ? "text-gray-300" : "hover:text-gray-400"} transition-all`}>
                Contact Us
              </Link>
            </li>
            <li>
              {/* Log Out Button */}
              <button
                onClick={() => {
                  logout(); // Trigger logout function
                  toggleSidebar(); // Close sidebar
                }}
                className="text-lg text-gray-300 hover:text-red-500 transition-all"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* 🔹 Logout Loader Overlay */}
      {isLoggingOut && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
            <p className="text-white mt-4 text-lg font-semibold">Logging Out...</p>
          </div>
        </div>
      )}
    </>
  );
}
