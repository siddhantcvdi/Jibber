// socket.store.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import authStore from './auth.store';
import useCryptoStore from './crypto.store';
import { useChatStore } from './chats.store';
import { useMessageStore } from './message.store';

interface Message{
  chatId: string,
  senderId: string,
  receiverId: string,
  cipher: string,
  iv: string,
  senderPublicIdKey: string,
  senderPublicSigningKey: string
}

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
    });

    socket.on('receivedMessage', async (data: Message)=>{
      const {decryptMessage} = useCryptoStore.getState()
      const {getSelectedChat} = useChatStore.getState()
      const {addReceivedMessage} = useMessageStore.getState()
      const text = await decryptMessage(data);
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
