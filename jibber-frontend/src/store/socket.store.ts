import { create } from 'zustand';
import type { Socket } from 'socket.io-client';
import authStore from './auth.store';
import {
  connectSocketService,
  disconnectSocketService,
  emitMessageService,
} from '@/services/socket.service';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  setSocket: (socket: Socket | null) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  emitMessage: (type: string, ...args: any[]) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  isConnected: false,

  setSocket: (socket) => {
    set({ socket, isConnected: !!socket });
  },

  connectSocket: () => {
    const accessToken = authStore.getState().accessToken;
    connectSocketService(accessToken);
    // We no longer set state here; the service does it.
  },

  disconnectSocket: () => {
    disconnectSocketService();
  },

  emitMessage: (type: string, args: any) => {
    emitMessageService(type, args);
  },
}));

