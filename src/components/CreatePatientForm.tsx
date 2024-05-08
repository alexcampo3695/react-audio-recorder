import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import "../styles/CreatePatientForm.css";

// interface TableRowData {
//   number: number;
//   patientName: string;
//   eventDate: Date;
//   recordingBlob: Blob | undefined;
//   transcription: string;
//   source: "recording" | "upload";
// }

// interface FlexTableProps {
//   data: TableRowData[];
//   onTranscriptionClick: (transcription: string) => void;
// }

const CreatePatientForm = ({}) => {
    const [createPatient, setCreatePatient] = useState(true);
    const [existingPatients, setExistingPatients] = useState(false);
    
    return (
        <div className="form-layout is-separate">
            <div className="form-outer">
                <div className="form-body">
                    <div className="form-section">
                        <div className="form-section-inner has-padding-bottom">
                            <h3 className="has-text-centered">Patient Information</h3>
                            <div className="columns is-multiline">
                                <div className="column is-6">
                                    <div className="field">
                                        <label>First name</label>
                                        <div className="control has-icon">
                                            <input type="text" className="input" placeholder=""></input>
                                            <div className="form-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-6">
                                    <div className="field">
                                        <label>Last name</label>
                                        <div className="control has-icon">
                                            <input type="text" className="input" placeholder=""></input>
                                            <div className="form-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-12">
                                    <div className="field">
                                        <label>Date of Birth</label>
                                        <div className="control has-icon">
                                            <input type="text" className="input" placeholder=""></input>
                                            <div className="form-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-12 custom-form-button">
                                    <div className="field">
                                    <button className="button h-button is-primary is-rounded is-elevated">
                                        <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                        </span>
                                        <span>Create Patient</span>
                                    </button> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default CreatePatientForm;
