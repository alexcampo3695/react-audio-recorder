import React, { ChangeEvent } from "react";

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".wav" onChange={handleFileChange} />
    </div>
  );
};

export default AudioUploader;