import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SummaryComponent from '../components/Summary';
import CreatePatientForm from '../components/CreatePatientForm';
import "../styles/CreatePatientForm.css";
import FlexTable from '../components/FlexTableNew';
import NavBar from '../components/NavBar';
import MobileNav from '../components/MobileNav';

const HomeComponent = ({}) => {
    const [activeTab, setActiveTab] = useState('create')
    const [patients, setPatients] = useState([]);
    
    const handleTabClick = (tab:string) => {
        setActiveTab(tab);
    }

    useEffect(() => {
        async function fetchPatients() {
            const patients = await fetch('http://localhost:8000/get_patients');
            setPatients(await patients.json());
        }
        fetchPatients();
    }, []);

    return (
        <div>
            <MobileNav />
            <NavBar />
            <div className="tabs-inner switch">
                <div className="tabs">
                    <ul>
                        <li 
                            data-tab="active-items-tab" 
                            className={activeTab === 'create' ? "is-active" : ''}
                            onClick={() => handleTabClick('create')}
                        >
                            <a><span>Create Patient</span></a>
                        </li>
                        <li 
                            data-tab="inactive-items-tab"
                            className = {activeTab === 'existing' ? "is-active" : ''}
                            onClick={() => handleTabClick('existing')}
                        >
                            <a><span>Existing Patients</span></a>
                        </li>
                        <li className="tab-naver"></li>
                    </ul>
                </div>
            </div>
            {activeTab === 'create' ? (
                <CreatePatientForm />
            ) : (
                <FlexTable />
            )}
        </div>
    )
}

export default HomeComponent;