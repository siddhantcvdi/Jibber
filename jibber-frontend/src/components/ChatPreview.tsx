import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { useChatStore } from '@/store/chats.store';
import type { EncryptedMessage } from '@/types';
import useCryptoStore from '@/store/crypto.store';
import authStore from '@/store/auth.store';

interface ChatPreviewProps {
  name: string;
  chatId: string,
  lastEncryptedMessage: EncryptedMessage | undefined;
  icon: string;
  unread?: number;
  isActive?: boolean;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({
  chatId,
  name,
  lastEncryptedMessage,
  icon,
  unread = 0,
  isActive = false,
}) => {
  const decryptMessage = useCryptoStore(select => select.decryptMessage);
  const navigate = useNavigate();
  const selectChat = useChatStore(select => select.selectChat)
  const user = authStore(select => select.user)
  const [lastChatText, setLastChatText] = useState<string>('');

  useEffect(() => {
    const decryptLastMessage = async () => {
      if (lastEncryptedMessage) {
        try {
          const decrypted = await decryptMessage(lastEncryptedMessage);
          setLastChatText(decrypted);
        } catch (error) {
          console.error('Failed to decrypt message:', error);
          setLastChatText('Unable to decrypt message');
        }
      } else {
        setLastChatText('');
      }
    };
    decryptLastMessage();
  }, [lastEncryptedMessage, decryptMessage]);

  const handleNavigate = () => {
    selectChat(chatId);
    navigate('/app/chat',{replace: true})
  };

    const getInitial = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div
      className={`flex gap-2 sm:gap-3 items-center cursor-pointer hover:bg-muted p-2 sm:p-3 rounded-2xl transition-all duration-200 mb-1
                ${isActive ? 'bg-muted dark:bg-accent/30 border-l-4 border-[#5e63f9]' : ''}`}
      onClick={() => {
        handleNavigate()
      }}
    >
      <div className="relative flex-shrink-0">
        <div className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-100 to-purple-100 text-white flex justify-center items-center overflow-hidden shadow-sm">
          {
            icon != ""
            ?<img src={icon} alt="" className="h-full w-full object-cover" />
            :<div className="w-10 h-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#5e63f9] to-[#7c7fff] flex items-center justify-center text-white font-semibold">
                      {getInitial(name || '')}
            </div>
          }
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-foreground truncate text-sm sm:text-base">
            {name}
          </span>
          <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">
            {lastEncryptedMessage?.timestamp}
          </span>
        </div>
        <div className="flex justify-between items-center mt-0.5 sm:mt-1">
          <div className="flex items-center text-muted-foreground text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[70%] sm:max-w-[180px]">
            <span
              className={`truncate text-xs ${unread > 0 ? ' text-foreground' : 'text-muted-foreground'}`}
            > 
              {(lastEncryptedMessage?.sender == user?._id )?'You: ': ''}
              {lastChatText || 'No messages yet'}
            </span>
          </div>

          {unread > 0 && (
            <div className="bg-[#5e63f9] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium flex-shrink-0 ml-1">
              {unread}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
