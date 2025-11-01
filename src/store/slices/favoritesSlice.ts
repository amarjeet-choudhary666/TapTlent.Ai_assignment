import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  cities: string[];
  searchHistory: string[];
}

const initialState: FavoritesState = {
  cities: JSON.parse(localStorage.getItem('favorites') || '[]'),
  searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload);
        localStorage.setItem('favorites', JSON.stringify(state.cities));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter(city => city !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.cities));
    },
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      const city = action.payload;
      // Remove if already exists to move to front
      state.searchHistory = state.searchHistory.filter(item => item !== city);
      // Add to beginning (most recent)
      state.searchHistory.unshift(city);
      // Keep only last 10 searches
      if (state.searchHistory.length > 10) {
        state.searchHistory = state.searchHistory.slice(0, 10);
      }
      localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory));
    },
    removeFromSearchHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(city => city !== action.payload);
      localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory));
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem('searchHistory');
    },
  },
});

export const { addFavorite, removeFavorite, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } = favoritesSlice.actions;
export default favoritesSlice.reducer;