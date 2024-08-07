import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'provider' | 'patient';
  loginAttempts: number;
  lockUntil?: number;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  twoFactorCode?: string;
  twoFactorExpire?: Date;
  matchPassword(password: string): Promise<boolean>;
  isActive: boolean
  PaymentMeta: mongoose.Schema.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['provider', 'patient'], required: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  twoFactorCode: { type: String },
  twoFactorExpire: { type: Date },
  isActive: {type: Boolean, default: true},
  PaymentMeta: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMeta' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
