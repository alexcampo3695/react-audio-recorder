import React, { useState, useMemo, useCallback } from "react"; 
import AudioRecorder from "../components/AudioRecordingComponent";
// import AudioUploader from "../components/AudioUploader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PatientDetails from "./PatientDetails";
import AppWrapper from "./AppWrapper";
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import "../styles/recorder-button.scss";
import UserProfile from "../components/UserProfile";
import { transcribeAudio } from "../helpers/transcribe";
import AudioUploader from "../components/AudioUploader";

interface RecorderPageProps {
  onRecordingComplete: (blob: Blob) => void;
  onFileUpload: (file: File) => void;
}

interface PatientData {
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  // Add other fields as necessary
}

interface LocationState {
  patientData?: PatientData;
}

const RecorderPage: React.FC<RecorderPageProps> = ({
  onRecordingComplete,
  onFileUpload,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Properly memoize patientData
  const patientData = useMemo(() => {
    const state = location.state as LocationState;
    console.log('Derived state:', state);
    return state?.patientData ?? null;  // Return null if patientData is undefined
  }, [location.state]);  // Dependency on location.state

  const [isRecording, setIsRecording] = useState(false);

  const handleRecordingStateChange = useCallback((isRecording: boolean) => {
    setIsRecording(isRecording);
  }, []);

  async function handleRecordingComplete(blob: Blob) {
    const formData = new FormData();
    formData.append("recording", blob, "recording.webm");
    console.log("Patient Data to be sent:", JSON.stringify(patientData));
    
    if (patientData) {
      formData.append("patientData", JSON.stringify(patientData));  // Correct the key here
    } else {
      console.error("No patient data found");
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/audio/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Recording uploaded successfully", data);
        onRecordingComplete(blob);
        setIsRecording(false);
        navigate('/table');
      } else {
        console.error("Error uploading recording: Server responded with status", response.status);
      }
    } catch (error) {
      console.error("Error uploading recording:", error);
    }
  }
  
  const [activeTab, setActiveTab] = useState('create');
    
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  }

  const memoizedAudioRecorder = useMemo(() => (
    <AudioRecorder
      onRecordingComplete={handleRecordingComplete}
      onRecordingStateChange={handleRecordingStateChange}
      isRecording={isRecording}
    />
  ), [handleRecordingComplete, handleRecordingStateChange, isRecording]);

  return (
    <AppWrapper
      title="Recorder"
      children={
        <div>
          <div 
            // className="tabs-inner switch"
          >
            <div 
              // className="tabs"
            >
              <ul>
                <li 
                  data-tab="active-items-tab" 
                  className={activeTab === 'create' ? "is-active" : ''}
                  onClick={() => handleTabClick('create')}
                >
                  <a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-upload-cloud">
                      <polyline points="16 16 12 12 8 16"></polyline>
                      <line x1="12" y1="12" x2="12" y2="21"></line>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                      <polyline points="16 16 12 12 8 16"></polyline>
                    </svg>
                    <span>Create Patient</span>
                  </a>
                </li>
                <li 
                  data-tab="inactive-items-tab"
                  className={activeTab === 'existing' ? "is-active" : ''}
                  onClick={() => handleTabClick('existing')}
                >
                  <a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-users">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>Existing Patients</span>
                  </a>
                </li>
                <li className="tab-naver"></li>
              </ul>
            </div>
          </div>
          {activeTab === 'create' ? (
            memoizedAudioRecorder
          ) : (
            <AudioUploader onFileUpload={onFileUpload} />
            
          )}
          {/* { patientData && <PatientDetails patientData={patientData} />} */}
        </div>
      }
    />
  );
};

export default RecorderPage;
