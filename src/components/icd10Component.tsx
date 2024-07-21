import React, { useEffect, useState } from "react";
import NoData from "./NoData";
import { API_BASE_URL } from "../config";
import Modal from "./Modal";
import AutoComplete from "./AutoComplete";


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
            <a> {description} </a>
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
  fileId?: string;
  patientId?: string;
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

const Icd10Component: React.FC<Icd10ComponentProps> = ({ fileId, patientId }) => {
  const [icd10s, setIcd10s] = useState<Icd10Response[] | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [customIcd, setCustomIcd] = useState<boolean>(false);

  useEffect(() => {
    const fetchIcd10Codes = async () => {
      const url = fileId 
        ? `${API_BASE_URL}/api/icd10/file/${fileId}` 
        : `${API_BASE_URL}/api/icd10/patient/${patientId}`;
      try {
        const response = await fetch(url);
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
  }, [fileId, customIcd]);

  console.log('icd10s:', icd10s);

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      await fetch(`${API_BASE_URL}/api/icd10/update/${id}`, {
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
          <button 
              className="button is-primary is-circle is-elevated"
              onClick={() => setCustomIcd(true)}
          >
              <span className="icon is-small">
              <i 
                  aria-hidden="true"
                  style={{color: 'white'}}
                  className="fas fa-plus">
              </i>
              </span>
          </button>
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
      {customIcd && (
          <Modal
              ModalTitle="Add ICD10 Codes"
              Type='custom'
              hasButtons={false}
              Children={
                <AutoComplete 
                  type='icd10s' 
                  patientId={patientId || ''} 
                  input='' 
                  fileId={fileId || ''}
                  onClose={() => setCustomIcd(false)}
                />
              }
              IsLarge={true}
              onClose={() => setCustomIcd(false)}
          />
      )}
  </div>
  );
};

export default Icd10Component;
