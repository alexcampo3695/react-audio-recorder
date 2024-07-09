import React from 'react';
import AppWrapper from './AppWrapper';
import "../styles/spinner.css";
import RecordingsFlexTable from '../components/RecordingTable';
import PatientTable from '../components/PatientTable';



const PatientPage: React.FC = ({ }) => {
    return (
        <AppWrapper
            children={<PatientTable />}
            title='Patients'
        />
    );
};

export default PatientPage;