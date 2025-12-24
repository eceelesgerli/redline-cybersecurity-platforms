import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  siteNameAccent: string;
  logoUrl?: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  siteName: { type: String, required: true, default: 'Red' },
  siteNameAccent: { type: String, required: true, default: 'Line' },
  logoUrl: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
