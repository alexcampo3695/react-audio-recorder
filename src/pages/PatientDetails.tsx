import React from "react";

interface PatientDetailsProps {
  patientData: {
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
  };
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientData }) => {
    if (!patientData) { return null} ;
    return (
        <div>
            <h2>Patient Details</h2>
            <p>First Name: {patientData.FirstName}</p>
            <p>Last Name: {patientData.LastName}</p>
            <p>Date of Birth: {patientData.DateOfBirth}</p>
        </div>
    );
};

export default PatientDetails;
