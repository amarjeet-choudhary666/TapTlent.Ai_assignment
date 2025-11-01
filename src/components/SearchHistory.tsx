import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addToSearchHistory, removeFromSearchHistory, clearSearchHistory, addFavorite } from '../store/slices/favoritesSlice';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SearchHistoryProps {
  onSelectCity: (city: string) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelectCity, showHistory, setShowHistory }) => {
  const dispatch = useAppDispatch();
  const searchHistory = useAppSelector((state) => state.favorites.searchHistory);

  const handleSelectCity = (city: string) => {
    dispatch(addToSearchHistory(city));
    dispatch(addFavorite(city));
    onSelectCity(city);
    setShowHistory(false);
  };

  const handleRemoveFromHistory = (city: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFromSearchHistory(city));
  };

  const handleClearHistory = () => {
    dispatch(clearSearchHistory());
  };

  if (!showHistory || searchHistory.length === 0) return null;

  return (
    <div className="absolute z-10 w-full mt-2">
      <Card className="bg-white bg-opacity-95 backdrop-blur-lg shadow-2xl max-h-64 overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">Recent Searches</CardTitle>
            <Button
              onClick={handleClearHistory}
              variant="ghost"
              size="sm"
              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {searchHistory.map((city, index) => (
            <div
              key={index}
              className="px-6 py-3 hover:bg-slate-50 cursor-pointer transition-all duration-200 border-b border-slate-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl group"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center flex-1"
                  onClick={() => handleSelectCity(city)}
                >
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-800 font-medium">{city}</span>
                </div>
                <Button
                  onClick={(e) => handleRemoveFromHistory(city, e)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  title="Remove from history"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchHistory;