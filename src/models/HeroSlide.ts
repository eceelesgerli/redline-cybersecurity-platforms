import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlide extends Document {
  imageUrl: string;
  cloudinaryId: string;
  title?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    cloudinaryId: {
      type: String,
      required: [true, 'Cloudinary ID is required'],
    },
    title: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
