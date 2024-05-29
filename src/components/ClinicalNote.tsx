import React, { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import "../styles/Markdown.css";

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

  useEffect(() => {
    const fetchClinicalNote = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/clinical_note/file/${fileId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch clinical note: ${response.status}`);
        }
        const data: NoteResponse = await response.json();
        console.log('Fetched Clinical Note:', data); // Log the fetched data
        setClinicalNote(data.clinicalNote);
        setNoteId(data._id); // Store the note's ID
      } catch (error) {
        console.error('Failed to fetch clinical note:', error);
      }
    };

    fetchClinicalNote();
  }, [fileId]);

  const handleEditToggle = () => {
    if (!isEditing) {
      setMarkdown(clinicalNote || '');
    }
    setIsEditing(!isEditing);
  };

  console.log('FileId:', fileId)

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/clinical_note/update/${noteId}`, { // Use the note's ID here
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
      console.log('Updated Clinical Note:', data); // Log the updated data
      setClinicalNote(data.clinicalNote);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update clinical note:', error);
    }
  };

  return (
    <div className="markdown-content">
      <div className="header">
        <h1>📝 Clinical Note</h1>
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
        <ReactMarkdown>
          {clinicalNote || ''}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default ClinicalNoteComponent;
