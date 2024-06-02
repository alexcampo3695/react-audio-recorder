import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Props } from "./interfaces";
import "../styles/CreatePatientForm.css";
import { v4 as uuidv4 } from 'uuid';
import { Notyf } from "notyf";
import { useUser } from "../context/UserContext";

const CreatePatientForm = ({}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [patientId, setPatientId] = useState(() => uuidv4());
    const navigate = useNavigate();
    const{ user } = useUser();
    const notyf = new Notyf();

    async function handleCreatePatient(e: React.FormEvent) {
        e.preventDefault();
        if (!user) {
            // Handle the case where user is not available
            notyf.error('User not logged in');
            return;
        }
        const patientData = {
          PatientId: patientId,
          FirstName: firstName,
          LastName: lastName,
          DateOfBirth: dateOfBirth,
          CreatedBy: user.id
        };
        await fetch('http://localhost:8000/api/patients/create', {
          method: 'POST',
          body: JSON.stringify(patientData),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        navigate('/recorder', { state: { patientData } });
        setFirstName('');
        setLastName('');
        setDateOfBirth('');
        notyf.success('Patient created successfully!');
      }

    console.log('userId', user?.id)
    return (
        <div className="form-layout is-separate">
            <div className="form-outer">
                <div className="form-body">
                    <div className="form-section">
                        <div className="form-section-inner has-padding-bottom">
                            <h3 className="has-text-centered">Create a New Patient</h3>
                            <form onSubmit={handleCreatePatient}>
                                <div className="columns is-multiline">
                                    <div className="column is-6">
                                        <div className="field">
                                            <label>First name</label>
                                            <div className="control has-icon">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder=""
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                                <div className="form-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column is-6">
                                        <div className="field">
                                            <label>Last name</label>
                                            <div className="control has-icon">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder=""
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                                <div className="form-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column is-12">
                                        <div className="field">
                                            <label>Date of Birth</label>
                                            <div className="control has-icon">
                                            <input
                                                id="start-date"
                                                className="input"
                                                type="date"
                                                placeholder="Start Date"
                                                aria-label="Use the arrow keys to pick a date"
                                                value={dateOfBirth}
                                                onChange={(e) => setDateOfBirth(e.target.value)}
                                            />
                                            <div className="form-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column is-12 custom-form-button">
                                        <div className="field">
                                        <button className="button h-button is-primary is-rounded is-elevated">
                                            <span className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            </span>
                                            <span>Create Patient</span>
                                        </button> 
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default CreatePatientForm;
