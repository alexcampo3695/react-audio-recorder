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

const Home = ({}) => {
    return (
        <div className="view-wrapper" data-naver-offset="150" data-menu-item="#home-sidebar-menu" data-mobile-item="#home-sidebar-menu-mobile">
            <div className="page-content-wrapper">
                <div className="page-content is-relative">
                    <div className="page-title has-text-centered">
                        <div className="huro-hamburger nav-trigger push-resize" data-sidebar="home-sidebar">
                            <span className="menu-toggle has-chevron">
                  <span className="icon-box-toggle">
                    <span className="rotate">
                      <i className="icon-line-top"></i>
                      <i className="icon-line-center"></i>
                      <i className="icon-line-bottom"></i>
                    </span>
                            </span>
                            </span>
                        </div>

                        <div className="title-wrap">
                            <h1 className="title is-4">Dashboard</h1>
                        </div>
                        <div className="toolbar ml-auto">
                            <div className="toolbar-link">
                                <label className="dark-mode ml-auto">
                                    {/* <input type="checkbox" checked=""></input> */}
                                    <span></span>
                                </label>
                            </div>

                            <a className="toolbar-link right-panel-trigger" data-panel="languages-panel">
                                <img src="assets/img/icons/flags/united-states-of-america.svg" alt=""></img>
                            </a>

                            <div className="toolbar-notifications is-hidden-mobile">
                                <div className="dropdown is-spaced is-dots is-right dropdown-trigger">
                                    <div className="is-trigger" aria-haspopup="true">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                        <span className="new-indicator pulsate"></span>
                                    </div>
                                    <div className="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <div className="heading">
                                                <div className="heading-left">
                                                    <h6 className="heading-title">Notifications</h6>
                                                </div>
                                                <div className="heading-right">
                                                    <a className="notification-link" href="/admin-profile-notifications.html">See all</a>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <a className="toolbar-link right-panel-trigger" data-panel="activity-panel">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-grid"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </a>
                        </div>
                    </div>

                    <div className="page-content-inner">
                        <HomeComponent />
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Home;