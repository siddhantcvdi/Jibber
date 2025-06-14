import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/auth.store';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAuthStore();

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background dark:bg-background">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
