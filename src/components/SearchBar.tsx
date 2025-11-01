import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { searchCities } from '../store/thunks';
import { addFavorite } from '../store/slices/favoritesSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Search, MapPin } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const result = await dispatch(searchCities(query)).unwrap();
          setSuggestions(result);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching city suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, dispatch]);

  const handleSelectCity = (city: string) => {
    setQuery(city);
    setShowSuggestions(false);
    dispatch(addFavorite(city));
    setQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) handleSelectCity(query.trim());
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Search Input */}
      <div className={`flex shadow-xl rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl border transition-all duration-300 ${
        isInputFocused ? 'border-blue-400 shadow-blue-200/50' : 'border-white/30'
      }`}>
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsInputFocused(true);
            }}
            onBlur={() => {
              setIsInputFocused(false);
              setTimeout(() => {
                setShowSuggestions(false);
              }, 150);
            }}
            placeholder="Search for any city worldwide..."
            className="w-full px-14 py-4 text-lg text-slate-800 font-medium bg-transparent border-0 outline-none placeholder-slate-400 focus:ring-0"
          />
          <motion.div 
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400"
            animate={{ scale: isInputFocused ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Enhanced Search Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className="px-8 py-4 text-white font-semibold text-lg flex items-center justify-center
                       bg-linear-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600
                       transition-all duration-300 rounded-none shadow-lg hover:shadow-xl"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </motion.div>
      </div>

      {/* Enhanced Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-40 w-full mt-3"
          >
            <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border border-white/30 max-h-64 overflow-y-auto rounded-2xl">
              <CardContent className="p-0">
                {suggestions.map((city, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectCity(city)}
                    className="px-6 py-4 flex items-center space-x-3 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 transition-all duration-200 cursor-pointer border-b border-slate-100/50 last:border-b-0 group"
                  >
                    <motion.div
                      className="text-sky-500 group-hover:text-sky-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <MapPin className="w-4 h-4" />
                    </motion.div>
                    <span className="text-slate-800 font-medium group-hover:text-slate-900">{city}</span>
                    <motion.div
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                    >
                      <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        Add to favorites
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default SearchBar;
