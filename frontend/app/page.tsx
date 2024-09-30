import Image from "next/image";
import NavBar from './components/landingPage/NavBar';
import Body from './components/landingPage/Body'; 
import BottomBar from './components/landingPage/BottomBar'; 
export default function Home() {
  return (
    <>
      <NavBar />
      <Body /> 
      <BottomBar/>
      
    </>
  );
}
