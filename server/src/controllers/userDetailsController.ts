
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

    const userDetails = new UserDetails({
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
    });

    await userDetails.save();

    res.status(201).json({ message: 'User details created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};