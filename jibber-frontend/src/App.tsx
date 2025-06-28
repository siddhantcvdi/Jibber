import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import MainLayout from './Layouts/MainLayout';
import ChatWindow from './components/ChatWindow/ChatWindow';
import Settings from './components/Settings';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { useEffect, useState } from 'react';
import authStore from './store/auth.store';
import useThemeStore from './store/themeStore';
import { useSocketStore } from './store/socket.store';
import ChatList from './components/ChatList/ContactList';

function App() {
  const isAuthLoading = authStore(select=>select.isAuthLoading);
  const silentRefresh  = authStore(select=>select.silentRefresh);
  const  isDarkMode  = useThemeStore(select=>select.isDarkMode);
  const connectSocket = useSocketStore(select=>select.connectSocket);
  const disconnectSocket = useSocketStore(select=>select.disconnectSocket);
  const [isSessionActiveElsewhere, setIsSessionActiveElsewhere] = useState(false);

  useEffect(() => {
    const tabId = Date.now().toString();
    localStorage.setItem('myAppActiveTab', tabId);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'myAppActiveTab' && e.newValue !== tabId) {
        setIsSessionActiveElsewhere(true);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  useEffect(() => {
    const initializeAuth = async () => {
      const {success} = await silentRefresh();
      if(success){
        connectSocket();
      }
    };
    initializeAuth();
    return(()=>{
      disconnectSocket()
    })
  }, [silentRefresh, connectSocket, disconnectSocket]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isSessionActiveElsewhere) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="max-w-md w-full mx-4 p-8 bg-card rounded-lg border border-border shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Session Active Elsewhere
            </h1>
            <p className="text-muted-foreground mb-6">
              This application is already open in another tab or window. Please close other instances to continue using Jibber here.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-4 cursor-pointer py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background dark:bg-background">
        <div className="w-10 h-10 border-4 border-border dark:border-border border-t-[#5e63f9] dark:border-t-[#7c7fff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ChatList />} />
          <Route path="chat" element={<ChatWindow />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
