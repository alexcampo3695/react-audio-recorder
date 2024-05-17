import './styles/huro/scss/main.scss';
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { transcribeAudio } from "./helpers/transcribe";
import RecordingPage from './pages/Recorder';
import RecordingsTable from './pages/RecordingsTablePage';
import SummaryPage from './pages/PatientSummary';
import CreatePatientForm from './components/CreatePatientForm';
import Home from './pages/Home';
import AppWrapper from './pages/AppWrapper';
import RecorderPage from './pages/Recorder';
import HomeComponent from './components/HomeComponent';
import AudioPlayer from './components/Summary';


const audioTable = document.createElement("table");
document.body.appendChild(audioTable);

interface AudioData {
  source: 'recording' | 'upload';
  blob: Blob;
  transcription: string;
  summary: string;
}

const App: React.FC = () => {
  const [audioDataList, setAudioDataList] = useState<AudioData[]>([]);
  const [selectedTranscription, setSelectedTranscription] = useState("");

  const addAudioElement = async (source: 'recording' | 'upload' ,blob: Blob) => {
    try { 
      const response = await transcribeAudio(blob);
      const transcription = response.text;
      setAudioDataList((prevList) => [
        ...prevList, 
        { source, blob, transcription, summary: "" }
      ]);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const handleSummarySubmit = (transcription: string, summary: string) => {
    setAudioDataList((prevList) => {
      const updatedList = [...prevList];
      const index = updatedList.findIndex((audioData => audioData.transcription === transcription))
      if (index !== -1) {
        updatedList[index] = {
          ...updatedList[index],
          summary,
        };
      }
      return updatedList;
    });
  };

  const handleTranscriptionClick = (transcription:string) => {
    setSelectedTranscription(transcription);
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home/>
          }
        />
        <Route
          path="/recorder"
          element={
            <RecorderPage
              onRecordingComplete={(blob) => addAudioElement('recording', blob)}
              onFileUpload={(file) => addAudioElement('upload', file)}
            />
          }
        />
        <Route
          path="/table"
          element={<RecordingsTable audioDataList={audioDataList} onTranscriptionClick={handleTranscriptionClick} />}
        />
        <Route
          path="/summary"
          element={<AudioPlayer 
            fileID={'6643aca0676ae55032da7ee9'}  
          />}
        />
      </Routes>
    </Router>

  );
};



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);