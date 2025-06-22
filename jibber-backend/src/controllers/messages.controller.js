import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { Message } from '../models/message.model.js';
import { Chat } from '../models/chat.model.js';

export const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  
  if (!chatId) {
    return errorResponse(res, { message: 'Chat ID is required' });
  }
  
  // Verify chat exists
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return errorResponse(res, { message: 'Chat not found' });
  }
  
  // Find messages for this chat
  const messages = await Message.find({ chatId })
    .populate('sender', 'username email')
    .populate('receiver', 'username email')
    .populate('chatId', 'users')
    .sort({ createdAt: 1 })
    .limit(50);
  
  return successResponse(res, {
    message: 'Messages retrieved successfully',
    data: messages
  });
})