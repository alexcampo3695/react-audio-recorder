import React, { ChangeEvent, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";


interface EncounterSummary {
  summary: string;
}



const AudioUploader: React.FC<EncounterSummary> = ({ summary }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="profile-card">
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
    </div>
  );
};

export default AudioUploader;