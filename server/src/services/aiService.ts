import axios from 'axios';
import dotenv from 'dotenv';
import { NotFoundError } from 'openai';

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

                        - Each ICD-10 code must be valid JSON and without periods or special characters.
                        - The JSON format should follow these examples:
                        [
                            {
                                "code": "A000",
                                "description": "Cholera due to Vibrio cholerae 01, biovar cholerae",
                                "status": false
                            },
                            {
                                "code": "A001",
                                "description": "Cholera due to Vibrio cholerae 01, biovar eltor",
                                "status": false
                            },
                            {
                                "code": "A001",
                                "description": "Cholera, unspecified",
                                "status": false
                            },
                            {
                                "code": "A009",
                                "description": "Cholera, unspecified",
                                "status": false
                            },
                            {
                                "code": "A0100",
                                "description": "Typhoid fever, unspecified",
                                "status": false
                            },
                            {
                                "code": "A0101",
                                "description": "Typhoid meningitis",
                                "status": false
                            }
                        ]
                        
                        Produce with this type: 
                        
                        interface ICD10Code {
                            code: string;
                            description: string;
                            status: boolean;
                        }

                        Please set every 'status' boolean to true.

                        If there are no medications in the transcription, please provide an empty array.

                        Provide me only JSON and no superfluous information, text, characters, or comments.

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

        const sanitizedResponseData = responseData.replace(/(`|´|‘|’)/g, '"');
        const icd10Codes: ICD10Code[] = JSON.parse(sanitizedResponseData);
        return icd10Codes;
        
    } catch (error) {
        console.error('Error from OpenAI API:', error);
        
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } 
        
    }
    return null;
}

interface Medication {
    DrugName: string;
    Dosage: string;
    Frequency: string;
    FillSupply: number;
    MethodOfIngestion: string;
    StartDate?: string;
    EndDate?: string; 
    SpecialInstructions?: string;
    Status: boolean;
}

export async function medicationGenerator(text: string): Promise<Medication[]> {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output valid Medications in JSON format without periods."
            },
            {
                role: "user",
                content: `You are receiving a conversation between a provider and a patient.
                        Your task is to strictly provide valid ICD-10 codes for the conversation in JSON format without periods.
                        Please ensure the following:

                        - Each medication must be valid JSON and without periods.
                        - The JSON format should follow these examples:
                        [
                            {
                                "DrugName": "Aspirin",
                                "Dosage": "100 mg",
                                "Frequency": "Once a day",
                                "FillSupply": 30,
                                "MethodOfIngestion": "Oral",
                                "StartDate": "2024-05-01",
                                "EndDate": "2024-05-30",
                                "SpecialInstructions": "Take with food",
                                "Status": true
                            },
                            {
                                "DrugName": "Lisinopril",
                                "Dosage": "20 mg",
                                "Frequency": "Twice a day",
                                "FillSupply": 60,
                                "MethodOfIngestion": "Oral",
                                "StartDate": "2024-05-15",
                                "SpecialInstructions": "Monitor blood pressure regularly",
                                "Status": true
                            },
                            {
                                "DrugName": "Metformin",
                                "Dosage": "500 mg",
                                "Frequency": "Twice a day",
                                "FillSupply": 60,
                                "MethodOfIngestion": "Oral",
                                "StartDate": "2024-06-01",
                                "EndDate": "2024-06-30",
                                "SpecialInstructions": "Take with a meal",
                                "Status": false
                            },
                            {
                                "DrugName": "Albuterol",
                                "Dosage": "2 puffs",
                                "Frequency": "As needed",
                                "FillSupply": 200,
                                "MethodOfIngestion": "Inhalation",
                                "StartDate": "2024-05-20",
                                "SpecialInstructions": "Use as directed for wheezing",
                                "Status": true
                            }
                        ]
                        
                        
                        Produce with this type: 
                        
                        interface MedicationResponse {
                            medicationId: string;
                            patientId: string;
                            fileId: string;
                            drugCode: string;
                            drugName: string;
                            dosage: string;
                            frequency: string;
                            fillSupply: number;
                            methodOfIngestion: string;
                            startDate: Date;
                            endDate?: Date;
                            status: boolean;
                          }
                          

                        Please set every 'Status' boolean to true.

                        Provide me only JSON and no superfluous information, text, characters, or comments.

                        If there are no medications in the transcription, please provide an empty array.

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
        console.log('Medication Response Data:', responseData)
        const sanitizedResponseData = responseData.replace(/(`|´|‘|’)/g, '"');
        const medications: Medication[] = JSON.parse(sanitizedResponseData);
        return medications;
        
    } catch (error) {
        console.error('Error from OpenAI API:', error);
        
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } 
    }
    return null;
}


interface CPT {
    code: string;
    description: string;
    status: boolean;
}

export async function cptGenerator(text: string): Promise<ICD10Code[]> {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output valid CPT codes in JSON format without periods."
            },
            {
                role: "user",
                content: `You are receiving a conversation between a provider and a patient.
                        Your task is to strictly provide valid CPT codes for the conversation in JSON format without periods.
                        Please ensure the following:

                        - Each ICD-10 code must be valid JSON and without periods or special characters.
                        - The JSON format should follow these examples:
                        [
                            {
                                "code": "99213",
                                "description": "Office or other outpatient visit for the evaluation and management of an established patient",
                                "status": true
                            },
                            {
                                "code": "93000",
                                "description": "Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report",
                                "status": true
                            },
                            {
                                "code": "90471",
                                "description": "Immunization administration (includes percutaneous, intradermal, subcutaneous, or intramuscular injections); one vaccine (single or combination vaccine/toxoid)",
                                "status": true
                            },
                            {
                                "code": "85610",
                                "description": "Prothrombin time (PT)",
                                "status": true
                            }
                        ]
                        
                        
                        Produce with this type: 
                        
                        interface CPT {
                            code: string;
                            description: string;
                            status: boolean;
                        }

                        Please set every 'status' boolean to true.

                        If there are no CPTs valid in the transcription, please provide an empty array.

                        Provide me only JSON and no superfluous information, text, characters, or comments.

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
        console.log('CPT Response Data:', responseData)
        const sanitizedResponseData = responseData.replace(/(`|´|‘|’)/g, '"');
        const cptCodes: CPT[] = JSON.parse(sanitizedResponseData);
        return cptCodes;
        
    } catch (error) {
        console.error('Error from OpenAI API:', error);
        
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } 
        
    }
    return null;
}

