import OpenAI from "openai";

const apiKey = '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'; // Replace with your actual API key

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export async function categorizeTranscription(transcription: string) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that categorizes transcriptions.',
        },
        {
          role: 'user',
          content: `Please provide a summary:\n\n${transcription}\n\nProvide a short summary.`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    const summary = chatCompletion.choices[0].message.content;
    return summary;
  } catch (error) {
    console.error('Error calling ChatGPT:', error);
    throw error;
  }
};