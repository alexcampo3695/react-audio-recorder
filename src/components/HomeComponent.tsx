import React, { useEffect, useState } from 'react';
import CreatePatientForm from './CreatePatientForm';
import "../styles/CreatePatientForm.css";
import ExistingPatientsTable from './ExistingPatient';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../config';
import { isPlatform } from '@ionic/react';
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
import TaskComponent from './TasksComponent';

interface UserDetails {
    _id: string;
    userId: string;
    deaNumber: string;
    email: string;
    firstName: string;
    gender: string;
    lastName: string;
    npiNumber: string;
    phoneNumber: string;
    practiceAddress: string;
    providerType: string;
    specialty: string;
    stateLicenseNumber: string;
}

const HomeComponent = ({}) => {
    const [activeTab, setActiveTab] = useState('create')
    const [patients, setPatients] = useState([]);
    const { user } = useUser();
    const [userDetails, setUserDetails] = useState({} as UserDetails);
    
    const handleTabClick = (tab:string) => {
        setActiveTab(tab);
    }

    // useEffect(() => {
    //     async function fetchPatients() {
    //         const patients = await fetch(`${API_BASE_URL}/api/get_patients`);
    //         setPatients(await patients.json());
    //     }
    //     fetchPatients();
    // }, []);

    useEffect(() => {
        async function fetchUserDetails() {
            const userDetails = await fetch(`${API_BASE_URL}/api/user_details/${user?.id}`);
            setUserDetails(await userDetails.json());
        }
        console.log('userDetails:', userDetails)
        fetchUserDetails();
    }, []);

    console.log('userId:', user?.id)

    return (
        <div
            style = {isPlatform('ios') ? {overflow: 'hidden'} : {}}
        >
            {/* <div className="tabs-inner switch">
                <div className="tabs">
                    <ul>
                        <li 
                            data-tab="active-items-tab" 
                            className={activeTab === 'create' ? "is-active" : ''}
                            onClick={() => handleTabClick('create')}
                        >
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-upload-cloud"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
                                <span>Create Patient</span>
                            </a>
                        </li>
                        <li 
                            data-tab="inactive-items-tab"
                            className = {activeTab === 'existing' ? "is-active" : ''}
                            onClick={() => handleTabClick('existing')}
                        >
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                <span>Existing Patients</span>
                            </a>
                        </li>
                        <li className="tab-naver"></li>
                    </ul>
                </div>
            </div>
            {activeTab === 'create' ? (
                <CreatePatientForm />
            ) : (
                <ExistingPatientsTable />
            )} */}

            <div className="personal-dashboard personal-dashboard-v2">
                <div className="columns is-multiline">
                    <div className="column is-12">
                        <div className="dashboard-header">
                            <div className="h-avatar is-xl">
                                <FakeAvatar 
                                    FirstName={userDetails.firstName}
                                    LastName={userDetails.lastName}
                                    Size={AvatarSize.XL}
                                />
                            </div>
                            <div className="user-meta is-dark-bordered-12">
                                <h3 className="title is-4 is-narrow is-bold">
                                    Welcome back, {userDetails.firstName} {userDetails.lastName}
                                </h3>
                                <p className="light-text">It's really nice to see you again</p>
                            </div>
                            <div className="user-action">
                                <h3 className="title is-2 is-narrow">3</h3>
                                <p className="light-text">Tasks are pending review</p>
                                <a className="action-link">View Tasks</a>
                            </div>
                            <div className="cta h-hidden-tablet-p">
                                <div className="media-flex inverted-text">
                                    <i className="lnil lnil-crown-alt-1"></i>
                                    <p className="white-text">
                                        Start using technology to manage your patients!
                                    </p>
                                </div>
                                <a className="link inverted-text">Make a Patient</a>
                            </div>
                        </div>
                    </div>

                    <div className="column is-8">
                        <TaskComponent
                            createdById={user?.id}
                        />
                    </div>

                    <div className="column is-4">
                          {/* something goes here  */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeComponent;