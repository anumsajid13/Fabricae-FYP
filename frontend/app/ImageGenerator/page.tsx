import Image from "next/image";
import NavBar from '../components/ImageGenerator/NavBar2';
import {BackgroundBeamsDemo} from '../components/ImageGenerator/BackgroundLines'; 
import {FocusCardsDemo} from '../components/ImageGenerator/focusCards'
export default function Home() {
  return (
    <>
      <NavBar />
      
      <BackgroundBeamsDemo/>
      
      
      <FocusCardsDemo patternType="prompt" />
      
    </>
  );
}
