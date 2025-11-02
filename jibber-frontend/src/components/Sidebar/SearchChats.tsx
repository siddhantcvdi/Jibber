// src/components/chats/SearchChats.tsx
import { useState } from "react";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/store/chats.store";
import authStore from "@/store/auth.store";
import UserAvatar from "../UserAvatar";
import StartChatPopup from "./StartChatPopup";
import { createChat } from "@/services/chat.service";
import { useUserSearch } from "@/hooks/useUserSearch.hook";
import type { SearchUser } from "@/types";

const SearchChats = () => {
  const { query, setQuery, results, loading } = useUserSearch();
  const { fetchChats, selectChat, doesChatExist } = useChatStore();
  const user = authStore((state) => state.user);
  const navigate = useNavigate();

  const [selectedSearchUser, setSelectedSearchUser] = useState<SearchUser | null>(null);
  const [showChatPopup, setShowChatPopup] = useState(false);

  const handleStartChat = async () => {
    if (!selectedSearchUser || !user?._id) return;

    try {
      const chat = await createChat([user._id, selectedSearchUser._id]);
      await fetchChats();
      selectChat(chat._id);
      setShowChatPopup(false);
      navigate("/app/chat");
    } catch (err) {
      console.error("Error creating chat", err);
      selectChat("");
      setShowChatPopup(false);
    }
  };

  const handleUserClick = (u: SearchUser) => {
    const chatId = doesChatExist(u._id);
    if (chatId) {
      selectChat(chatId);
      navigate("/app/chat", { replace: true });
    } else {
      setSelectedSearchUser(u);
      setShowChatPopup(true);
    }
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.p
              key="loading"
              className="text-sm text-muted-foreground text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Searching...
            </motion.p>
          )}

          {!loading && query === "" && results.length === 0 && (
            <motion.p
              key="empty"
              className="text-sm text-muted-foreground text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Enter a username to find contacts
            </motion.p>
          )}

          {!loading && query && results.length === 0 && (
            <motion.p
              key="no-results"
              className="text-sm text-muted-foreground text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              {results.map((u, i) => (
                <motion.div
                  key={u._id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleUserClick(u)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserAvatar user={u} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{u.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StartChatPopup
        handleStartChat={handleStartChat}
        handleClosePopup={() => {
          setShowChatPopup(false);
          setSelectedSearchUser(null);
        }}
        selectedSearchUser={selectedSearchUser}
        UserAvatar={UserAvatar}
        showChatPopup={showChatPopup}
      />
    </>
  );
};

export default SearchChats;
