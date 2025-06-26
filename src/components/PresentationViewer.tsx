/**
 * PresentationViewer Component
 * Handles navigation between multiple slides in a presentation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PresentationConfig, PresentationState } from '../framework/types/presentation.types';
import { EducationalTemplate } from '../framework/components/templates/EducationalTemplate';
import { renderIcon } from '../framework/utils/iconRegistry';

interface PresentationViewerProps {
  presentation: PresentationConfig;
  className?: string;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  presentation,
  className = ''
}) => {
  const [state, setState] = useState<PresentationState>({
    currentSlideIndex: 0,
    isPlaying: false,
    isFullscreen: false,
    showControls: true,
    totalSlides: presentation.slides.length
  });

  const currentSlide = presentation.slides[state.currentSlideIndex];

  // Navigation functions
  const goToNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentSlideIndex: Math.min(prev.currentSlideIndex + 1, prev.totalSlides - 1)
    }));
  }, []);

  const goToPrevious = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentSlideIndex: Math.max(prev.currentSlideIndex - 1, 0)
    }));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentSlideIndex: Math.max(0, Math.min(index, prev.totalSlides - 1))
    }));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!presentation.settings.allowKeyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          goToNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(state.totalSlides - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentation.settings.allowKeyboardNavigation, goToNext, goToPrevious, goToSlide, state.totalSlides]);

  // Auto advance
  useEffect(() => {
    if (!presentation.settings.autoAdvance || !state.isPlaying) return;

    const interval = setInterval(() => {
      if (state.currentSlideIndex < state.totalSlides - 1) {
        goToNext();
      } else if (presentation.settings.loop) {
        goToSlide(0);
      } else {
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    }, presentation.settings.autoAdvanceDelay || 30000);

    return () => clearInterval(interval);
  }, [presentation.settings, state.isPlaying, state.currentSlideIndex, state.totalSlides, goToNext, goToSlide]);

  // Slide transition variants
  const slideVariants = {
    enter: { opacity: 0, x: 300 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 }
  };

  return (
    <div className={`relative w-full h-screen bg-slate-900 ${className}`}>
      {/* Main Slide Area */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentSlideIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <EducationalTemplate config={currentSlide} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {presentation.settings.controls && state.showControls && (
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl px-6 py-3 flex items-center gap-4 border border-slate-700/50 shadow-2xl">
            
            {/* Previous Button */}
            <motion.button
              onClick={goToPrevious}
              disabled={state.currentSlideIndex === 0}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {renderIcon('chevron-left', { size: 20, className: 'text-white' })}
            </motion.button>

            {/* Slide Indicator */}
            <div className="flex items-center gap-2">
              {presentation.slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === state.currentSlideIndex 
                      ? 'bg-blue-400 w-6' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={goToNext}
              disabled={state.currentSlideIndex === state.totalSlides - 1}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {renderIcon('chevron-right', { size: 20, className: 'text-white' })}
            </motion.button>

            {/* Play/Pause Button */}
            {presentation.settings.autoAdvance && (
              <motion.button
                onClick={() => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                className="p-2 rounded-lg bg-blue-600/50 hover:bg-blue-500/50 transition-all duration-200 ml-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {renderIcon(state.isPlaying ? 'pause' : 'play', { size: 20, className: 'text-white' })}
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      {presentation.settings.showProgress && (
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-slate-800/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
            style={{
              width: `${((state.currentSlideIndex + 1) / state.totalSlides) * 100}%`
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {/* Slide Number */}
      <motion.div
        className="absolute top-6 right-6 z-50 bg-slate-800/90 backdrop-blur-lg rounded-lg px-3 py-2 text-sm text-white border border-slate-700/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {state.currentSlideIndex + 1} / {state.totalSlides}
      </motion.div>
    </div>
  );
}; 