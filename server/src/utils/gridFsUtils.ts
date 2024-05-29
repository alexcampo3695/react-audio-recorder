import mongoose from 'mongoose';
import { MongoClient, Db } from 'mongodb';
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import { Request } from 'express';
import path from 'path';

let db: Db;
let gfs: any;

const conn = mongoose.createConnection(process.env.MONGO_URL!);
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    db = conn.db as unknown as Db;
    console.log("GridFS initialized");
});

export { db, gfs };

const storage = new GridFsStorage({
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    url: process.env.MONGO_URL!,
    file: (req: Request, file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                crypto.randomBytes(16, (err, buf: Buffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const patientData = req.body.patientData ? JSON.parse(req.body.patientData) : null;

                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads',
                        metadata: patientData
                    }
                    resolve(fileInfo);
                });
            });
        });
    }
});

export { storage };

const signatureStorage = new GridFsStorage({
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    url: process.env.MONGO_URL!,
    file: (req: Request, file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                crypto.randomBytes(16, (err: Error, buf: Buffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const userId = req.body.userId;
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'signatures',
                        metadata: {
                            userId: userId
                        }
                    }
                    resolve(fileInfo);
                })
            })
        })
    }
});

export { signatureStorage };


