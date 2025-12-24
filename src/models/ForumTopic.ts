import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IForumTopic extends Document {
  title: string;
  slug: string;
  content: string;
  author: Types.ObjectId;
  category: string;
  subcategory: string;
  views: number;
  repliesCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastReplyAt: Date;
  lastReplyBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ForumTopicSchema = new Schema<IForumTopic>({
  title: { type: String, required: true, maxlength: 200 },
  slug: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  views: { type: Number, default: 0 },
  repliesCount: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  lastReplyAt: { type: Date, default: Date.now },
  lastReplyBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ForumTopicSchema.index({ category: 1, subcategory: 1 });
ForumTopicSchema.index({ author: 1 });
ForumTopicSchema.index({ createdAt: -1 });

export default mongoose.models.ForumTopic || mongoose.model<IForumTopic>('ForumTopic', ForumTopicSchema);
