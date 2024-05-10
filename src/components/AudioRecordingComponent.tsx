import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import useAudioRecorder from "../hooks/useAudioRecorder";


import micSVG from "../icons/mic.svg";
import pauseSVG from "../icons/pause.svg";
import resumeSVG from "../icons/play.svg";
import saveSVG from "../icons/save.svg";
import discardSVG from "../icons/stop.svg";
import "../styles/audio-recorder.css";
import "../styles/recorder-button.scss";
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";

const LiveAudioVisualizer = React.lazy(async () => {
  const { LiveAudioVisualizer } = await import("react-audio-visualize");
  return { default: LiveAudioVisualizer };
});

/**
 * Usage: https://github.com/samhirtarif/react-audio-recorder#audiorecorder-component
 *
 *
 * @prop `onRecordingComplete` Method that gets called when save recording option is clicked
 * @prop `recorderControls` Externally initilize hook and pass the returned object to this param, this gives your control over the component from outside the component.
 * https://github.com/samhirtarif/react-audio-recorder#combine-the-useaudiorecorder-hook-and-the-audiorecorder-component
 * @prop `audioTrackConstraints`: Takes a {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings#instance_properties_of_audio_tracks subset} of `MediaTrackConstraints` that apply to the audio track
 * @prop `onNotAllowedOrFound`: A method that gets called when the getUserMedia promise is rejected. It receives the DOMException as its input.
 * @prop `downloadOnSavePress` If set to `true` the file gets downloaded when save recording is pressed. Defaults to `false`
 * @prop `downloadFileExtension` File extension for the audio filed that gets downloaded. Defaults to `mp3`. Allowed values are `mp3`, `wav` and `webm`
 * @prop `showVisualizer` Displays a waveform visualization for the audio when set to `true`. Defaults to `false`
 * @prop `classes` Is an object with attributes representing classes for different parts of the component
 */
const AudioRecorder: (props: Props) => ReactElement = ({
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
}: Props) => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } =
    recorderControls ??
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAudioRecorder(
      audioTrackConstraints,
      onNotAllowedOrFound,
      mediaRecorderOptions

      
    );
  // console.log("isRecording prop:", isRecording);

  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(isRecording);
    }
  }, [isRecording, onRecordingStateChange]);

  const [shouldSave, setShouldSave] = useState(false);

  const stopAudioRecorder: (save?: boolean) => void = (
    save: boolean = true
  ) => {
    setShouldSave(save);
    stopRecording();
  };

  const convertToDownloadFileExtension = async (
    webmBlob: Blob
  ): Promise<Blob> => {
    const FFmpeg = await import("@ffmpeg/ffmpeg");
    const ffmpeg = FFmpeg.createFFmpeg({ log: false });
    await ffmpeg.load();

    const inputName = "input.webm";
    const outputName = `output.${downloadFileExtension}`;

    ffmpeg.FS(
      "writeFile",
      inputName,
      new Uint8Array(await webmBlob.arrayBuffer())
    );

    await ffmpeg.run("-i", inputName, outputName);

    const outputData = ffmpeg.FS("readFile", outputName);
    const outputBlob = new Blob([outputData.buffer], {
      type: `audio/${downloadFileExtension}`,
    });

    return outputBlob;
  };

  const downloadBlob = async (blob: Blob): Promise<void> => {
    if (!crossOriginIsolated && downloadFileExtension !== "webm") {
      console.warn(
        `This website is not "cross-origin isolated". Audio will be downloaded in webm format, since mp3/wav encoding requires cross origin isolation. Please visit https://web.dev/cross-origin-isolation-guide/ and https://web.dev/coop-coep/ for information on how to make your website "cross-origin isolated"`
      );
    }

    const downloadBlob = crossOriginIsolated
      ? await convertToDownloadFileExtension(blob)
      : blob;
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

  useEffect(() => {
    if (
      (shouldSave || recorderControls) &&
      recordingBlob != null &&
      onRecordingComplete != null
    ) {
      onRecordingComplete(recordingBlob);
      if (downloadOnSavePress) {
        void downloadBlob(recordingBlob);
      }
    }
  }, [recordingBlob]);

  return (
    <div
      className="antidote-recorder-container"
      data-testid="audio_recorder"
    >
      {/* recordingtimer */}
      <span
        className={`audio-recorder-timer ${
          !isRecording ? "display-none" : ""
        } ${classes?.AudioRecorderTimerClass ?? ""}`}
        data-testid="ar_timer"
      >
        {Math.floor(recordingTime / 60)}:
        {String(recordingTime % 60).padStart(2, "0")}
      </span>
      {showVisualizer ? (
        <span
          className={`audio-recorder-visualizer ${
            !isRecording ? "display-none" : ""
          }`}
        >
          {mediaRecorder && (
            <Suspense fallback={<></>}>
              <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                barWidth={2}
                gap={2}
                width={140}
                height={30}
                fftSize={512}
                maxDecibels={-10}
                minDecibels={-80}
                smoothingTimeConstant={0.4}
              />
            </Suspense>
          )}
        </span>
      ) : (
        <span
          className={`audio-recorder-status ${
            !isRecording ? "display-none" : ""
          } ${classes?.AudioRecorderStatusClass ?? ""}`}
        >
          <span className="audio-recorder-status-dot"></span>
          Recording
        </span>
      )}

      {/* recorder button */}
      <div>
        <div className="antidote-recorder-container">
          <div
            className={`antidote-recorder-button ${isRecording ? 'is-recording' : ''}`}
            onClick={startRecording}
          >
            <img className="light-image recorder-emblem" src={antidoteEmblem} alt="" />
            <img className="dark-image recorder-emblem" src={antidoteEmblem} alt="" />
        </div>
        </div>

        <div className="antidote-controls-container">
          {/* SAVE SVG */}
          {/* <img
            src={isRecording ? saveSVG : micSVG}
            className={`audio-recorder-mic ${
              classes?.AudioRecorderStartSaveClass ?? ""
            }`}
            onClick={isRecording ? () => stopAudioRecorder() : startRecording}
            data-testid="ar_mic"
            title={isRecording ? "Save recording" : "Start recording"}
          /> */}

          <div
            // src={isRecording ? saveSVG : micSVG}
            className={"completed"}
            onClick={isRecording ? () => stopAudioRecorder() : startRecording}
            data-testid="ar_mic"
            title={isRecording ? "Save recording" : "Start recording"}
          >
            <i><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></i>
          </div>

          {/* PAUSE */}
          <img
            src={isPaused ? resumeSVG : pauseSVG}
            className="pause"
            onClick={togglePauseResume}
            title={isPaused ? "Resume recording" : "Pause recording"}
            data-testid="ar_pause"
          />
          
          {/* <img
            src={discardSVG}
            className={`audio-recorder-options ${
              !isRecording ? "display-none" : ""
            } ${classes?.AudioRecorderDiscardClass ?? ""}`}
            onClick={() => stopAudioRecorder(false)}
            title="Discard Recording"
            data-testid="ar_cancel"
          /> */}

          {/* DELETE */}
          <div 
            className={`audio-recorder-options ${
              !isRecording ? "display-none" : "deleted"
            } ${classes?.AudioRecorderDiscardClass ?? ""}`}
            onClick={() => stopAudioRecorder(false)}
            title="Discard Recording"
            data-testid="ar_cancel"
          >
            <i><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
