import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function summarizeTranscription(text: string): Promise<string> {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            {
                role: "user",
                content: `Please summarize the following transcription between a provider and patient in 2-3 sentences: \n\n${text}`
            }
        ],
        max_tokens: 4096,
        temperature: 0.7
    };

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", requestBody, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error from OpenAI API:', error.response?.data);
        throw new Error(`Failed to summarize text: ${error.response?.status} ${error.response?.statusText}`);
    }
}

export async function diariazeTranscription(text: string): Promise<string> {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            {
                role: "user",
                content: `You're being a conversation or patient visit between a provider and patient. 
                Please diarize to the best of your ability. Please fix any grammar or fit anything 
                that have gotten lost in translation conservatively. Please label and distinguish between 
                Provider and Patient. Here is the transcription:\n\n${text}`,   
            }
        ],
        max_tokens: 4096,
        temperature: 0.7
    };

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", requestBody, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error from OpenAI API:', error.response?.data);
        throw new Error(`Failed to diarize text: ${error.response?.status} ${error.response?.statusText}`);
    }
}
