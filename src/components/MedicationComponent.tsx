import React, { useEffect, useState } from "react";
import NoData from "./NoData";
import { API_BASE_URL } from "../config";
import AutoComplete from "./AutoComplete";
import Modal from "./Modal";


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

interface MedicationComponentProps {
  fileId?: string;
  patientId?: string;
}

interface MedicationResponse {
  medicationId: string;
  patientId: string;
  fileId: string;
  drugCode: string;
  drugName: string;
  dosage: string;
  frequency: string;
  fillSupply: number;
  methodOfIngestion: string; // e.g., orally, intravenously, etc.
  startDate: Date;
  endDate?: Date;
  status: boolean;
}


const MedicationComponent: React.FC<MedicationComponentProps> = ({ fileId, patientId }) => {
  const [medications, setMedications] = useState<MedicationResponse[] | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [customMedications, setCustomMedications] = useState<boolean>(false);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const url = fileId ? `${API_BASE_URL}/api/medications/file/${fileId}` : `${API_BASE_URL}/api/medications/patient/${patientId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch medications codes: ${response.status}`);
        }
        const data: MedicationResponse[] = await response.json();

        const uniqueMedicationsMap = new Map<string, MedicationResponse>();
        data.forEach(medication => {
          const key = `${medication.drugName}-${medication.dosage}`;
          if(!uniqueMedicationsMap.has(key)) {
            uniqueMedicationsMap.set(key, medication);
          }
        })

        const uniqueMedications = Array.from(uniqueMedicationsMap.values());
        setMedications(uniqueMedications);
      } catch (error) {
        console.error('Failed to fetch medications:', error);
      }
    };

    fetchMedications();
  }, [fileId, customMedications]);

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      await fetch(`/api/medications/update/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // setMedications(prevMedications => 
      //   prevMedications?.map(medication =>
      //     medication.medicationId === id ? {...medications, status: newStatus} : medications
      //   ) || null
      // );
    } catch (error) {
      console.error('Failed to update medication status:', error);
    }
  }

  console.log('fileId:', fileId);

  return (
    <div className="list-widget list-widget-v2 tabbed-widget">
      <div className="widget-head">
          <h3 className="dark-inverted">Medications</h3>
          <button 
              className="button is-primary is-circle is-elevated"
              onClick={() => setCustomMedications(true)}
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
              {medications?.length === 0 ? (
                <NoData 
                  Title='No Medications Found'
                  Subtitle= 'There have been no medications found in this transcription file.'
                />
              ) : (
                medications?.map(medication => (
                  <Icd10Row
                    key={medication.medicationId}
                    id={medication.medicationId}
                    code={medication.dosage}
                    description={medication.drugName}
                    status={medication.status}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
          </div>
      </div>
      {customMedications && (
          <Modal
              ModalTitle="Add Medications"
              Type='custom'
              hasButtons={false}
              Children={
                <AutoComplete 
                  type='medications' 
                  patientId={patientId || ''} 
                  input='' 
                  fileId={fileId || ''}
                  onClose={() => setCustomMedications(false)}
                />
              }
              IsLarge={true}
              onClose={() => setCustomMedications(false)}
          />
      )}
  </div>
  );
};

export default MedicationComponent;
