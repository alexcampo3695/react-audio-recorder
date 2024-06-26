import React, { useState, useEffect } from "react";
import { VoiceRecorder } from "capacitor-voice-recorder";
import { useUser } from "../context/UserContext";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
// import { Permissions } from '@capacitor/core';

interface IonicAudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  isRecording: boolean;
}

const IonicAudioRecorder: React.FC<IonicAudioRecorderProps> = ({
  onRecordingComplete,
  onRecordingStateChange,
  isRecording,
}) => {
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused">("idle");
  const { user } = useUser();
  const notyf = new Notyf();

  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(recordingState === "recording");
    }
  }, [recordingState, onRecordingStateChange]);

  function base64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  console.log('state', recordingState)

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      notyf.error('getUserMedia API is not supported in this browser.');
      return;
    }
  
    try {
      await VoiceRecorder.requestAudioRecordingPermission();
      const hasPermission = await VoiceRecorder.hasAudioRecordingPermission();
      if (!hasPermission.value) {
        notyf.error('Audio recording permission not granted.')
        return
      }
      await VoiceRecorder.startRecording();
      setRecordingState("recording");
    } catch (error) {
      console.error('Failed to start recording:', error);
      notyf.error('Failed to start recording');
      setRecordingState("idle");
    }
  };

  const stopRecording = async (save: boolean = true) => {
    try {
      const status = await VoiceRecorder.getCurrentStatus();
      if (status.status !== 'RECORDING') {
        notyf.error('Recording has not yet started.')
        setRecordingState("idle");
        return
      }

      const result = await VoiceRecorder.stopRecording();
      setRecordingState("idle");
      if (result.value && save) {
        const audioBlob = base64ToBlob(result.value.recordDataBase64, result.value.mimeType);
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        // setRecordingState('idle')
        notyf.success('Recording saved successfully');
      } else if (!save) {
        notyf.error('Recording Discarded');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error)
      notyf.error('Failed to stop recording');
      setRecordingState("idle");
    }
  }

  const toggleRecording = () => {
    if (recordingState === "idle") {
      startRecording();
    } else if (recordingState === "recording") {
      stopRecording();
    }
  }

  return (
    <div className="antidote-recorder-container" data-testid="audio_recorder">
      <div>
        <div className="antidote-recorder-container">
          <div className={`antidote-recorder-button ${recordingState !== "idle" ? "is-recording" : ""} ${recordingState === "paused" ? "is-paused" : ""}`} onClick={toggleRecording}>
            <img className="light-image recorder-emblem" src={antidoteEmblem} alt="" />
            <img className="dark-image recorder-emblem" src={antidoteEmblem} alt="" />
          </div>
          <div className="timer-container">
            {/* <div className="title-wrap">
              <h1 className="title is-4">{formatTime(recordingTime)}</h1>
            </div> */}
          </div>
        </div>
        <div className="antidote-controls-container">
          <div className={"complete"} onClick={recordingState === 'recording' ? () => stopRecording() : startRecording} data-testid="ar_mic" title={recordingState === 'recording' ? "Save recording" : "Start recording"}>
            <i>
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </i>
          </div>
          <div className={"deleted"} onClick={() => stopRecording(false)} title="Discard Recording" data-testid="ar_cancel">
            <i>
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IonicAudioRecorder;


