import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import "../styles/Markdown.css";
import { useUser } from "../context/UserContext"; 
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import SignatureCanvas from 'react-signature-canvas';
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";

interface ProfileFormBodyProps {
    formData: any;
    onUpdateFormData: (formData: any) => void;
    onSignatureChange: (signature: File | null) => void;
    signature: File | null;
}

const ProfileFormBody: React.FC<ProfileFormBodyProps> = ({ formData, onUpdateFormData, onSignatureChange, signature }) => {
    const [genderDropDown, setGenderDropDown] = useState<boolean>(false);
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const [showImage, setShowImage] = useState<boolean>(true);

    useEffect(() => {
        const loadSignature = async () => {
            if (signature) {
                console.log("Signature file:", signature); // Log the signature file
    
                const reader = new FileReader();
    
                reader.onload = (event) => {
                    const dataUrl = event.target?.result as string;
                    console.log("Signature Data URL:", dataUrl); // Log the Data URL
                    setImageDataUrl(dataUrl);
                };
    
                reader.onerror = (event) => {
                    console.error("File could not be read! Code " + event.target?.error);
                };
    
                reader.readAsDataURL(signature);
            } else {
                console.log("Signature is not available");
            }
        };
    
        loadSignature();
    }, [signature]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onUpdateFormData({
            ...formData,
            [name]: value
        });
    };

    const clearSignature = () => {
        sigCanvas.current?.clear();
        onSignatureChange(null);
        setImageDataUrl(null)
    }

    const saveSignature = () => {
        if (sigCanvas.current) {
            sigCanvas.current.getTrimmedCanvas().toBlob((blob: Blob) => {
                if (blob) {
                    const file = new File([blob], "signature.png", { type: "image/png" });
                    onSignatureChange(file);
                } else {
                    console.error('Failed to save signature');
                }
            });
        }
    }

    return (
        <div className="form-body">
            {/* Profile Picture Section */}
            {/* <div className="fieldset">
                <div className="fieldset-heading">
                    <h4>Profile Picture</h4>
                    <p>This is how others will recognize you</p>
                </div>
                <div className="h-avatar profile-h-avatar is-xl">
                    <img className="avatar" src="assets/img/avatars/photos/8.jpg" alt="Avatar" />
                    <div className="filepond-profile-wrap is-hidden">
                        <div className="filepond--root profile-filepond filepond--hopper">
                            <input className="filepond--browser" type="file" name="profile_filepond" aria-controls="filepond--assistant" aria-labelledby="filepond--drop-label" />
                            <div style={{ height: "100%" }}></div>
                            <a className="filepond--credits" aria-hidden="true" href="https://pqina.nl/" target="_blank" rel="noopener noreferrer">
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                        </span>
                    </button>
                </div>
            </div> */}

            {/* Personal Info Section */}
            <div className="fieldset">
                <div className="fieldset-heading">
                    <h4>Personal Info</h4>
                    <p>This will appear on the clinical note.</p>
                </div>
                <div className="columns is-multiline">
                    <div className="column is-6">
                        <div className="field">
                            <div className="control has-icon">
                                <input type="text" className="input" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                <div className="form-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
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
                                <input type="text" className="input" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                <div className="form-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-6">
                        <div className="field">
                            <div className="control">
                                <div className={`h-select ${genderDropDown ? 'is-active' : ''}`}>
                                    <div className="select-box" onClick={() => setGenderDropDown(!genderDropDown)}>
                                        <span>{formData.gender || 'Gender'}</span>
                                    </div>
                                    <div className="select-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                    {genderDropDown && (
                                        <div className="select-drop has-slimscroll-sm">
                                            <div className="drop-inner">
                                                <div className="option-row">
                                                    <input type="radio" name="gender" value="Male" onClick={() => setGenderDropDown(false)} checked={formData.gender === "Male"} onChange={handleChange} />
                                                    <div className="option-meta">
                                                        <span>Male</span>
                                                    </div>
                                                </div>
                                                <div className="option-row">
                                                    <input type="radio" name="gender" value="Female" onClick={() => setGenderDropDown(false)} checked={formData.gender === "Female"} onChange={handleChange} />
                                                    <div className="option-meta">
                                                        <span>Female</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-6">
                        <div className="field">
                            <div className="control has-icon">
                                <input type="text" className="input" placeholder="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                                <div className="form-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-smartphone">
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input type="text" className="input" placeholder="Practice Address" name="practiceAddress" value={formData.practiceAddress} onChange={handleChange} />
                                <div className="form-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin">
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
                                <input type="text" className="input" placeholder="Provider Type (e.g., MD, DO, NP, PA)" name="providerType" value={formData.providerType} onChange={handleChange} />
                                <div className="form-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-briefcase">
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
                                <input type="text" className="input" placeholder="Specialty (e.g., Cardiology, Pediatrics)" name="specialty" value={formData.specialty} onChange={handleChange} />
                                <div className="form-icon">
                                    <i className="fas fa-heart"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input type="text" className="input" placeholder="NPI Number" name="npiNumber" value={formData.npiNumber} onChange={handleChange} />
                                <div className="form-icon">
                                    <i className="fas fa-hashtag"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input type="text" className="input" placeholder="State License Number" name="stateLicenseNumber" value={formData.stateLicenseNumber} onChange={handleChange} />
                                <div className="form-icon">
                                    <i className="fas fa-flag-usa"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column is-12">
                        <div className="field">
                            <div className="control has-icon">
                                <input type="text" className="input" placeholder="DEA Number" name="deaNumber" value={formData.deaNumber} onChange={handleChange} />
                                <div className="form-icon">
                                    <i className="fas fa-pills"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Signature Section */}
                    <div className="fieldset">
                        <div className="fieldset-heading">
                            <h4>Signature</h4>
                            <p>This signature will be appended to all clinical notes.</p>
                        </div>
                        <div className="signature-container">
                            {showImage && imageDataUrl ? (
                                <img src = {imageDataUrl} alt='Signature'/>
                            ) : (
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="black"
                                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                                />
                            )}
                                
                            <div className="signature-buttons">
                                <button onClick={clearSignature} className="button is-light">Clear</button>
                                <button onClick={saveSignature} className="button is-primary">Save</button>
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
    const [formData, setFormData] = useState<any>({
        firstName: '',
        lastName: '',
        gender: '',
        phoneNumber: '',
        practiceAddress: '',
        providerType: '',
        specialty: '',
        npiNumber: '',
        stateLicenseNumber: '',
        deaNumber: ''
    });
    const [signature, setSignature] = useState<File | null>(null);
    const [isNew, setIsNew] = useState<boolean>(true);
    const notyf = new Notyf();
    const [loading, setLoading] = useState(true);

    const handleGeneralDataSubmit = async () => {
        if (user) {
            const data = new FormData();
        
            data.append('userId', user.id);
            data.append('email', user.email);
        
            Object.keys(formData).forEach(key => {
                if (key !== 'userId' && key !== 'email' && key !== '_id' && key !== '__v') {
                    data.append(key, formData[key]);
                }
            });
        
            if (signature) {
                data.append('signature', signature);
            }
        
            try {
                const response = await fetch(`http://localhost:8000/api/user_details/${isNew ? 'create' : `update/${user.id}`}`, {
                    method: isNew ? 'POST' : 'PATCH',
                    body: data,
                });
        
                if (!response.ok) {
                    throw new Error('Failed to update user data');
                }
        
                const results = await response.json();
                notyf.success('User data updated successfully');
            } catch (error) {
                console.error('Failed to update user data:', error);
                notyf.error('Failed to update user data');
            }
        } else {
            console.log('User is not defined');
        }
    };



    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user) {
                console.log('Fetching user details...');
                try {
                    const response = await fetch(`http://localhost:8000/api/user_details/${user.id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user details');
                    }
                    const data = await response.json();
                    if (data) {
                        console.log('User details:', data);
                        setFormData(data);
                        setIsNew(false); // If data exists, set isNew to false
                    }

                    if (data.signature) {
                        const signatureResponse = await fetch(`http://localhost:8000/api/user_details/signature/${data.signature}`);
                        if (signatureResponse.ok) {
                            const signatureBlob = await signatureResponse.blob();
                            const file = new File([signatureBlob], 'signature.png', { type: 'image/png' });
                            setSignature(file);
                            console.log('Signature file created:', file);
                        }
                    }
                    setLoading(false); // Set loading to false after data is fetched
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [user]);

    useEffect(() => {
        console.log('final sig', signature);
    }, [signature]);
    
    return (
        <div className="account-wrapper">
            <div className="columns">
                <div className="column is-4">
                    <div className="account-box is-navigation">
                        <div className="media-flex-center">
                            <FakeAvatar 
                                FirstName={formData.firstName !== '' ? formData.firstName : 'U'} 
                                LastName={formData.lastName !== '' ? formData.lastName : 'K'} 
                                Size={AvatarSize.Medium}
                            />
                            <div className="flex-meta">
                                <span>
                                    {formData.firstName !== '' ? formData.firstName : 'Unknown'} 
                                    {formData.lastName !== '' ? formData.lastName : ''}
                                </span>
                                <span>{formData.providerType !== '' ? formData.providerType : 'Unknown'}</span>
                            </div>
                        </div>

                        <div className="account-menu">
                            <a
                                className={`account-menu-item ${general ? 'is-active' : ''}`}
                                // onClick={() => { setGeneral(true); setSettings(false); }}
                            >
                                <i className="lnil lnil-user-alt"></i>
                                <span>General</span>
                                <span className="end">
                                    <i aria-hidden="true" className="fas fa-arrow-right"></i>
                                </span>
                            </a>
                            {/* <a
                                href="/admin-profile-edit-4.html"
                                className={`account-menu-item ${settings ? 'is-active' : ''}`}
                                onClick={() => { setGeneral(false); setSettings(true); }}
                            >
                                <i className="lnil lnil-cog"></i>
                                <span>Settings</span>
                                <span className="end">
                                    <i aria-hidden="true" className="fas fa-arrow-right"></i>
                                </span>
                            </a> */}
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
                        {!loading && <ProfileFormBody formData={formData} onUpdateFormData={setFormData} onSignatureChange={setSignature} signature={signature} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;

function load() {
    throw new Error("Function not implemented.");
}
function RestorationEffect(arg0: () => void, arg1: any[]) {
    throw new Error("Function not implemented.");
}

