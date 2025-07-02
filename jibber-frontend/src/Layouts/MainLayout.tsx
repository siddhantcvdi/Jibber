import ChatList from '@/components/ChatList/ContactList.tsx';
import EmptyChatState from '../components/EmptyChatState.tsx';
import { useMediaQuery } from 'react-responsive';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useChatStore } from '@/store/chats.store.ts';

const MainLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();
  const selectChat = useChatStore(select => select.selectChat)

  // Check if we're on a specific chat route or settings
  const isOnChatRoute = location.pathname.includes('/app/chat');
  const isOnSettingsRoute = location.pathname.includes('/app/settings');
  
  useEffect(() => {
    if (!isOnChatRoute) {
      selectChat('');
    }
  }, [isOnChatRoute, selectChat]);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-background">
      {isMobile ? (
        <Outlet />
      ) : (
        <>
          <ChatList />
          {isOnChatRoute || isOnSettingsRoute ? <Outlet /> : <EmptyChatState />}
        </>
      )}
    </div>
  );
};

export default MainLayout;
