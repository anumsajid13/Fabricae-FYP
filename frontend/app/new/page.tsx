// pages/index.js
import Image from "next/image";
import NavBar from '../components/landingPage/NavBar';
import { WavyBackground  } from '../components/ui/wavy-background';

export default function Home() {
  return (
    <>
      <NavBar />
    
      <WavyBackground >Hello bye</WavyBackground>
    </>
  );
}
