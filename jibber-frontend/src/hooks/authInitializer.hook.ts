import { useEffect } from 'react';
import authStore from '../store/auth.store';
import { useSocketStore } from '../store/socket.store';

export const useAuthInitializer = (): boolean => {
  const isAuthLoading = authStore((state) => state.isAuthLoading);
  const silentRefresh = authStore((state) => state.silentRefresh);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);

  useEffect(() => {
    const initializeAuth = async () => {
      await silentRefresh();
    };
    initializeAuth();

    // Ensure socket is disconnected when the app unmounts
    return () => {
      disconnectSocket();
    };
  }, [silentRefresh, disconnectSocket]);

  return isAuthLoading;
};
