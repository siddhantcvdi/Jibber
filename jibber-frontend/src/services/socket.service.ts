import { io, Socket } from 'socket.io-client';
import type { EncryptedMessage } from '@/types';
import { decryptMessageService } from './crypto.service';
import { useMessageStore } from '@/store/message.store';
import { useChatStore } from '@/store/chats.store';
import { useSocketStore } from '@/store/socket.store'; // Import the store

let socket: Socket | null = null;

const setupMessageListener = () => {
  if (!socket) return;

  // Remove listener to prevent event listener stacking
  socket.off('receivedMessage');
  socket.on('receivedMessage', async (data: EncryptedMessage) => {
    try {
      const decryptedText = await decryptMessageService(data);
      console.log('Decrypted message:', decryptedText);

      // 2. Get state from the relevant stores.
      const { getSelectedChat } = useChatStore.getState();
      const { addReceivedMessage } = useMessageStore.getState();

      if (getSelectedChat()?._id === data.chatId) {
        addReceivedMessage(decryptedText);
      }

      // later - add a notification for messages received in non-active chats.

    } catch (error) {
      console.error('Failed to decrypt and process received message:', error);
    }
  });
};

export const connectSocketService = (token: string | null) => {
  if (!token) {
    console.error('Socket Connection Failed: No access token provided.');
    return;
  }

  // Prevent multiple connections
  if (socket && socket.connected) {
    return;
  }

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';


  socket = io(VITE_BACKEND_URL, {
    // auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });


  socket.on('connect', () => {
    console.log('Socket connected ✅', socket?.id);
    useSocketStore.getState().setSocket(socket);
    setupMessageListener();
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected ❌');
    socket = null;
    // **FIX:** Update the store's state *when the event fires*
    useSocketStore.getState().setSocket(null);
  });

  // We no longer return the socket, as it will be set reactively
};

export const disconnectSocketService = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  useSocketStore.getState().setSocket(null);
};

export const emitMessageService = (type: string, ...args: unknown[]) => {
  if (socket?.connected) {
    socket.emit(type, ...args);
  } else {
    console.error(`Socket not connected. Cannot emit message: ${type}`);
  }
};

