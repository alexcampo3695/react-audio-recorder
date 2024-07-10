import React from 'react';
import AppWrapper from './AppWrapper';
import "../styles/spinner.css";
import RecordingsFlexTable from '../components/RecordingTable';

interface AudioData {
    source: 'recording' | 'upload';
    blob: Blob;
    // transcription: string;
    // summary: string;
  }

interface TablePageProps {
    audioDataList: AudioData[];
    onTranscriptionClick: (transcription: string) => void;
}

const RecordingsTable: React.FC<TablePageProps> = ({ audioDataList, onTranscriptionClick }) => {
    return (
        <AppWrapper
            children=
                {<RecordingsFlexTable
                    hasSearch={true}
                />}
            title='Recordings Table'
        />
    );
};

export default RecordingsTable;