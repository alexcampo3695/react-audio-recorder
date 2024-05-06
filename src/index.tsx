export { default as AudioRecorder } from "./components/AudioRecordingComponent";
export { default as useAudioRecorder } from "./hooks/useAudioRecorder";

require("dotenv").config();

console.log(process.env.OPENAI_API_KEY);
