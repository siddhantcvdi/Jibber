import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { Chat } from '../models/chat.model.js';
import { User } from '../models/user.model.js';
import { Message } from '../models/message.model.js';

export const createChat = asyncHandler(async (req, res) => {
  const {users} = req.body;
  if(!Array.isArray(users) || !users[0] || !users[1] || users.length !== 2) 
    return errorResponse(res, {message: "Invalid Users for chat session"});
  
  // Convert to strings for comparison to avoid ObjectId comparison issues
  if(users[0].toString() === users[1].toString()) 
    return errorResponse(res, {message: "You cannot chat with yourself."});
  
  // Check if both users exist
  const user1 = await User.findById(users[0]);
  const user2 = await User.findById(users[1]);
  
  if (!user1 || !user2) {
    return errorResponse(res, {message: "One or both users not found"});
  }
  
  // Check for existing chat
  const existingChat = await Chat.findByUsers(users[0], users[1]);
  if (existingChat) {
    return successResponse(res, {message: "Chat already exists", data: existingChat});
  }
  
  const newChat = await Chat.create({
    users: [user1._id, user2._id]
  });
  
  return successResponse(res, {message: "New chat created", data: newChat});
});



export const getAllChatsOfUser = asyncHandler(async(req, res)=>{
  const currentUserId = req.user._id;
  
  if (!currentUserId) {
    return errorResponse(res, { message: "User not authenticated", statusCode: 401 });
  }

  const chatsWithUnreadCounts = await Chat.find({
    users: currentUserId
  })
  .populate({
    path: 'users',
    select: 'username profilePhoto email publicIdKey publicSigningKey',
  })
  .lean()
  .exec();

  // Get last messages for all chats in parallel
  const formattedChats = await Promise.all(
    chatsWithUnreadCounts.map(async (chat) => {
      const otherUser = chat.users.find(u => u._id.toString() !== currentUserId.toString());
      const unreadCount = chat.unreadCounts?.[currentUserId.toString()] || 0;
      
      const lastMessage = await Message.findOne({ chatId: chat._id })
        .sort({ createdAt: 1 })
        .lean();

      return {
        _id: chat._id,
        details: otherUser,
        lastMessage,
        unreadCount,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      };
    })
  );

  return successResponse(res, {
    message: "Chats retrieved successfully",
    data: formattedChats
  });
})