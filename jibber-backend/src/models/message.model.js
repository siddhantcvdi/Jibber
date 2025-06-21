import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
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
  }
});

messageSchema.index({ sessionId: 1, timestamp: -1 });
messageSchema.index({ receiver: 1 });

export const Message = mongoose.model('Message', messageSchema);
