import { Request, Response } from 'express';
import Transcription from '../models/Transcription';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export async function getTranscriptions(req: Request, res: Response) {
    const { page = '1', limit = '15', search = '', createdBy } = req.query;
    const pageNumber = parseInt(page as string, 15);
    const limitNumber = parseInt(limit as string, 15);
    
    if (createdBy === undefined || createdBy === '') {
        return res.status(400).json({ message: 'CreatedBy is required' });
      }

    const query = {
        'patientData.CreatedBy': createdBy,
        ...(search && {
            $or: [
                { 'patientData.FirstName': { $regex: search as string, $options: 'i' } },
                { 'patientData.LastName': { $regex: search as string, $options: 'i' } }
            ]
        })
    };

    console.log('query', query)

    try {
        const skip = (pageNumber - 1) * limitNumber;
        const totalItems = await Transcription.countDocuments();
        const totalPages = Math.ceil(totalItems / limitNumber);

        const transcriptions = await Transcription.find(query)
            .skip(skip)
            .limit(limitNumber);

        res.json({
            transcriptions,
            totalItems,
            totalPages,
            search,
            currentPage: pageNumber,
        });

        console.log('transcriptions', transcriptions)
        
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve transcriptions", error });
    }
    
}

export async function getTranscriptionById(req: Request, res: Response) {
    try {
        const transcription = await Transcription.findById(req.params.transcriptionId);
        if (!transcription) {
            return res.status(404).send('Transcription not found').json({ message: "Transcription not found" });
        }
        res.json(transcription);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve transcription", error });
    }
}

export async function getTranscriptionByFileID(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const transcription = await Transcription.findOne({ fileId: fileID });
        if (!transcription) {
            return res.status(404).json({ message: "Transcription not found" });
        }
        res.json(transcription);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve transcription", error });
    }
}