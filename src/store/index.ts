import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import favoritesReducer from './slices/favoritesSlice';
import settingsReducer from './slices/settingsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;