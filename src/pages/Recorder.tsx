import React, { useState } from "react";
import AudioRecorder from "../components/AudioRecordingComponent";
import AudioUploader from "../components/AudioUploader";
import { Link, useLocation } from "react-router-dom";
import PatientDetails from "./PatientDetails";
import AppWrapper from "./AppWrapper";
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import "../styles/recorder-button.scss";
import UserProfile from "../components/UserProfile";

interface RecorderPageProps {
  onRecordingComplete: (blob: Blob) => void;
  onFileUpload: (file: File) => void;
}

const RecorderPage: React.FC<RecorderPageProps> = ({
  onRecordingComplete,
  onFileUpload,
}) => {
  const location = useLocation();
  const patientData = location.state?.patientData;
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordingStateChange = (isRecording: boolean) => {
    setIsRecording(isRecording);
  };

  async function handleRecordingComplete(blob: Blob) {
    const formData = new FormData();
    formData.append("recording", blob);
    formData.append("patientData", JSON.stringify(patientData));
    console.log("PatientData:", patientData);
    await fetch("http://localhost:8000/upload_recording", {
      method: "POST",
      body: formData,
    });
    onRecordingComplete(blob);
    setIsRecording(false);
  }

  return (
    
    <AppWrapper
      children={
        <div>
          {/* <UserProfile FirstName="John" LastName="Doe" DateOfBirth="01/01/1990" /> */}
          {/* <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onRecordingStateChange={handleRecordingStateChange}
            isRecording={isRecording} 
          />
          <AudioUploader onFileUpload={onFileUpload} />
          {patientData && <PatientDetails patientData={patientData} />} */}
          {/* {isRecording && (
            <div className={`antidote-recorder-button ${isRecording ? 'is-recording' : ''}`}>
              <img className="light-image recorder-emblem" src={antidoteEmblem} alt="" />
            </div>
          )} */}
          <div className="antidote-recorder-container">
            <div className="antidote-recorder-button">
              <img className="light-image recorder-emblem" src={antidoteEmblem} alt="" />
              <img className="dark-image recorder-emblem" src={antidoteEmblem} alt="" />
            </div>
          </div>
          <div className="antidote-controls-container">
            <div className="deleted">
            <i><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></i>
            </div>
            <div className="pause">
              <span>Resume</span>
            </div>
            <div className="complete">
              <i><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></i>
            </div>
          </div>
        </div>
      }
      title="Recorder"
    />
  );
};

export default RecorderPage;