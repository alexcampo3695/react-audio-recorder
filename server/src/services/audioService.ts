import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { Readable } from 'stream';
import { db } from '../utils/gridFsUtils';
import { GridFSBucket } from 'mongodb';

export async function splitAudioFile(file: Express.Multer.File, chunkSize: number): Promise<Buffer[]> {
    const inputPath = path.join(__dirname, 'uploads', file.filename);
    const chunks: Buffer[] = [];

    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions('-f segment', `-segment_time ${chunkSize}`, '-c copy', `${inputPath}-%03d.wav`)
            .on('end', resolve)
            .on('error', reject)
            .run();
    });

    for (let i = 0; true; i++) {
        const chunkPath = `${inputPath}-${i.toString().padStart(3, '0')}.wav`;
        if (fs.existsSync(chunkPath)) {
            chunks.push(fs.readFileSync(chunkPath));
            fs.unlinkSync(chunkPath);
        } else {
            break;
        }
    }

    return chunks;
}

export async function transcribeAudio(blob: Buffer) {
    const form = new FormData();
    form.append('file', blob, {
        filename: 'audio.wav',
        contentType: 'audio/wav'
    });
    form.append('model', 'whisper-1');

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: form as unknown as BodyInit
    });

    if (!response.ok) {
        throw new Error('Transcription request failed');
    }

    return await response.json();
}

export async function updateMetaData(filename: string, patientData: any, transcription: string) {
    try {
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        const files = await bucket.find({ filename }).toArray();
        if (files.length > 0) {
            const file = files[0];
            await db.collection('uploads.files').updateOne(
                { _id: file._id },
                { $set: { metadata: { ...patientData, transcription } } }
            );
            console.log("Metadata updated successfully in the database.");
        }
    } catch (error) {
        console.error("Error updating metadata:", error);
    }
}
