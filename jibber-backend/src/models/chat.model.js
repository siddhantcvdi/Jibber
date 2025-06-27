import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const chatSchema = new Schema({
  users: [{
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }],
  unreadCounts: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true
});


chatSchema.pre('validate', function (next) {
  if (this.users.length !== 2)
    return next(new Error('Chat must have exactly 2 users'));

  if (this.users[0].equals(this.users[1]))
    return next(new Error('A chat cannot contain the same user twice'));

  next();
});

chatSchema.index({ users: 1 }, { unique: true });

chatSchema.statics.findByUsers = function (id1, id2) {
  const userId1 = mongoose.Types.ObjectId.isValid(id1) ? new mongoose.Types.ObjectId(id1) : id1;
  const userId2 = mongoose.Types.ObjectId.isValid(id2) ? new mongoose.Types.ObjectId(id2) : id2;
  
  return this.findOne({
    users: { $all: [userId1, userId2] }
  });
};

chatSchema.methods.getOtherUser = function (currentUserId) {
  return this.users.find(u => !u.equals(currentUserId));
};

chatSchema.methods.incUnread = async function (receiverId) {
  const currentCount = this.unreadCounts.get(receiverId.toString()) || 0;
  this.unreadCounts.set(receiverId.toString(), currentCount + 1);
  await this.save();
};

chatSchema.methods.resetUnread = async function (userId) {
  this.unreadCounts.set(userId.toString(), 0);
  await this.save();
};

chatSchema.methods.getUnreadCount = function (userId) {
  return this.unreadCounts.get(userId.toString()) || 0;
};

export const Chat = mongoose.model('Chat', chatSchema);
