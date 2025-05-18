import React from 'react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  text: string;
  isSentByMe: boolean;
  timestamp: string;
  isGrouped: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isSentByMe, timestamp, isGrouped }) => {
  return (
    <div
      className={`flex flex-col ${
        isSentByMe ? "items-end" : "items-start"
      } ${isGrouped ? "" : "mb-4"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
          isSentByMe
            ? 'bg-[#5e63f9] text-white rounded-tr-none'
            : 'bg-gray-200 text-black rounded-tl-none'
        }`}
        style={{ whiteSpace: 'pre-wrap' }} // Preserve line breaks and whitespace
      >
        <p>{text}</p>
      </motion.div>
      {timestamp && (
        <span className="text-xs text-neutral-500 mt-1">{timestamp}</span>
      )}
    </div>
  );
};

export default ChatBubble;