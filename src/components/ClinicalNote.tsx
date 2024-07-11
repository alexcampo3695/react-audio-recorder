import React, { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import "../styles/Markdown.css";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../config";

interface ClinicalNoteProps {
  fileId: string;
}

interface NoteResponse {
  _id: string;
  fileId: string;
  clinicalNote: string;
  patientId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ClinicalNoteComponent: React.FC<ClinicalNoteProps> = ({ fileId }) => {
  const [clinicalNote, setClinicalNote] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [noteId, setNoteId] = useState<string | null>(null); // To store the note's ID
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<any | null>(null)
  const [signatureUrl, setSignatureUrl] = useState<string | null>('')


  useEffect(() => {
    const fetchClinicalNote = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/clinical_note/file/${fileId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch clinical note: ${response.status}`);
        }
        const data: NoteResponse = await response.json();
        setClinicalNote(data.clinicalNote);
        setNoteId(data._id); // Store the note's ID
      } catch (error) {
        console.error('Failed to fetch clinical note:', error);
      }
    };

    const fetchUserDetailsAndSignature = async () => {
      if (!user?.id) return;
      // get userdata
      try {
        const response = await fetch(`/api/user_details/${user.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status}`);
        }
        const userData = await response.json();
        setUserDetails(userData);

        //get sig
        if (userData.signature) {
          const signatureResponse = await fetch(`${API_BASE_URL}/api/user_details/signature/${userData.signature}`);
          if (signatureResponse.ok) {
            const signatureBlob = await signatureResponse.blob();
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              setSignatureUrl(dataUrl);
            };
            reader.onerror = (event) => {
              console.error("File could not be read! Code " + event.target?.error);
            };
            reader.readAsDataURL(signatureBlob);
          } else {
            console.log('Signature is not available');
          }
        }
      } catch (error) {
        console.error('Failed to fetch user details or signature:', error);
      }
    };

    fetchClinicalNote();
    fetchUserDetailsAndSignature();
  }, [fileId, user?.id]);

  const handleEditToggle = () => {
    if (!isEditing) {
      setMarkdown(clinicalNote || '');
    }
    setIsEditing(!isEditing);
  };

  console.log('UserDetails', userDetails)

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clinical_note/update/${noteId}`, { // Use the note's ID here
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clinicalNote: markdown }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update clinical note: ${response.status}`);
      }
      const data: NoteResponse = await response.json();
      setClinicalNote(data.clinicalNote);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update clinical note:', error);
    }
  };

  return (
    <div className="markdown-content">
      <div className="header">
        <h3>📝 Clinical Note</h3>
        <div className="buttons">
          <button
            className="button h-button"
            onClick={handleEditToggle}
          >
            <span className="icon">
              <i data-feather={isEditing ? "eye" : "edit-2"}></i>
            </span>
            <span>{isEditing ? "View" : "Edit"}</span>
          </button>
          {isEditing && (
            <button
              className="button h-button is-success is-elevated"
              onClick={handleSave}
            >
              <span className="icon">
                <i className="fas fa-check"></i>
              </span>
              <span>Approve</span>
            </button>
          )}
        </div>
      </div>
      {isEditing ? (
        <textarea
          style = {{minHeight: "1200px"}}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="textarea"
        />
      ) : (
        <>
          <ReactMarkdown>
            {clinicalNote || ''}
          </ReactMarkdown>
            <div className="dashboard-card">
                <div className="title-wrap">
                    <h3 className="dark-inverted">✍🏻 Provider Signature</h3>
                </div>
                {signatureUrl && <img src={signatureUrl} alt="Signature" className="signature-image" />}
                <p className="context-text">
                    I, hearby attest this information is correct.
                </p>
            </div>
        </>
      )}
    </div>
  );
};

export default ClinicalNoteComponent;
