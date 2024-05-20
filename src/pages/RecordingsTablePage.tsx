import React from 'react';
import { Link } from 'react-router-dom';
// import FlexTable from '../components/FlexTable';
import FlexTable from '../components/RecordingTable';
import AppWrapper from './AppWrapper';
import "../styles/spinner.css";

interface AudioData {
    source: 'recording' | 'upload';
    blob: Blob;
    transcription: string;
    summary: string;
  }

interface TablePageProps {
    audioDataList: AudioData[];
    onTranscriptionClick: (transcription: string) => void;
}

const RecordingsTable: React.FC<TablePageProps> = ({ audioDataList, onTranscriptionClick }) => {
    return (
        <AppWrapper
            children={<FlexTable />}
            title='Recordings Table'
        />
            
    );
};

export default RecordingsTable;