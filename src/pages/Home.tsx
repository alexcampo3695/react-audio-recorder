import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SummaryComponent from '../components/Summary';
import CreatePatientForm from '../components/CreatePatientForm';
import "../styles/CreatePatientForm.css";


const Home = ({}) => {
    const [activeTab, setActiveTab] = useState('create')

    const handleTabClick = (tab:string) => {
        setActiveTab(tab);
    }

    return (
        <div>
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
                <div>
                <h1>Hello, World!</h1>
                </div>
            )}
        </div>
    );
}

export default Home;