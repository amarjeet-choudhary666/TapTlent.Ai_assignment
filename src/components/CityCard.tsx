import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addFavorite, removeFavorite, removeFromSearchHistory } from '../store/slices/favoritesSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';


interface CityCardProps {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  unit: 'celsius' | 'fahrenheit';
  lastUpdated: number;
  onClick: () => void;
  onDelete?: () => void;
}

const CityCard: React.FC<CityCardProps> = ({
  city,
  temperature,
  condition,
  humidity,
  windSpeed,
  icon,
  unit,
  lastUpdated,
  onClick,
  onDelete,
}) => {
  const dispatch = useAppDispatch();

  const favorites = useAppSelector((state) => state.favorites.cities);
  const searchHistory = useAppSelector((state) => state.favorites.searchHistory);

  const isFavorited = favorites.includes(city);
  const isInSearchHistory = searchHistory.includes(city);

  const handleFavoriteToggle = () => {
    isFavorited ? dispatch(removeFavorite(city)) : dispatch(addFavorite(city));
  };

  const handleRemoveFromSearchHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFromSearchHistory(city));
  };

  const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString();

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <Card className="relative backdrop-blur-lg bg-gradient-to-br from-sky-100/70 to-slate-100/50 shadow-md hover:shadow-xl transition-all border-slate-200 hover:border-sky-300 group">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold text-slate-800 tracking-tight">
              {city}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {onDelete && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  title="Delete city card"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1
                      0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              )}
              {isInSearchHistory && (
                <Button
                  onClick={handleRemoveFromSearchHistory}
                  title="Remove from search history"
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle();
                }}
                variant="ghost"
                size="sm"
                className={`text-2xl transition-transform duration-200 ${
                  isFavorited
                    ? 'text-yellow-400 drop-shadow-glow'
                    : 'text-slate-400 group-hover:text-yellow-400'
                }`}
              >
                ★
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">

          {/* Weather Info */}
          <div className="flex items-center mb-6">
            <div className="relative">
              <img
                src={icon}
                alt={condition}
                className="w-20 h-20 drop-shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://openweathermap.org/img/wn/01d@2x.png`;
                }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <div className="ml-4">
              <div className="text-5xl font-bold text-slate-800 mb-1">
                {Math.round(temperature)}°
                <span className="text-lg font-normal">{unit === 'celsius' ? 'C' : 'F'}</span>
              </div>
              <div className="text-slate-600 capitalize font-medium">{condition}</div>
            </div>
          </div>

          {/* Weather Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center border border-slate-100">
              <div className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Humidity</div>
              <div className="text-lg font-bold text-slate-800">{humidity}%</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center border border-slate-100">
              <div className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Wind</div>
              <div className="text-lg font-bold text-slate-800">{windSpeed} km/h</div>
            </div>
          </div>

          {/* Updated Time */}
          <div className="text-xs text-slate-500 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
            <span className="font-medium">Updated:</span> {formatTime(lastUpdated)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CityCard;
