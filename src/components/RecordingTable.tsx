import React, { useState, useEffect } from "react";
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
import formatDate from "../helpers/DataManipulation";
import { useNavigate } from "react-router-dom";

interface MetaData {
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
}

interface Transcription {
  _id: string;
  filename: string;
  transcription: string;
  patientData: MetaData;
  fileId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TableRowData {
  number: number;
  firstName: string;
  lastName: string;
  eventDate: string;
  gridID: string;
  status: string;
}


const RecordingFlexItem: React.FC<TableRowData> = ({
  number,
  firstName,
  lastName,
  eventDate,
  gridID,
  status,
}) => {

  const navigate = useNavigate();
  
  const handleItemClick = () => {
    navigate(`/summary/${gridID}`);
  }
  
  return (
    <div className="flex-table-item" onClick={handleItemClick} style ={{ cursor: 'pointer'}}>
      <div className="flex-table-cell is-media is-grow">
        <FakeAvatar FirstName={firstName} LastName={lastName} Size={AvatarSize.Small} />
        <div>
          <span className="item-name strokeWidth-inverted">{firstName} {lastName}</span>
          <span className="item-meta">
            <span>Patient</span>
          </span>
        </div>
      </div>
      <div className="flex-table-cell" data-th="Upload Date">
        <span className="light-text">{eventDate}</span>
      </div>
      <div className="flex-table-cell" data-th="ID">
        {status === 'complete' 
          ?   <span className="tag is-rounded is-success is-elevated">Complete</span> 
          :   <span 
                className="tag is-rounded is-orange is-elevated"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                  Transcribing
                  <span className="spinner"></span>
              </span>
        }
      </div>
      <div className="flex-table-cell cell-end" data-th="Actions">
        <div className="dropdown is-spaced is-dots is-right dropdown-trigger is-pushed-mobile is-up">
          <div className="is-trigger" aria-haspopup="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
          </div>
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <a href="#" className="dropdown-item is-media">
                <div className="icon">
                  <i className="lnil lnil-eye"></i>
                </div>
                <div className="meta">
                  <span>View</span>
                  <span>View user details</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const RecordingsFlexTable: React.FC = () => {
  const [data, setData] = useState<TableRowData[]>([]);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchRecordings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/transcriptions');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data: Transcription[] = await response.json();
      const parsedData = data.map((recording: Transcription, index: number) => {
        const metadata = recording.patientData || { FirstName: 'Unknown', LastName: 'Unknown', DateOfBirth: 'Unknown' };
        return {
          number: index + 1,
          firstName: metadata.FirstName,
          lastName: metadata.LastName,
          birthDate: metadata.DateOfBirth,
          gridID: recording._id,
          eventDate: recording.createdAt,
          status: recording.status
        };
      });
      setData(parsedData);
      console.log("Data:", parsedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };


  useEffect(() => {
    fetchRecordings(); // Call the function
  }, []);

  useEffect(() => {
    const pollData = async () => {
      await fetchRecordings();
    };

    pollData();
    const interval = setInterval(pollData, 5000);
    setPollingInterval(interval);

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    }
  }, []);



  return (
    <div>
      <div className="list-flex-toolbar">
        <div className="control has-icon">
          <input 
            className="input custom-text-filter" 
            placeholder="Search..." 
            data-filter-target=".flex-table-item"
          />
          <div className="form-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>
      </div>
      <div className="page-content-inner">
        <div className="flex-list-wrapper flex-list-v1">
          <div className="flex-table">
            <div className="flex-table-header" data-filter-hide="">
              <span className="is-grow">Patient</span>
              <span>Upload Date</span>
              <span>Status</span>
              <span className="cell-end">Actions</span>
            </div>
            <div className="flex-list-inner">
              {data.map((item) => (
                <RecordingFlexItem
                  key={item.gridID}
                  number={item.number}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  eventDate={formatDate(item.eventDate)}
                  gridID={item.gridID}
                  status={item.status}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingsFlexTable;
