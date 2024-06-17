import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import { format } from "path";
import { useHistory } from "react-router-dom";
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
import formatDate from "../helpers/DataManipulation";
import { useUser } from "../context/UserContext";
import FlexTable from "./FlexTable";
import "../styles/flex-list.css";
import { handle } from "mdast-util-to-markdown/lib/handle";
import NoData from "./NoData";

interface Patient {
    _id: string;
    PatientId: string
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
    CreatedBy: string;
    __v: number
  }
  
interface FlexItemProps {
    PatientId: string
    FirstName: string
    LastName: string
    DateOfBirth: string
    CreatedBy: string
}

const ExistingPatientItem: React.FC<FlexItemProps> = ({ PatientId, FirstName, LastName, DateOfBirth }) => {
    const history = useHistory();
    const{ user } = useUser();
    

    const handleItemClick = () => {
        const patientData: FlexItemProps = {
            PatientId: PatientId,
            FirstName: FirstName,
            LastName: LastName,
            DateOfBirth: DateOfBirth,
            CreatedBy: user?.id || ''
        };
        history.push("/recorder", { patientData } );

        console.log('PatientData:', patientData)
    }

    return (
        <div className="flex-table-item flex-table-item-animation" onClick={handleItemClick}>
            <div className="flex-table-cell is-media is-grow">
                <FakeAvatar
                    FirstName={FirstName}
                    LastName={LastName}
                    Size={AvatarSize.Small}
                />
                <div>
                    <span className="item-name strokeWidth-inverted" data-filter-match="">{FirstName} {LastName}</span>
                    <span className="item-meta">
                        <span data-filter-match="">Patient</span>
                    </span>
                </div>
            </div>
            <div className="flex-table-cell" data-th="Date of Birth">
                <span className="light-text" data-filter-match="">{formatDate(DateOfBirth)}</span>
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
    )
};



const ExistingPatientsTable: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const { user } = useUser();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPatients = async (searchTerm: string = '') => {
        if (!user) {
            console.error('No user found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/patients/by_creatorId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    createdBy: user.id,
                    search: searchTerm,
                    page,
                    limit: 10
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch patients: ${response.status}`);
            }

            const data = await response.json();

            console.log('existing patients:', data.patients)
            if (!Array.isArray(data.patients)) {
                throw new Error('Expected patients to be an array');
            }

            setPatients((prevPatients) => {
                if (page === 1) {
                    return data.patients;
                } else {
                    const newPatients = data.patients.filter((newPatient: Patient) => !prevPatients.some(patient => patient._id === newPatient._id));
                    return [...prevPatients, ...newPatients];
                }
            });
            setHasMore(page < data.totalPages);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    useEffect(() => {
        fetchPatients(searchTerm);
    }, [page, searchTerm]);

    const loadMoreData = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleSearchTermChange = (term: string) => {
        setSearchTerm(term);
        setPage(1);
        setPatients([]);
    };

    return (
        <FlexTable
            titles={["Name", "DOB", "Actions"]}
            hasMore={hasMore}
            loadMore={loadMoreData}
            searchPlaceholder="Search..."
            onSearchChange={handleSearchTermChange}
        >
            {patients.length > 0 ? (
                patients.map((patient: any) => (
                    <ExistingPatientItem
                        key={patient._id}
                        PatientId={patient.PatientId}
                        FirstName={patient.FirstName}
                        LastName={patient.LastName}
                        DateOfBirth={patient.DateOfBirth}
                        CreatedBy={patient.id}
                    />
                ))
            ) : (
                <NoData
                    Title="No patients found"
                    Subtitle="Create a new patient to get started."
                />
            )}
        </FlexTable>
    );
};

export default ExistingPatientsTable;
