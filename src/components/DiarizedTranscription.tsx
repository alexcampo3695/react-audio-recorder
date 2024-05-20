import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';


interface DiarizedComponentProps {
  fileId: string;
}

interface DiarizedResponse {
  _id: string;
  fileId: string;
  diarization: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const DiarizedComponent: React.FC<DiarizedComponentProps> = ({ fileId }) => {
  const [diarization, setDiarization] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiarization = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/diarization/file/${fileId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch summary: ${response.status}`);
        }
        const data: DiarizedResponse = await response.json();
        setDiarization(data.diarization);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    };

    fetchDiarization();
  }, [fileId]);

  return (
    <div 
      className={`collapse has-plus ${isActive ? 'is-active' : ''}`}
    >
      <div className="collapse-header">
          <h3>Transcribed Encounter</h3>
          <div className="collapse-icon"
            onClick = {() => setIsActive(!isActive)}
          >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
      </div>
      <div 
        className="collapse-content"
        style= {{display: isActive ? 'block' : 'none'}}
      >
          <ReactMarkdown>
              {diarization || ''}
          </ReactMarkdown>
      </div>
  </div>
  );
};

export default DiarizedComponent;
