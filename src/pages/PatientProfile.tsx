import React, { useEffect, useMemo, useState } from 'react';
import AppWrapper from './AppWrapper';
import "../styles/spinner.css";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
import RecordingsFlexTable from '../components/RecordingTable';
import Icd10Component from '../components/icd10Component';
import MedicationComponent from '../components/MedicationComponent';
import feather from 'feather-icons';

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
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
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

    // console.log('patientData:', patientData);

    console.log('patientId:', patientId);

    useEffect(() => {
        feather.replace();
    }, []);

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
                                <div className="column is-5">
                                    <div className="profile-card">
                                        {/* <div className="profile-card-section">
                                            <div className="section-title">
                                                <h4>About Me</h4>
                                                <a href="/admin-profile-edit-1.html"><i className="lnil lnil-pencil"></i></a>
                                            </div>
                                            <div className="section-content">
                                                <p className="description">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                    Falli igitur possumus. Praeteritis, inquit, gaudeo. Duo
                                                    Reges: constructio interrete. Idemne, quod iucunde? Quis
                                                    enim redargueret? Non semper, inquam; Quid nunc honeste
                                                    dicit? Eam tum adesse, cum dolor omnis absit; Negat enim
                                                    summo bono afferre incrementum diem.
                                                </p>
                                            </div>
                                        </div> */}
                                        <div className="profile-card-section">
                                            <div 
                                                className="section-title"
                                                style={{display: 'flex', justifyContent: 'space-between'}}
                                            >
                                                <h4>Recordings</h4>
                                                <button 
                                                    className="button is-primary is-circle is-elevated"
                                                    onClick={() => history.push('/recorder', { patientData })}
                                                >
                                                    <span className="icon is-small">
                                                    <i 
                                                        aria-hidden="true"
                                                        style={{color: 'white'}}
                                                        className="fas fa-plus">
                                                    </i>
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="section-content">
                                                <div className="skills-wrapper">
                                                    <RecordingsFlexTable 
                                                        patientId={patientId}
                                                        hasSearch={false}
                                                    />  
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                                <div className="column is-7">
                                    <Icd10Component
                                        patientId = {patientId}
                                    />
                                    <MedicationComponent
                                        patientId = {patientId}
                                    />
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