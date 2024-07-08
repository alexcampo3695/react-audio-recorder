import { icd10Generator, taskGenerator } from './aiService';
import ICD10Model from '../models/ICD10';
import { ICD10 } from '../types/ICD10'
import { Tasks } from '../types/Tasks';
import TasksModel from '../models/Tasks';

export async function generateTasks(transcription: string, fileId: any, patientId: any, createdBy: any) {
    let tasks: Tasks[] = [];
    for (let i = 0; i < 3; i++) {
        const tasksJson = await taskGenerator(transcription);
        if (tasksJson !== null && tasksJson.length > 0) {
            tasks = tasksJson;
            break;
        }
    }
    
    const taskPromises = tasks.map(async(task) => {
        const existingTask = await TasksModel.findOne({task: task.task})
        if (existingTask) {
            console.log(`Updating existing task: ${task.task}`);
            return TasksModel.updateOne(
                { task: task.task},
                {
                    reasoning: task.reasoning,
                    status: task.status,
                    dueDate: task.dueDate,
                    patientId: patientId,
                    fileId: fileId,
                    createdBy: createdBy
                }
            );
        } else {

            console.log(`Creating new task: ${task.task}`)
            const newTask = new TasksModel({
                fileId: fileId,
                task: task.task,
                reasoning: task.reasoning,
                dueDate: task.dueDate,
                status: task.status,
                patientId: patientId,
                createdBy: createdBy
            });
            return newTask.save()
        }
    });

    await Promise.all(taskPromises);

    const savedTasks = await TasksModel.find({ file: fileId })

    console.log('Saved Tasks:', savedTasks)

    return savedTasks
}
