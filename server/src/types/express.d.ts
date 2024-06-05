// types/express.d.ts
import { Request } from 'express';
import { Document } from 'mongoose';

interface UserDocument extends Document {
    _id: string;
    role: string;
    email: string
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserDocument;
    }
}
