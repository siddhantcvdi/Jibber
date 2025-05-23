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
      } ${isGrouped ? "mb-1" : "mb-4"}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`max-w-xs px-5 py-3 rounded-[18px] ${
          isSentByMe
            ? 'bg-[#5e63f9]/90 backdrop-blur-sm text-white rounded-tr-[6px] shadow-lg shadow-[#5e63f9]/20 dark:shadow-[#5e63f9]/10'
            : 'bg-gray-200 dark:bg-accent/70 text-foreground rounded-tl-[6px]'
        }`}
        style={{ 
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <p className="text-[14px] font-normal leading-[1.5] tracking-[0.2px]">{text}</p>
      </motion.div>
      {timestamp && (
        <span className="text-[9px] font-medium text-muted-foreground mt-1.5 mx-1.5 opacity-75">{timestamp}</span>
      )}
    </div>
  );
};

export default ChatBubble;