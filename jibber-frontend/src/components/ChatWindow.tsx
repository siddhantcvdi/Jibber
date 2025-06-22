import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { SendHorizonal, MoreVertical, ImageUp } from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import { useMessageStore } from '@/store/message.store';
import {useChatStore, useSelectedChatUser, useIsChatValid} from "@/store/chats.store.ts";


const ChatWindow = () => {
  const { id } = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {groupMessages, messages, handleSendMessage} = useMessageStore();
  const {selectChat} = useChatStore();
  const selectedChatUser = useSelectedChatUser();
  const isValidChatId = useIsChatValid();
  
  // Set selected chat ID when component mounts or ID changes
  useEffect(() => {
    if(id) {
      selectChat(id);
    }
  }, [id, selectChat]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  };
    useEffect(() => {
    if(id){
      api.get(`/messages/${id}`)
      .then((res)=>{
        console.log(res.data.data);
      })
      .catch(err => {
        console.log("Error Fetching Messages", err);
      })
    }
  }, [id]);

  // Go to the bottom of page
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Text Area auto resizer
  useEffect(() => {
    autoResizeTextarea();
  }, [newMessage]);

    const getInitial = (username: string) => {
      return username ? username.charAt(0).toUpperCase() : 'U';
    };

  
  if (!isValidChatId) {
    return (
      <div className=" h-[100dvh] flex-1 bg-muted pl-0 max-md:pl-2 p-2 shadow-lg overflow-hidden">
        <div className='h-full w-full flex bg-background rounded-2xl'>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Contact not found
            </h3>
            <p className="text-muted-foreground">
              The chat you're looking for doesn't exist.
            </p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex-1 p-2 md:pl-0 bg-muted dark:bg-background overflow-hidden">
      <div className='w-full h-full flex flex-col'>
        <div className="bg-background dark:bg-muted/25 rounded-2xl border-border shadow-lg">
          <div className="flex justify-between items-center p-3 px-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30 flex justify-center items-center">
                 {
                   selectedChatUser?.profilePhoto
                  ?<img src={selectedChatUser?.profilePhoto} alt="" className="h-full w-full object-cover" />
                  :<div className="w-10 h-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#5e63f9] to-[#7c7fff] flex items-center justify-center text-white font-semibold">
                      {getInitial(selectedChatUser?.username || '')}
                   </div>
                }
                </div>
              </div>
              <div>
                <h3 className="font-medium text-foreground">{selectedChatUser?.username}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <ThemeToggle />
              </div>
              <button className="p-2 rounded-2xl hover:bg-accent text-muted-foreground transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 shadow-lg overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 bg-background dark:bg-muted/25 mt-2 rounded-2xl">
          {groupMessages(messages).map((message, index) => (
            <ChatBubble
              key={index}
              text={message.text}
              isSentByMe={message.isSentByMe}
              timestamp={message.timestamp}
              showTimestamp={message.showTimestamp}
            />
          ))}

          <div ref={messagesEndRef} />
        </div>
        <div className="bg-background dark:bg-muted/25 md:p-1 mt-2 border-border rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2 rounded-2xl h-14 pl-3 px-1.5 py-1.5">
            <button
              className="p-3 -ml-2 sm:p-3 rounded-lg md:rounded-2xl cursor-pointer hover:bg-muted/50 text-foreground hover:shadow-md transition-all"
              onClick={handleSendMessage}
            >
              <ImageUp size={18} />
            </button>
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none outline-none max-h-32 text-neutral-800 dark:text-foreground py-0 leading-normal placeholder:text-muted-foreground my-auto "
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="p-3 sm:p-3 rounded-lg md:rounded-2xl bg-[#5e63f9] cursor-pointer hover:bg-[#5358f8] text-white hover:shadow-md transition-all"
              onClick={handleSendMessage}
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatWindow;
