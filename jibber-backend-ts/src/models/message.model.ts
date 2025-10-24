import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- 1️⃣ Define the Message document interface ---

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  cipher: string;
  iv: string;
  signature: string;
  senderPublicIdKey: string;
  receiverPublicIdKey: string;
  senderPublicSigningKey: string;
  timestamp: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface MessageModel extends Model<IMessage> {
}


const messageSchema = new Schema<IMessage, MessageModel>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cipher: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    senderPublicIdKey: {
      type: String,
      required: true,
    },
    receiverPublicIdKey: {
      type: String,
      required: true,
    },
    senderPublicSigningKey: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ chatId: 1, timestamp: -1 });
messageSchema.index({ receiver: 1 });

export const Message = mongoose.model<IMessage, MessageModel>('Message', messageSchema);
