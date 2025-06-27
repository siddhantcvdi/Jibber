import {create} from 'zustand'
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

interface ChatStore{
  isLoading: boolean,
  chats: Chat[],
  selectedChatId: string,
  fetchChats: () => Promise<void>,
  selectChat: (chatId: string) => void,
  clearSelection: () => void,
  getSelectedChat: () => Chat | null,
  getSelectedChatUser: () => ChatUser | null,
  isChatValid: () => boolean
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
      set({ chats: [], isLoading: false })
    } finally {
      set({ isLoading: false });
    }
  },

  selectChat: (chatId: string) => {
    set({ selectedChatId: chatId });
  },

  clearSelection: () => {
    set({ selectedChatId: '' });
  },

  getSelectedChat: () => {
    const { chats, selectedChatId } = get(); // <-- Use `get()` instead of `useChatStore.getState()` here
    return chats.find(chat => chat._id === selectedChatId) || null;
  },

  getSelectedChatUser: () => {
    const selectedChat = get().getSelectedChat();
    return selectedChat?.details || null;
  },

  isChatValid: () => {
    const selectedChat = get().getSelectedChat();
    const { selectedChatId } = get();
    return selectedChatId === '' || selectedChat !== null;
  }
}));
