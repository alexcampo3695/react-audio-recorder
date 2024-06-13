import React, { useState, useMemo, useCallback } from "react"; 
import AudioRecorder from "../components/AudioRecordingComponent";
import { Link, useLocation, useHistory } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import "../styles/recorder-button.scss";
import AudioUploader from "../components/AudioUploader";
import { useUser } from "../context/UserContext";
import IonicAudioRecorder from "../components/IonicAudioRecorder";

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
  const history = useHistory();
  const location = useLocation();


  const patientData = useMemo(() => {
    const state = location.state as LocationState;
    console.log('Derived state:', state);
    return state?.patientData ?? null;
  }, [location.state]);  // Dependency on location.state

  const [isRecording, setIsRecording] = useState(false);
  const { user } = useUser();

  const handleRecordingStateChange = useCallback((isRecording: boolean) => {
    setIsRecording(isRecording);
  }, []);

  async function handleRecordingComplete(blob: Blob) {
    const formData = new FormData();
    formData.append("recording", blob, "recording.webm");
    
    if (patientData) {
      formData.append("patientData", JSON.stringify(patientData));  // Correct the key here
    } else {
      console.error("No patient data found");
    }

    if (user) {
      formData.append("userId", user.id);
    } else {
      console.error("No user data found");
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/audio/upload", {
        method: "POST",
        body: formData,
      });
      console.log('formData', formData)
      if (response.ok) {
        const data = await response.json();
        onRecordingComplete(blob);
        setIsRecording(false);
        history.push('/table');
      } else {
        console.error("Error uploading recording: Server responded with status", response.status);
      }
    } catch (error) {
      console.error("Error uploading recording:", error);
    }
  }
  
  const [activeTab, setActiveTab] = useState('record');
    
  const handleTabClick = (tab: string, event:React.MouseEvent) => {
    event.preventDefault()
    setActiveTab(tab);
    console.log(activeTab)
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
        <>
          <div className="tabs-wrapper is-slider is-squared" style={{display: 'flex', justifyContent: 'center'}}>
            <div className="tabs-inner">
                <div className="tabs">
                  <ul>
                    <li 
                      data-tab="team-tab1" 
                      className={activeTab === 'record' ? 'is-active' : ''}
                      onClick={(e) => handleTabClick('record', e)}
                    >
                      <a>
                        <span>Recorder</span>
                      </a>
                    </li>
                    <li 
                      data-tab="projects-tab1"
                      className={activeTab === 'upload' ? 'is-active': ''}
                      onClick={(e) => handleTabClick('upload', e)}
                    >
                      <a>
                        <span>Upload</span>
                      </a>
                    </li>
                    <li className="tab-naver"></li>
                  </ul>
                </div>
            </div>
          </div>
          <div>
            {activeTab === 'record' ? (
              <IonicAudioRecorder />
            ) : (
              <AudioUploader onFileUpload={onFileUpload} />
              
            )}
            {/* { patientData && <PatientDetails patientData={patientData} />} */}
          </div>
        </>
      }
    />
  );
};

export default RecorderPage;
