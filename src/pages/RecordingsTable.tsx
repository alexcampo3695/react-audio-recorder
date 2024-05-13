import React from 'react';
import { Link } from 'react-router-dom';
// import FlexTable from '../components/FlexTable';
import FlexTable from '../components/FlexTableNew';

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
        <div>
            <h1>Table Page</h1>
            <FlexTable
                // data={audioDataList.map((audioData, index) => ({
                // number: index + 1,
                // patientName: `Alex Campo`,
                // eventDate: new Date(),
                // recordingBlob: audioData.blob,
                // transcription: '',
                // source: audioData.source,
                // }))}
                // onTranscriptionClick={onTranscriptionClick}
            />
            <nav>
                <Link to="/">Go to Recording Page</Link>
                <Link to="/summary">Go to Summary Page</Link>
            </nav>
        </div>
    );
};

export default RecordingsTable;