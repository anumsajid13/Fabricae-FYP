"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store/authStore";
import { getUserProfile } from "../utils/auth";
import NavBar from "./components/landingPage/NavBar";
import NavBar2 from "./components/ImageGenerator/NavBar2";
import Body from "./components/landingPage/Body";
import BottomBar from "./components/landingPage/BottomBar";
import LearnMoreSection from "./components/landingPage/learnMore";

export default function Home() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token); // Access the token from the store
  const setToken = useAuthStore((state) => state.setToken); // Access the setToken function from the store

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userProfile = await getUserProfile(); // Fetch user profile

        if (userProfile?.token) {
          setToken(userProfile.token); // Update the token in the store

          // Log user profile details
          console.log("User Name:", userProfile.name);
          console.log("Profile Picture:", userProfile.picture);
          console.log("Email:", userProfile.email);
        } else {
          console.log("No session found.");
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
      }
    };

      initializeUser();
    
  }, [token, setToken, router]);

  return (
    <>
      <div style={{ backgroundColor: "#E7E4D8"}}> 
        {token ? <NavBar2 /> : <NavBar />}    
          <Body /> 
        <div style={{ backgroundColor: "#434242"}}>
          <BottomBar />
          <LearnMoreSection/>
        </div>
         
      </div>
      
    </>
  );
}
