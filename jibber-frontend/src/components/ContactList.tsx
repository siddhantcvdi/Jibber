import { Search, Settings, MoreVertical, User, LogOut, MessageCircle, X } from 'lucide-react';
import ChatPreview from './ContactPreview';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { ThemeToggle } from './ui/theme-toggle';
import { contactsData } from '../data/contactsData';
import { useLocation, useNavigate } from 'react-router-dom';
import authStore from '../store/auth.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import debounce from 'lodash.debounce';
import api from '@/services/api';
import { motion, AnimatePresence } from 'motion/react';

interface SearchUser {
  _id: string
  username: string;
  publicIdKey: string;
  publicSigningKey: string;
  email: string;
  profilePhoto?: string;
}

const ContactList = () => {
  const [activeTab, setActiveTab] = useState('all');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = authStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);

  const tabs = useMemo(() => [
    { id: 'all', label: 'All Chats' },
    { id: 'find', label: 'Find Users' },
  ], []);

  const updatePillPosition = useCallback((activeTabId: string) => {
    if (!tabsRef.current) return;

    const tabButtons = tabsRef.current.querySelectorAll('button');
    const activeIndex = tabs.findIndex(tab => tab.id === activeTabId);
    const activeButton = tabButtons[activeIndex];

    if (activeButton) {
      const containerRect = tabsRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setPillStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left,
      });
    }
  }, [tabs]);

  useEffect(() => {
    updatePillPosition(activeTab);
  }, [activeTab, updatePillPosition]);

  useEffect(() => {
    const handleResize = () => updatePillPosition(activeTab);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, updatePillPosition]);
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


  const currentChatId = location.pathname.includes('/app/chat/')
    ? location.pathname.split('/app/chat/')[1]
    : null;

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const handleUserClick = (user: SearchUser) => {
    setSelectedUser(user);
    setShowChatPopup(true);
  };

  const handleStartChat = async () => {
    if (!selectedUser) return;

    // Here you would typically create a new chat or navigate to existing chat
    // For now, we'll just navigate to a chat with the user's ID
    setShowChatPopup(false);
    setSelectedUser(null);
    navigate(`/app/chat/${selectedUser._id}`);
  };

  const handleClosePopup = () => {
    setShowChatPopup(false);
    setSelectedUser(null);
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

  return (
    <div className="h-[100dvh] p-2 w-full md:w-1/4 md:min-w-[400px] flex flex-col bg-muted dark:bg-background poppins-regular">
      <div className='h-full bg-background dark:bg-muted/25 rounded-2xl shadow-lg'>
        <div className="p-4 border-border">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">Jibber</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => navigate('/app/settings')}
                className="p-2 rounded-2xl hover:bg-accent text-muted-foreground transition-colors cursor-pointer"
              >
                <Settings size={18} />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-2xl hover:bg-accent text-muted-foreground transition-colors cursor-pointer">
                    <MoreVertical size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 glassmorphism-header">
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
        <div
          ref={tabsRef}
          className="relative flex border-b border-border px-2 pr-6"
        >
          {/* Animated underline */}
          <div
            className="absolute h-0.5 bg-[#5e63f9] transition-all duration-300 ease-out"
            style={{
              width: `${pillStyle.width}px`,
              transform: `translateX(${pillStyle.left}px)`,
              bottom: '0px',
            }}
          />

          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative cursor-pointer ${activeTab === id
                ? 'text-[#5e63f9]'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto p-2 pt-4">
          {activeTab === 'find' ? (
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
              <AnimatePresence mode="wait">              {results.length === 0 && query === '' && (
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
              )}            {query && results.length === 0 && (
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
              )}            {results.length > 0 && (
                <motion.div
                  key="results"
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >                {results.map((user: SearchUser, index) => (
                  <motion.div
                    key={user.publicIdKey}
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
                    </div>                    </motion.div>
                ))}
                </motion.div>
              )}
              </AnimatePresence>
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
          )}        </div>
      </div>      {/* Start Chat Popup */}
      <AnimatePresence>
        {showChatPopup && selectedUser && (
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
                <UserAvatar user={selectedUser} />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    {selectedUser.username}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedUser.email}
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

    </div>

  );
};

export default ContactList;
