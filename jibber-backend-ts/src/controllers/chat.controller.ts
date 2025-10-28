import { asyncHandler } from '@/utils/asyncHandler';
import { AuthRequest } from '@/types';
import { ResponseUtil } from '@/utils/response';
import { User } from '@/models/user.model';
import { Chat } from '@/models/chat.model';
import { Message } from '@/models/message.model';
import mongoose, {Types} from 'mongoose';

export const createChat = asyncHandler(async (req: AuthRequest, res) => {
  const users: string[] = req.body?.users;

  if (!Array.isArray(users) || users.length !== 2 || !users[0] || !users[1]) {
    return ResponseUtil.error(res, "Invalid users for chat session", undefined, 400);
  }

  if (users[0] === users[1]) {
    return ResponseUtil.error(res, "You cannot chat with yourself", undefined, 400);
  }

  const [user1, user2] = await Promise.all([
    User.findById(users[0]),
    User.findById(users[1])
  ]);

  if (!user1 || !user2) {
    return ResponseUtil.error(res, "One or both users not found", undefined, 404);
  }

  const existingChat = await Chat.findByUsers(users[0], users[1]);
  if (existingChat) {
    return ResponseUtil.error(res, "Chat already exists", undefined, 409);
  }

  const newChat = await Chat.create({
    users: [user1._id, user2._id]
  });

  return ResponseUtil.success(res, "New chat created successfully", newChat);
});

export const getAllChatsOfUser = asyncHandler(async (req: AuthRequest, res) => {
  const currentUserId = req.user?._id;

  if (!currentUserId) {
    return ResponseUtil.error(res, "User not authenticated", undefined, 401);
  }

  const chats = await Chat.aggregate([
    // Match chats that include the current user
    { $match: { users: new mongoose.Types.ObjectId(currentUserId) } },

    // Lookup other user details
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
        pipeline: [
          {
            $project: {
              username: 1,
              profilePhoto: 1,
              email: 1,
              publicIdKey: 1,
              publicSigningKey: 1
            }
          }
        ]
      }
    },

    // Lookup the last message (only the latest one)
    {
      $lookup: {
        from: "messages",
        let: { chatId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 }
        ],
        as: "lastMessage"
      }
    },

    // Flatten the lastMessage array
    { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },

    // Add computed fields (like unreadCount)
    {
      $addFields: {
        unreadCount: {
          $ifNull: [
            { $getField: { field: { $toString: currentUserId }, input: "$unreadCounts" } },
            0
          ]
        }
      }
    },

    // Sort by most recently updated chats
    { $sort: { updatedAt: -1 } }
  ]);

  // Format the other user and response
  const formattedChats = chats.map(chat => {
    const otherUser = chat.users.find((u: Types.ObjectId) => u._id.toString() !== currentUserId.toString());
    return {
      _id: chat._id,
      details: otherUser,
      lastMessage: chat.lastMessage,
      unreadCount: chat.unreadCount || 0,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };
  });

  return ResponseUtil.success(res, "Chats retrieved successfully", formattedChats);
});
