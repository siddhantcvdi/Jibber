import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const unreadCountSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  count:  { type: Number, default: 0 }
}, { _id: false });

const chatSchema = new Schema({
  users: [{
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessageId: {
    type: Types.ObjectId,
    ref: 'Message'
  },
  unreadCounts: [unreadCountSchema]
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
  await this.updateOne({
    'unreadCounts.userId': receiverId
  }, {
    $inc: { 'unreadCounts.$.count': 1 }
  });
};

chatSchema.methods.resetUnread = async function (userId) {
  await this.updateOne({
    'unreadCounts.userId': userId
  }, {
    $set: { 'unreadCounts.$.count': 0 }
  });
};

export const Chat = mongoose.model('Chat', chatSchema);
