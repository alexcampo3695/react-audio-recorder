import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URL!;
const dbName = process.env.DB_NAME!;

mongoose.connect(url);

// Define your Patient schema and model
const patientSchema = new mongoose.Schema({
  PatientId: { type: String, unique: true, required: true },
  FirstName: String,
  LastName: String,
  DateOfBirth: Date,
  CreatedBy: String,
});

const Patient = mongoose.model('Patient', patientSchema);

const patientDataSchema = new mongoose.Schema({
  PatientId: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  DateOfBirth: { type: Date, required: true },
  CreatedBy: { type: String, required: true },
}, { _id: false }); // _id: false to prevent creating a subdocument _id

// Define your Transcription schema and model
const transcriptionSchema = new mongoose.Schema({
  filename: String,
  transcription: String,
  patientData: { type: patientDataSchema, required: true },
  fileId: String,
  status: String,
  createdAt: Date,
  updatedAt: Date,
});

const Transcription = mongoose.model('Transcription', transcriptionSchema);

const generatePatients = (numPatients: number) => {
  const patients = [];
  for (let i = 0; i < numPatients; i++) {
    patients.push({
      PatientId: faker.datatype.uuid(),
      FirstName: faker.name.firstName(),
      LastName: faker.name.lastName(),
      DateOfBirth: faker.date.past(50, new Date()),
      CreatedBy: "6663d33b090ad1d704a7a696",
    });
  }
  return patients;
};

const generateTranscriptions = async (numTranscriptions: number, patients: any[]) => {
  const transcriptions = [];
  for (let i = 0; i < numTranscriptions; i++) {
    const randomPatient = patients[faker.datatype.number({ min: 0, max: patients.length - 1 })];
    transcriptions.push({
      filename: faker.system.fileName(),
      transcription: faker.lorem.paragraphs(),
      patientData: {
        PatientId: faker.datatype.uuid(),
        FirstName: faker.name.firstName(),
        LastName: faker.name.lastName(),
        DateOfBirth: faker.date.past(50, new Date()),
        CreatedBy: '6663d33b090ad1d704a7a696'
      },
      fileId: faker.datatype.uuid(),
      status: faker.helpers.arrayElement(['complete', 'transcribing']),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  return transcriptions;
};

const seedDatabase = async () => {
  try {
    await Patient.deleteMany({});
    await Transcription.deleteMany({});

    const patients = generatePatients(1000);
    const savedPatients = await Patient.insertMany(patients);

    const transcriptions = await generateTranscriptions(1000, savedPatients);
    await Transcription.insertMany(transcriptions);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database!', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();