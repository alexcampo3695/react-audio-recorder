import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/Users';
import { Request, Response, NextFunction } from 'express';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            req.user = user; // Now req.user is assigned only if user is not null
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
}