import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITool extends Document {
  name: string;
  description: string;
  category: string;
  externalLink: string;
  icon?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ToolSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Reconnaissance',
        'Scanning',
        'Exploitation',
        'Post-Exploitation',
        'Password Attacks',
        'Web Application',
        'Network Analysis',
        'Forensics',
        'Other',
      ],
    },
    externalLink: {
      type: String,
      required: [true, 'External link is required'],
    },
    icon: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ToolSchema.index({ category: 1 });
ToolSchema.index({ createdAt: -1 });

const Tool: Model<ITool> = mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema);

export default Tool;
