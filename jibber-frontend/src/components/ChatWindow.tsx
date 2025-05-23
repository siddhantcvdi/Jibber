import React, { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import { SendHorizonal, MoreVertical } from "lucide-react";
import { ThemeToggle } from "./ui/theme-toggle";

interface Message {
  text: string;
  isSentByMe: boolean;
  timestamp: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello, how are you?", isSentByMe: false, timestamp: "10:30 AM" },
    { text: "I'm good, thanks! How about you?", isSentByMe: true, timestamp: "10:31 AM" },
    { text: "I'm doing well too!", isSentByMe: false, timestamp: "10:31 AM" },
    { text: "What have you been up to lately?", isSentByMe: false, timestamp: "10:32 AM" },
    { text: "Just working on a new project. It's a messaging app with end-to-end encryption.", isSentByMe: true, timestamp: "10:34 AM" },
    { text: "That sounds really interesting! Can you tell me more about it?", isSentByMe: false, timestamp: "10:35 AM" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages([
      ...messages,
      { text: newMessage, isSentByMe: true, timestamp: currentTime },
    ]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    autoResizeTextarea();
  }, [newMessage]);

  const groupedMessages = messages.reduce((groups, message, index) => {
    const date = new Date().toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({
      ...message,
      isLastInGroup:
        index === messages.length - 1 ||
        messages[index + 1].timestamp !== message.timestamp ||
        messages[index + 1].isSentByMe !== message.isSentByMe
    });
    return groups;
  }, {} as Record<string, (Message & { isLastInGroup: boolean })[]>);

  return (
    <div className="flex flex-col h-[100dvh] flex-1 bg-muted/50 shadow-lg rounded-lg overflow-hidden">
      <div className="bg-background border-b border-border shadow-sm">
        <div className="flex justify-between items-center p-3 px-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30 flex justify-center items-center">
                <img
                  src="https://images.moneycontrol.com/static-mcnews/2024/12/20241211112438_BeFunky-collage-2024-12-11T165424.810.jpg?impolicy=website&width=770&height=431"
                  className="object-cover h-full w-full"
                  alt="Donald Duck"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Donald Duck</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            <button className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 bg-background/75">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex justify-center my-4 ">
              <div className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                {date === new Date().toLocaleDateString() ? "Today" : date}
              </div>
            </div>
            {dateMessages.map((message, index) => (
              <ChatBubble
                key={index}
                text={message.text}
                isSentByMe={message.isSentByMe}
                timestamp={message.isLastInGroup ? message.timestamp : ""}
                isGrouped={!message.isLastInGroup}
              />
            ))}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-background border-border p-2 sm:p-3">
        <div className="flex items-center gap-2 bg-background rounded-2xl border border-border pl-3 px-1.5 py-1.5">
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
            className="p-2 sm:p-3 rounded-lg bg-[#5e63f9] text-white hover:shadow-md transition-all"
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