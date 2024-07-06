import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import path from 'path';
import multer from 'multer';
import { storage } from './utils/gridFsUtils';



// Routes
import patientRoutes from './routes/patientRoutes';
import audioRoutes from './routes/audioRoutes';
import transcriptionRoutes from './routes/trascriptionRoutes';
import summaryRoutes from './routes/encounterSummaryRoutes';
import diarizationRoutes from './routes/diarizationRoutes';
import icd10Routes from './routes/icd10Routes';
import medicationsRoutes from './routes/medicationsRoutes';
import cptRoutes from './routes/cptRoutes';
import clincalNotesRoutes from './routes/clinicalNotesRoutes';
import userRoutes from './routes/userRoutes';
import userDetailsRoutes from './routes/userDetailsRoutes';
import emailRoutes from './routes/emailRoutes';
import taskRoutes from './routes/taskRoutes';

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

app.use('/api/patients', patientRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/transcriptions', transcriptionRoutes);
app.use('/api/encounter_summary', summaryRoutes);
app.use('/api/diarization', diarizationRoutes);
app.use('/api/icd10', icd10Routes);
app.use('/api/medications', medicationsRoutes);
app.use('/api/cpt', cptRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/clinical_note', clincalNotesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user_details', userDetailsRoutes);
app.use('/api/email', emailRoutes)


export default app;
