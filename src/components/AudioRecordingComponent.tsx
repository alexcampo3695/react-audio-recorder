import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import useAudioRecorder from "../hooks/useAudioRecorder";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import 'webrtc-adapter';


import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import "../styles/audio-recorder.css";
import "../styles/recorder-button.scss";

const LiveAudioVisualizer = React.lazy(async () => {
  const { LiveAudioVisualizer } = await import("react-audio-visualize");
  return { default: LiveAudioVisualizer };
});

// Wrapped the AudioRecorder in React.memo to prevent unnecessary re-renders
const AudioRecorder = React.memo((props: Props) => {
  const {
    onRecordingComplete,
    onNotAllowedOrFound,
    recorderControls,
    audioTrackConstraints,
    downloadOnSavePress = false,
    downloadFileExtension = "webm",
    showVisualizer = false,
    mediaRecorderOptions,
    classes,
    onRecordingStateChange,
  } = props;

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = recorderControls ?? useAudioRecorder(audioTrackConstraints, onNotAllowedOrFound, mediaRecorderOptions);

  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(isRecording);
    }
  }, [isRecording, onRecordingStateChange]);

  console.log("AudioRecorderComponent.tsx");

  const [shouldSave, setShouldSave] = useState(false);
  const notyf = new Notyf();

  const stopAudioRecorder = (save: boolean = true) => {
    setShouldSave(save);
    stopRecording();
    // Custom state to track the recording status
    setRecordingState("idle");
    if (save) {
      notyf.success("Recording saved successfully");
    } else {
      notyf.error("Recording discarded");
    }
  };

  const convertToDownloadFileExtension = async (webmBlob: Blob): Promise<Blob> => {
    const FFmpeg = await import("@ffmpeg/ffmpeg");
    const ffmpeg = FFmpeg.createFFmpeg({ log: false });
    await ffmpeg.load();

    const inputName = "input.webm";
    const outputName = `output.${downloadFileExtension}`;

    ffmpeg.FS("writeFile", inputName, new Uint8Array(await webmBlob.arrayBuffer()));
    await ffmpeg.run("-i", inputName, outputName);

    const outputData = ffmpeg.FS("readFile", outputName);
    const outputBlob = new Blob([outputData.buffer], {
      type: `audio/${downloadFileExtension}`,
    });

    return outputBlob;
  };

  const downloadBlob = async (blob: Blob): Promise<void> => {
    const downloadBlob = crossOriginIsolated ? await convertToDownloadFileExtension(blob) : blob;
    const fileExt = crossOriginIsolated ? downloadFileExtension : "webm";
    const url = URL.createObjectURL(downloadBlob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `audio.${fileExt}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Added state to keep track of the recording state
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused">("idle");

  // Function to toggle recording, and pause/resume
  const toggleRecording = () => {
    if (recordingState === "idle") {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        notyf.error("Your browser does not support audio recording.");
        return;
      }

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          startRecording();
          setRecordingState("recording");
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
          notyf.error("Error accessing microphone. Please check your browser settings.");
        })
      startRecording();
      setRecordingState("recording");
    } else if (recordingState === "recording") {
      togglePauseResume();
      setRecordingState("paused");
    } else if (recordingState === "paused") {
      togglePauseResume();
      setRecordingState("recording");
    }
  };

  // Function to format time for display
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  // Effect to handle recording completion and save
  useEffect(() => {
    if ((shouldSave || recorderControls) && recordingBlob != null && onRecordingComplete != null) {
      onRecordingComplete(recordingBlob);
      if (downloadOnSavePress) {
        void downloadBlob(recordingBlob);
      }
    }
  }, [recordingBlob]);

  return (
    <div className="antidote-recorder-container" data-testid="audio_recorder">
      <div>
        <div className="antidote-recorder-container">
          <div className={`antidote-recorder-button ${recordingState !== "idle" ? "is-recording" : ""} ${recordingState === "paused" ? "is-paused" : ""}`} onClick={toggleRecording}>
            <img className="light-image recorder-emblem" src={antidoteEmblem} alt="" />
            <img className="dark-image recorder-emblem" src={antidoteEmblem} alt="" />
          </div>
          <div className="timer-container">
            <div className="title-wrap">
              <h1 className="title is-4">{formatTime(recordingTime)}</h1>
            </div>
          </div>
        </div>
        <div className="antidote-controls-container">
          <div className={"complete"} onClick={isRecording ? () => stopAudioRecorder() : startRecording} data-testid="ar_mic" title={isRecording ? "Save recording" : "Start recording"}>
            <i>
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </i>
          </div>
          <div className={"deleted"} onClick={() => stopAudioRecorder(false)} title="Discard Recording" data-testid="ar_cancel">
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
}, areEqual);

// Custom comparison function for React.memo
function areEqual(prevProps: Props, nextProps: Props) {
  // Implement custom comparison logic here if needed
  return prevProps === nextProps;
}

export default AudioRecorder;
