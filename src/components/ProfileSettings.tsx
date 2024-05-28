import React, { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import "../styles/Markdown.css";
import { useUser } from "../context/UserContext"; 

interface ProfileFormBodyProps {
    onUpdateFormData: (formData: any) => void;
}


const ProfileFormBody: React.FC<ProfileFormBodyProps> = ({ onUpdateFormData }) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [practiceAddress, setPracticeAddress] = useState<string>('');
    const [providerType, setProviderType] = useState<string>('');
    const [specialty, setSpecialty] = useState<string>('');
    const [npiNumber, setNpiNumber] = useState<string>('');
    const [stateLicenseNumber, setStateLicenseNumber] = useState<string>('');
    const [deaNumber, setDeaNumber] = useState<string>('');
    const [genderDropDown, setGenderDropDown] = useState<boolean>(false);

    useEffect(() => {
        const formData = {
            firstName,
            lastName,
            gender,
            phoneNumber,
            practiceAddress,
            providerType,
            specialty,
            npiNumber,
            stateLicenseNumber,
            deaNumber,
        };
        console.log('updating form data', formData)
        onUpdateFormData(formData);
    }, [firstName, lastName, gender, phoneNumber, practiceAddress, providerType, specialty, npiNumber, stateLicenseNumber, deaNumber]);

    

    return (
        <div className="form-body">
            <div className="fieldset">
                <div className="fieldset-heading">
                    <h4>Profile Picture</h4>
                    <p>This is how others will recognize you</p>
                </div>
                <div className="h-avatar profile-h-avatar is-xl">
                    <img className="avatar" src="assets/img/avatars/photos/8.jpg" alt="Avatar" />
                    <div className="filepond-profile-wrap is-hidden">
                        <div
                            className="filepond--root profile-filepond filepond--hopper"
                            data-style-panel-layout="compact circle"
                            data-style-button-remove-item-position="left bottom"
                            data-style-button-process-item-position="right bottom"
                            data-style-load-indicator-position="center bottom"
                            data-style-progress-indicator-position="right bottom"
                            data-style-button-remove-item-align="false"
                            data-style-image-edit-button-edit-item-position="bottom center"
                        >
                            <input
                                className="filepond--browser"
                                type="file"
                                name="profile_filepond"
                                aria-controls="filepond--assistant"
                                aria-labelledby="filepond--drop-label"
                            />
                            <div style={{ height: "100%" }}></div>
                            <a
                                className="filepond--credits"
                                aria-hidden="true"
                                href="https://pqina.nl/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Powered by PQINA
                            </a>
                            <div className="filepond--drop-label">
                                <label htmlFor="filepond--browser" id="filepond--drop-label" aria-hidden="true">
                                    <i className="lnil lnil-cloud-upload"></i>
                                </label>
                            </div>
                            <div className="filepond--list-scroller">
                                <ul className="filepond--list" role="list"></ul>
                            </div>
                            <div className="filepond--panel filepond--panel-root" data-scalable="true">
                                <div className="filepond--panel-top filepond--panel-root"></div>
                                <div className="filepond--panel-center filepond--panel-root"></div>
                                <div className="filepond--panel-bottom filepond--panel-root"></div>
                            </div>
                            <div className="filepond--drip"></div>
                            <span className="filepond--assistant" role="status" aria-live="polite" aria-relevant="additions"></span>
                            <fieldset className="filepond--data"></fieldset>
                        </div>
                    </div>
                    <button className="button is-circle edit-button is-edit">
                        <span className="icon is-small">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-edit-2"
                            >
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            <div className="fieldset">
                <div className="fieldset-heading">
                    <h4>Personal Info</h4>
                    <p>This will appear on the clinical clinical note.</p>
                </div>
                <div className="columns is-multiline">
                    <div className="column is-6">
                        <div className="field">
                            <div className="control has-icon">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="First Name" 
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <div className="form-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-user"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-6">
                        <div className="field">
                            <div className="control has-icon">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="Last Name" 
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <div className="form-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-user"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-6">
                        <div className="field"
                            onClick={() => setGenderDropDown(!genderDropDown)}
                        >
                            <div className="control">
                                <div className={`h-select ${genderDropDown ? 'is-active' : ''}`}>
                                    <div className="select-box">
                                        <span>Gender</span>
                                    </div>
                                    <div className="select-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                    <div className="select-drop has-slimscroll-sm">
                                        <div className="drop-inner">
                                            
                                            <div className="option-row">
                                                <input type="radio" name="gender_select" value="Male" checked={gender === "Male"} onChange={(e) => setGender(e.target.value)} />
                                                <div className="option-meta">
                                                    <span>Male</span>
                                                </div>
                                            </div>
                                            <div className="option-row">
                                                <input type="radio" name="gender_select" value="Female" checked={gender === "Female"} onChange={(e) => setGender(e.target.value)} />
                                                <div className="option-meta">
                                                    <span>Female</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-6">
                        <div className="field">
                            <div className="control has-icon">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="Phone Number" 
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <div className="form-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-smartphone"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="Practice Address"
                                    value={practiceAddress}
                                    onChange={(e) => setPracticeAddress(e.target.value)}
                                />
                                <div className="form-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-map-pin"
                                    >
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="Provider Type (e.g., MD, DO, NP, PA)" 
                                    value={providerType}
                                    onChange={(e) => setProviderType(e.target.value)}
                                />
                                <div className="form-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-briefcase"
                                    >
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="Specialty (e.g., Cardiology, Pediatrics)" 
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                />
                                <div className="form-icon">
                                    <i className="fas fa-heart"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="NPI Number" 
                                    value={npiNumber}
                                    onChange={(e) => setNpiNumber(e.target.value)}
                                />
                                <div className="form-icon">
                                    <i className="fas fa-hashtag"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="State License Number" 
                                    value={stateLicenseNumber}
                                    onChange={(e) => setStateLicenseNumber(e.target.value)}
                                />
                                <div className="form-icon">
                                    <i className="fas fa-flag-usa"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="DEA Number"
                                    value={deaNumber}
                                    onChange={(e) => setDeaNumber(e.target.value)}
                                />
                                <div className="form-icon">
                                    <i className="fas fa-pills"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};




const ProfileSettings = () => {
    const { user } = useUser();
    const [general, setGeneral] = useState<boolean>(true);
    const [settings, setSettings] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({});

    console.log('User:', user); // Debugging statement

    const handleGeneralDataSubmit = async () => {
        console.log('handleGeneralDataSubmit called'); // Debugging statement

        if (user) {
            const data = {
                userId: user.id,
                email: user.email,
                ...formData
            };

            console.log('Data to be sent:', data); // Debugging statement
             // Debugging statement

            try {
                const response = await fetch('http://localhost:8000/api/user_details/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Failed to update user data');
                }

                const results = await response.json();
                console.log('Updated user data:', results); // Debugging statement
            } catch (error) {
                console.error('Failed to update user data:', error);
            }
        } else {
            console.log('User is not defined');
        }
    };

    return (
        <div className="account-wrapper">
            <div className="columns">
                <div className="column is-4">
                    <div className="account-box is-navigation">
                        <div className="media-flex-center">
                            <div className="h-avatar is-large">
                                <img className="avatar" src="assets/img/avatars/photos/8.jpg" alt="Avatar" />
                                <img className="badge" src="assets/img/icons/flags/united-states-of-america.svg" alt="Flag" />
                            </div>
                            <div className="flex-meta">
                                <span>Erik Kovalsky</span>
                                <span>Product Manager</span>
                            </div>
                        </div>

                        <div className="account-menu">
                            <a 
                                href="#general" 
                                className={`account-menu-item ${general ? 'is-active' : ''}`}
                                onClick={() => { setGeneral(true); setSettings(false); }}
                            >
                                <i className="lnil lnil-user-alt"></i>
                                <span>General</span>
                                <span className="end">
                                    <i aria-hidden="true" className="fas fa-arrow-right"></i>
                                </span>
                            </a>
                            <a 
                                href="#settings" 
                                className={`account-menu-item ${settings ? 'is-active' : ''}`}
                                onClick={() => { setGeneral(false); setSettings(true); }}
                            >
                                <i className="lnil lnil-cog"></i>
                                <span>Settings</span>
                                <span className="end">
                                    <i aria-hidden="true" className="fas fa-arrow-right"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="column is-8">
                    <div className="account-box is-form is-footerless">
                        <div className="form-head stuck-header">
                            <div className="form-head-inner">
                                <div className="left">
                                    <h3>Settings</h3>
                                    <p>Edit your account prefs and settings</p>
                                </div>
                                <div className="right">
                                    <div className="buttons">
                                        <a href="/admin-profile-view.html" className="button h-button is-light is-dark-outlined">
                                            <span className="icon">
                                                <i className="lnir lnir-arrow-left rem-100"></i>
                                            </span>
                                            <span>Go Back</span>
                                        </a>
                                        <button 
                                            id="save-button" 
                                            className="button h-button is-primary is-raised"
                                            onClick={handleGeneralDataSubmit}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {general ? <ProfileFormBody onUpdateFormData={setFormData} /> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;