import { Request, Response } from 'express';
import Transcription from '../models/Transcription';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
import ClinicalNote from '../models/ClinicalNote';

// export async function getClinicalNotes(req: Request, res: Response) {
//     try {
//         const clincalNote = await ClinicalNote.find();
//         res.json(clincalNote);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to retrieve clincalNote", error });
//     }
// }

// export async function getClincalNotesById(req: Request, res: Response) {
//     try {
//         const clincalNote = await ClinicalNote.findById(req.params._id);
//         if (!clincalNote) {
//             return res.status(404).send('clincalNote not found').json({ message: "clincalNote not found" });
//         }
//         res.json(clincalNote);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to retrieve clincalNote", error });
//     }
// }

export async function getClincalNotesByFileID(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const clinicalNote = await ClinicalNote.findOne({ fileID });

        if (!clinicalNote) {
            return res.status(404).json({ message: "Cpt's not found" });
        }
        res.json(clinicalNote);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve Cpts", error });
    }
}