import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import MainLayout from './Layouts/MainLayout';
import ChatWindow from './components/ChatWindow';
import Settings from './components/Settings';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { useEffect } from 'react';
import authStore from './store/auth.store';
import useThemeStore from './store/themeStore';
import { useSocketStore } from './store/socket.store';
import ChatList from './components/ChatList/ContactList';

function App() {
  const { isAuthLoading, silentRefresh } = authStore();
  const { isDarkMode } = useThemeStore();
  const {connectSocket, disconnectSocket} = useSocketStore();

  useEffect(() => {
    // Try to silently refresh token on app startup
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
          <Route path="chat/:id" element={<ChatWindow />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
