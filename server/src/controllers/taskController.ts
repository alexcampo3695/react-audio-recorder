import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Tasks from '../models/Tasks';
import TasksModel from '../models/Tasks';

export async function getTasks(req: Request, res: Response) {
    try {
        const tasks = await TasksModel.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve tasks", error });
    }
}

export async function getTasksByFile(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const tasks = await TasksModel.find({ fileId: fileID });
        if (!tasks) {
            return res.status(404).json({ message: "Tasks not found" });
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve tasks", error });
    }
}

export async function updateTaskStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updateTask = await TasksModel.findByIdAndUpdate(id, {status}, {new: true});
        if (!updateTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(updateTask);
    } catch (error) {
        res.status(500).json({ message: "Failed to update task status", error });
    }
};

export async function getTasksByUser(req: Request, res: Response) {
    try {
        const { createdById } = req.params
        console.log('Fetching tasks for createdBy:', createdById);
        const tasks = await TasksModel.find({ createdBy: createdById });
        if (!tasks) {
            return res.status(404).json({ message: "Tasks not found" });
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve tasks", error });
    }
};