import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// const BlogPost = new Schema({
//   author: ObjectId,
//   title: String,
//   body: String,
//   date: Date
// });

const DeckSchema = new Schema({
    title: String
});

const DeckModel = mongoose.model('Deck', DeckSchema);

export default DeckModel;