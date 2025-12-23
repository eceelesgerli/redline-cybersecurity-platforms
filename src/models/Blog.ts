import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot be more than 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ createdAt: -1 });

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
