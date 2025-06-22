import {create} from 'zustand'
import api from "@/services/api.ts";

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
  lastMessage: {
    cipher: string,
    iv: string
  } | undefined;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore{
  isLoading: boolean,
  chats: Chat[],
  selectedChatId: string,
  fetchChats: () => Promise<void>,
  selectChat: (chatId: string) => void,
  clearSelection: () => void
}

export const useChatStore = create<ChatStore>((set, get)=>({
  isLoading: false,
  chats: [],
  selectedChatId: '',
  fetchChats: async () => {
    try {
      set({isLoading: true});
      const response = await api.get('/chats/getAllChatsOfUser');
      set({chats: response.data.data || []});
    } catch (error) {
      console.error('Error fetching chats:', error);
      set({chats: [], isLoading: false})
    } finally {
      set({isLoading: false});
    }
  },
  selectChat: (chatId: string) => {
    const { chats } = get();
    const chatExists = chats.some(chat => chat._id === chatId);
    if (chatExists || chatId === '') {
      set({selectedChatId: chatId});
    }
  },
  clearSelection: () => {
    set({selectedChatId: ''});
  }
}))

// Computed selectors
export const useSelectedChat = () => {
  const { chats, selectedChatId } = useChatStore();
  return chats.find(chat => chat._id === selectedChatId) || null;
};

export const useSelectedChatUser = () => {
  const selectedChat = useSelectedChat();
  return selectedChat?.details || null;
};

export const useIsChatValid = () => {
  const selectedChat = useSelectedChat();
  const { selectedChatId } = useChatStore();
  return selectedChatId === '' || selectedChat !== null;
};