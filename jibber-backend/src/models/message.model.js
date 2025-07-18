import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cipher: {
    type: String,
    required: true,
  }, 
  iv: {
    type: String,
    required: true
  },
  signature: {
    type: String,
    required: true
  },
  senderPublicIdKey: {
    type: String,
    required: true
  },
  receiverPublicIdKey: {
    type: String,
    required: true
  },
  senderPublicSigningKey: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  }
});

messageSchema.index({ chatId: 1, timestamp: -1 });
messageSchema.index({ receiver: 1 });

export const Message = mongoose.model('Message', messageSchema);
