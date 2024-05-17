import React, { ChangeEvent, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { transcribeAudio } from "../helpers/transcribe";

interface AudioUploaderProps {
  onFileUpload: (file: Blob) => void;
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



const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileUpload }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Properly memoize patientData
  const patientData = useMemo(() => {
    const state = location.state as LocationState;
    console.log('Derived state:', state);
    return state?.patientData ?? null;  // Return null if patientData is undefined
  }, [location.state]);  // Dependency on location.state

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const blob = new Blob([file], { type: "audio/wav" })

    const formData = new FormData();
    formData.append("recording", blob, "recording.webm");
    console.log("Patient Data to be sent:", JSON.stringify(patientData));
    
    if (patientData) {
      formData.append("patientData", JSON.stringify(patientData));  // Correct the key here
    } else {
      console.error("No patient data found");
    }
    
    console.log("Form Data entries:");
    for (const entry of formData.entries()) {
      console.log(entry);
    }
  
    try {
      const transcriptionResponse = await transcribeAudio(blob);
      const transcription = transcriptionResponse.text;
      console.log("Transcription:", transcription);
  
      formData.append("transcription", transcription);
  
      
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Recording uploaded successfully", data);
        onFileUpload(blob);
        navigate('/table');
      } else {
        console.error("Error uploading recording: Server responded with status", response.status);
      }
    } catch (error) {
      console.error("Error uploading recording:", error);
    }
  }

  return (
    <div>
      <input type="file" accept=".wav,.mp3" onChange={handleUpload} />
    </div>
  );
};

export default AudioUploader;