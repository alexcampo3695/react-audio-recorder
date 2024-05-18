import { Request, Response } from 'express';
import Patients from '../models/Patient';

export async function createPatient(req: Request, res: Response) {
    const newPatient = new Patients({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        DateOfBirth: req.body.DateOfBirth
    });
    const createdPatient = await newPatient.save();
    res.json(createdPatient);
}

export async function getPatients(req: Request, res: Response) {
    const { search } = req.query;
    const query = search
        ? {
            $or: [
                { FirstName: { $regex: RegExp(search as string, 'i') } },
                { LastName: { $regex: RegExp(search as string, 'i') } }
            ],
        }
        : {};

    const patients = await Patients.find(query);
    res.json(patients);
}
