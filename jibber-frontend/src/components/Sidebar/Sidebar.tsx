import { useCallback, useEffect, useState } from 'react';
import { useChatStore } from '@/store/chats.store';
import SidebarHeader from './SidebarHeader.tsx';
import SidebarTabs from './SidebarTabs.tsx';
import SearchChats from './SearchChats';
import AllChats from './AllChats';


const ChatList = () => {
  const [activeTab, setActiveTab] = useState('all');
  const fetchChats = useChatStore(select=>select.fetchChats)
  const fetchChatsCallback = useCallback(fetchChats, [fetchChats]);
  useEffect(() => {
    fetchChatsCallback();
  }, [fetchChatsCallback]);
  
  return (
    <div className="h-[100dvh] p-2 w-full md:w-1/4 md:min-w-[400px] flex flex-col bg-muted dark:bg-background poppins-regular">
      <div className='h-full bg-background dark:bg-muted/25 rounded-2xl shadow-lg'>
        <SidebarHeader/>
        <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 overflow-y-auto p-2 pt-4">
          { activeTab === 'find' ? <SearchChats/> : <AllChats/>}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
