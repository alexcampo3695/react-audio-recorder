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
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onRecordingStateChange={handleRecordingStateChange}
            isRecording={isRecording} 
          />
          <AudioUploader onFileUpload={onFileUpload} />
          {patientData && <PatientDetails patientData={patientData} />}
          {/* {isRecording && (
            <div className={`antidote-recorder-button ${isRecording ? 'is-recording' : ''}`}>
              <img className="light-image recorder-emblem" src={antidoteEmblem} alt="" />
            </div>
          )} */}
        </div>
      }
      title="Recorder"
    />
  );
};

export default RecorderPage;