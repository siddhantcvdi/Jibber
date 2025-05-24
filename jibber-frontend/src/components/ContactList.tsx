import { Search, Settings } from "lucide-react"
import ChatPreview from "./ContactPreview"
import { useState } from "react"
import { ThemeToggle } from "./ui/theme-toggle"
import { contactsData } from "../data/contactsData"
import { useLocation } from "react-router-dom"

const ContactList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const location = useLocation();
  
  // Get current chat ID from URL to determine which chat is active
  const currentChatId = location.pathname.includes('/app/chat/') 
    ? location.pathname.split('/app/chat/')[1] 
    : null;  
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
            <button className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors">
              <Settings size={18} />
            </button>
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
          All
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