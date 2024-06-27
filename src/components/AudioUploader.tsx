import React, { useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FilePond, registerPlugin, FilePondFile, FilePondErrorDescription } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Register plugins
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
}

interface PatientData {
  patientId: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
}

interface LocationState {
  patientData?: PatientData;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileUpload }) => {
  const history = useHistory();
  const location = useLocation();

  const patientData = useMemo(() => {
    const state = location.state as LocationState;
    console.log('Derived state:', state);
    return state?.patientData ?? null;
  }, [location.state]);


  return (
    <div>
      <FilePond
        allowMultiple={true}
        acceptedFileTypes={['audio/*']}
        onprocessfile={(error: FilePondErrorDescription | null, file: FilePondFile) => {
          if (error) {
            console.error('Error processing file:', error);
            return;
          }
          console.log('File processed:', file);
          onFileUpload(file.file);
          history.push('/table');
        }}
        onupdatefiles={(fileItems: FilePondFile[]) => {
          if (fileItems.length === 0) {
            return;
          }
          const file = fileItems[0].file;
          console.log('Selected file:', file);
        }}
        server={{
          process: (
            fieldName: string,
            file: File,
            metadata: any,
            load: (p: string) => void,
            error: (e: string) => void,
            progress: (isLengthComputable: boolean, loaded: number, total: number) => void,
            abort: () => void
          ) => {
            const formData = new FormData();
            formData.append("recording", file, file.name);
            console.log("Patient Data to be sent:", JSON.stringify(patientData));

            if (patientData) {
              formData.append("patientData", JSON.stringify(patientData));
            } else {
              console.error("No patient data found");
              error("No patient data found");
              return {
                abort: () => {}
              };
            }

            const request = new XMLHttpRequest();
            request.open('POST', '/api/audio/upload');

            request.upload.onprogress = (e) => {
              progress(e.lengthComputable, e.loaded, e.total);
            };

            request.onload = function() {
              if (request.status >= 200 && request.status < 300) {
                load(request.responseText);
              } else {
                console.error('Error uploading file');
                error('Error uploading file');
              }
            };

            request.onerror = function() {
              console.error('Network error uploading file');
              error('Network error uploading file');
            };

            request.onabort = function() {
              console.error('Aborted uploading file');
              abort();
            };

            request.send(formData);

            return {
              abort: () => {
                request.abort();
                abort();
              }
            };
          }
        }}
      />
    </div>
  );
};

export default AudioUploader;
