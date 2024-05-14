import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// const BlogPost = new Schema({
//   author: ObjectId,
//   title: String,
//   body: String,
//   date: Date
// });

const recordingSchema = new mongoose.Schema({
  gridFsId: mongoose.Schema.Types.ObjectId,
  filename: String,
  length: Number,
  chunkSize: Number,
  uploadDate: Date,
  contentType: String,
  metadata: {
    FirstName: String,
    LastName: String,
    DateOfBirth: Date
  }
});

const Recording = mongoose.model('uploads.files', recordingSchema);

export default Recording;