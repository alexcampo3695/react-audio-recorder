import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import useAudioRecorder from "../hooks/useAudioRecorder";
import { transcribeAudio } from "../helpers/transcribe";
import "../styles/audio-recorder.css";
import "../styles/flex-list.css";

interface TableRowData {
  number: number;
  patientName: string;
  eventDate: Date;
  recordingBlob: Blob | undefined;
  transcription: string;
  source: "recording" | "upload";
}

interface FlexTableProps {
  data: TableRowData[];
  onTranscriptionClick: (transcription: string) => void;
}

const FlexTable: React.FC<FlexTableProps> = ({ data, onTranscriptionClick }) => {
  const [transcriptions, setTranscriptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      const promises = data.map(async (row, index) => {
        if (row.recordingBlob) {
          const response = await transcribeAudio(row.recordingBlob);
          return response.text;
        } else {
          return '';
        }
      });
      const results = await Promise.all(promises);
      setTranscriptions(results);
    };

    fetchTranscriptions();
  }, [data]);

  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th>Event ID</th>
          <th>Patient Name</th>
          <th>Date</th>
          <th>Recording</th>
          <th>Transcription</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.number}</td>
            <td>{row.patientName}</td>
            <td>{row.eventDate.toLocaleDateString()}</td>
            <td>
              {row.recordingBlob && (
                <audio src={URL.createObjectURL(row.recordingBlob)} controls />
              )}
            </td>
            <td onClick={() => onTranscriptionClick(transcriptions[index])}>
              {transcriptions[index]}
            </td>
            <td>{row.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FlexTable;
