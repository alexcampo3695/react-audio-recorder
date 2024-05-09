import React from "react";
import AudioRecorder from "../components/AudioRecordingComponent";
import AudioUploader from "../components/AudioUploader";
import { Link, useLocation } from "react-router-dom";
import PatientDetails from "./PatientDetails";
import AppWrapper from "./AppWrapper";

interface RecorderPageProps {
  onRecordingComplete: (blob: Blob) => void;
  onFileUpload: (file: File) => void;
}

const RecorderPage: React.FC<RecorderPageProps> = ({ onRecordingComplete, onFileUpload }) => {

  const location = useLocation();
  const patientData = location.state?.patientData;
  
  async function handleRecordingComplete(blob: Blob) {
    const formData = new FormData();
    formData.append("recording", blob);
    formData.append("patientData", JSON.stringify(patientData));
    console.log('PatientData:', patientData);

    await fetch("http://localhost:8000/upload_recording", {
      method: "POST",
      body: formData,
    });

    onRecordingComplete(blob);
  }

  return (
    <AppWrapper
      children = {
        <div>
          <h1>Recorder Page</h1>
            <AudioRecorder onRecordingComplete={onRecordingComplete} />
            <AudioUploader onFileUpload={onFileUpload} />
            {patientData && <PatientDetails patientData={patientData} />}
          {/* <nav>
            <Link to="/table">Go to Table Page</Link>
            <Link to="/summary">Go to Summary Page</Link>
          </nav> */}
        </div>
      }
      
      title = "Recorder"
    />
    
  );
}

export default RecorderPage;

