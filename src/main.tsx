import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import AudioRecorder from "./components/AudioRecordingComponent";
import FlexTable from "./components/FlexTable";
import SummaryComponent from "./components/Summary";
import { transcribeAudio } from "./helpers/transcribe";
import AudioUploader from "./components/AudioUploader";


const audioTable = document.createElement("table");
document.body.appendChild(audioTable);

let audioCount = 0;



interface AudioData {
  source: 'recording' | 'upload';
  blob: Blob;
  transcription: string;
  summary: string;
}

const App = () => {
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
    <React.StrictMode>
      <AudioUploader onFileUpload={(file) => addAudioElement('upload', file)} />
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement('recording', blob)}
        onNotAllowedOrFound={(err) => console.table(err)}
        showVisualizer={true}
        downloadOnSavePress
        downloadFileExtension="mp3"
      />
      <FlexTable
        data={audioDataList.map((audioData, index) => ({
          number: index + 1,
          patientName: `Alex Campo`,
          eventDate: new Date(),
          recordingBlob: audioData.blob,
          transcription: "",
          source: audioData.source,
        }))}
        onTranscriptionClick={handleTranscriptionClick}
      />
      {selectedTranscription && (
        <SummaryComponent 
          transcription={selectedTranscription} 
          onSummarySubmit={handleSummarySubmit}
        />
      )}
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);