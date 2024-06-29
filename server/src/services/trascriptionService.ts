import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import dotenv from 'dotenv';
import axios from 'axios';
import Transcription from '../models/Transcription';

dotenv.config();

export async function splitAudioFile(file: { path: string, filename: string }, segmentTime: number): Promise<Buffer[]> {
    const inputPath = file.path;
    const outputPattern = path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}-%03d.wav`);
    const chunks: Buffer[] = [];

    if (!fs.existsSync(inputPath)) {
        throw new Error(`Input file does not exist: ${inputPath}`);
    }

    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPattern)
            .outputOptions(['-f', 'segment', '-segment_time', `${segmentTime}`, '-c:a', 'pcm_s16le'])
            .on('end', resolve)
            .on('error', (err, stdout, stderr) => {
                reject(err);
            })
            .run();
    });

    for (let i = 0; true; i++) {
        const chunkPath = `${path.dirname(inputPath)}/${path.basename(inputPath, path.extname(inputPath))}-${i.toString().padStart(3, '0')}.wav`;
        if (fs.existsSync(chunkPath)) {
            chunks.push(fs.readFileSync(chunkPath));
            fs.unlinkSync(chunkPath);
        } else {
            break;
        }
    }

    return chunks;
}

export async function transcribeAudio(blob: Buffer): Promise<any> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
    }

    const form = new FormData();
    form.append('file', blob, { filename: 'audio.wav', contentType: 'audio/wav' });
    form.append('model', 'whisper-1');

    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        ...form.getHeaders()
    };

    try {
        const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", form, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function generateTranscription(inputPath: string, recording: any, fileId: any) {
    const chunks = await splitAudioFile({ path: inputPath, filename: recording.filename }, 60);
    let transcription = '';
    for (const chunk of chunks) {
        const transcriptionResponse = await transcribeAudio(chunk);
        transcription += transcriptionResponse.text + ' ';
    }
    await Transcription.updateOne(
        { fileId: fileId },
        { $set: { transcription: transcription.trim(), status: 'complete' } }
    );
    return transcription.trim();
}


// export async function icd10Generator(text: string): Promise<string> {
//     const apiKey = process.env.VITE_OPENAI_API_KEY;
//     if (!apiKey) {
//         throw new Error("OpenAI API key is not set in environment variables");
//     }

//     const requestBody = {
//         model: "gpt-3.5-turbo",
//         messages: [
//             {
//                 role: "system",
//                 content: "You are a helpful assistant designed to output valid ICD-10 codes in JSON format without periods."
//             },
//             {
//                 role: "user",
//                 content: `You are receiving a conversation between a provider and a patient.
//                         Your task is to strictly provide valid ICD-10 codes for the conversation in JSON format without periods.
//                         Please ensure the following:

//                         - Each ICD-10 code must be valid and without periods.
//                         - The JSON format should follow these examples:
//                         {CODE:"A000", Description:"Cholera due to Vibrio cholerae 01, biovar cholerae"}
//                         {CODE:"A001", Description:"Cholera due to Vibrio cholerae 01, biovar eltor"}
//                         {CODE:"A001", Description:"Cholera, unspecified"}
//                         {CODE:"A009", Description:"Cholera, unspecified"}
//                         {CODE:"A0100", Description:"Typhoid fever, unspecified"}
//                         {CODE:"A0101", Description:"Typhoid meningitis"}

//                         Here is the transcription:\n\n${text}`
//             }
//         ],
//         max_tokens: 4096,
//         temperature: 0.0,
//     };

//     try {
//         const response = await axios.post("https://api.openai.com/v1/chat/completions", requestBody, {
//             headers: {
//                 "Authorization": `Bearer ${apiKey}`,
//                 "Content-Type": "application/json"
//             }
//         });
//         return response.data.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('Error from OpenAI API:', error.response?.data);
//         throw new Error(`Failed to generate ICD-10 codes: ${error.response?.status} ${error.response?.statusText}`);
//     }
// }
