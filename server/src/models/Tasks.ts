// src/models/ICD10.ts
import { Schema, model, Document } from 'mongoose';
import { Tasks } from '../types/Tasks';

interface TasksDocument extends Tasks, Document {}

const TaskSchema = new Schema<TasksDocument>({
    fileId: { type: String, required: true },
    task: { type: String, required: true },
    reasoning: { type: String, required: true },
    status: { type: Boolean, default: true },
    dueDate: { type: Date, default: Date.now  },
    patientId: { type: String, required: true, ref: 'Patient' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const TasksModel = model<TasksDocument>('Tasks', TaskSchema);

export default TasksModel;
