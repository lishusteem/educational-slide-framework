import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavigationContextValue {
  isPlaying: boolean;
  currentSlideIndex: number;
  totalSlides: number;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const totalSlides = 1; // Placeholder until presentation context wired

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const next = useCallback(() => setCurrentSlideIndex((idx) => Math.min(idx + 1, totalSlides - 1)), [totalSlides]);
  const previous = useCallback(() => setCurrentSlideIndex((idx) => Math.max(idx - 1, 0)), []);

  const value: NavigationContextValue = {
    isPlaying,
    currentSlideIndex,
    totalSlides,
    play,
    pause,
    next,
    previous,
    canGoNext: currentSlideIndex < totalSlides - 1,
    canGoPrevious: currentSlideIndex > 0,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}; 