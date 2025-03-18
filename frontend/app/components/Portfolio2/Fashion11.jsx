import React from "react";

export const ContactMe = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#efe8e4] p-4">
        <div className="max-w-4xl w-full border border-black p-4 h-96 "> {/* Reduced padding and added overflow-y-auto */}
          {/* Heading */}
          <h2 className="text-3xl font-serif font-bold text-center">CONTACT ME</h2> {/* Reduced font size */}

          {/* Call-to-Action Message */}
          <p className="text-center text-base mt-3"> {/* Reduced font size and margin */}
            If you're interested in collaborating or have any questions, feel free to reach out! I'd love to hear from you.
          </p>

          {/* Contact Information */}
          <div className="mt-4 space-y-3"> {/* Reduced margin and gap */}
            {/* Email Section */}
            <div className="text-center">
              <h3 className="text-xl font-serif font-bold">Email</h3> {/* Reduced font size */}
              <a
                href="mailto:example@example.com"
                className="text-base text-blue-600 hover:underline"
              >
                example@example.com
              </a>
            </div>

            {/* LinkedIn Section */}
            <div className="text-center">
              <h3 className="text-xl font-serif font-bold">LinkedIn</h3> {/* Reduced font size */}
              <a
                href="https://www.linkedin.com/in/example"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-blue-600 hover:underline"
              >
                linkedin.com/in/example
              </a>
            </div>

            {/* Additional Information */}
            <div className="text-center">
              <h3 className="text-xl font-serif font-bold">Let's Connect</h3> {/* Reduced font size */}
              <p className="text-base"> {/* Reduced font size */}
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>
          </div>

          {/* Optional: Social Media Icons */}
          <div className="flex justify-center mt-4 space-x-3"> {/* Reduced margin and gap */}
            <a
              href="https://twitter.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.94 13.94 0 011.67 3.148a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.934 4.934 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 14.01-7.507 14.01-14.013 0-.213-.005-.426-.015-.637A10.025 10.025 0 0024 4.557z" />
              </svg>
            </a>
            <a
              href="https://github.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.042.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  };