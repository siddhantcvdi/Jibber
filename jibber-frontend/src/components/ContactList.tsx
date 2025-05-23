import { Search, Settings } from "lucide-react"
import ChatPreview from "./ContactPreview"
import { useState } from "react"
import { ThemeToggle } from "./ui/theme-toggle"

const ContactList = () => {
  const [activeTab, setActiveTab] = useState("all");  
  return (
    <div className="h-screen w-1/4 min-w-[320px] max-md:w-full flex flex-col bg-background border-r border-border poppins-regular">
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
          onClick={() => setActiveTab("unread")}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "unread" 
              ? "text-[#5e63f9]" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread
          {activeTab === "unread" && (
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
              <ChatPreview 
                name="Siddhant Chaturvedi" 
                lastChatText="Yes, I'll be there in 5 minutes" 
                icon="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" 
                id="1234" 
                time="11:45 AM"
                isActive={true}
              />
              <ChatPreview 
                name="Donald Duck" 
                lastChatText="That sounds really interesting! Can you tell me more about it?" 
                icon="https://images.moneycontrol.com/static-mcnews/2024/12/20241211112438_BeFunky-collage-2024-12-11T165424.810.jpg?impolicy=website&width=770&height=431" 
                id="4567"
                time="10:35 AM"
                unread={2}
              />
              <ChatPreview 
                name="Joe Who" 
                lastChatText="Where am I? I don't remember..." 
                icon="https://www.thoughtco.com/thmb/naT2Yc0Z1u0kz37osn29jkOSm-g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1055820900-ed9e56a18e5e464e8b00620f1174dbfa.jpg" 
                id="8901"
                time="Yesterday"
                unread={1}
                isOnline={false}
              />
              <ChatPreview 
                name="Alice Thompson" 
                lastChatText="Thanks for the information!" 
                icon="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" 
                id="5678"
                time="Tuesday"
                isOnline={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactList