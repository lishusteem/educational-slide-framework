/**
 * Professional Presentation Viewer
 * Ultimate multi-panel editor with layout manager, canvas, and area-specific sidebars
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EducationalTemplate } from '../../framework/components/templates/EducationalTemplate';
import { NavigationControls } from './NavigationControls';
import { AudioControls } from './AudioControls';
import { LayoutManager } from './LayoutManager';
import { VocabularySidebar } from './VocabularySidebar';
import { ConceptsSidebar } from './ConceptsSidebar';
import { renderIcon } from '../../framework/utils/iconRegistry';
import type { PresentationConfig } from '../types/presentation.types';
import type { SlideConfig } from '../../framework/types/slide.types';
import type { AudioConfig } from '../../framework/hooks/useAudio';

export interface ProfessionalPresentationViewerProps {
  presentation: PresentationConfig;
  onPresentationUpdate?: (presentation: PresentationConfig) => void;
  className?: string;
}

interface SidebarState {
  layoutManager: boolean;
  vocabulary: boolean;
  concepts: boolean;
}

export const ProfessionalPresentationViewer: React.FC<ProfessionalPresentationViewerProps> = ({
  presentation,
  onPresentationUpdate,
  className = ''
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [workingPresentation, setWorkingPresentation] = useState(presentation);
  const [sidebars, setSidebars] = useState<SidebarState>({
    layoutManager: true,
    vocabulary: true,
    concepts: true
  });
  
  const currentSlide = workingPresentation.slides[currentSlideIndex];
  const totalSlides = workingPresentation.slides.length;
  
  // Audio configuration for current slide
  const audioConfig: AudioConfig | undefined = currentSlide.audio ? {
    src: currentSlide.audio.src,
    volume: currentSlide.audio.volume || 0.7,
    loop: currentSlide.audio.loop || false,
    autoPlay: false
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

  // Presentation update handler
  const handlePresentationUpdate = useCallback((updatedPresentation: PresentationConfig) => {
    setWorkingPresentation(updatedPresentation);
    onPresentationUpdate?.(updatedPresentation);
  }, [onPresentationUpdate]);

  // Slide update handler
  const handleSlideUpdate = useCallback((updatedSlide: SlideConfig) => {
    const newPresentation = {
      ...workingPresentation,
      slides: workingPresentation.slides.map((slide, index) =>
        index === currentSlideIndex ? updatedSlide : slide
      )
    };
    
    handlePresentationUpdate(newPresentation);
  }, [workingPresentation, currentSlideIndex, handlePresentationUpdate]);

  // Sidebar toggle handlers
  const toggleSidebar = (sidebar: keyof SidebarState) => {
    setSidebars(prev => ({
      ...prev,
      [sidebar]: !prev[sidebar]
    }));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 ${className}`}>
      <div className="h-screen flex flex-col">
        
        {/* Top Bar - Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 p-4 border-b border-white/10 bg-black/20 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            
            {/* Left Side - Presentation Info */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">{workingPresentation.title}</h1>
              <div className="text-sm text-blue-300/60">
                Slide {currentSlideIndex + 1} of {totalSlides}
              </div>
            </div>
            
            {/* Center - Main Controls */}
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
            </div>
            
            {/* Right Side - Panel Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSidebar('layoutManager')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  sidebars.layoutManager
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                title="Toggle Layout Manager"
              >
                {renderIcon('layers', { size: 14 })}
                Layouts
              </button>
              
              <button
                onClick={() => toggleSidebar('vocabulary')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  sidebars.vocabulary
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                title="Toggle Vocabulary Panel"
              >
                {renderIcon('book', { size: 14 })}
                Vocab
              </button>
              
              <button
                onClick={() => toggleSidebar('concepts')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  sidebars.concepts
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                title="Toggle Concepts Panel"
              >
                {renderIcon('lightbulb', { size: 14 })}
                Concepts
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Layout Manager Sidebar */}
          <AnimatePresence>
            {sidebars.layoutManager && (
              <LayoutManager
                presentation={workingPresentation}
                currentSlideIndex={currentSlideIndex}
                onPresentationUpdate={handlePresentationUpdate}
                onSlideSelect={goToSlide}
              />
            )}
          </AnimatePresence>
          
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Canvas - Full Screen ca în Single Slide */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <EducationalTemplate 
                    config={currentSlide}
                    isSlideActive={isPlaying}
                    className="w-full h-full"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Quick Slide Navigation */}
            {totalSlides > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-white/10 bg-black/10"
              >
                <div className="flex justify-center gap-2 flex-wrap max-w-4xl mx-auto">
                  {workingPresentation.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(index)}
                      className={`
                        px-2 py-1 rounded text-xs font-medium transition-all max-w-32 truncate
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
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3 max-w-4xl mx-auto">
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
              </motion.div>
            )}
          </div>
          
          {/* Right Sidebars */}
          <div className="flex">
            {/* Vocabulary Sidebar */}
            <VocabularySidebar
              slide={currentSlide}
              onSlideUpdate={handleSlideUpdate}
              isCollapsed={!sidebars.vocabulary}
              onToggleCollapse={() => toggleSidebar('vocabulary')}
            />
            
            {/* Concepts Sidebar */}
            <ConceptsSidebar
              slide={currentSlide}
              onSlideUpdate={handleSlideUpdate}
              isCollapsed={!sidebars.concepts}
              onToggleCollapse={() => toggleSidebar('concepts')}
            />
          </div>
        </div>
        
        {/* Bottom Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 p-3 border-t border-white/10 bg-black/20 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between text-xs text-white/60">
            
            {/* Left Status */}
            <div className="flex items-center gap-4">
              <span>Theme: {typeof workingPresentation.theme === 'string' ? workingPresentation.theme : 'custom'}</span>
              <span>•</span>
              <span>Aspect: {workingPresentation.aspectRatio}</span>
              <span>•</span>
              <span>v{workingPresentation.version}</span>
            </div>
            
            {/* Center Status */}
            <div className="flex items-center gap-4">
              <span>Vocabulary: {currentSlide.content.vocabulary?.length || 0}</span>
              <span>•</span>
              <span>Concepts: {currentSlide.content.concepts?.length || 0}</span>
              {audioConfig && (
                <>
                  <span>•</span>
                  <span>🎵 Audio: {audioConfig.src}</span>
                </>
              )}
            </div>
            
            {/* Right Status */}
            <div className="flex items-center gap-4">
              <span>Panels: {Object.values(sidebars).filter(Boolean).length}/3</span>
              <span>•</span>
              <span className="text-green-400">Ready for Export</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};