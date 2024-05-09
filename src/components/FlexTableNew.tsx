import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import { format } from "path";
import { useNavigate } from "react-router-dom";

interface FlexItemProps {
    FirstName: string
    LastName: string
    DateOfBirth: string
}

const FlexTableItem: React.FC<FlexItemProps> = ({ FirstName, LastName, DateOfBirth }) => {
    const navigate = useNavigate();
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const handleItemClick = () => {
        const patientData = {
            FirstName,
            LastName,
            DateOfBirth
        };
        navigate("/recorder", { state: { patientData } });
    }

    return (
        <div className="flex-table-item" onClick={handleItemClick}>
            <div className="flex-table-cell is-media is-grow">
                <div className="h-avatar is-medium">
                    <img className="avatar" src="assets/img/avatars/photos/26.jpg" data-demo-src="assets/img/avatars/photos/26.jpg" alt="" data-user-popover="23"></img>
                    <img className="badge" src="assets/img/icons/flags/australia.svg" data-demo-src="assets/img/icons/flags/australia.svg" alt=""></img>
                </div>
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



const FlexTable = ({ }) => {
    const [patients, setPatients] = useState([]);

    const fetchPatients = async (searchTerm: string = '') => {
        const response = await fetch(`http://localhost:8000/get_patients?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setPatients(data);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        // Make this a ReactFragment??
        <div>
            <div className="list-flex-toolbar">
                <div className="control has-icon">
                    <input 
                        className="input custom-text-filter" 
                        placeholder="Search..." 
                        data-filter-target=".flex-table-item"
                        onChange={(e) => fetchPatients(e.target.value)}
                    >
                    </input>
                    <div className="form-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>

                <div className="buttons">
                    <button className="button h-button is-primary is-elevated">
                        <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                        </span>
                        <span>Add User</span>
                    </button>
                </div>
            </div>
            <div className="page-content-inner">
                <div className="flex-list-wrapper flex-list-v1">
                    <div className="page-placeholder custom-text-filter-placeholder is-hidden">
                        <div className="placeholder-content">
                            <img className="light-image" src="assets/img/illustrations/placeholders/search-4.svg" alt=""></img>
                            <img className="strokeWidth-image" src="assets/img/illustrations/placeholders/search-4-strokeWidth.svg" alt=""></img>
                            <h3>We couldn't find any matching results.</h3>
                            <p className="is-larger">
                                Too bad. Looks like we couldn't find any matching results for
                                the search terms you've entered. Please try different search
                                terms or criteria.
                            </p>
                        </div>
                    </div>
                    <div className="flex-table">
                        <div className="flex-table-header" data-filter-hide="">
                            <span className="is-grow">Patient</span>
                            {/* <span>First Name</span>
                            <span>Last Name</span> */}
                            <span>Date of Birth</span>
                            {/* <span>Relations</span> */}
                            <span className="cell-end">Actions</span>
                        </div>

                        <div className="flex-list-inner">
                        {patients.map((patient:any) => (
                            <FlexTableItem
                            key={patient._id}
                            FirstName={patient.FirstName}
                            LastName={patient.LastName}
                            DateOfBirth={patient.DateOfBirth}
                            />
                        ))}
                        </div>
                    </div>
                    {/* <nav className="flex-pagination pagination is-rounded" aria-label="pagination" data-filter-hide="">
                        <a className="pagination-previous has-chevron"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a>
                        <a className="pagination-next has-chevron"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a>
                        <ul className="pagination-list">
                            <li><a className="pagination-link" aria-label="Goto page 1">1</a></li>
                            <li><span className="pagination-ellipsis">…</span></li>
                            <li>
                                <a className="pagination-link" aria-label="Goto page 45">45</a>
                            </li>
                            <li>
                                <a className="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a>
                            </li>
                            <li>
                                <a className="pagination-link" aria-label="Goto page 47">47</a>
                            </li>
                            <li><span className="pagination-ellipsis">…</span></li>
                            <li>
                                <a className="pagination-link" aria-label="Goto page 86">86</a>
                            </li>
                        </ul>
                    </nav> */}
                </div>
            </div>
        </div>
    );
};

export default FlexTable;