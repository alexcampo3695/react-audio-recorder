import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import dotenv from 'dotenv';
import axios from 'axios';

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
    const apiKey = process.env.VITE_OPENAI_API_KEY;
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
