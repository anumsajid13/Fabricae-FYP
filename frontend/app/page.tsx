"use client"

import NavBar from './components/landingPage/NavBar';
import NavBar2 from './components/ImageGenerator/NavBar2';

import Body from './components/landingPage/Body'; 
import BottomBar from './components/landingPage/BottomBar'; 
import { useAuthStore } from './store/authStore';

export default function Home() {

  const token = useAuthStore((state) => state.token); // Access the token from the store

  return (
    <>
      {token ? <NavBar2 /> : <NavBar />}    
        <Body /> 
      <BottomBar/>
      
    </>
  );
}
