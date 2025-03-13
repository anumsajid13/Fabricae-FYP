"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useFashionStore } from "../Portfolio/FashionProvider";


const SelectPortfolio  = () => {

const { portfolioId, setPortfolioId } = useFashionStore();
  
  const router = useRouter();
  
  const handlePortfolioSelection = (portfolioId) => {
    console.log('iddd', portfolioId);
   
    setPortfolioId(portfolioId);
    // Navigate to the customization page
    router.push("/Portfolio");
  };
  
    return (
        <div id="webcrumbs">
            <div className="mx-auto bg-[#e7e4d8] font-sans">
                <header className="relative h-[400px] overflow-hidden rounded-b-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#822538] to-[#b4707e] z-0 transform transition-transform duration-1000 hover:scale-105">
                        <div
                            className="absolute inset-0 opacity-30 mix-blend-overlay"
                            style={{
                                backgroundImage:
                                    'url("https://images.unsplash.com/photo-1545239351-ef35f43d514b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
                                backgroundPosition: "center",
                                backgroundSize: "cover"
                            }}
                        ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <h1 className= " font-custom text-white  text-5xl font-bold text-center max-w-3xl px-6 leading-tight tracking-wide transform transition-all duration-500 hover:scale-105">
                            Let's Customize Portfolios and Connect !
                            <div className="mt-4 h-1 w-32 bg-white mx-auto rounded-full transform transition-all duration-500 hover:w-64"></div>
                        </h1>
                    </div>
                </header>

                <main className="py-16 px-8">
                    <section>
                        <h2 className="text-3xl font-bold mb-12 text-center relative text-[#616852]">
                            <span className="relative z-10">Choose Portfolio to Customize</span>
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-[#822538] rounded-full"></span>
                        </h2>

                        <div className="grid grid-cols-2 gap-10 mt-6">
                            <div id ='1' onClick={() => handlePortfolioSelection('1')}
 className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                        alt="Minimal Portfolio"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#616852] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#822538] transition-colors duration-300">
                                        Minimal Portfolio
                                    </h3>
                                    <p className="text-[#616852] mb-4">
                                        Clean and minimal design focusing on content and typography for a professional
                                        look.
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium py-1 px-3 bg-[#e7e4d8] text-[#616852] rounded-full">
                                            Professional
                                        </span>
                                        <button className="flex items-center text-[#822538] font-medium group">
                                            View Details
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 ml-1 transition-transform duration-300 transform group-hover:translate-x-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div id ='2' onClick={() => handlePortfolioSelection('2')} className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                        alt="Creative Portfolio"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#616852] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#822538] transition-colors duration-300">
                                        Creative Portfolio
                                    </h3>
                                    <p className="text-[#616852] mb-4">
                                        Bold and creative design with interactive elements to showcase artistic
                                        projects.
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium py-1 px-3 bg-[#b4707e]/20 text-[#822538] rounded-full">
                                            Artistic
                                        </span>
                                        <button className="flex items-center text-[#822538] font-medium group">
                                            View Details
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 ml-1 transition-transform duration-300 transform group-hover:translate-x-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                        alt="Corporate Portfolio"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#616852] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#822538] transition-colors duration-300">
                                        Corporate Portfolio
                                    </h3>
                                    <p className="text-[#616852] mb-4">
                                        Elegant and sophisticated design perfect for business professionals and
                                        agencies.
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium py-1 px-3 bg-[#616852]/20 text-[#616852] rounded-full">
                                            Business
                                        </span>
                                        <button className="flex items-center text-[#822538] font-medium group">
                                            View Details
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 ml-1 transition-transform duration-300 transform group-hover:translate-x-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                        alt="Tech Portfolio"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#616852] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#822538] transition-colors duration-300">
                                        Tech Portfolio
                                    </h3>
                                    <p className="text-[#616852] mb-4">
                                        Modern interface with interactive elements perfect for developers and tech
                                        professionals.
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium py-1 px-3 bg-[#e7e4d8] text-[#616852] rounded-full">
                                            Technology
                                        </span>
                                        <button className="flex items-center text-[#822538] font-medium group">
                                            View Details
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 ml-1 transition-transform duration-300 transform group-hover:translate-x-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                     
                    </section>

                    <section className="mt-24">
                        <h2 className="text-3xl font-bold mb-12 text-center relative text-[#616852]">
                            <span className="relative z-10">Your Portfolios</span>
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-[#822538] rounded-full"></span>
                        </h2>

                        <div className="grid grid-cols-3 gap-6 mt-10">
                            <div className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                        alt="My Portfolio 1"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-green-500 text-white text-xs py-1 px-2 rounded-full">
                                            Active
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold mb-1 group-hover:text-[#822538] transition-colors duration-300">
                                        My Design Showcase
                                    </h3>
                                    <p className="text-[#616852] text-sm mb-3">Last updated: 2 days ago</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <button className="p-1.5 bg-[#e7e4d8] rounded-full hover:bg-[#822538] hover:text-white transition-colors duration-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button className="p-1.5 bg-[#e7e4d8] rounded-full hover:bg-[#822538] hover:text-white transition-colors duration-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <button className="text-sm text-[#822538] font-medium flex items-center group">
                                            View
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                        alt="My Portfolio 2"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-yellow-500 text-white text-xs py-1 px-2 rounded-full">
                                            Draft
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold mb-1 group-hover:text-[#822538] transition-colors duration-300">
                                        Business Projects
                                    </h3>
                                    <p className="text-[#616852] text-sm mb-3">Last updated: 1 week ago</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <button className="p-1.5 bg-[#e7e4d8] rounded-full hover:bg-[#822538] hover:text-white transition-colors duration-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button className="p-1.5 bg-[#e7e4d8] rounded-full hover:bg-[#822538] hover:text-white transition-colors duration-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <button className="text-sm text-[#822538] font-medium flex items-center group">
                                            View
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-white bg-opacity-60 border-2 border-dashed border-[#822538]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#822538] hover:bg-opacity-80">
                                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[#822538]/10 flex items-center justify-center mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-[#822538]"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-[#822538]">Create New Portfolio</h3>
                                    <p className="text-[#616852] text-sm mb-4">
                                        Start from scratch or use a template to create your new portfolio
                                    </p>
                                    <button className="px-4 py-2 bg-[#822538] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[#b4707e] transition-colors duration-300 transform hover:scale-105">
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
export default SelectPortfolio;  