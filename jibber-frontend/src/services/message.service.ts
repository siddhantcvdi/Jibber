import api from "@/services/api.ts";
import { useChatStore } from '@/store/chats.store.ts';
import authStore from '@/store/auth.store';
import type { EncryptedMessage, Message } from '@/types';
import {
  decryptMessageService,
  encryptMessageService,
  signMessageService,
} from './crypto.service';
import { emitMessageService } from './socket.service';
import useCryptoStore from '@/store/crypto.store.ts';

export const fetchMessagesService = async (chatId: string): Promise<Message[]> => {
  try {
    const res = await api.get(`/messages/${chatId}`);
    const encryptedMessages: EncryptedMessage[] = res.data.data;
    const { user } = authStore.getState();

    const decryptedMessages = await Promise.all(
      encryptedMessages.map(async (message) => {
        return {
          text: await decryptMessageService(message),
          isSentByMe: message.sender === user?._id,
          timestamp: message.timestamp,
        };
      })
    );
    return decryptedMessages;
  } catch (err) {
    console.error("Error Fetching Messages:", err);
    throw err;
  }
};

export const sendMessageService = async (
  text: string,
  timestamp: string
): Promise<void> => {
  try {
    const { getSelectedChatUser, getSelectedChat } = useChatStore.getState();
    const { user } = authStore.getState();

    const receiverPublicIdKey = getSelectedChatUser()?.publicIdKey;
    const privateIdKey = useCryptoStore.getState().privateIdKey;
    const privateSigningKey = useCryptoStore.getState().privateSigningKey;
    if (!receiverPublicIdKey || !privateIdKey || !privateSigningKey) throw new Error('Key error while sending message!');
    if (!user) throw new Error('User not authenticated');

    const encryptedMessage = await encryptMessageService(text, privateIdKey, receiverPublicIdKey);
    const signature = await signMessageService(encryptedMessage.cipher, privateSigningKey);

    // Construct the payload
    const messagePayload = {
      chatId: getSelectedChat()?._id,
      sender: user._id,
      receiver: getSelectedChatUser()?._id,
      cipher: encryptedMessage.cipher,
      iv: encryptedMessage.iv,
      signature,
      senderPublicIdKey: user.publicIdKey,
      senderPublicSigningKey: user.publicSigningKey,
      receiverPublicIdKey,
      timestamp: timestamp,
    };

    emitMessageService('sendMessage', messagePayload);
  } catch (err) {
    console.error("Error Sending Message:", err);
    throw err;
  }
};
