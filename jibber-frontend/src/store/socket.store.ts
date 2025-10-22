// socket.store.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import authStore from './auth.store';
import { useChatStore } from './chats.store';
import { useMessageStore } from './message.store';
import type { EncryptedMessage } from '@/types';
import { decryptMessageService } from '@/services/crypto.service.ts';

interface SocketState {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
  emitMessage: (type: string, ...args: any[]) => void
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  connectSocket: () => {
    const accessToken = authStore.getState().accessToken
    const socket = io('http://localhost:5000', {
      autoConnect: true,
      auth: {
        token: accessToken,
      },
    });

    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected ✅', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected ❌');
      set({socket: null})
    });

    socket.on('receivedMessage', async (data: EncryptedMessage)=>{
      const {getSelectedChat} = useChatStore.getState()
      const {addReceivedMessage} = useMessageStore.getState()
      const text = await decryptMessageService(data);
      if(getSelectedChat()?._id === data.chatId){
        addReceivedMessage(text)
      }
      console.log(text);
      
    })

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
  emitMessage(type: string, args: any): void {
    const {socket} = get()
    socket?.emit(type, args);
  }
}));
