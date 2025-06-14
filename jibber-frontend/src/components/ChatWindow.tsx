import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { SendHorizonal, MoreVertical } from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';
import { useParams } from 'react-router-dom';
import { findContactById, type Message } from '../data/contactsData';

const ChatWindow = () => {
  const { id } = useParams<{ id: string }>();
  const contact = findContactById(id || '');

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages([
      ...messages,
      { text: newMessage, isSentByMe: true, timestamp: currentTime },
    ]);
    setNewMessage('');
  };

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

  // Initialize messages when contact changes
  useEffect(() => {
    if (contact) {
      setMessages(contact.messages);
    }
  }, [contact]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    autoResizeTextarea();
  }, [newMessage]);

  // If no contact found, show error or redirect
  if (!contact) {
    return (
      <div className="flex flex-col h-[100dvh] flex-1 bg-muted/50 shadow-lg rounded-3xl overflow-hidden">
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
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] flex-1 bg-muted/50 shadow-lg overflow-hidden">
      <div className="bg-background border-b border-border shadow-sm">
        <div className="flex justify-between items-center p-3 px-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30 flex justify-center items-center">
                <img
                  src={contact.icon}
                  className="object-cover h-full w-full"
                  alt={contact.name}
                />
              </div>
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-foreground">{contact.name}</h3>
              <p className="text-xs text-muted-foreground">
                {contact.isOnline ? 'Online' : 'Offline'}
              </p>
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

      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 bg-background/75">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            text={message.text}
            isSentByMe={message.isSentByMe}
            timestamp={message.timestamp}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-background border-border p-2 sm:p-3">
        <div className="flex items-center gap-2 bg-background rounded-3xl border border-border pl-3 px-1.5 py-1.5">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none outline-none max-h-32 text-foreground py-0 leading-normal placeholder:text-muted-foreground my-auto bg-transparent"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="p-2 sm:p-3 rounded-2xl bg-[#5e63f9] text-white hover:shadow-md transition-all"
            onClick={handleSendMessage}
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
