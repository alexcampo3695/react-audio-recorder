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

    console.log(`Splitting audio file: ${inputPath} into chunks of ${segmentTime} seconds each.`);
    console.log(`Output pattern: ${outputPattern}`);

    if (!fs.existsSync(inputPath)) {
        throw new Error(`Input file does not exist: ${inputPath}`);
    }

    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPattern)
            .outputOptions(['-f', 'segment', '-segment_time', `${segmentTime}`, '-c:a', 'pcm_s16le'])
            .on('start', (cmd) => console.log(`Running ffmpeg command: ${cmd}`))
            .on('stderr', (stderrLine) => console.error('ffmpeg stderr:', stderrLine))
            .on('end', resolve)
            .on('error', (err, stdout, stderr) => {
                console.error(`ffmpeg error: ${err.message}`);
                console.error(`ffmpeg stdout: ${stdout}`);
                console.error(`ffmpeg stderr: ${stderr}`);
                reject(err);
            })
            .run();
    });

    console.log(`Checking for chunk files with pattern: ${outputPattern}`);

    for (let i = 0; true; i++) {
        const chunkPath = `${path.dirname(inputPath)}/${path.basename(inputPath, path.extname(inputPath))}-${i.toString().padStart(3, '0')}.wav`;
        if (fs.existsSync(chunkPath)) {
            console.log(`Found chunk file: ${chunkPath}`);
            chunks.push(fs.readFileSync(chunkPath));
            fs.unlinkSync(chunkPath);
        } else {
            break;
        }
    }

    console.log(`Total chunks created: ${chunks.length}`);
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

    console.log(`Using OpenAI API Key: ${apiKey}`);

    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        ...form.getHeaders()
    };

    console.log('headers:', headers);

    try {
        const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", form, {
            headers: headers
        });

        return response.data;
    } catch (error) {
        console.error("Error transcribing audio:", error);
        throw error;
    }
}

