import SelectPortfolio from '../components/SelectPortfolio/SelectPortfolio';

import Navbar from '../components/ImageGenerator/NavBar2';

import { PortfolioProvider } from '../components/SelectPortfolio/PortfolioContext'; // Adjust the path

const MainSelectPortfolio = () => 
{

    return (
    <PortfolioProvider>
            <Navbar />
            <SelectPortfolio/> 
    </PortfolioProvider>
        );
    
}

export default MainSelectPortfolio;