import { icd10Generator, taskGenerator } from './aiService';
import ICD10Model from '../models/ICD10';
import { ICD10 } from '../types/ICD10'
import { Tasks } from '../types/Tasks';
import TasksModel from '../models/Tasks';

export async function generateTasks(transcription: string, fileId: any, patientId: any) {
    let tasks: Tasks[] = [];
    for (let i = 0; i < 3; i++) {
        tasks = await taskGenerator(transcription);
        if (tasks !== null) {
            break;
        }
        console.log('ICD10 Codes',tasks)
    }
    
    const taskPromises = tasks.map(async(task) => {
        const existingTask = await TasksModel.findOne({code: task.task})
        if (existingTask) {
            return ICD10Model.updateOne(
                { task: task.task},
                {
                    reasoning: task.reasoning,
                    status: task.status,
                    dueDate: task.dueDate,
                    patientId: patientId,
                    fileId: fileId
                }
            );
        } else {
            const newTask = new TasksModel({
                fileId: fileId,
                task: task.task,
                reasoning: task.reasoning,
                dueDate: task.dueDate,
                status: task.status,
                patientId: patientId
            });
            return newTask.save()
        }
    });

    await Promise.all(taskPromises);

    const savedTasks = await TasksModel.find({ file: fileId })

    return savedTasks
}
