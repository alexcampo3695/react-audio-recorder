import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import { format } from "path";

interface FlexItemProps {
    FirstName: string
    LastName: string
    DateOfBirth: string
}

const FlexTableItem: React.FC<FlexItemProps> = ({ FirstName, LastName, DateOfBirth }) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toDateString();
    };

    return (
        <div className="flex-table-item">
            <div className="flex-table-cell is-media is-grow">
                <div className="h-avatar is-medium">
                    <img className="avatar" src="assets/img/avatars/photos/26.jpg" data-demo-src="assets/img/avatars/photos/26.jpg" alt="" data-user-popover="23"></img>
                    <img className="badge" src="assets/img/icons/flags/australia.svg" data-demo-src="assets/img/icons/flags/australia.svg" alt=""></img>
                </div>
                <div>
                    <span className="item-name dark-inverted" data-filter-match="">{FirstName} {LastName}</span>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
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

    useEffect(() => {
        async function fetchPatients() {
            const patients = await fetch('http://localhost:8000/get_patients');
            setPatients(await patients.json());
        }
        fetchPatients();
    }, [])

    return (
        <div className="page-content-inner">
            <div className="flex-list-wrapper flex-list-v1">
                <div className="page-placeholder custom-text-filter-placeholder is-hidden">
                    <div className="placeholder-content">
                        <img className="light-image" src="assets/img/illustrations/placeholders/search-4.svg" alt=""></img>
                        <img className="dark-image" src="assets/img/illustrations/placeholders/search-4-dark.svg" alt=""></img>
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
                    <a className="pagination-previous has-chevron"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a>
                    <a className="pagination-next has-chevron"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a>
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
    );
};

export default FlexTable;