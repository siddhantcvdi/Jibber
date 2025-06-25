// socket.store.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import authStore from './auth.store';

interface SocketState {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  connectSocket: () => {
    const accessToken = authStore.getState().getAccessToken();

    const socket = io('http://localhost:5000', {
      autoConnect: false,
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

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
