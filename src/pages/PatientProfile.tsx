import React, { useEffect, useMemo, useState } from 'react';
import AppWrapper from './AppWrapper';
import "../styles/spinner.css";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";

interface PatientData {
    PatientId: string;
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
    CreatedBy: string
  }

interface TranscriptionData {
    _id: string;
    filename: string;
    transcription: string;
    patientData: PatientData;
    fileId: string;
}

interface LocationState {
    patientData?: PatientData;
  }


const PatientProfile: React.FC = ({ }) => {
    const { patientId } = useParams<{ patientId: string }>();
    const [transcriptions, setTranscriptions] = useState<TranscriptionData[] | null>(null);

    const history = useHistory();
    const location = useLocation();

    const patientData = useMemo(() => {
        const state = location.state as LocationState;
        console.log('Derived state:', state);
        return state?.patientData ?? null;
      }, [location.state]);

    console.log('patientData:', patientData);

    useEffect(() => {
        const fetchTranscription = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/transcriptions/patient/${patientId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch transcription: ${response.status}`);
                }
                const transcriptionsPayload: TranscriptionData[] = await response.json();
                setTranscriptions(transcriptionsPayload);
                console.log('transcriptions:', transcriptionsPayload)
            } catch (error) {
                console.error('Failed to fetch transcription:', error);
            }
        };
        
        if (patientId) {
            fetchTranscription();
        }
    }, [patientId]);
    
    return (
        <AppWrapper
            children={
                <>
                    <div className="profile-wrapper">
                        <div className="profile-header has-text-centered">
                            <FakeAvatar
                                FirstName={patientData?.FirstName || 'Uknown'}
                                LastName={patientData?.LastName || 'Patient'}
                                Size={AvatarSize.XL}
                            />
                            <h3 className="title is-4 is-narrow is-thin">{patientData?.FirstName} {patientData?.LastName}</h3>
                            <p className="light-text">
                                Hey everyone, I am a product manager from New York and Iam looking
                                for new opportunities in the software business.
                            </p>
                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <i className="lnil lnil-users-alt"></i>
                                    <span>500+ Relations</span>
                                </div>
                                <div className="separator"></div>
                                <div className="profile-stat">
                                    <i className="lnil lnil-checkmark-circle"></i>
                                    <span>78 Projects</span>
                                </div>
                                <div className="separator"></div>
                                <div className="socials">
                                    <a><i aria-hidden="true" className="fab fa-facebook-f"></i></a>
                                    <a><i aria-hidden="true" className="fab fa-twitter"></i></a>
                                    <a><i aria-hidden="true" className="fab fa-linkedin-in"></i></a>
                                </div>
                            </div>
                        </div>

                        <div className="profile-body">
                            <div className="columns">
                                <div className="column is-8">
                                    {transcriptions ? (
                                        transcriptions.map((transcription) => (
                                            <div key = {transcription._id}>
                                                <h4>{transcription.filename}</h4>
                                            </div>
                                        ))
                                    ) : (
                                        <span>Loading transcriptions...</span>
                                    )}
                                    
                                </div>
                                <div className="column is-4">
                                    {/* data goes here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            title='Patients'
        />
    );
};

export default PatientProfile;