import React from 'react';

interface ChatPreviewProps {
    name: string;
    lastChatText: string;
    icon: string;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ name, lastChatText, icon }) => {
    return (
        <div className="flex gap-2 cursor-pointer hover:bg-neutral-200 p-3 rounded-xl duration-500 mb-2">
            <div className="rounded-full h-12 w-12 bg-indigo-800 text-white flex justify-center items-center overflow-hidden">
                <img src={icon} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="text-lg">{name}</div>
                <div className="text-neutral-700 text-[14px] text-nowrap truncate">{lastChatText}</div>
            </div>
        </div>
    );
};

export default ChatPreview;