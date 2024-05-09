import React, { useState } from "react";
import AudioRecorder from "../components/AudioRecordingComponent";
import AudioUploader from "../components/AudioUploader";
import { Link, useLocation } from "react-router-dom";
import PatientDetails from "./PatientDetails";
import AppWrapper from "./AppWrapper";

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
          <h1>Recorder Page</h1>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onRecordingStateChange={handleRecordingStateChange}
            isRecording={isRecording} 
          />
          <AudioUploader onFileUpload={onFileUpload} />
          {patientData && <PatientDetails patientData={patientData} />}
          {isRecording && <span>Recording...</span>}
        </div>
      }
      title="Recorder"
    />
  );
};

export default RecorderPage;