import { config } from 'dotenv';
config();

import express, {NextFunction, Request, Response} from 'express';
const bodyParser = require('body-parser');
import mongoose from 'mongoose';
import Patients from "./models/Patient";
import cors from 'cors';
import path from 'path';
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


const app = express();

const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
;

let gfs;

const conn = mongoose.createConnection(process.env.MONGO_URL!);

 conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
 })

 const storage = new GridFsStorage({
  url: process.env.MONGO_URL!,
  file: (req: Request, file: Express.Multer.File) => {
    return new Promise((resolve, reject) => {
      const patientData = req.body.patientData ? JSON.parse(req.body.patientData) : {};
      if (!patientData) {
        reject(new Error("No patient data provided"));
      }

      crypto.randomBytes(16, (err: Error , buf: Buffer) => {
        if (err) {
          console.error('Error generating filename:', err);
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          // _id: new mongoose.Types.ObjectId(),
          filename: filename,
          metadata: patientData,
          bucketName: 'uploads'
        };
        console.log('File info:', fileInfo);
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });


// @ route GET / @desc Loads from

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

// @route POST /upload
app.post('/upload', upload.single('recording'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.json({ file: req.file });
  // res.redirect('/recordings_table'); ** implement for redirect! **
}, (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Upload failed:', error);
  res.status(500).send('Error uploading file');
});


app.get('/get_patients', async (req: Request, res: Response) => {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { FirstName: { $regex: RegExp(search as string, 'i') } },
            { LastName: { $regex: RegExp(search as string, 'i') } },
            // { DateOfBirth: { $regex: RegExp(search as string, 'i') } },
          ],
        }
      : {};
    
    console.log('Query object:', query);
    const patients = await Patients.find(query);
    res.json(patients);
});

app.post('/create_patient', async (req : Request, res: Response) => {
    const newPatient = new Patients({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        DateOfBirth: req.body.DateOfBirth
    });
    const createdPatient = await newPatient.save();
    res.json(createdPatient);
})

mongoose.connect(
    process.env.MONGO_URL!
).then(() => {
    console.log(`Connected to database on port: ${PORT}`);
    app.listen(PORT);
});




