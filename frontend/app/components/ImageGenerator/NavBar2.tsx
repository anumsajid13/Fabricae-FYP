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
              { label: "Editor", path: "/ImageEditor" },
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

            <Link href="/Chat">
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="35" viewBox="0 0 24 24"><path fill="#822538" fill-rule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.63 1.63 0 0 1 1.149.133A9.96 9.96 0 0 0 12 22m-4-8.75a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm-.75-2.75A.75.75 0 0 1 8 9.75h8a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75" clip-rule="evenodd"/></svg>            </Link>
            <button onClick={toggleSidebar} className="focus:outline-none">
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="35" viewBox="0 0 24 24"><path fill="none" stroke="#822538" stroke-linecap="round" stroke-width="1.9" d="M20 7H4m16 5H4m16 5H4"/></svg>     </button>
          
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
              <Link href="/Explore" className={`text-lg ${pathname === "/explore" ? "text-gray-300" : "hover:text-gray-400"} transition-all`}>
                Explore
              </Link>
            </li>
             <li>
              <Link href="/Feedback" className={`text-lg ${pathname === "/explore" ? "text-gray-300" : "hover:text-gray-400"} transition-all`}>
                Feedback
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
