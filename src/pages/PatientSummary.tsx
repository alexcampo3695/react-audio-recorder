import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SummaryComponent from '../elements/AudioPlayer';
import AudioPlayer from '../elements/AudioPlayer';
import AppWrapper from './AppWrapper';
import { transcribeAudio } from '../helpers/transcribe';
import { t } from 'vitest/dist/types-198fd1d9';
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
    metadata: MetaData;
  }

interface SummaryPageProps {
    selectedTranscription: string;
}

interface Transcription {
    text: string;
  }
  

const SummaryPage: React.FC<SummaryPageProps> = ({  }) => {
    const { gridID } = useParams<{ gridID: string }>();
    const validGridId = gridID || '';
    const [data, setData] = useState<UploadedFile | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcription, setTranscription] = useState<Transcription | null>(null);

    useEffect(() => {
        const fetchRecordingData = async () => {
          try {
            const response = await fetch(`http://localhost:8000/api/audio/${gridID}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch audio: ${response.status}`);
            }
            const data: UploadedFile = await response.json();
            setData(data);
    
          } catch (error) {
            console.error('Failed to fetch the recording data:', error);
          }
        };
    
        fetchRecordingData();
    
      }, []);
    
      // useEffect(() => {
      //   const fetchAudio = async () => {
      //     try {
      //       const respone = await fetch(`http://localhost:8000/api/audio/${gridID}`);
      //       if (!respone.ok) {
      //         throw new Error(`Failed to fetch audio blob: ${respone.status}`);
      //       }
      //       const blob = await respone.blob();
      //       setAudioBlob(blob);
    
      //     } catch (error) {
      //       console.error('Failed to fetch audio:', error);
      //     }
      //   };
    
      //   fetchAudio();

      // }, [gridID]);

    //   useEffect(() => {
    //     const fetchTranscriptions = async () => {
    //       try {
    //         const response = await fetch(`http://localhost:8000/api/audio/${gridID}`);
    //         if (!response.ok) {
    //           throw new Error(`Failed to fetch audio: ${response.status}`);
    //         }
    //         const data: UploadedFile = await response.json();
    //         setData(data);
    
    //       } catch (error) {
    //         console.error('Failed to fetch the recording data:', error);
    //       }
    //     };
    
    //     fetchTranscriptions();
    // }, [data]);

    console.log('data', data)
    console.log('grid', gridID)
    return (
        <AppWrapper
            title = "Recording Summary"
            children = {
                <div className="profile-wrapper">
                    <div className="profile-header has-text-centered">
                        <FakeAvatar
                            FirstName={data?.metadata.FirstName ?? ''}
                            LastName={data?.metadata.LastName ?? ''}
                            Size={AvatarSize.XL}
                        />
                        <h3 className="title is-4 is-narrow is-thin">{data?.metadata.FirstName} {data?.metadata.LastName}</h3>
                        <p className="light-text">
                            Hey everyone, Iam a product manager from New York and Iam looking
                            for new opportunities in the software business.
                        </p>
                        <p>
                            {transcription?.text}
                        </p>
                        <AudioPlayer 
                            fileID={validGridId}
                        />
                    </div>
                </div>
                
            }
            
        />
    );
}

export default SummaryPage;