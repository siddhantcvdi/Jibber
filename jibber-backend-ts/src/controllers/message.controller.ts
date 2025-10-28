import { AuthRequest } from "@/types";
import { ResponseUtil } from "@/utils/response";
import { asyncHandler } from "@/utils/asyncHandler";
import { Message } from "@/models/message.model";
import { Chat } from "@/models/chat.model";
import mongoose from "mongoose";

export const getMessages = asyncHandler(async (req: AuthRequest, res) => {
  const chatId = req.params?.chatId;
  const userId = req.user?._id;

  if (!chatId) {
    return ResponseUtil.error(res, "No chatId provided");
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return ResponseUtil.error(res, "Invalid chatId format");
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return ResponseUtil.error(res, "Chat not found");
  }

  if (!chat.users.some(id => id.toString() === userId)) {
    return ResponseUtil.error(res, "User not a part of this chat");
  }

  const messages = await Message.find({ chatId })
    .sort({ createdAt:  1 });

  return ResponseUtil.success(res, "Messages found", messages);
});
