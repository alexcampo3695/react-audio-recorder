import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;


const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export async function transcribeAudio(audioBlob: Blob) {
  console.log('envKey', import.meta.env.OPEN_API_KEY);
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.wav');
  formData.append('model', 'whisper-1');
  const file = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

  try {
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });
    return response;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}