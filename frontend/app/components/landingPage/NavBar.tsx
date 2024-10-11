"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Toaster, toast } from 'sonner'

export default function Navbar() {
  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/logo.svg" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image 
            src="/logo.svg" 
            alt="Fabricae Logo" 
            width={45} // Set your desired width
            height={32} // Set your desired height
          />
          <span className="self-center text-2xl font-custom font-bold whitespace-nowrap text-customGreen">
            FABRICAE
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-3 rtl:space-x-reverse">
        <Toaster richColors/>
        <button
          type="button"
          onClick={() => toast.success('My first toast')}
          className="text-white bg-black border border-white hover:bg-customPurple focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium text-sm px-4 py-2 custom-radius"
        >
          Login
        </button>


        <Link href='/SignUp'>
          <button
            type="button"
            className="text-white bg-black border border-white custom-radius hover:bg-customPurple focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium text-sm px-4 py-2"
          >
            Sign Up
          </button>

          </Link>

          
          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-black md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link href="/" className="block py-2 px-3 md:p-0 text-white rounded md:bg-transparent hover:text-customGreen" aria-current="page">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 px-3 md:p-0 text-white rounded hover:text-customGreen md:hover:bg-transparent">
                Explore
              </Link>
            </li>
            <li>
           
              <Link href="/services" className="block py-2 px-3 md:p-0 text-white rounded hover:text-customGreen md:hover:bg-transparent">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
