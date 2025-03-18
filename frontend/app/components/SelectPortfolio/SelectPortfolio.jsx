"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFashionStore } from "../Portfolio/FashionProvider";

const SelectPortfolio = () => {
  const { portfolioId, setPortfolioId } = useFashionStore();
  const router = useRouter();
  const [uniquePortfolioIds, setUniquePortfolioIds] = useState([]); // State to store unique portfolio IDs

  // Fetch unique portfolio IDs on component mount
  useEffect(() => {
    const fetchUniquePortfolioIds = async () => {
      try {
        const username = localStorage.getItem("userEmail");

        if (!username) {
          console.error("Username not found in local storage");
          return;
        }

        const response = await fetch("http://localhost:5000/api/unique-portfolio-ids", {
          method: "GET",
          headers: {
            username: username,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch unique portfolio IDs");
        }

        const data = await response.json();
        console.log("Unique Portfolio IDs:", data.uniquePortfolioIds);
        setUniquePortfolioIds(data.uniquePortfolioIds); // Update state with fetched IDs
      } catch (error) {
        console.error("Error fetching unique portfolio IDs:", error);
      }
    };

    fetchUniquePortfolioIds();
  }, []);

  const handlePortfolioSelection = (portfolioId) => {
    console.log("Selected Portfolio ID:", portfolioId);
    setPortfolioId(portfolioId);
    router.push("/Portfolio");
  };

  return (
    <div id="webcrumbs">
      <div className="mx-auto bg-[#e7e4d8] font-sans">
        <header className="relative h-[400px] overflow-hidden rounded-b-lg">
          <div className="absolute inset-0 z-0 transform transition-transform duration-1000 hover:scale-105">
            {/* Video Background */}
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              src="/Gradient.mp4"
              autoPlay
              loop
              muted
            ></video>
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <h1 className=" font-custom text-white  text-5xl font-bold text-center max-w-3xl px-6 leading-tight tracking-wide transform transition-all duration-500 hover:scale-105">
              Let's Customize Portfolios and Connect !
              <div className="mt-4 h-1 w-32 bg-white mx-auto rounded-full transform transition-all duration-500 hover:w-64"></div>
            </h1>
          </div>
        </header>

        <main className="py-16 px-8">
          <section>
            <h2 className="text-3xl font-bold mb-12 text-center relative text-[#616852]">
              <span className="relative z-10">
                Choose Portfolio to Customize
              </span>
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-[#822538] rounded-full"></span>
            </h2>

            <div className="grid grid-cols-2 gap-10 mt-6">
              {/* Static portfolio options */}
              <div
                id="1"
                onClick={() => handlePortfolioSelection("1")}
                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2"
              >
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
                    Clean and minimal design focusing on content and typography
                    for a professional look.
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

              <div
                id="2"
                onClick={() => handlePortfolioSelection("2")}
                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2"
              >
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
                    Bold and creative design with interactive elements to
                    showcase artistic projects.
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
            </div>
          </section>

          <section className="mt-24">
            <h2 className="text-3xl font-bold mb-12 text-center relative text-[#616852]">
              <span className="relative z-10">Your Portfolios</span>
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-[#822538] rounded-full"></span>
            </h2>

            <div className="grid grid-cols-3 gap-6 mt-10">
              {/* Dynamically create portfolio cards */}
              {uniquePortfolioIds.map((id) => (
                <div
                  key={id}
                  onClick={() => handlePortfolioSelection(id)}
                  className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                      alt={`Portfolio ${id}`}
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
                      Portfolio {id}
                    </h3>
                    <p className="text-[#616852] text-sm mb-3">
                      Last updated: 2 days ago
                    </p>
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
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SelectPortfolio;