"use client";

import { useEffect, useState } from "react";
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
  const token = useAuthStore((state) => state.token); 
  const setToken = useAuthStore((state) => state.setToken);
  const [userInitialized, setUserInitialized] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userProfile = await getUserProfile(); // Fetch user profile

        if (userProfile?.token) {
          setToken(userProfile.token); // Update the token in the store
          console.log("User Name:", userProfile.name);
          console.log("Profile Picture:", userProfile.picture);
          console.log("Email:", userProfile.email);

          // Call the route only once user is initialized
          if (userProfile.email) {
            await fetchOrCreateUser(userProfile.email); // Safe to call with a string
          } else {
            console.error("Email is undefined in user profile.");
          }

        } else {
          console.log("No session found.");
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
      } finally {
        setUserInitialized(true);
      }
    };

    if (!userInitialized) {
      initializeUser(); 
    }
  }, [userInitialized, setToken]);

  const fetchOrCreateUser = async (email: string) => {
    try {

      console.log("email",email)
      const response = await fetch('http://localhost:5000/api/auth/get-or-create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('User Data:', data.user);
        console.log('JWT Token:', data.token);

        useAuthStore.getState().setToken(data.token);
        localStorage.setItem("userEmail", data.user.email);
        router.push('/'); 
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error during user creation:', error);
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "#E7E4D8" }}>
        {token ? <NavBar2 /> : <NavBar />}
        <Body />
        <div style={{ backgroundColor: "#434242" }}>
          <BottomBar />
          <LearnMoreSection />
        </div>
      </div>
    </>
  );
}
