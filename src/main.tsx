import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import AudioRecorder from "./components/AudioRecordingComponent";
import FlexTable from "./components/FlexTable";

const audioTable = document.createElement("table");
document.body.appendChild(audioTable);

let audioCount = 0;

interface AudioData {
  url: string;
  blob: Blob;
}

const App = () => {
  const [audioDataList, setAudioDataList] = useState<Blob[]>([]);

  const addAudioElement = (blob: Blob) => {
    setAudioDataList((prevList) => [...prevList, blob]);
  };

  return (
    <React.StrictMode>
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
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
          recordingBlob: audioData,
          transcription: "",
        }))}
      />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);