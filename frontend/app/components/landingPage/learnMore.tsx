import React from "react";
import Spline from '@splinetool/react-spline';
import Link from "next/link";

interface LearnMoreProps {
  id?: string;
}

const LearnMoreSection: React.FC<LearnMoreProps> = ({ id }) => {
  return (
    <div id="learn-more" style={styles.container}>
      {/* Right Side: Spline 3D Model */}
      <div style={styles.splineContainer}>
        <Spline
        scene="https://prod.spline.design/e6Nj5oNwtFQpp2PB/scene.splinecode" 
        style={styles.spline}
        />
      </div>

      <div id="webcrumbs">
        <div className=" p-8 rounded-lg relative overflow-hidden w-[800px]">
          <h2 className="text-4xl font-custom font-bold text-center mb-10 relative">
            How our App Works
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-[#822538] rounded-full"></span>
          </h2>

          <div className="flex flex-col items-center gap-6 max-w-[600px] mx-auto">
            {/* Step 1: Signup Card */}
            <div className="flex w-full items-center">
              <div className="h-full flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center font-bold text-[#616852]">
                  1
                </div>
                <div className="h-full w-0.5 bg-cream-100 my-2"></div>
              </div>

              <div className="w-full bg-cream-100 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:translate-y-[-4px]">
                <div className="flex">
                  <div className="bg-[#b4707e] p-6 flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="6"
                        r="4"
                        fill="#fff"
                        stroke-width="0.5"
                        stroke="#000"
                      />
                      <path
                        fill="#fff"
                        fill-rule="evenodd"
                        d="M16.5 22c-1.65 0-2.475 0-2.987-.513C13 20.975 13 20.15 13 18.5s0-2.475.513-2.987C14.025 15 14.85 15 16.5 15s2.475 0 2.987.513C20 16.025 20 16.85 20 18.5s0 2.475-.513 2.987C18.975 22 18.15 22 16.5 22m.583-5.056a.583.583 0 1 0-1.166 0v.973h-.973a.583.583 0 1 0 0 1.166h.973v.973a.583.583 0 1 0 1.166 0v-.973h.973a.583.583 0 1 0 0-1.166h-.973z"
                        clip-rule="evenodd"
                        stroke-width="0.5"
                        stroke="#000"
                      />
                      <path
                        fill="#fff"
                        d="M15.678 13.503c-.473.005-.914.023-1.298.074c-.643.087-1.347.293-1.928.875c-.582.581-.788 1.285-.874 1.928c-.078.578-.078 1.284-.078 2.034v.172c0 .75 0 1.456.078 2.034c.06.451.18.932.447 1.38H12c-8 0-8-2.015-8-4.5S7.582 13 12 13c1.326 0 2.577.181 3.678.503"
                        stroke-width="0.5"
                        stroke="#000"
                      />
                    </svg>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-custom text-2xl font-bold mb-2">
                      Sign up
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Kickstart your design adventure by signing up for our
                      fashion design application.It is completely free!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Prompt Card */}
            <div className="flex w-full items-center">
              <div className="h-full flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center font-bold  text-[#616852]">
                  2
                </div>
                <div className="h-full w-0.5 bg-cream-100 my-2"></div>
              </div>

              <div className="w-full bg-cream-100 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:translate-y-[-4px]">
                <div className="flex">
                  <div className="bg-[#b4707e] p-6 flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#fff"
                        fill-rule="evenodd"
                        d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828S6.239 2 10.03 2c.606 0 1.091 0 1.5.017q-.02.12-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22m-8.75-7.5a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75m0 3.5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75"
                        clip-rule="evenodd"
                        stroke-width="0.5"
                        stroke="#000"
                      />
                      <path
                        fill="#fff"
                        d="m19.352 7.617l-3.96-3.563c-1.127-1.015-1.69-1.523-2.383-1.788L13 5c0 2.357 0 3.536.732 4.268S15.643 10 18 10h3.58c-.362-.704-1.012-1.288-2.228-2.383"
                        stroke-width="0.5"
                        stroke="#000"
                      />
                    </svg>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-2xl font-bold  font-custom mb-2">
                      Prompt-based Pattern Generation
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Alright, you're in! Now, it's time to toss over your
                      design tasks our way. Need a bold geometric textile
                      pattern? A delicate floral print? Or maybe an eye-catching
                      abstract design? No sweat. Just keep those requests
                      coming!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Sketch Card */}
            <div className="flex w-full items-center">
              <div className="h-full flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center font-bold text-[#616852]">
                  3
                </div>
              </div>

              <div className="w-full bg-cream-100 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:translate-y-[-4px]">
                <div className="flex">
                  <div className="bg-[#b4707e] p-6 flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 256 256"
                    >
                      <g fill="#fff" stroke-width="6.5" stroke="#000">
                        <path
                          d="M224 128a96 96 0 1 0-144 83.16V176l48-104l48 104v35.16A96 96 0 0 0 224 128"
                          opacity="0.2"
                        />
                        <path d="M201.54 54.46A104 104 0 0 0 54.46 201.54A104 104 0 0 0 201.54 54.46M88 192a16 16 0 0 1 32 0v23.59a88 88 0 0 1-32-9.22Zm48 0a16 16 0 0 1 32 0v14.37a88 88 0 0 1-32 9.22Zm-28.73-56h41.46l11.58 25.1a31.93 31.93 0 0 0-32.31 9.77a31.93 31.93 0 0 0-32.31-9.77Zm7.39-16L128 91.09L141.34 120Zm75.56 70.23c-2 2-4.08 3.87-6.22 5.64V176a7.9 7.9 0 0 0-.74-3.35l-48-104a8 8 0 0 0-14.52 0l-48 104A7.9 7.9 0 0 0 72 176v19.87a89 89 0 0 1-6.22-5.64a88 88 0 1 1 124.44 0" />
                      </g>
                    </svg>{" "}
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-2xl font-bold mb-2 font-custom">
                      Sketch to Pattern
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Got a quick sketch or a random design? Watch it transform
                      into a stunning digital pattern—because every great design
                      starts with a simple idea!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link href="/ImageGenerator">
            <div>
              <button className="mt-10 bg-[#b4707e] hover:bg-[#822538] text-black font-custom font-normal py-3 px-8 rounded-full shadow-lg mx-auto transition-all hover:transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Start your design journey</span>
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearnMoreSection;

// Styles
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "40px",
    backgroundColor: "#E7E4D8",
    minHeight: "100vh",
    marginTop: "40px",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    maxWidth: "50%",
    paddingRight: "40px",
  },
  heading: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  subHeading: {
    fontSize: "20px",
    lineHeight: "1.6",
    marginBottom: "40px",
    color: "#666",
  },
  stepsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  step: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  stepTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  stepDescription: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#666",
  },
  splineContainer: {
    flex: 1,
    maxWidth: "50%",
    height: "800px",
  },
  spline: {
    width: "100%",
    height: "100%",
    // border: "1px solid red",
  },
};
