import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDetails extends Document {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  practiceAddress: string;
  providerType: string;
  specialty: string;
  npiNumber: string;
  stateLicenseNumber: string;
  deaNumber: string;
  signature: string;
}

const UserDetailsSchema = new Schema<IUserDetails>({
  userId: { type: String, required: false },
  email: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  gender: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  practiceAddress: { type: String, required: false },
  providerType: { type: String, required: false },
  specialty: { type: String, required: false },
  npiNumber: { type: String, required: false },
  stateLicenseNumber: { type: String, required: false },
  deaNumber: { type: String, required: false },
  signature: { type: String, required: false },
});

const UserDetails = mongoose.model<IUserDetails>('UserDetails', UserDetailsSchema);

export default UserDetails;
