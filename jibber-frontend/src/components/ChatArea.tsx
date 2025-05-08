import React, { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import { SendHorizonal } from "lucide-react";

interface Message {
  text: string;
  isSentByMe: boolean;
  timestamp: string;
}

const ChatArea = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello, how are you?", isSentByMe: false, timestamp: "10:30 AM" },
    { text: "I'm good, thanks! How about you?", isSentByMe: true, timestamp: "10:31 AM" },
    { text: "I'm doing well too!", isSentByMe: true, timestamp: "10:31 AM" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault(); // Prevent default Enter behavior
      handleSendMessage();
    } else if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault(); // Prevent default Enter behavior
      setNewMessage((prev) => prev + "\n"); // Add a new line
    }
  };

  // Scroll to the latest message when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-screen w-full bg-neutral-50 outline-1 outline-neutral-200 poppins-regular">
      <div className="w-full h-18 bg-neutral-50">
        <div className="flex gap-4 items-center p-3.5 border-b-2 cursor-pointer border-neutral-200 mx-2">
          <span className="w-10 overflow-hidden h-10 bg-neutral-800 text-white flex justify-center items-center rounded-full">
            <img
              src="https://images.moneycontrol.com/static-mcnews/2024/12/20241211112438_BeFunky-collage-2024-12-11T165424.810.jpg?impolicy=website&width=770&height=431"
              className="object-cover h-full w-full"
              alt=""
            />
          </span>
          <span className="text-xl text-neutral-800">Donald Duck</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4 h-[calc(100vh-140px)] overflow-y-auto">
        {messages.map((message, index) => {
          const isLastInGroup =
            index === messages.length - 1 ||
            messages[index + 1].timestamp !== message.timestamp;

          return (
            <ChatBubble
              key={index}
              text={message.text}
              isSentByMe={message.isSentByMe}
              timestamp={isLastInGroup ? message.timestamp : ""}
              isGrouped={!isLastInGroup}
            />
          );
        })}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full p-2 flex items-center gap-2">
        <textarea
          className="flex-1 px-4 py-2 border border-neutral-400 h-12 rounded-full outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="px-3.5 py-3.5 cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-600"
          onClick={handleSendMessage}
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatArea;