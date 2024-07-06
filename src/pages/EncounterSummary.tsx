import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../elements/AudioPlayer';
import AppWrapper from './AppWrapper';
import FakeAvatar, { AvatarSize } from '../elements/FakeAvatar';
import EncounterSummaryComponent from '../components/EncounterSummary';
import DiarizedComponent from '../components/DiarizedTranscription';
import Icd10Component from '../components/icd10Component';
import MedicationComponent from '../components/MedicationComponent';
import CPTComponent from '../components/CptComponent';
import TaskComponent from '../components/TasksComponent';
import ClinicalNoteComponent from '../components/ClinicalNote';
import feather from "feather-icons";

import '@fortawesome/fontawesome-svg-core/styles.css';
// import feather from 'feather-icons';
import { handlePDF, handlePDFtoEmail} from '../helpers/PDF';
import { useUser } from '../context/UserContext';
import { format } from 'date-fns';
import { Notyf } from "notyf";
import { API_BASE_URL } from '../config';


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
    const { user } = useUser();
    const notyf = new Notyf();

    useEffect(() => {
        const fetchTranscription = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/transcriptions/${validGridId}`);
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
        feather.replace();
      }, []);

    useEffect(() => {
        const fetchAudio = async () => {
            if (fileId === null) return;  // Ensure fileId is not null

            try {
                const response = await fetch(`${API_BASE_URL}/api/audio/${fileId}`);
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

    const sendPDFViaEmail = async () => {
        if (!user) {
            console.error('user not found!')
            return;
        }
        try {
            const formattedDate = format(new Date(data?.createdAt || ''),'MM-dd-yyyy')
            const pdfBlob = await handlePDFtoEmail({
                elementId: 'clinical-note',
                fileName: `${data?.patientData?.FirstName}_${data?.patientData?.LastName}_${formattedDate}_VisitNote.pdf`
            });

            const formData = new FormData();
            formData.append('pdf', pdfBlob, `${data?.patientData?.FirstName}_${data?.patientData?.LastName}_${formattedDate}_VisitNote.pdf`);
            formData.append('userId', user.id); // Add user ID here
            formData.append('fileName', `${data?.patientData?.FirstName}_${data?.patientData?.LastName}_${formattedDate}_VisitNote.pdf`);
            formData.append('patientName', `${data?.patientData?.FirstName} ${data?.patientData?.LastName}`);
            formData.append('visitDate', data?.createdAt || '');

            const response = await fetch(`${API_BASE_URL}/api/email/send_pdf_email`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to send email: ${response.status}`);
            }
            console.log('Email send successfully')
            notyf.success('Email sent successfully!') 
        } catch (error) {
            console.error('Error sending email', error)
        }
    };
    
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
                        {/* <p className="light-text">
                            Hey everyone, I am a product manager from New York and I am looking
                            for new opportunities in the software business.
                        </p> */}
                        <div className="profile-stats">
                            <div className="socials">
                                <button className="button is-circle is-elevated"
                                    onClick = {() => handlePDF(
                                        {elementId: 'clinical-note', fileName: `${data?.patientData?.FirstName}_${data?.patientData?.LastName}_${data?.createdAt}_VisitNote.pdf`}
                                    )}
                                >
                                    <span className="icon is-small">
                                        <i data-feather="download"></i>
                                    </span>
                                </button>
                                <button 
                                    className="button is-circle is-elevated"
                                    style = {{marginLeft: '5px'}}
                                    onClick = {sendPDFViaEmail}
                                >
                                    <span className="icon is-small">
                                        <i data-feather="mail"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        {audioBlob && fileId && <AudioPlayer fileID={fileId} />}
                    </div>
                    <div className="profile-body">
                        <div className="columns">
                            <div className="column is-6">
                                <div className="profile-card">
                                    <EncounterSummaryComponent
                                        fileId={fileId ?? ''}
                                    />
                                </div>
                                <DiarizedComponent
                                    fileId = {fileId ?? ''}
                                />
                                <Icd10Component
                                    fileId = {fileId ?? ''}
                                />
                                <MedicationComponent
                                    fileId = {fileId ?? ''}
                                />
                                <CPTComponent
                                    fileId={fileId ?? ''}
                                />
                                <TaskComponent
                                    fileId={fileId ?? ''}
                                />
                            </div>
                            <div className="column is-6">
                                <div className="profile-card" id="clinical-note">
                                    <ClinicalNoteComponent
                                        fileId={fileId ?? ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default SummaryPage;



