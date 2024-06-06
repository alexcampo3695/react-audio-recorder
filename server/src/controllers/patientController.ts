import { Request, Response } from 'express';
import Patients from '../models/Patient';

export async function createPatient(req: Request, res: Response) {
    const { PatientId, FirstName, LastName, DateOfBirth, CreatedBy } = req.body

    if (!CreatedBy) {
        return res.status(400).json({ message: 'CreatedBy is required'})
    }
    const newPatient = new Patients({
        PatientId,
        FirstName,
        LastName,
        DateOfBirth,
        CreatedBy
    });
    try {
        const createdPatient = await newPatient.save();
        res.json(createdPatient);
    } catch (error) {
        res.status(500).json({message: 'Error creating patient', error})
    }  
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

export async function getPatientsByCreatedUser(req: Request, res: Response) {
    const { search, createdBy, page = 1, limit = 10 } = req.body;

    if (!createdBy) {
        return res.status(400).json({ message: 'CreatedBy is required' });
    }

    const query = {
        CreatedBy: createdBy,
        ...(search && {
            $or: [
                { FirstName: { $regex: RegExp(search, 'i') } },
                { LastName: { $regex: RegExp(search, 'i') } }, 
            ],
        }),
    };

    try { 
        const skip = (page - 1) * limit
        const patients = await Patients.find(query)
            .skip(skip)
            .limit(limit)
        
        const total = await Patients.countDocuments(query);

        res.json({
            patients,
            total,
            currentPage: page,
            totalPages: Math.ceil(total/limit)
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error})
    }
}