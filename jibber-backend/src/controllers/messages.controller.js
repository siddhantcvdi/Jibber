import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { Message } from '../models/message.model.js';
import { User } from '../models/user.model.js';

export const getMessages = asyncHandler(async (req, res) => {
  const {users} = req.body;
  if( !Array.isArray(users) || !users[0] || !users[1]) return errorResponse(res, {message: 'Invalid Inputs provided'});  
  const user1 = await User.findById(users[0]);
  const user2 = await User.findById(users[1]);
  if(!user1 || !user2) return errorResponse(res, {message: "Users not found"});
  
  const messages = await Message.find({
    $or: [
      { sender: user1._id, receiver: user2._id },
      { sender: user2._id, receiver: user1._id }
    ]
  })
  .populate('sender', 'username email')
  .populate('receiver', 'username email')
  .sort({ createdAt: 1 })
  .limit(20);
  
  return successResponse(res, {
    message: 'Messages retrieved successfully',
    data: messages
  });
})