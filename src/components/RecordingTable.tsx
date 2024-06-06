import React, { useState, useEffect, useRef } from "react";
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
import formatDate from "../helpers/DataManipulation";
import { useNavigate } from "react-router-dom";
import FlexTable from "./FlexTable";

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
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1);
  const isFetching = useRef(false);

  const fetchRecordings = async (page: number) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const response = await fetch(`http://localhost:8000/api/transcriptions?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const result = await response.json();
      const transcriptions = result.transcriptions;
      const parsedData = transcriptions.map((recording: Transcription, index: number) => {
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
      setData((prevData) => {
        const newTranscriptions = parsedData.filter((newTranscription: TableRowData) => !prevData.some(transcription => transcription.gridID === newTranscription.gridID));
        return [...prevData, ...parsedData]; //fix this
      });
      setHasMore(page < result.totalPages);
      console.log("Data:", parsedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      isFetching.current = false;
    }
  };



  useEffect(() => {
    fetchRecordings(page); // Call the function
  }, [page]);

  useEffect(() => {
    const pollData = async () => {
      await fetchRecordings(page);
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

  const loadMoreData = () => {
    if (hasMore && !isFetching.current) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || !hasMore) {
        return;
      }
      loadMoreData();
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore]);

  return (
    <FlexTable
        titles = {["Name", "DOB", "Actions"]}
        hasMore = {hasMore}
        loadMore = {loadMoreData}
    >
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
    </FlexTable>
              
  );
};

export default RecordingsFlexTable;
