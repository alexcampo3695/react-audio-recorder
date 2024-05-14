import React, { useEffect, useState } from 'react';


interface AudioPlayerProps {
  fileID: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ fileID }) => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const respone = await fetch(`http://localhost:8000/upload/${fileID}`);
        if (!respone.ok) {
          throw new Error(`Failed to fetch audio: ${respone.status}`);
        }
        const blob = await respone.blob();

        const url = window.URL.createObjectURL(blob);
        setAudioSrc(url);

      } catch (error) {
        console.error('Failed to fetch audio:', error);
      }
    };

    fetchAudio();

    // Clean up the object URL when the component unmounts
    return () => {
      if (audioSrc) {
        window.URL.revokeObjectURL(audioSrc);
      }
    };
  }, [fileID]);

  return (
    <div>
      <h1>Audio Player</h1>
      {audioSrc ? (
        <audio controls>
          <source src={audioSrc} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AudioPlayer;
