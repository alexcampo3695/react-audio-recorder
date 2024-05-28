
import { Request, Response } from 'express';
import crypto from 'crypto';
import UserDetails from '../models/UserDetails';
import User from '../models/Users';


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
      { userId },
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
    res.status(500).json({ error: error.message });
  }
};

export const getUserDetailsById = async (req: Request, res: Response) => {
  try {
      const userId = req.params.userId;
      const userDetails = await UserDetails.findOne({ userId }); // Directly pass userId
      if (!userDetails) {
          return res.status(404).json({ message: "User Details not found" });
      }
      res.json(userDetails);
  } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user details", error });
  }
}


// export async function getClincalNotesByFileID(req: Request, res: Response) {
//   try {
//       const fileID = new ObjectId(req.params.fileID);
//       const clinicalNote = await ClinicalNote.findOne({ fileID });

//       if (!clinicalNote) {
//           return res.status(404).json({ message: "Cpt's not found" });
//       }
//       res.json(clinicalNote);
//   } catch (error) {
//       res.status(500).json({ message: "Failed to retrieve Cpts", error });
//   }
// }