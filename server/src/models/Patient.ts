import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// const BlogPost = new Schema({
//   author: ObjectId,
//   title: String,
//   body: String,
//   date: Date
// });

const PatientSchema = new Schema({
    FirstName: String,
    LastName: String,
    DateOfBirth: Date
});

const Patient = mongoose.model('Patient', PatientSchema);

export default Patient;