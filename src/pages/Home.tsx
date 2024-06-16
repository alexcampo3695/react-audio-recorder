import React, { useEffect, useState, ReactElement } from 'react';
import "../styles/CreatePatientForm.css";
import HomeComponent from '../components/HomeComponent';
import AppWrapper from './AppWrapper';
import TabsTest from './TestTabs';
import { IonButton, IonContent, IonHeader, IonPage } from '@ionic/react';
import TestTabs from './TestTabs';

const Home = ({}) => {
    console.log('Home.tsx')
    return (
        <AppWrapper
            children={
                <HomeComponent />
            }
            title='Home'
        /> 
    ) 
}

export default Home;