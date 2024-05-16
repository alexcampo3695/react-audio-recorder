import React from 'react';
import { Link } from 'react-router-dom';
import SummaryComponent from '../elements/AudioPlayer';

interface SummaryPageProps {
    selectedTranscription: string;
    onSummarySubmit: (transcription: string, summary: string) => void;
}

const SummaryPage: React.FC<SummaryPageProps> = ({ selectedTranscription, onSummarySubmit }) => {
    return (
        <div>
            <h1>Summary Page</h1>
            {selectedTranscription && (
                <SummaryComponent transcription={selectedTranscription} onSummarySubmit={onSummarySubmit} />
            )}
            <nav>
                <Link to="/table">Go to Table Page</Link>
            </nav>
        </div>
    );
}

export default SummaryPage;