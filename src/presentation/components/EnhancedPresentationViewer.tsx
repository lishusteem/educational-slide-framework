/**
 * Enhanced Presentation Viewer
 * 3-Panel layout with Canvas, Navigation, Audio, and Real-time Editor
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '../../framework/components/Canvas';
import { NavigationControls } from './NavigationControls';
import { AudioControls } from './AudioControls';
import { ContentEditor } from './ContentEditor';
import { renderIcon } from '../../framework/utils/iconRegistry';
import type { PresentationConfig } from '../types/presentation.types';
import type { SlideConfig } from '../../framework/types/slide.types';
import type { AudioConfig } from '../../framework/hooks/useAudio';

export interface EnhancedPresentationViewerProps {
  presentation: PresentationConfig;
  onPresentationUpdate?: (presentation: PresentationConfig) => void;
  className?: string;
}

export const EnhancedPresentationViewer: React.FC<EnhancedPresentationViewerProps> = ({
  presentation,
  onPresentationUpdate,
  className = ''
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showEditor, setShowEditor] = useState(true);
  const [workingPresentation, setWorkingPresentation] = useState(presentation);
  
  const currentSlide = workingPresentation.slides[currentSlideIndex];
  const totalSlides = workingPresentation.slides.length;
  
  // Audio configuration for current slide
  const audioConfig: AudioConfig | undefined = currentSlide.audio ? {
    src: currentSlide.audio.src,
    volume: currentSlide.audio.volume || 0.7,
    loop: currentSlide.audio.loop || false,
    autoPlay: false // Manual control
  } : undefined;
  
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

  // Slide update handler
  const handleSlideUpdate = useCallback((updatedSlide: SlideConfig) => {
    const newPresentation = {
      ...workingPresentation,
      slides: workingPresentation.slides.map((slide, index) =>
        index === currentSlideIndex ? updatedSlide : slide
      )
    };
    
    setWorkingPresentation(newPresentation);
    onPresentationUpdate?.(newPresentation);
  }, [workingPresentation, currentSlideIndex, onPresentationUpdate]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 ${className}`}>
      <div className="h-screen flex flex-col">
        
        {/* Top Bar - Navigation & Audio Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Presentation Info */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">{workingPresentation.title}</h1>
              <div className="text-sm text-blue-300/60">
                Slide {currentSlideIndex + 1} of {totalSlides}
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Audio Controls */}
              <AudioControls
                audioConfig={audioConfig}
                size="normal"
                onTimeUpdate={handleTimeUpdate}
              />
              
              {/* Navigation Controls */}
              <NavigationControls
                isPlaying={isPlaying}
                currentTime={currentTime}
                onPlay={play}
                onPause={pause}
                onNext={totalSlides > 1 ? nextSlide : undefined}
                onPrevious={currentSlideIndex > 0 ? previousSlide : undefined}
                onTimeUpdate={handleTimeUpdate}
                size="normal"
                className="bg-black/50"
              />
              
              {/* Editor Toggle */}
              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  showEditor
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {renderIcon('edit-3', { size: 14 })}
                Editor
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex">
          
          {/* Canvas Area */}
          <div className="flex-1 p-4">
            <div className="h-full flex flex-col">
              
              {/* Canvas */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-5xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Canvas
                        slide={currentSlide}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        onTimeUpdate={handleTimeUpdate}
                        showNavigation={false} // Controls are in top bar
                        aspectRatio={workingPresentation.aspectRatio}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Slide Thumbnails */}
              {totalSlides > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex justify-center gap-2 flex-wrap"
                >
                  {workingPresentation.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(index)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all max-w-48 truncate
                        ${currentSlideIndex === index
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                        }
                      `}
                      title={slide.content.title}
                    >
                      {index + 1}. {slide.content.title}
                    </button>
                  ))}
                </motion.div>
              )}
              
              {/* Progress Bar */}
              <div className="mt-4">
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
          
          {/* Content Editor Panel */}
          <AnimatePresence>
            {showEditor && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-80 border-l border-white/10 bg-black/10 backdrop-blur-xl"
              >
                <div className="p-4 h-full">
                  <ContentEditor
                    slide={currentSlide}
                    onSlideUpdate={handleSlideUpdate}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Bottom Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 border-t border-white/10 bg-black/20 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-4">
              <span>Theme: {workingPresentation.theme}</span>
              <span>•</span>
              <span>Aspect: {workingPresentation.aspectRatio}</span>
              <span>•</span>
              <span>v{workingPresentation.version}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {audioConfig && (
                <>
                  <span>🎵 Audio: {audioConfig.src}</span>
                  <span>•</span>
                </>
              )}
              <span>Ready for export</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};