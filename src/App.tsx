import { useAppSelector } from './store/hooks';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { user } = useAppSelector((state) => state.auth);

  console.log('App render - user:', user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AnimatePresence mode="wait">
        {user ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Auth />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
