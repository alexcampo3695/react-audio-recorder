import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import { NotFoundError } from 'openai';
import mongoose, { Schema, Document } from 'mongoose';
import { Medication } from '../types/Medication';
import { ICD10 } from '../types/ICD10'
import { CPT } from '../types/CPT'
import { Tasks } from '../types/Tasks';

dotenv.config();

function isAxiosError(error: any): error is { response: { data: any; status: number; headers: any } } {
    return error && error.response && typeof error.response === 'object';
}

export async function summarizeTranscription(text: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key:', apiKey)
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-4o-mini",
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
        if (error instanceof Error) {
            if ('response' in error && error.response) {
                console.error('Error from OpenAI API:', (error.response as any).data);
                throw new Error(`Failed to summarize text: ${(error.response as any).status} ${(error.response as any).statusText}`);
            } else {
                console.error('Error:', error.message);
                throw new Error(`Failed to summarize text: ${error.message}`);
            }
        } else {
            console.error('Unknown error:', error);
            throw new Error('Failed to summarize text: Unknown error occurred');
        }
    }
}


export async function diariazeTranscription(text: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            {
                role: "user",
                content: `You are receiving a conversation between a clinician and a patient for a health care visit.
              Your task is to strictly diarize the conversation in markdown format. 
              Please ensure the following:
              - Only include events and information that are explicitly mentioned in the transcript.
              - Fix any grammatical errors conservatively.
              - Label and distinguish between "Clinician" and "Patient".
              - Do not add any events or information that did not occur in the provided text.
              - Format the conversation in markdown.
              - FORMAT in compilable MARKDOWN Format. NO extra characters please.
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

        let transcription = response.data.choices[0].message.content.trim();
        console.log('Raw transcription:', transcription);

        // Ensure the transcription is in markdown format
        transcription = transcription.replace(/```markdown|```/g, '').trim();

        console.log('Processed transcription:', transcription);

        return transcription;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Error from OpenAI API:', error.response?.data);
            throw new Error(`Failed to diarize text: ${error.response?.status} ${error.response?.statusText}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('An unknown error occurred');
        }
    }
}




export async function icd10Generator(text: string): Promise<ICD10[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-4o-mini",
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
                        INCLUDE 0-20 ICD10 CODES THAT YOU WOULD FIND RELEVANT FOR THE VISIT!
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

                        Please use absolutely no memory, hallucination, or imagination. Only use the information provided in the transcription.

                        Just provide the relevant ICD-10 codes solorly based on the transcription provided

                        If there are no relevant ICD10 codes for the transcription, please provide an empty array.

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
        console.log('Raw ICD-10 response data:', responseData);
        
        // Remove backticks and other potential anomalies
        const sanitizedResponseData = responseData.replace(/[`´‘’]/g, '"');
        console.log('Sanitized response data:', sanitizedResponseData);

        // Ensure the response data is valid JSON
        let icd10Codes: ICD10[];
        try {
            icd10Codes = JSON.parse(sanitizedResponseData);
        } catch (jsonError) {
            console.error('Failed to parse JSON:', sanitizedResponseData);
            throw new Error('Failed to generate ICD-10 codes: Invalid JSON format');
        }

        return icd10Codes;
        
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data);
            console.error('Status:', error.response?.status);
            console.error('Headers:', error.response?.headers);
            throw new Error(`Failed to generate ICD-10 codes: ${error.response?.status} `);
        } else if (error instanceof Error) {
            console.error('Error:', error.message);
            throw new Error(`Failed to generate ICD-10 codes: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Failed to generate ICD-10 codes: Unknown error occurred');
        }
    }
}

export async function taskGenerator(text: string): Promise<Tasks[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const todaysDate = new Date().toLocaleDateString();
    console.log('Todays date:', todaysDate)

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output valid recommended tasks in JSON format without periods."
            },
            {
                role: "user",
                content: `You are receiving a conversation between a provider and a patient.
                        Your task is to strictly provide recommended clinical taks based on the conversation in JSON format without periods.
                        Here is a sample of how the output should be structured. Please ensure the following format for the JSON:
                        
                        [
                            {
                                "task": "Monitor patient's response to Adderall",
                                "reasoning": "Evaluate the effectiveness of Adderall 10 mg in managing ADHD symptoms and any side effects",
                                "severity": "Mild",
                                "status": false,
                                "dueDate": "2024-07-14T00:00:00.000Z"
                            },
                            {
                                "task": "Reassess patient's depression symptoms",
                                "reasoning": "Determine if additional treatment for depression is needed after initial trial of Adderall",
                                "severity": "Moderate",
                                "status": false,
                                "dueDate": "2024-07-21T00:00:00.000Z"
                            },
                            {
                                "task": "Schedule follow-up appointment",
                                "reasoning": "Ensure patient returns for follow-up to monitor progress and adjust treatment if necessary",
                                "severity": "Low",
                                "status": false,
                                "dueDate": "2024-07-28T00:00:00.000Z"
                            },
                            {
                                "task": "Update medication list",
                                "reasoning": "Add newly prescribed Adderall to the patient's record for accurate tracking",
                                "severity": "Low",
                                "status": false,
                                "dueDate": "2024-07-07T00:00:00.000Z"
                            }
                        ]


                        Please set every 'status' boolean to false.

                        Please set a severity of 'Low', 'Mild' , 'Moderate', or 'High' for each task.

                        If you have no recommendations for tasks, please provide an empty array.

                        Provide me only JSON and no superfluous information, text, characters, or comments.

                        Today's date is: \n\n${todaysDate}. Please make sure you do not assign tasks in the past. Here is the transcription:\n\n${text}`
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
        console.log('Raw Tasks response data:', responseData);
        
        // Remove backticks and other potential anomalies
        const sanitizedResponseData = responseData.replace(/[`´‘’]/g, '"');
        console.log('Sanitized response data:', sanitizedResponseData);

        // Ensure the response data is valid JSON
        let tasks: Tasks[];
        try {
            tasks = JSON.parse(sanitizedResponseData);
        } catch (jsonError) {
            console.error('Failed to parse JSON:', sanitizedResponseData);
            throw new Error('Failed to generate tasks: Invalid JSON format');
        }

        // tasks = tasks.map(task => ({
        //     ...task,
        //     dueDate: new Date(task.dueDate),
        //     createdAt: new Date(task.createdAt),
        //     updatedAt: new Date(task.updatedAt)
        // }));

        return tasks;
        
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data);
            console.error('Status:', error.response?.status);
            console.error('Headers:', error.response?.headers);
            throw new Error(`Failed to generate tasks: ${error.response?.status} `);
        } else if (error instanceof Error) {
            console.error('Error:', error.message);
            throw new Error(`Failed to generate tasks: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Failed to generate tasks: Unknown error occurred');
        }
    }
}

export async function medicationGenerator(text: string): Promise<Medication[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output valid Medications in JSON format without periods."
            },
            {
                role: "user",
                content: `You are receiving a conversation between a provider and a patient.
                        Your task is to strictly provide valid medication data for the conversation in JSON format without periods.
                        Please ensure the following:

                        - Each medication must be valid JSON and without periods.
                        - The JSON format should follow these examples:
                        [
                            {
                                "DrugCode": "C01",
                                "DrugName": "Aspirin",
                                "Dosage": "100 mg",
                                "Frequency": "Once a day",
                                "FillSupply": 30,
                                "MethodOfIngestion": "Oral",
                                "StartDate": "2024-05-01",
                                "EndDate": "2024-05-30",
                                "SpecialInstructions": "Take with food",
                                "Status": true
                            }
                        ]
                        
                        Produce with this type: 
                        
                        interface Medication {
                            DrugCode: string;
                            DrugName: string;
                            Dosage?: string;
                            Frequency?: string;
                            FillSupply?: number;
                            MethodOfIngestion: string;
                            StartDate?: string;
                            EndDate?: string; 
                            SpecialInstructions?: string;
                            Status: boolean;
                        }

                        - Set every 'Status' boolean to true.
                        - If there is no data for a specific field, leave it as null or undefined.
                        - Do not hallucinate any data. If there are no medications in the transcription, please provide an empty array.
                        - Provide me only JSON and no superfluous information, text, characters, or comments.

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
        const sanitizedResponseData = responseData.replace(/[`´‘’]/g, '"');
        
        let medications: Medication[];
        
        try {
            medications = JSON.parse(sanitizedResponseData);
        } catch (jsonError) {
            console.error('Failed to parse JSON:', sanitizedResponseData);
            throw new Error('Failed to generate medications: Invalid JSON format');
        }

        return medications;
        
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error from OpenAI API:', error.response?.data);
            throw new Error(`Failed to generate medications: ${error.response?.status} ${error.response?.statusText}`);
        } else if (error instanceof Error) {
            console.error('Error:', error.message);
            throw new Error(`Failed to generate medications: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('An unknown error occurred');
        }
    }
}

export async function cptGenerator(text: string): Promise<CPT[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output valid CPT codes in JSON format without periods."
            },
            {
                role: "user",
                content: `You are receiving a conversation between a provider and a patient.
                        INCLUDE ALL CPTS THAT YOU WOULD FIND RELEVANT FOR THE VISIT!
                        Your task is to strictly provide valid CPT codes for the conversation in JSON format without periods.
                        Please ensure the following:

                        - Each CPT code must be valid JSON and without periods or special characters.
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
        
        const sanitizedResponseData = responseData.replace(/[`´‘’]/g, '"');

        let cptCodes: CPT[];
        try {
            cptCodes = JSON.parse(sanitizedResponseData); // <-- Corrected: removed `const` keyword
        } catch (jsonError) {
            console.error('Failed to parse JSON:', sanitizedResponseData);
            throw new Error('Failed to generate CPT codes: Invalid JSON format'); // <-- Corrected error message
        }
        
        return cptCodes; // <-- Now this variable is properly defined and returned
        
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error from OpenAI API:', error.response?.data);
            throw new Error(`Failed to generate CPT codes: ${error.response?.status} ${error.response?.statusText}`);
        } else if (error instanceof Error) {
            console.error('Error:', error.message);
            throw new Error(`Failed to generate CPT codes: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('An unknown error occurred');
        }
    }
}

interface NoteProps {
    transcription: string
    icd10Codes: string
    cptCodes: string
    medicatations: string
    patientData: string
    userDetails: string
}

export async function noteGenerator(transcription: string, icd10Codes: string, cptCode: string, medications: string, patientData: string, userDetails: string): Promise<NoteProps[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output valid CPT codes in JSON format without periods."
            },
            {
                role: "user",
                content: 
                `
                    You are receiving multiple payloads for a viit between a provider and a patient or a provider taking notes on a patient vist.
                    Your task is to generate a comprehensive medical note from the data you are provided. 
                    Please ensure the following:
                    - Only include events and information that are explicitly mentioned in the transcript and the data provided.
                    - Please ensure the note is formatted in markdown.
                    - Please make the markdown beautiful and easy to read.
                    - Please use emojis with the bolded headers.
                    - Please include: Treatment Plans: Creating detailed treatment plans that include medications, therapies, and follow-up appointments.
                    - Please include: Diagnosis: Listing the icd 10 diagnosis codes (code & description) that were discussed during the visit.
                    - Please include: Procedures: Listing the procedures (with cpt codes, code & description) that were discussed during the visit.
                    - Please include: Medications: Listing the medications that were discussed during the visit.
                    - Please include: Follow-up: Scheduling follow-up appointments and tests.
                    - Please include: Referrals: Making referrals to specialists.
                    - SOAP Notes: Structuring the transcription into SOAP (Subjective, Objective, Assessment, Plan) notes format for consistency and clarity.
                    - Chronic Condition Management Plans: Creating specific plans for managing chronic conditions such as diabetes, hypertension, and asthma.
                    - Format the conversation in markdown.
                    - Please do not make a title, I'm already handling this in the UI. Just got straight into the note.
                    - Please provide the patient details in the note in its own section separated by a line break.
                    - Please provider from user details. The user details always be the clinical provider
                    - Please attach a nice cofied provider details section at the bottom of the note, for the provider section.
                    Here is the transcription:\n\n${transcription}
                    Here are the diagnosis codes:\n\n${icd10Codes}
                    Here are the cpt codes:\n\n${cptCode}
                    Here are the medications:\n\n${medications}
                    Here are the patient details:\n\n${patientData}
                    Here are the user details:\n\n${userDetails}
                    Here is today's date: ${new Date().toLocaleDateString()}
                `

            }
        ],
        max_tokens: 3000,
        temperature: 0.0,
    };

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", requestBody, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });
        return response.data.choices[0].message.content.trim();
        
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.error('Response data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            throw new Error(`Failed to generate clinical note: ${error.response.status} `);
        } else if (error instanceof Error) {
            console.error('Error:', error.message);
            throw new Error(`Failed to generate clinical note: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Failed to generate clinical note: Unknown error occurred');
        }
    }
}

