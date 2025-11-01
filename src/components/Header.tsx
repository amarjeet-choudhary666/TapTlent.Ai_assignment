import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setUser } from '../store/slices/authSlice';
import { authService } from '../services/auth';
import { Button } from './ui/button';

import { motion } from 'framer-motion';
import { Cloud, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const displayName = user?.displayName || 'User';
  const photoURL = user?.photoURL || '';

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      dispatch(setUser(null));
    } catch (error: any) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WeatherScope
              </h1>
              <p className="text-xs text-slate-500 font-medium">Analytics Dashboard</p>
            </div>
          </motion.div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <motion.div 
              className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-slate-800 text-sm">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500">Online</p>
              </div>
            </motion.div>

            {/* Sign Out Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 hover:border-red-200 hover:text-red-600 transition-all duration-200 shadow-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;