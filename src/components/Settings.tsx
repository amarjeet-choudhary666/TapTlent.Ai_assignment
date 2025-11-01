import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setTemperatureUnit } from '../store/slices/settingsSlice';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Thermometer, X } from 'lucide-react';

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const temperatureUnit = useAppSelector((state) => state.settings.temperatureUnit);
  const [isOpen, setIsOpen] = useState(false);

  const handleUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    dispatch(setTemperatureUnit(unit));
  };

  return (
    <div className="relative">
      {/* Settings Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="lg"
          className="bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <SettingsIcon className="w-5 h-5 mr-2" />
          Settings
        </Button>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Settings Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="absolute top-full right-0 mt-4 z-50"
            >
              <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/30">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-slate-800">
                      <SettingsIcon className="w-5 h-5 mr-2 text-blue-500" />
                      Settings
                    </CardTitle>
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Temperature Unit Setting */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                      <Thermometer className="w-4 h-4 mr-2 text-blue-500" />
                      Temperature Unit
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => handleUnitChange('celsius')}
                          variant={temperatureUnit === 'celsius' ? 'default' : 'outline'}
                          className={`w-full ${
                            temperatureUnit === 'celsius'
                              ? 'bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                              : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-blue-50'
                          }`}
                        >
                          <span className="font-medium">°C</span>
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => handleUnitChange('fahrenheit')}
                          variant={temperatureUnit === 'fahrenheit' ? 'default' : 'outline'}
                          className={`w-full ${
                            temperatureUnit === 'fahrenheit'
                              ? 'bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                              : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-blue-50'
                          }`}
                        >
                          <span className="font-medium">°F</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Additional Settings Placeholder */}
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">
                      More settings coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;