import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({  
  users: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    publicIdKey: {
      type: String,
      required: true
    },
    publicSigningKey: {
      type: String,
      required: true
    }
  }],
}, {
  timestamps: true
});

chatSchema.pre('save', function(next) {
  if (this.users.length !== 2) {
    return next(new Error('Chat must have exactly 2 users'));
  }
  for (const user of this.users) {
    if (!user.publicIdKey || !user.publicSigningKey) {
      return next(new Error('Each user must have both public ID key and public signing key'));
    }
  }
  next();
});

chatSchema.index({ 'users.userId': 1 });

chatSchema.statics.findByUsers = function(userId1, userId2) {
  return this.findOne({
    'users.userId': { $all: [userId1, userId2] }
  });
};


chatSchema.methods.getOtherUser = function(currentUserId) {
  return this.users.find(user => user.userId.toString() !== currentUserId.toString());
};

chatSchema.methods.getUserPublicKeys = function(userId) {
  const user = this.users.find(user => user.userId.toString() === userId.toString());
  return user ? {
    publicIdKey: user.publicIdKey,
    publicSigningKey: user.publicSigningKey
  } : null;
};

export const Chat = mongoose.model('Chat', chatSchema);
