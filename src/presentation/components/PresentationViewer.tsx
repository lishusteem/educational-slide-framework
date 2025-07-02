/**
 * Presentation Viewer Component
 * Simple multi-slide viewer with navigation controls
 * Preserves all existing visual functionality while adding slide navigation
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '../../framework/components/Canvas';
import { NavigationControls } from './NavigationControls';
import type { PresentationConfig } from '../types/presentation.types';

export interface PresentationViewerProps {
  presentation: PresentationConfig;
  className?: string;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  presentation,
  className = ''
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const currentSlide = presentation.slides[currentSlideIndex];
  const totalSlides = presentation.slides.length;
  
  // Navigation handlers
  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
      setCurrentTime(0);
    }
  }, [totalSlides]);
  
  const nextSlide = useCallback(() => {
    goToSlide(currentSlideIndex + 1);
  }, [currentSlideIndex, goToSlide]);
  
  const previousSlide = useCallback(() => {
    goToSlide(currentSlideIndex - 1);
  }, [currentSlideIndex, goToSlide]);
  
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Presentation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-white">{presentation.title}</h1>
          {presentation.description && (
            <p className="text-blue-200/80">{presentation.description}</p>
          )}
          <div className="flex items-center justify-center gap-4 text-sm text-blue-300/60">
            <span>Slide {currentSlideIndex + 1} of {totalSlides}</span>
            <span>•</span>
            <span>{presentation.author}</span>
            <span>•</span>
            <span>v{presentation.version}</span>
          </div>
        </motion.div>
        
        {/* Main Navigation Controls */}
        <div className="flex justify-center">
          <NavigationControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            onPlay={play}
            onPause={pause}
            onNext={totalSlides > 1 ? nextSlide : undefined}
            onPrevious={currentSlideIndex > 0 ? previousSlide : undefined}
            onTimeUpdate={handleTimeUpdate}
            size="large"
            className="bg-black/50 backdrop-blur-xl"
          />
        </div>
        
        {/* Canvas Area */}
        <motion.div
          className="flex justify-center"
          layout
        >
          <div className="w-full max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <Canvas
                  slide={currentSlide}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  onTimeUpdate={handleTimeUpdate}
                  showNavigation={false} // Main navigation is above
                  aspectRatio={presentation.aspectRatio}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Slide Thumbnails */}
        {totalSlides > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-2 flex-wrap"
          >
            {presentation.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${currentSlideIndex === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                {index + 1}. {slide.content.title}
              </button>
            ))}
          </motion.div>
        )}
        
        {/* Progress Bar */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};