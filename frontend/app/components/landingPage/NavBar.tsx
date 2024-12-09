"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Use `usePathname` to get the current route

export default function Navbar() {
  const pathname = usePathname(); // Get the current route path

  return (
    <nav className="bg-[#E7E4D8] border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center rtl:space-x-reverse">
          <Image src="/F (Logo).svg" alt="Fabricae Logo" width={70} height={50} />
          <span className="self-center text-2xl font-custom2 font-bold whitespace-nowrap text-black ml-[-10px]">
            FABRICAE
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
          <Link href="/Login">
            <button
              className="text-white bg-[#822538] font-medium text-sm px-6 py-3 custom-radius transition duration-500 ease-in-out hover:bg-[#B4707E]"
            >
              Login
            </button>
          </Link>
          <Link href="/SignUp">
            <button
              className="text-white bg-[#822538] custom-radius font-medium text-sm px-4 py-3 transition duration-500 ease-in-out hover:bg-[#B4707E]"
            >
              Sign Up
            </button>
          </Link>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col font-custom p-4 md:p-0 mt-4 bg-[#E7E4D8] md:space-x-8 rtl:space-x-reverse md:flex-row">
            <li>
              <Link
                href="/"
                className={`font-semibold block py-2 px-3 ${
                  pathname === "/"
                    ? "uppercase text-[#822538]" // Different color for active link
                    : "text-black hover:text-[#822538]" // Default color with hover effect
                }`}
              >
                {pathname === "/" ? "HOME" : "Home"}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`font-semibold block py-2 px-3 ${
                  pathname === "/about"
                    ? "uppercase text-[#822538]" // Different color for active link
                    : "text-black hover:text-[#822538]" // Default color with hover effect
                }`}
              >
                {pathname === "/about" ? "EXPLORE" : "Explore"}
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className={`font-semibold block py-2 px-3 ${
                  pathname === "/services"
                    ? "uppercase text-[#822538]" // Different color for active link
                    : "text-black hover:text-[#822538]" // Default color with hover effect
                }`}
              >
                {pathname === "/services" ? "CONTACT US" : "Contact us"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

