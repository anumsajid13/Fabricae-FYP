
import Image from "next/image";
import NavBar from './components/landingPage/NavBar';
import Body from './components/landingPage/Body'; 
import BottomBar from './components/landingPage/BottomBar'; 
export default function Home() {
  return (
    <>
      <div style={{ backgroundColor: "#E7E4D8"}}> 
        <NavBar />
        <Body /> 
        <div style={{ backgroundColor: "#434242"}}>
          <BottomBar />
        </div>
       
      </div>
      
    </>
  );
}
