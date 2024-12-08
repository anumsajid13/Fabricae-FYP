import Image from "next/image";
import NavBar from '../components/ImageGenerator/NavBar2';
import Body from '../components/landingPage/Body'; 
import BottomBar from '../components/landingPage/BottomBar'; 
import {PlaceholdersAndVanishInputDemo} from '../components/ImageGenerator/searchbar'; 
import {BackgroundBeamsDemo} from '../components/ImageGenerator/BackgroundLines'; 
import FileUploadDemo from '../components/ImageGenerator/fileupload'; 
import {FocusCardsDemo} from '../components/ImageGenerator/focusCards'
export default function Home() {
  return (
    <>
      <NavBar />
      
      <BackgroundBeamsDemo/>
      
      
      <FocusCardsDemo/>
      
    </>
  );
}
