import { config } from 'dotenv';
config();

import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import Deck from "./models/Deck";


const app = express();

const PORT = 8000;

app.use(express.json());

app.post('/decks', async (req : Request, res: Response) => {
    const newDeck = new Deck({
        title: req.body.title
    });
    const createdDeck = await newDeck.save();
    res.json(createdDeck);
})

mongoose.connect(
    process.env.MONGO_URL!
).then(() => {
    console.log(`Connected to database on port: ${PORT}`);
    app.listen(PORT);
});




