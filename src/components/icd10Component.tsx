import React, { useEffect, useState } from "react";
import NoData from "./NoData";
import { API_BASE_URL } from "../config";


interface Icd10RowData {
  id: string;
  code: string;
  description: string;
  status: boolean;
  onStatusChange: (id: string, newStatus: boolean) => void;
}

const Icd10Row: React.FC<Icd10RowData> = ({ id, code, description, status, onStatusChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleICD10StatusChange = () => {
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
              onChange = {handleICD10StatusChange}
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
interface Icd10ComponentProps {
  fileId: string;
}

interface Icd10Response {
  _id: string;
  fileId: string;
  code: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Icd10Component: React.FC<Icd10ComponentProps> = ({ fileId }) => {
  const [icd10s, setIcd10s] = useState<Icd10Response[] | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchIcd10Codes = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch(`${API_BASE_URL}/api/icd10/file/${fileId}`);
=======
        const response = await fetch(`api/icd10/file/${fileId}`);
>>>>>>> 9012301133c1efa5e3e08e5b483030ef462be5fc
        if (!response.ok) {
          throw new Error(`Failed to fetch icd10 codes: ${response.status}`);
        }
        const data: Icd10Response[] = await response.json();
        setIcd10s(data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    };

    fetchIcd10Codes();
  }, [fileId]);

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
<<<<<<< HEAD
      await fetch(`${API_BASE_URL}/api/icd10/update/${id}`, {
=======
      await fetch(`/api/icd10/update/${id}`, {
>>>>>>> 9012301133c1efa5e3e08e5b483030ef462be5fc
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setIcd10s(prevIcd10s => 
        prevIcd10s?.map(icd10 =>
          icd10._id === id ? {...icd10, status: newStatus} : icd10
        ) || null
      );
    } catch (error) {
      console.error('Failed to update icd10 status:', error);
    }
  }

  return (
    <div className="list-widget list-widget-v2 tabbed-widget">
      <div className="widget-head">
          <h3 className="dark-inverted">ICD10 Codes</h3>
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
              {icd10s?.length === 0 ? (
                <NoData 
                  Title='No ICD10 Codes Found'
                  Subtitle= 'There have been no ICD10 codes found in this transcription file.'
                />
              ) : (
                icd10s?.map(icd10 => (
                  <Icd10Row
                    key={icd10._id}
                    id={icd10._id}
                    code={icd10.code}
                    description={icd10.description}
                    status={icd10.status}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}

          </div>
      </div>
  </div>
  );
};

export default Icd10Component;
