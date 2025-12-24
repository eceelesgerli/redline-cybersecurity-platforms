import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export const RANKS = [
  { level: 1, name: 'Script Kiddie', emoji: '🔰' },
  { level: 2, name: 'White Hat Trainee', emoji: '🎓' },
  { level: 3, name: 'Ethical Hacker', emoji: '💻' },
  { level: 4, name: 'Security Engineer', emoji: '🛡️' },
  { level: 5, name: 'Cyber Guardian', emoji: '⚔️' },
];

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  rank: number;
  avatar?: string;
  bio?: string;
  topicsCount: number;
  repliesCount: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6,
  },
  rank: { 
    type: Number, 
    default: 1,
    min: 1,
    max: 5,
  },
  avatar: { type: String },
  bio: { type: String, maxlength: 500 },
  topicsCount: { type: Number, default: 0 },
  repliesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update the updatedAt field on save
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
