import { useChatStore } from '@/store/chats.store';
import { MessageCircle, Trash } from 'lucide-react';
import ChatPreview from '../ChatPreview';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

const AllChats = () => {
  const isLoading = useChatStore((state) => state.isLoading);
  const chats = useChatStore((state) => state.chats);
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const deleteChat = useChatStore((state) => state.deleteChat);
  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading chats...</div>
        </div>
      ) : chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MessageCircle size={48} className="text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No chats yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start a conversation by finding users
          </p>
        </div>
      ) : (
        <>
          {chats.map((chat) => (
            <div key={chat._id}>
              <ContextMenu>
                <ContextMenuTrigger>
                  <ChatPreview
                    chatId={chat._id}
                    name={chat.details.username}
                    lastEncryptedMessage={chat.lastMessage}
                    icon={chat.details.profilePhoto || ''}
                    unread={chat.unreadCount}
                    isActive={selectedChatId === chat._id}
                  />
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => deleteChat(chat._id)}
                    className="bg-red-500/5 focus:bg-red-500/10  cursor-pointer text-red-500 focus:text-red-600"
                  >
                    <Trash className="text-red-500" size={16} />
                    Delete Chat
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AllChats;
