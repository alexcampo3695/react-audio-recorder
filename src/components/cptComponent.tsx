import React, { useEffect, useState } from "react";

import NoData from "./NoData";
import { API_BASE_URL } from "../config";


interface CPT10RowData {
  id: string;
  code: string;
  description: string;
  status: boolean;
  onStatusChange: (id: string, newStatus: boolean) => void;
}

const CPTRow: React.FC<CPT10RowData> = ({ id, code, description, status, onStatusChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCPTStatusChange = () => {
    const newStatus = !isChecked;
    setIsChecked(newStatus);
    onStatusChange(id, newStatus);
  }
  return (
    <div className="inner-list-item media-flex-center">
        <div 
          className={`animated-checkbox ${status === true ? 'is-checked' : 'is-unchecked'}`}
        >
            <input 
              type="checkbox"
              onClick = {() => setIsChecked(!isChecked)}
              onChange = {handleCPTStatusChange}
            >
            </input>
            <div className="checkmark-wrap">
                <div className="shadow-circle"></div>
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"></circle>
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
                </svg>
            </div>
        </div>
        <div className="flex-meta is-light">
            <a href="#">{description}</a>
            <span>{code}</span>
        </div>
        <div className="flex-end">
            {/* hardcoded need to take care of! */}
            <span 
              className={`tag is-rounded ${status === true ? 'is-success' : 'is-light'}`}
            >
                {status === true ? 'Active' : 'Inactive'}
            </span> 
        </div>
    </div>
  );
};
interface CPTComponentProps {
  fileId: string;
}

interface CPTResponse {
  _id: string;
  fileId: string;
  code: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const CPTComponent: React.FC<CPTComponentProps> = ({ fileId }) => {
  const [cpts, setCPTs] = useState<CPTResponse[] | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchCPTCodes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cpt/file/${fileId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch cpt codes: ${response.status}`);
        }
        const data: CPTResponse[] = await response.json();
        setCPTs(data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    };

    fetchCPTCodes();
  }, [fileId]);

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      await fetch(`/api/cpt/update/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setCPTs(prevCPTs => 
        prevCPTs?.map(cpt =>
          cpt._id === id ? {...cpt, status: newStatus} : cpt
        ) || null
      );
    } catch (error) {
      console.error('Failed to update cpt status:', error);
    }
  }

  return (
    <div className="list-widget list-widget-v2 tabbed-widget">
      <div className="widget-head">
          <h3 className="dark-inverted">CPT Codes</h3>
          <div className="tabbed-controls">
              <a className="tabbed-control is-active">
                  <span>All</span>
              </a>
              <a className="tabbed-control">
                  <span>Mine</span>
              </a>
              <div className="tabbed-naver"></div>
          </div>
      </div>

      <div className="inner-list-wrapper is-active">
          <div className="inner-list">
              {cpts?.length === 0 ? (
                <NoData 
                  Title='No CPT Codes Found'
                  Subtitle= 'There have been no CPT Codes found in this transcription file.'
                />
              ) : (
                cpts?.map(cpt => (
                  <CPTRow
                    key={cpt._id}
                    id={cpt._id}
                    code={cpt.code}
                    description={cpt.description}
                    status={cpt.status}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}

          </div>
      </div>
  </div>
  );
};

export default CPTComponent;
