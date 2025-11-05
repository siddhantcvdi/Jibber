import { create } from 'zustand'
import api from "@/services/api.ts";
import type { EncryptedMessage } from '@/types';

interface ChatUser {
  _id: string;
  username: string;
  email: string;
  profilePhoto: string;
  publicIdKey: string;
  publicSigningKey: string;
}

interface Chat {
  _id: string;
  details: ChatUser;
  unreadCount: number;
  lastMessage: EncryptedMessage | undefined;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  isLoading: boolean,
  chats: Chat[],
  selectedChatId: string,
  fetchChats: () => Promise<void>,
  selectChat: (chatId: string) => void,
  clearSelection: () => void,
  getSelectedChat: () => Chat | null,
  getSelectedChatUser: () => ChatUser | null,
  doesChatExist: (userId: string) => string | undefined,
  incUnreadCount: (chatId: string) => void,
}

export const useChatStore = create<ChatStore>((set, get) => ({
  isLoading: false,
  chats: [],
  selectedChatId: '',

  fetchChats: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/chats/getAllChatsOfUser');
      set({ chats: response.data.data || [] });
    } catch (error) {
      console.error('Error fetching chats:', error);
      set({ chats: [], isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  selectChat: (chatId: string) => {
    const chats = get().chats.map(chat =>
      chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
    );
    set({ selectedChatId: chatId, chats });
  },

  clearSelection: () => {
    set({ selectedChatId: '' });
  },

  getSelectedChat: () => {
    const { chats, selectedChatId } = get();
    return chats.find(chat => chat._id === selectedChatId) || null;
  },

  getSelectedChatUser: () => {
    const selectedChat = get().getSelectedChat();
    return selectedChat?.details || null;
  },

  doesChatExist: (userId) => {
    const { chats } = get();
    const chat = chats.find(chat => chat.details._id === userId);
    return chat?._id;
  },

  incUnreadCount: (chatId: string) => {
    const chats = get().chats.map(chat =>
      chat._id === chatId ? { ...chat, unreadCount:  (chat.unreadCount || 0)+1} : chat
    );
    set({ chats });
  }
}));

