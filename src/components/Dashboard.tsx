import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchCurrentWeather } from '../store/thunks';
import { removeFavorite, removeFromSearchHistory } from '../store/slices/favoritesSlice';
import CityCard from './CityCard';
import SearchBar from './SearchBar';
import DetailedView from './DetailedView';
import Settings from './Settings';
import Header from './Header';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentWeather, loading, error } = useAppSelector((state) => state.weather);
  const favorites = useAppSelector((state) => state.favorites.cities);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const temperatureUnit = useAppSelector((state) => state.settings.temperatureUnit);

  const citiesToDisplay = favorites.length > 0 ? favorites : ['London', 'New York', 'Tokyo', 'Paris'];

  useEffect(() => {
    citiesToDisplay.forEach((city: string) => {
      if (!currentWeather[city]) {
        dispatch(fetchCurrentWeather(city));
      }
    });
  }, [citiesToDisplay, dispatch, currentWeather]);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      citiesToDisplay.forEach((city: string) => {
        dispatch(fetchCurrentWeather(city));
      });
    }, 300000);
    return () => clearInterval(interval);
  }, [citiesToDisplay, dispatch]);

  const convertTemperature = (temp: number, unit: 'celsius' | 'fahrenheit') =>
    unit === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp;

  const handleDeleteCity = (city: string) => {
    dispatch(removeFavorite(city));
    dispatch(removeFromSearchHistory(city));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-100 via-sky-50 to-slate-100 text-slate-800">
      {/* 🌸 Floating Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-16 w-48 h-48 bg-sky-200 opacity-30 blur-3xl animate-float" />
        <div className="absolute bottom-24 right-16 w-60 h-60 bg-purple-200 opacity-25 blur-3xl animate-float delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-pink-200 opacity-20 blur-2xl animate-float delay-2000" />
        <div className="absolute bottom-1/3 left-1/3 w-52 h-52 bg-cyan-100 opacity-20 blur-2xl animate-float delay-1500" />
      </div>

      {/* 🌤️ Header */}
      <Header />

      {/* 🌈 Main Content */}
      <main className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-sky-600 to-indigo-500 bg-clip-text text-transparent">
            Weather Analytics Dashboard
          </h1>
          <p className="mt-3 text-lg text-slate-600 font-medium">
            Stay informed with <span className="font-semibold text-sky-700">real-time</span> weather updates & trends
          </p>
        </motion.div>

        {/* 🔍 Search & Settings Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Card className="bg-white/60 backdrop-blur-md shadow-lg border border-slate-200 flex-1">
            <CardContent className="p-6">
              <SearchBar />
            </CardContent>
          </Card>
          <Settings />
        </motion.div>

        {/* ⚠️ Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Alert variant="destructive">
              <AlertDescription>Error: {error}</AlertDescription>
            </Alert>
          </motion.div>
        )}


        {/* 🌆 City Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {citiesToDisplay.map((city: string, index: number) => {
            const weather = currentWeather[city];
            if (!weather) return null;

            return (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <CityCard
                  city={city}
                  temperature={convertTemperature(weather.temperature, temperatureUnit)}
                  condition={weather.condition}
                  humidity={weather.humidity}
                  windSpeed={weather.windSpeed}
                  icon={weather.icon}
                  unit={temperatureUnit}
                  lastUpdated={weather.lastUpdated}
                  onClick={() => setSelectedCity(city)}
                  onDelete={() => handleDeleteCity(city)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ⏳ Loading State */}
        {loading && (
          <motion.div
            className="text-center mt-10 text-slate-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading weather data...
          </motion.div>
        )}

        {/* 🌍 Detailed View Modal */}
        {selectedCity && (
          <DetailedView city={selectedCity} onClose={() => setSelectedCity(null)} />
        )}
      </main>
    </div>
  );
};

export default Dashboard; 