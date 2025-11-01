import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setUser, setLoading, setError } from "../store/slices/authSlice";
import { authService } from "../services/auth";
import type { User } from "firebase/auth";
import type { UserData } from "../store/slices/authSlice";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { motion } from "framer-motion";

const Auth: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user: User | null) => {
      const userData: UserData | null = user
        ? {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }
        : null;
      dispatch(setUser(userData));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleSignIn = async () => {
    dispatch(setLoading(true));
    try {
      const user = await authService.signInWithGoogle();
      if (user) {
        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        dispatch(setUser(userData));
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center">
        <motion.div
          className="text-white text-2xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center px-4">
        {/* Floating Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div
          className="relative w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="bg-white/40 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center space-y-2 py-8">
              <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">
                WeatherScope
              </CardTitle>
              <CardDescription className="text-slate-700 font-medium">
                Sign in to explore your personalized weather analytics
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Button
                  onClick={handleSignIn}
                  size="lg"
                  className="w-full bg-white text-slate-800 font-semibold flex items-center justify-center gap-3 hover:bg-slate-100 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#4285F4"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          <motion.p
            className="mt-6 text-center text-slate-100 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Securely powered by Firebase Authentication 🔐
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default Auth;
