import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URL!;
const dbName = process.env.DB_NAME!;

// mongoose.connect(url, {
//   connectTimeoutMS: 30000, // 30 seconds
//   socketTimeoutMS: 45000, // 45 seconds
//   dbName: dbName,
// }).then(() => {
//   console.log('Connected to MongoDB');
//   seedDatabase();
// }).catch((error) => {
//   console.error('Error connecting to MongoDB:', error);
// });

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
      PatientId: faker.string.uuid(),
      FirstName: faker.person.firstName(),
      LastName: faker.person.lastName(),
      DateOfBirth: faker.date.past(),
      CreatedBy: "668c7861b258cd7e3af846a1",
    });
  }
  return patients;
};

const generateTranscriptions = async (numTranscriptions: number, patients: any[]) => {
  const transcriptions = [];
  for (let i = 0; i < numTranscriptions; i++) {
    const randomPatient = patients[faker.number.int({ min: 0, max: patients.length - 1 })];
    transcriptions.push({
      filename: faker.system.fileName(),
      transcription: faker.lorem.paragraphs(),
      patientData: {
        PatientId: faker.string.uuid(),
        FirstName: faker.person.firstName(),
        LastName: faker.person.lastName(),
        DateOfBirth: faker.date.past(),
        CreatedBy: '668c7861b258cd7e3af846a1'
      },
      fileId: faker.string.uuid(),
      status: faker.helpers.arrayElement(['complete', 'transcribing']),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  return transcriptions;
};

console.log(url);

const seedDatabase = async () => {
  try {
    await mongoose.connect(url, {
      dbName: dbName,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');
    await Patient.deleteMany({});
    await Transcription.deleteMany({});

    const patients = generatePatients(35);
    const savedPatients = await Patient.insertMany(patients);

    const transcriptions = await generateTranscriptions(100, savedPatients);
    await Transcription.insertMany(transcriptions);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database!', error);
  } finally {
    mongoose.connection.close();
  }
};

mongoose.set('strictQuery', false);
seedDatabase();
