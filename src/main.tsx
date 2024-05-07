import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { transcribeAudio } from "./helpers/transcribe";
import RecordingPage from './pages/Recorder';
import RecordingsTable from './pages/RecordingsTable';
import SummaryPage from './pages/PatientSummary';



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
            <RecordingPage
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
          element={<SummaryPage selectedTranscription={selectedTranscription} onSummarySubmit={handleSummarySubmit} />}
        />
      </Routes>
    </Router>

  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);