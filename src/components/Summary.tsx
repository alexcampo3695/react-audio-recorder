import React, { useState } from "react";
import { summarizeTranscription } from "../helpers/openAI";

interface SummaryComponentProps {
  transcription: string;
  onSummarySubmit: (transcription: string, summary: string) => void;
}

const SummaryComponent: React.FC<SummaryComponentProps> = ({ transcription, onSummarySubmit }) => {
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    try {
      const generatedSummary = await summarizeTranscription(transcription);
      setSummary(generatedSummary);
      onSummarySubmit(transcription, generatedSummary)
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  return (
    <div>
      <h3>Summary</h3>
      {summary ? (
        <p>{summary}</p>
      ) : (
        <button onClick={handleSummarize}>Generate Summary</button>
      )}
    </div>
  );
};

export default SummaryComponent;