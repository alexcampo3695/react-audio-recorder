import React from "react";
import AudioRecorder from "../components/AudioRecordingComponent";
import AudioUploader from "../components/AudioUploader";
import { Link } from "react-router-dom";

interface RecorderPageProps {
  onRecordingComplete: (blob: Blob) => void;
  onFileUpload: (file: File) => void;
}

const RecorderPage: React.FC<RecorderPageProps> = ({ onRecordingComplete, onFileUpload }) => {
  return (
    <div>
      <h1>Recorder Page</h1>
      <AudioRecorder onRecordingComplete={onRecordingComplete} />
      <AudioUploader onFileUpload={onFileUpload} />
      <nav>
        <Link to="/table">Go to Table Page</Link>
        <Link to="/summary">Go to Summary Page</Link>
      </nav>
    </div>
  );
}

export default RecorderPage;

