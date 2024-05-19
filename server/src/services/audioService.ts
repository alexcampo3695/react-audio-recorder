import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { Readable } from 'stream';
import { db } from '../utils/gridFsUtils';
import { GridFSBucket } from 'mongodb';
import { transcribeAudio, splitAudioFile } from './trascriptionService';


export async function updateMetaData(filename: string, patientData: any) {
    try {
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        const files = await bucket.find({ filename }).toArray();
        if (files.length > 0) {
            const file = files[0];
            await db.collection('uploads.files').updateOne(
                { _id: file._id },
                { $set: { metadata: { patientData } } }
            );
            console.log("Metadata updated successfully in the database.");
        }
    } catch (error) {
        console.error("Error updating metadata:", error);
    }
}
