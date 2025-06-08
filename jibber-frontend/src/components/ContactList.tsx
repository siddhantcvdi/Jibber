import { Search, Settings, MoreVertical, User, LogOut } from "lucide-react"
import ChatPreview from "./ContactPreview"
import { useState } from "react"
import { ThemeToggle } from "./ui/theme-toggle"
import { contactsData } from "../data/contactsData"
import { useLocation, useNavigate } from "react-router-dom"
import authStore from "../store/auth.store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ContactList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = authStore();
  
  // Get current chat ID from URL to determine which chat is active
  const currentChatId = location.pathname.includes('/app/chat/') 
    ? location.pathname.split('/app/chat/')[1] 
    : null;

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  // Get first letter of username for avatar
  const getInitial = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="h-[100dvh] w-full md:w-1/4 md:min-w-[320px] flex flex-col bg-background border-r border-border poppins-regular">
      <div className="p-4 border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Messages</h1>
            <div className="px-2 py-0.5 bg-[#5e63f9] text-white text-xs font-medium rounded-full">3</div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => navigate('/app/settings')}
              className="p-2 rounded-2xl hover:bg-accent text-muted-foreground transition-colors"
            >
              <Settings size={18} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-2xl hover:bg-accent text-muted-foreground transition-colors">
                  <MoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <div className="flex items-center gap-3 p-3 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5e63f9] to-[#7c7fff] flex items-center justify-center text-white font-semibold">
                    {getInitial(user?.username || '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem 
                  onClick={() => navigate('/app/settings')}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  <User size={16} />
                  <span>Profile & Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-border px-2">
        <button 
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "all" 
              ? "text-[#5e63f9]" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Chats
          {activeTab === "all" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5e63f9]"></div>
          )}
        </button>
        <button 
          onClick={() => setActiveTab("find")}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "find" 
              ? "text-[#5e63f9]" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Find Users
          {activeTab === "find" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5e63f9]"></div>
          )}
        </button>
      </div>
      
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-2 pt-4 bg-background">
        {activeTab === "find" ? (
          <div className="p-2">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search users by username" 
                className="bg-muted dark:bg-muted/80 w-full rounded-full py-2 pl-10 pr-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">Enter a username to find contacts</p>
          </div>
        ) : (
          <div>
            <div>
              {contactsData.map((contact) => (
                <ChatPreview 
                  key={contact.id}
                  name={contact.name} 
                  lastChatText={contact.lastChatText} 
                  icon={contact.icon} 
                  id={contact.id} 
                  time={contact.time}
                  unread={contact.unread}
                  isActive={currentChatId === contact.id}
                  isOnline={contact.isOnline}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactList