import React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "../ui/button"
import { MessageCircle, X } from "lucide-react"
import type { SearchUser } from "@/types";

interface StartChatProps {
  handleStartChat: () => Promise<void>,
  handleClosePopup: () => void; 
  selectedSearchUser: SearchUser | null; 
  UserAvatar: ({ user }: { user: SearchUser; }) => React.ReactElement; 
  showChatPopup: boolean; 
}

const StartChatPopup = ({showChatPopup, selectedSearchUser, handleClosePopup, handleStartChat, UserAvatar}: StartChatProps) => {
  return (
    <AnimatePresence>
        {showChatPopup && selectedSearchUser && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={handleClosePopup}
          >
            <motion.div 
              className="bg-background dark:bg-muted backdrop-blur-sm border border-border/50 rounded-2xl p-4 w-full max-w-sm shadow-2xl ring-1 ring-white/10"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">Start a Chat</h3>
                </div>
                <button
                  onClick={handleClosePopup}
                  className="p-1.5 cursor-pointer rounded-full hover:bg-red-400/10 transition-all duration-200 hover:scale-110"
                >
                  <X size={18} className="text-red-400 dark:text-red-300" />
                </button>
              </div>
              
              {/* User Info Card */}
              <div className="bg-background/20 rounded-xl p-3 mb-4 border border-border/30">
                <div className="flex items-center gap-3">
                  <UserAvatar user={selectedSearchUser} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {selectedSearchUser.username}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedSearchUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5">
                <Button
                  variant="outline"
                  onClick={handleClosePopup}
                  className="cursor-pointer flex-1 h-10 rounded-lg border-2 hover:bg-accent/50 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartChat}
                  className="cursor-pointer flex-1 h-10 rounded-lg bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4c52f7] hover:to-[#6b70fd] text-white border-0 shadow-lg transition-all duration-200"
                >
                  <MessageCircle size={16} className="mr-1.5" />
                  Start Chat
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  )
}

export default StartChatPopup