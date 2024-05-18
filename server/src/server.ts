import { config } from 'dotenv';
config();

console.log('MONGO_URL:', process.env.MONGO_URL);  // Add this line to check if MONGO_URL is loaded

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL!)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });
