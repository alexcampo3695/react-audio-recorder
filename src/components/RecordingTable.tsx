import React, { useState, useEffect, useRef } from "react";
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
import formatDate from "../helpers/DataManipulation";
import { useHistory } from "react-router-dom";
import FlexTable from "./FlexTable";
// import { Table } from "mdast";
import { useUser } from "../context/UserContext";
import NoData from "./NoData";
import { API_BASE_URL } from "../config";

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
  fileId: string;
  status: string;
}


const RecordingFlexItem: React.FC<TableRowData> = ({
  number,
  firstName,
  lastName,
  eventDate,
  gridID,
  fileId,
  status,
}) => {

  const history = useHistory();
  
  const handleItemClick = () => {
    history.push(`/summary/${gridID}`);
    console.log('fileId', fileId)
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
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const fetchedIds = useRef(new Set<string>());
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const fetchRecordings = async (pageNum: number, shouldReset: boolean = false) => {
    if (!user || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/transcriptions?page=${pageNum}&limit=15&search=${searchTerm}&createdBy=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const result = await response.json();
      const transcriptions = result.transcriptions;
      const parsedData: TableRowData[] = transcriptions
        .map((recording: Transcription, index: number) => {
          const metaData = recording.patientData || { FirstName: 'Unknown', LastName: 'Unknown', DateOfBirth: 'Unknown' };
          return {
            number: (page - 1) * 15 + index + 1,
            firstName: metaData.FirstName,
            lastName: metaData.LastName,
            birthDate: metaData.DateOfBirth,
            gridID: recording._id,
            eventDate: recording.createdAt,
            fileId: recording.fileId,
            status: recording.status,
          };
        });

      console.log('Parsed Data', parsedData);

      setData(prevData => shouldReset ? parsedData : [...prevData, ...parsedData]);
      
      setHasMore(result.currentPage < result.totalPages);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
    fetchRecordings(1, true);
  };

  const loadMoreData = () => {
    if(!isLoading && hasMore) {
      setPage(prevPage => {
        fetchRecordings(prevPage + 1);
        return prevPage + 1;
      })
    }
  };


  useEffect(() => {
    if (user) {
      fetchRecordings(1, true); // Initial fetch
    }
  }, [user]);

  

  useEffect(() => {
    const pollData = async () => {
      const response = await fetch(`${API_BASE_URL}/api/transcriptions?page=1&limit=15&search=${searchTerm}&createdBy=${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      const transcriptions = result.transcriptions;
  
      setData((prevData) => {
        const newData = [...prevData];
        transcriptions.forEach((recording: Transcription) => {
          const index = newData.findIndex(item => item.fileId === recording.fileId);
          if (index !== -1) {
            newData[index] = {
              ...newData[index],
              status: recording.status,
            };
          }
        });
        return newData;
      });
    };
  
    const interval = setInterval(pollData, 5000);
    return () => clearInterval(interval);
  }, [searchTerm, user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const buffer = 50;

      if (scrollPosition + buffer >= scrollableHeight && hasMore && !isLoading) {
        loadMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, isLoading]);

  

  return (
    <FlexTable
      titles={["Name", "DOB", "Status", "Actions"]}
      hasMore={hasMore}
      loadMore={loadMoreData}
      onSearchChange={handleSearchTermChange}
    >
        { data.map((item) => (
          <RecordingFlexItem
            key={item.gridID}
            number={item.number}
            firstName={item.firstName}
            lastName={item.lastName}
            eventDate={formatDate(item.eventDate)}
            gridID={item.gridID}
            fileId={item.fileId}
            status={item.status}
          />
        ))}
    </FlexTable>
  );
};

export default RecordingsFlexTable;