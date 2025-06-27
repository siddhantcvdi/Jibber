import api from "@/services/api";
import { useChatStore } from "@/store/chats.store";
import type { SearchUser } from "@/types"
import debounce from "lodash.debounce";
import { Search } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react";
import authStore from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import StartChatPopup from "./StartChatPopup";

const SearchChats = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [selectedSearchUser, setSelectedSearchUser] = useState<SearchUser | null>(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const  user  = authStore(select=>select.user);
  const navigate = useNavigate();



  const {fetchChats, selectChat } = useChatStore()


  const fetchUsers = debounce(async (q) => {
    if (!q) {
      setResults([]);
      return;
    }
    const res = await api.get(`/users/getUsers?query=${q}`);
    const data = res.data.data;
    setResults(data);
  }, 300);

  useEffect(() => {
    fetchUsers(query);
    return fetchUsers.cancel;
  }, [query, fetchUsers]);

  const handleStartChat = async () => {
    if (!selectedSearchUser) return;
    try {
      const res = await api.post('/chats/createChat', {
        users: [user?._id, selectedSearchUser?._id]
      })
      const chatId = res.data.data._id; setShowChatPopup(false);
      setSelectedSearchUser(null);
      await fetchChats();
      selectChat(chatId);
      navigate(`/app/chat/${chatId}`);
    } catch (err: unknown) {
      console.log("Error creating chat", err);
      setShowChatPopup(false);
      setSelectedSearchUser(null);
    }
  };
  const handleClosePopup = () => {
    setShowChatPopup(false);
    setSelectedSearchUser(null);
  };
  const getInitial = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };
  const UserAvatar = ({ user }: { user: SearchUser }) => {
    const [imageError, setImageError] = useState(false);
    if (!user.profilePhoto || imageError) {
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5e63f9] to-[#7c7fff] flex items-center justify-center text-white font-semibold">
          {getInitial(user.username)}
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src={user.profilePhoto}
          alt={user.username}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  const handleUserClick = (user: SearchUser) => {
    setSelectedSearchUser(user);
    setShowChatPopup(true);
  };

  return (
    <>
      <div className="p-2">
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search users by username"
            className="bg-muted dark:bg-muted/80 w-full rounded-full py-2 pl-10 pr-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <AnimatePresence mode="wait">
          {results.length === 0 && query === '' && (
            <motion.p
              key="empty-state"
              className="text-sm text-muted-foreground text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Enter a username to find contacts
            </motion.p>
          )}
          {query && results.length === 0 && (
            <motion.p
              key="no-results"
              className="text-sm text-muted-foreground text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              No users found
            </motion.p>
          )}
          {results.length > 0 && (
            <motion.div
              key="results"
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {results.map((user: SearchUser, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleUserClick(user)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserAvatar user={user} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <StartChatPopup handleStartChat={handleStartChat} handleClosePopup={handleClosePopup} selectedSearchUser={selectedSearchUser} UserAvatar={UserAvatar} showChatPopup={showChatPopup} />
    </>
  )
}

export default SearchChats