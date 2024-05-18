import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import path from 'path';
import crypto from 'crypto';
import { storage } from './utils/gridFsUtils';
import multer from 'multer';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const upload = multer({ storage }).single('recording');

// Connect to MongoDB
const dbConnectionUrl = process.env.MONGO_URL!;
mongoose.connect(dbConnectionUrl).then(() => {
    console.log('Connected to MongoDB');
});

// Routes
import patientRoutes from './routes/patientRoutes';
import audioRoutes from './routes/audioRoutes';

app.use('/patients', patientRoutes);
app.use('/audio', audioRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

export default app;
