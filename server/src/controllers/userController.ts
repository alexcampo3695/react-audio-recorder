import User from '../models/Users';
import generateToken from '../utils/generateToken';
import { Request, Response } from 'express';

// Register new user
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
  
    const user = await User.create({
        username,
        email,
        password,
        role
    });
  
    if (user) {
        res.status(201).json({
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// Authenticate user
export const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
