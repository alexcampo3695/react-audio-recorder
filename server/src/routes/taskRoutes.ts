import { Router } from 'express';
import { getTasks, getTasksByFile, getTasksByUser, updateTaskStatus } from '../controllers/taskController';

const router = Router();

router.get('/', getTasks); // Gets all tasks
router.get('/file/:fileID', getTasksByFile); // Gets by tasks fileID
router.patch('/update/:id', updateTaskStatus); //Patches tasks by id
router.get('/created_by/:createdById', getTasksByUser); // Gets by tasks ileID

export default router;
