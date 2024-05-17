import React, { useEffect, useState, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import SummaryComponent from '../components/Summary';
import CreatePatientForm from '../components/CreatePatientForm';
import "../styles/CreatePatientForm.css";
import FlexTable from '../components/FlexTableNew';
import NavBar from '../components/NavBar';
import MobileNav from '../components/MobileNav';
import HomeComponent from '../components/HomeComponent';
import AppWrapper from './AppWrapper';

const Home = ({}) => {
    return (
        <AppWrapper
            children={<HomeComponent />}
            title='Home'
        />
    ) 
}

export default Home;