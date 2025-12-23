import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
