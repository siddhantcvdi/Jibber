import mongoose, { Document, Model, Schema, Types } from 'mongoose';


export interface IChat extends Document {
  users: Types.ObjectId[];
  unreadCounts: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  getOtherUser(currentUserId: Types.ObjectId): Types.ObjectId | undefined;
  incUnread(receiverId: Types.ObjectId): Promise<void>;
  resetUnread(userId: Types.ObjectId): Promise<void>;
  getUnreadCount(userId: Types.ObjectId): number;
}

export interface ChatModel extends Model<IChat> {
  findByUsers(id1: Types.ObjectId | string, id2: Types.ObjectId | string): Promise<IChat | null>;
}

const chatSchema = new Schema<IChat, ChatModel>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    unreadCounts: {
      type: Map,
      of: Number,
      default: () => new Map<string, number>(),
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.pre('validate', function (next) {
  if (this.users.length !== 2) {
    return next(new Error('Chat must have exactly 2 users'));
  }

  if (this.users[0]?.equals(this.users[1])) {
    return next(new Error('A chat cannot contain the same user twice'));
  }

  next();
});

chatSchema.index({ users: 1 }, { unique: true });

chatSchema.statics.findByUsers = function (id1, id2) {
  const userId1 = Types.ObjectId.isValid(id1) ? new Types.ObjectId(id1) : id1;
  const userId2 = Types.ObjectId.isValid(id2) ? new Types.ObjectId(id2) : id2;

  return this.findOne({
    users: { $all: [userId1, userId2] },
  });
};

chatSchema.methods.getOtherUser = function (currentUserId: Types.ObjectId) {
  return this.users.find((u: Types.ObjectId) => !u.equals(currentUserId));
};

chatSchema.methods.incUnread = async function (receiverId: Types.ObjectId) {
  const currentCount = this.unreadCounts.get(receiverId.toString()) || 0;
  this.unreadCounts.set(receiverId.toString(), currentCount + 1);
  await this.save();
};

chatSchema.methods.resetUnread = async function (userId: Types.ObjectId) {
  this.unreadCounts.set(userId.toString(), 0);
  await this.save();
};

chatSchema.methods.getUnreadCount = function (userId: Types.ObjectId) {
  return this.unreadCounts.get(userId.toString()) || 0;
};


export const Chat = mongoose.model<IChat, ChatModel>('Chat', chatSchema);
