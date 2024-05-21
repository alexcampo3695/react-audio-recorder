import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface EncounterSummaryProps {
  fileId: string;
}

interface SummaryResponse {
  _id: string;
  fileId: string;
  summary: string;
  __v: number;
}

const EncounterSummaryComponent: React.FC<EncounterSummaryProps> = ({ fileId }) => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/encounter_summary/file/${fileId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch summary: ${response.status}`);
        }
        const data: SummaryResponse = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    };

    fetchSummary();
  }, [fileId]);

  return (
    // <div className="profile-card">
      <div className="profile-card-section">
        <div className="section-title">
          <h4>Encounter Summary</h4>
          {/* <a><i className="lnil lnil-pencil"></i></a> */}
        </div>
        <div className="section-content">
          <p className="description">
            {summary}
          </p>
        </div>
      </div>
    // </div>
  );
};

export default EncounterSummaryComponent;
