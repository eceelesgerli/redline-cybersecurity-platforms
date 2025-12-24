import mongoose, { Schema, Document } from 'mongoose';

export interface ISubCategory {
  name: string;
  slug: string;
  description: string;
  topicsCount: number;
}

export interface IForumCategory extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: ISubCategory[];
  order: number;
  createdAt: Date;
}

const SubCategorySchema = new Schema<ISubCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  topicsCount: { type: Number, default: 0 },
});

const ForumCategorySchema = new Schema<IForumCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String, default: '📁' },
  color: { type: String, default: '#dc2626' },
  subcategories: [SubCategorySchema],
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ForumCategory || mongoose.model<IForumCategory>('ForumCategory', ForumCategorySchema);
