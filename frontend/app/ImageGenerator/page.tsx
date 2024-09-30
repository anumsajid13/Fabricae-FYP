import Image from "next/image";
import NavBar from '../components/landingPage/NavBar';
import Body from '../components/landingPage/Body'; 
import BottomBar from '../components/landingPage/BottomBar'; 
import {PlaceholdersAndVanishInputDemo} from '../components/ImageGenerator/searchbar'; 
import {BackgroundBeamsDemo} from '../components/ImageGenerator/BackgroundLines'; 
import FileUploadDemo from '../components/ImageGenerator/fileupload'; 

export default function Home() {
  return (
    <>
      <NavBar />
      <BackgroundBeamsDemo/>
      
    </>
  );
}
