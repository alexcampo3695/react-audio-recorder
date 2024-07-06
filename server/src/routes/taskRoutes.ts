import { Router } from 'express';
import { getTasks, getTasksByFile, updateTaskStatus } from '../controllers/taskController';

const router = Router();

router.get('/', getTasks); // Gets all tasks
router.get('/file/:fileID', getTasksByFile); // Gets by tasks ileID
router.patch('/update/:id', updateTaskStatus); //Patches tasks by id

export default router;
