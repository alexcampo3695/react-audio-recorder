import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// const BlogPost = new Schema({
//   author: ObjectId,
//   title: String,
//   body: String,
//   date: Date
// });

const UploadSchema = new Schema({
    _id: String,
  length: Number,
  chunkSize: Number,
  uploadDate: String,
  filename: String,
  contentType: String,
  metadata: {
    FirstName: String,
    LastName: String,
    DateOfBirth: String,
  }
});

const Uploads = mongoose.model('uploads.files', UploadSchema);

export default Uploads;