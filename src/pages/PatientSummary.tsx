import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../elements/AudioPlayer';
import AppWrapper from './AppWrapper';
import FakeAvatar, { AvatarSize } from '../elements/FakeAvatar';

interface MetaData {
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
}

interface UploadedFile {
    _id: string;
    filename: string;
    length: number;
    chunkSize: number;
    uploadDate: string;
    contentType: string;
    metadata: {
        patientData: MetaData;
    };
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
    const [data, setData] = useState<UploadedFile | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecordingData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/audio/uploads_data/${gridID}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch audio data: ${response.status}`);
                }
                const data: UploadedFile = await response.json();
                setData(data);
            } catch (error) {
                console.error('Failed to fetch the recording data:', error);
            }
        };

        fetchRecordingData();
    }, [gridID]);

    useEffect(() => {
        const fetchAudio = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/audio/${gridID}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch audio blob: ${response.status}`);
                }
                const blob = await response.blob();
                setAudioBlob(blob);
            } catch (error) {
                console.error('Failed to fetch audio:', error);
            }
        };

        if (data) {
            fetchAudio();
        }
    }, [data, gridID]);

    useEffect(() => {
        const fetchTranscription = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/transcriptions/file/${gridID}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch transcription: ${response.status}`);
                }
                const transcriptionPayload: TranscriptionPayload = await response.json();
                setTranscription(transcriptionPayload.transcription);
            } catch (error) {
                console.error('Failed to fetch transcription:', error);
            }
        };

        if (gridID) {
            fetchTranscription();
        }
    }, [gridID]);

    console.log('transcription:', transcription)
    return (
        <AppWrapper
            title="Recording Summary"
            children={
                <div className="profile-wrapper">
                    <div className="profile-header has-text-centered">
                        <FakeAvatar
                            FirstName={data?.metadata?.patientData?.FirstName ?? ''}
                            LastName={data?.metadata?.patientData?.LastName ?? ''}
                            Size={AvatarSize.XL}
                        />
                        <h3 className="title is-4 is-narrow is-thin">
                            {data?.metadata?.patientData?.FirstName} {data?.metadata?.patientData?.LastName}
                        </h3>
                        <p className="light-text">
                            Hey everyone, I am a product manager from New York and I am looking
                            for new opportunities in the software business.
                        </p>
                        <p>{transcription}</p>
                        {audioBlob && <AudioPlayer fileID={validGridId} />}
                    </div>
                </div>
            }
        />
    );
}

export default SummaryPage;
