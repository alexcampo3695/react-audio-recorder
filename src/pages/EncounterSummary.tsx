import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../elements/AudioPlayer';
import AppWrapper from './AppWrapper';
import FakeAvatar, { AvatarSize } from '../elements/FakeAvatar';
import EncounterSummary from '../components/EncounterSummary';

interface MetaData {
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
}

interface TranscriptionPayload {
    _id: string;
    filename: string;
    transcription: string;
    patientData: MetaData;
    fileId: string;
    createdAt: string;
    updatedAt: string;
}

const SummaryPage: React.FC = () => {
    const { gridID } = useParams<{ gridID: string }>();
    const validGridId = gridID || '';
    const [data, setData] = useState<TranscriptionPayload | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTranscription = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/transcriptions/${validGridId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch transcription: ${response.status}`);
                }
                const transcriptionPayload: TranscriptionPayload = await response.json();
                setTranscription(transcriptionPayload.transcription);
                setFileId(transcriptionPayload.fileId);
                setData(transcriptionPayload);
            } catch (error) {
                console.error('Failed to fetch transcription:', error);
            }
        };
        
        if (validGridId) {
            fetchTranscription();
        }
    }, [validGridId]);

    useEffect(() => {
        const fetchAudio = async () => {
            if (fileId === null) return;  // Ensure fileId is not null

            try {
                const response = await fetch(`http://localhost:8000/api/audio/${fileId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch audio blob: ${response.status}`);
                }
                const blob = await response.blob();
                setAudioBlob(blob);
            } catch (error) {
                console.error('Failed to fetch audio:', error);
            }
        };

        if (fileId) {
            fetchAudio();
        }
    }, [fileId]);

    return (
        <AppWrapper
            title="Recording Summary"
            children={
                <div className="profile-wrapper">
                    <div className="profile-header has-text-centered">
                        <FakeAvatar
                            FirstName={data?.patientData?.FirstName ?? ''}
                            LastName={data?.patientData?.LastName ?? ''}
                            Size={AvatarSize.XL}
                        />
                        <h3 className="title is-4 is-narrow is-thin">
                            {data?.patientData?.FirstName} {data?.patientData?.LastName}
                        </h3>
                        <p className="light-text">
                            Hey everyone, I am a product manager from New York and I am looking
                            for new opportunities in the software business.
                        </p>
                        {audioBlob && fileId && <AudioPlayer fileID={fileId} />}
                    </div>
                    <div className="profile-body">
                        <div className="columns">
                            <div className="column is-8">
                            <EncounterSummary 
                                fileId={fileId ?? ''}
                            />
                            </div>
                            <div className="column is-4">
                            </div>
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default SummaryPage;



