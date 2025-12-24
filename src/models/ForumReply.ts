import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IForumReply extends Document {
  content: string;
  author: Types.ObjectId;
  topic: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ForumReplySchema = new Schema<IForumReply>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: Schema.Types.ObjectId, ref: 'ForumTopic', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ForumReplySchema.index({ topic: 1, createdAt: 1 });

export default mongoose.models.ForumReply || mongoose.model<IForumReply>('ForumReply', ForumReplySchema);
