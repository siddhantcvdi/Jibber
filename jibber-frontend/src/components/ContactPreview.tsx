import useChatWindowStore from '@/store/chatWindowStore';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { Check, Shield } from 'lucide-react';

interface ChatPreviewProps {
    name: string;
    lastChatText: string;
    icon: string;
    id: string;
    time?: string;
    unread?: number;
    isActive?: boolean;
    isOnline?: boolean;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ 
    name, 
    lastChatText, 
    icon, 
    id, 
    time = "11:30 AM", 
    unread = 0,
    isActive = false,
    isOnline = true
}) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { setChatWindow } = useChatWindowStore();
    
    const handleNavigate = () => {
        if(isMobile) 
            navigate(`/app/chat/${id}`);
        else {
            setChatWindow({
                id: id, 
                name: name,
                icon: icon,
            });
        }
    };
    
    return (
        <div 
            className={`flex gap-2 sm:gap-3 items-center cursor-pointer hover:bg-accent p-2 sm:p-3 rounded-xl transition-all duration-200 mb-1
                ${isActive ? 'bg-accent/50 dark:bg-accent/30 border-l-4 border-[#5e63f9]' : ''}`}
            onClick={()=>handleNavigate()}
        >
            <div className="relative flex-shrink-0">
                <div className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-100 to-purple-100 text-white flex justify-center items-center overflow-hidden shadow-sm">
                    <img src={icon} alt="" className="h-full w-full object-cover" />
                </div>
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
            </div>
            
            <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground truncate text-sm sm:text-base">{name}</span>
                    <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">{time}</span>
                </div>
                <div className="flex justify-between items-center mt-0.5 sm:mt-1">
                    <div className="flex items-center text-muted-foreground text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[70%] sm:max-w-[180px]">
                        {id === '1234' && (
                            <Check size={14} className="text-[#5e63f9] mr-1 flex-shrink-0" />
                        )}
                        <span className={`truncate ${unread > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                            {lastChatText}
                        </span>
                    </div>
                    
                    {unread > 0 && (
                        <div className="bg-[#5e63f9] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium flex-shrink-0 ml-1">
                            {unread}
                        </div>
                    )}
                    
                    {id === '1234' && (
                        <Shield size={14} className="text-[#5e63f9] flex-shrink-0 ml-1" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPreview;