import OpenAI from "openai";

const apiKey = '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'; // Replace with your actual API key

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export async function transcribeAudio(audioBlob: Blob) {
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