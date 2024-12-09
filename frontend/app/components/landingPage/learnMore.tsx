import React from 'react';

const LearnMoreSection = () => {
  return (
    <div className="bg-[##434242] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            How Our App Works
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Discover the step-by-step process of our fashion design application.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white shadow-lg mb-4 transform transition duration-300 hover:scale-110">
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h5 className="text-lg font-medium text-white">User Sign Up</h5>
            <p className="mt-2 text-base text-gray-300 text-center">
              Get started by signing up for our fashion design application.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white shadow-lg mb-4 transform transition duration-300 hover:scale-110">
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h5 className="text-lg font-medium text-white">Prompt-based Pattern Generation</h5>
            <p className="mt-2 text-base text-gray-300 text-center">
              Use our AI-powered pattern generation tool to create unique designs.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white shadow-lg mb-4 transform transition duration-300 hover:scale-110">
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h5 className="text-lg font-medium text-white">Sketch to Pattern</h5>
            <p className="mt-2 text-base text-gray-300 text-center">
              Sketch your design ideas and turn them into digital patterns.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white shadow-lg mb-4 transform transition duration-300 hover:scale-110">
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h5 className="text-lg font-medium text-white">Pattern Editing</h5>
            <p className="mt-2 text-base text-gray-300 text-center">
              Refine and edit your patterns with our intuitive tools.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white shadow-lg mb-4 transform transition duration-300 hover:scale-110">
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h5 className="text-lg font-medium text-white">Portfolio Creation</h5>
            <p className="mt-2 text-base text-gray-300 text-center">
              Build your fashion design portfolio and showcase your work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMoreSection;
