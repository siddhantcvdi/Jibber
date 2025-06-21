import mongoose from 'mongoose';

const unreadSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  count: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

unreadSchema.index({ chat_id: 1, user_id: 1 }, { unique: true });

unreadSchema.statics.incrementCount = function(chatId, userId) {
  return this.findOneAndUpdate(
    { chat_id: chatId, user_id: userId },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
};

unreadSchema.statics.resetCount = function(chatId, userId) {
  return this.findOneAndUpdate(
    { chat_id: chatId, user_id: userId },
    { count: 0 },
    { new: true }
  );
};

unreadSchema.statics.getUnreadCount = function(chatId, userId) {
  return this.findOne({ chat_id: chatId, user_id: userId }).select('count');
};

export const Unread = mongoose.model('Unread', unreadSchema);
