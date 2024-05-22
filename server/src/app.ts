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
app.use('/api/medcations', medicationsRoutes);
app.use('/api/cpt', cptRoutes);



export default app;
