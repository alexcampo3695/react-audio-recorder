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
                content: `Please summarize the following transcription between a provider and patient in 2-3 sentences. 
                Ensure the summary only includes events and information explicitly mentioned in the transcript and do not 
                add any information that did not occur: \n\n${text}`
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
                content: `You are receiving a conversation between a provider and a patient.
              Your task is to strictly diarize the conversation in markdown format. 
              Please ensure the following:
              - Only include events and information that are explicitly mentioned in the transcript.
              - Fix any grammatical errors conservatively.
              - Label and distinguish between "Provider" and "Patient".
              - Do not add any events or information that did not occur in the provided text.
              - Format the conversation in markdown.
              Here is the transcription:\n\n${text}`
              }
        ],
        max_tokens: 4096,
        temperature: 0.0
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

interface ICD10Code {
    code: string;
    description: string;
    status: boolean;
}

export async function icd10Generator(text: string): Promise<ICD10Code[]> {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output valid ICD-10 codes in JSON format without periods."
            },
            {
                role: "user",
                content: `You are receiving a conversation between a provider and a patient.
                        Your task is to strictly provide valid ICD-10 codes for the conversation in JSON format without periods.
                        Please ensure the following:

                        - Each ICD-10 code must be valid and without periods.
                        - The JSON format should follow these examples:
                        {"code":"A000", "description":"Cholera due to Vibrio cholerae 01, biovar cholerae"}
                        {"code":"A001", "description":"Cholera due to Vibrio cholerae 01, biovar eltor"}
                        {"code":"A001", "description":"Cholera, unspecified"}
                        {"code":"A009", "description":"Cholera, unspecified"}
                        {"code":"A0100", "description":"Typhoid fever, unspecified"}
                        {"code":"A0101", "description":"Typhoid meningitis"}

                        Produce with this type: 
                        
                        interface ICD10Code {
                            code: string;
                            description: string;
                            status: boolean;
                        }

                        Please set every boolean to false.

                        Here is the transcription:\n\n${text}`
            }
        ],
        max_tokens: 4096,
        temperature: 0.0,
    };

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", requestBody, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });
        const responseData = response.data.choices[0].message.content.trim();
        const icd10Codes: ICD10Code[] = JSON.parse(responseData);

        return icd10Codes;
        
    } catch (error) {
        console.error('Error from OpenAI API:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        throw new Error(`Failed to generate ICD-10 codes: ${error.message}`);
    }
}