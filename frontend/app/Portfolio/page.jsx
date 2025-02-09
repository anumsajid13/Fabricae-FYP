"use client"

import React from 'react';
import FashionPortfolio from '../components/Portfolio/1';
import FashionLayout from '../components/Portfolio/2';
import Fashion from '../components/Portfolio/3';
import FabricMaterialSelection from '../components/Portfolio/4';

import SketchesIllustrations from '../components/Portfolio/5';
import PortfolioSection from '../components/Portfolio/6'
const Portfolio= () => {
    return (
        <div >
            < FashionPortfolio/>
            <FashionLayout/>
            <Fashion/>
            <FabricMaterialSelection/>
            <SketchesIllustrations/>
            <PortfolioSection/>
        </div>
    );
};

