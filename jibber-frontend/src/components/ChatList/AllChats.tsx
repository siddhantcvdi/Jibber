import { useChatStore } from "@/store/chats.store"
import { MessageCircle } from "lucide-react"
import ChatPreview from "../ContactPreview"

const AllChats = () => {

  const isLoading = useChatStore((state)=>state.isLoading)
  const chats = useChatStore((state)=>state.chats)
  const selectedChatId = useChatStore((state)=>state.selectedChatId)

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading chats...</div>
        </div>
      ) : chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MessageCircle size={48} className="text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No chats yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start a conversation by finding users</p>
        </div>
      ) : (<div>
        {chats.map((chat) => (
          <div key={chat._id}>
            <ChatPreview
              chatId={chat._id}
              name={chat.details.username}
              lastChatText={chat.lastMessage}
              icon={chat.details.profilePhoto || ""}
              id={chat.details._id}
              unread={chat.unreadCount}
              isActive={selectedChatId === chat._id}
            />
          </div>
        ))}
      </div>
      )}
    </div>
  )
}

export default AllChats