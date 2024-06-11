
import { Request, Response } from 'express';
import crypto from 'crypto';
import UserDetails from '../models/UserDetails';
import User from '../models/Users';
import { gfs, db } from '../utils/gridFsUtils';
import { GridFSBucket, ObjectId } from 'mongodb';

export const createUserDetails = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      email,
      firstName,
      lastName,
      gender,
      phoneNumber,
      practiceAddress,
      providerType,
      specialty,
      npiNumber,
      stateLicenseNumber,
      deaNumber
    } = req.body;

    const userDetails = await UserDetails.findOneAndUpdate(
      { userId:userId },
      {
        email,
        firstName,
        lastName,
        gender,
        phoneNumber,
        practiceAddress,
        providerType,
        specialty,
        npiNumber,
        stateLicenseNumber,
        deaNumber
      },
      { new: true, upsert: true } // Create a new document if one doesn't exist
    );

    res.status(200).json({
      message: userDetails.isNew ? 'User details created successfully' : 'User details updated successfully',
      userDetails
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserDetailsById = async (req: Request, res: Response) => {
  try {
      const userId = req.params.userId;
      const userDetails = await UserDetails.findOne({ userId }); // Directly pass userId
      if (!userDetails) {
          return res.status(404).json({ message: `User Details not found, ${userDetails}` });
      }
      console.log('userId',userId)
      res.json(userDetails);
  } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user details", error });
      const userId = req.params.userId;
      console.log('userId',userId)
  }
}


// export const getSignatureByFileName = async (req: Request, res: Response) => {
//   try {
//     const filename = req.params.filename;
//     const bucket = new GridFSBucket(db, {bucketName: 'signatures'})

//     const signature = await bucket.find({filename: filename}).toArray()

//     if (signature.length === 0) {
//       console.log('sig', signature)
//       return res.status(404).send('File note found')
//     }

//     res.json(signature)

//   } catch (error) {
//     res.status(500).json({ message: "Failed to retrieve signature", error });
//   }
// }


export const getSignatureByFileName = async (req:Request, res:Response) => {
  try {
    const filename = req.params.filename
    const bucket = new GridFSBucket(db, {bucketName: 'signatures'})

    const files = await bucket.find({ filename }).toArray();

    if (files.length === 0 ) {
      console.log('sig', files)
      return res.status(404).send('File not found');
    }

    const fileId = new ObjectId(files[0]._id)

    const downloadStream = bucket.openDownloadStream(fileId);

    res.set('content-type', 'image/png')
    res.set('accept-ranges', 'bytes')

    downloadStream.on('data', (chunk: Buffer) => {
      res.write(chunk);
    })

    downloadStream.on('error', () => {
      res.status(404).send('File not found');
    });

    downloadStream.on('end', () => {
      res.end();
    });
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: "Failed to retrieve signature", error });
  }
};
