import { create } from 'zustand';
import type { Message, GroupedMessage } from '@/types';
import {
  fetchMessagesService,
  sendMessageService,
} from '@/services/message.service';

interface MessageStore {
  messages: Message[];
  newMessage: string;
  isLoading: boolean;
  error: string | null;
  groupMessages: (messages: Message[]) => GroupedMessage[];
  parseTimeString: (timeStr: string) => Date | null;
  handleSendMessage: () => Promise<void>;
  setNewMessage: (message: string) => void;
  fetchMessages: (id: string | undefined) => Promise<void>;
  addReceivedMessage: (message: string) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  newMessage: '',
  isLoading: false,
  error: null,

  groupMessages(messages) {
    if (messages.length === 0) return [];
    const grouped: GroupedMessage[] = [];
    for (let i = 0; i < messages.length; i++) {
      const currentMessage = messages[i];
      const nextMessage = messages[i + 1];
      const parseTimeString = get().parseTimeString;
      let showTimestamp = true;
      if (nextMessage) {
        const currentTime = parseTimeString(currentMessage.timestamp);
        const nextTime = parseTimeString(nextMessage.timestamp);
        if (
          currentMessage.isSentByMe === nextMessage.isSentByMe &&
          nextTime &&
          currentTime &&
          Math.abs(nextTime.getTime() - currentTime.getTime()) <= 60000
        )
          showTimestamp = false;
      }
      grouped.push({ ...currentMessage, showTimestamp });
    }
    return grouped;
  },

  parseTimeString(timeStr) {
    try {
      const today = new Date();
      const [time, meridiem] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      if (meridiem === 'PM' && hours !== 12) hour24 += 12;
      else if (meridiem === 'AM' && hours === 12) hour24 = 0;
      return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour24, minutes);
    } catch {
      return null;
    }
  },

  setNewMessage: (message: string) => {
    set({ newMessage: message });
  },

  addReceivedMessage: (message) => {
    const messages = get().messages;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    set({
      messages: [
        ...messages,
        { text: message, isSentByMe: false, timestamp: currentTime },
      ],
    });
  },

  handleSendMessage: async () => {
    const { newMessage, messages } = get();
    if (newMessage.trim() === '') return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 1. Optimistic UI: Update the state immediately
    const optimisticMessage: Message = {
      text: newMessage,
      isSentByMe: true,
      timestamp: currentTime,
    };

    set({
      messages: [...messages, optimisticMessage],
      newMessage: '',
    });

    try {
      await sendMessageService(newMessage, currentTime);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Rollback: Mark the message as failed
      set((state) => ({
        messages: state.messages.map((m) =>
          m === optimisticMessage
            ? { ...m, text: `❗Failed to send: ${m.text}`, error: true }
            : m
        ),
        newMessage: newMessage, // Put the message back in the input box
      }));
    }
  },

  fetchMessages: async (id) => {
    if (!id) return;
    set({ isLoading: true, error: null });
    try {
      const decryptedMessages = await fetchMessagesService(id);
      set({ messages: decryptedMessages, isLoading: false });
    } catch (err) {
      console.error("Error Fetching Messages", err);
      set({ isLoading: false, error: 'Failed to fetch messages.' });
    }
  },
}));
