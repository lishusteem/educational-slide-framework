/**
 * Professional Presentation Viewer
 * Ultimate multi-panel editor with layout manager, canvas, and area-specific sidebars
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EducationalTemplate } from '../../framework/components/templates/EducationalTemplate';
import { NavigationControls } from './NavigationControls';
import { AudioControls } from './AudioControls';

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
  const [isPlaying, setIsPlaying] = useState(true); // Layout cycling pentru UN SLIDE
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
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                title="Toggle Audio & Timing Controls"
              >
                {renderIcon('clock', { size: 14 })}
                Timing
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
          
          {/* Audio Controls Sidebar */}
          <AnimatePresence>
            {sidebars.layoutManager && (
              <AudioAndTimingControls
                slide={currentSlide}
                onSlideUpdate={handleSlideUpdate}
                audioConfig={audioConfig}
                isPlaying={isPlaying}
                currentTime={currentTime}
              />
            )}
          </AnimatePresence>
          
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Single Slide cu Layout Cycling */}
            <div className="flex-1 relative">
              {/* Layout Cycling Toggle */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-4 z-50"
              >
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isPlaying
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-red-600 text-white shadow-lg'
                  }`}
                >
                  {renderIcon(isPlaying ? 'pause' : 'play', { size: 14 })}
                  {isPlaying ? 'Layout Cycling ON' : 'Layout Cycling OFF'}
                </button>
              </motion.div>

              {/* Educational Template - UN SINGUR SLIDE cu layout cycling */}
              <EducationalTemplate 
                config={currentSlide}
                isSlideActive={isPlaying}
                className="w-full h-full"
              />
            </div>

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

// Audio and Timing Controls Component
const AudioAndTimingControls: React.FC<{
  slide: SlideConfig;
  onSlideUpdate: (slide: SlideConfig) => void;
  audioConfig?: AudioConfig;
  isPlaying: boolean;
  currentTime: number;
}> = ({ slide, onSlideUpdate, audioConfig, isPlaying, currentTime }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('main');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateSlideContent = (updates: Partial<typeof slide.content>) => {
    onSlideUpdate({
      ...slide,
      content: { ...slide.content, ...updates }
    });
  };

  const updateSlideTiming = (updates: Partial<typeof slide.timing>) => {
    onSlideUpdate({
      ...slide,
      timing: { ...slide.timing, ...updates }
    });
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const audioUrl = URL.createObjectURL(file);
      onSlideUpdate({
        ...slide,
        audio: {
          src: audioUrl,
          volume: 0.7,
          loop: false
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-purple-900/95 backdrop-blur-xl border-r border-purple-700/50 shadow-2xl overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-purple-700/50 bg-gradient-to-r from-purple-600/20 to-indigo-600/20">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          {renderIcon('clock', { size: 18, className: 'text-purple-400' })}
          Audio & Timing Controls
        </h3>
        <p className="text-purple-200 text-sm mt-1">
          Control audio and timing for all elements
        </p>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Audio Section */}
        <div className="space-y-4">
          <button
            onClick={() => toggleSection('audio')}
            className="w-full flex items-center justify-between p-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg transition-colors"
          >
            <span className="font-medium text-white flex items-center gap-2">
              {renderIcon('volume-2', { size: 16, className: 'text-purple-400' })}
              Audio Controls
            </span>
            {renderIcon(expandedSection === 'audio' ? 'chevron-down' : 'chevron-right', 
              { size: 16, className: 'text-purple-400' })}
          </button>

          <AnimatePresence>
            {expandedSection === 'audio' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pl-4"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-purple-600/80 hover:bg-purple-500 text-white py-2 px-3 rounded-md text-sm transition-all flex items-center justify-center gap-2"
                >
                  {renderIcon('upload', { size: 14 })}
                  {slide.audio ? 'Change Audio' : 'Upload Audio'}
                </button>

                {audioFile && (
                  <div className="text-xs text-purple-300">
                    File: {audioFile.name}
                  </div>
                )}

                {audioConfig && (
                  <div className="space-y-2">
                    <div className="text-xs text-purple-300">
                      Status: {isPlaying ? 'Playing' : 'Paused'}
                    </div>
                    <div className="text-xs text-purple-300">
                      Time: {Math.floor(currentTime)}s
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content Timing */}
        <div className="space-y-4">
          <button
            onClick={() => toggleSection('main')}
            className="w-full flex items-center justify-between p-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg transition-colors"
          >
            <span className="font-medium text-white flex items-center gap-2">
              {renderIcon('type', { size: 16, className: 'text-purple-400' })}
              Main Content Timing
            </span>
            {renderIcon(expandedSection === 'main' ? 'chevron-down' : 'chevron-right', 
              { size: 16, className: 'text-purple-400' })}
          </button>

          <AnimatePresence>
            {expandedSection === 'main' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pl-4"
              >
                {/* Title Timing */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">Title:</label>
                  <input
                    type="text"
                    value={slide.content.title}
                    onChange={(e) => updateSlideContent({ title: e.target.value })}
                    className="w-full bg-purple-800/30 border border-purple-600/50 rounded-md px-3 py-2 text-white mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                                         <div>
                       <label className="block text-xs text-purple-300 mb-1">Start Time (ms):</label>
                       <input
                         type="number"
                         value={slide.timing?.title?.startTime || 0}
                         onChange={(e) => updateSlideTiming({
                           title: { startTime: parseInt(e.target.value) || 0, duration: slide.timing?.title?.duration || 2000, delay: slide.timing?.title?.delay || 0 }
                         })}
                         className="w-full bg-purple-800/30 border border-purple-600/50 rounded px-2 py-1 text-white text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs text-purple-300 mb-1">Duration (ms):</label>
                       <input
                         type="number"
                         value={slide.timing?.title?.duration || 2000}
                         onChange={(e) => updateSlideTiming({
                           title: { startTime: slide.timing?.title?.startTime || 0, duration: parseInt(e.target.value) || 2000, delay: slide.timing?.title?.delay || 0 }
                         })}
                         className="w-full bg-purple-800/30 border border-purple-600/50 rounded px-2 py-1 text-white text-sm"
                       />
                     </div>
                  </div>
                </div>

                                 {/* Subtitle Timing */}
                 <div>
                   <label className="block text-sm font-medium text-purple-300 mb-1">Subtitle:</label>
                   <input
                     type="text"
                     value={slide.content.subtitle || ''}
                     onChange={(e) => updateSlideContent({ subtitle: e.target.value })}
                     className="w-full bg-purple-800/30 border border-purple-600/50 rounded-md px-3 py-2 text-white mb-2"
                   />
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="block text-xs text-purple-300 mb-1">Start Time (ms):</label>
                       <input
                         type="number"
                         value={slide.timing?.subtitle?.startTime || 500}
                         onChange={(e) => updateSlideTiming({
                           subtitle: { startTime: parseInt(e.target.value) || 500, duration: slide.timing?.subtitle?.duration || 2000, delay: slide.timing?.subtitle?.delay || 0 }
                         })}
                         className="w-full bg-purple-800/30 border border-purple-600/50 rounded px-2 py-1 text-white text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs text-purple-300 mb-1">Duration (ms):</label>
                       <input
                         type="number"
                         value={slide.timing?.subtitle?.duration || 2000}
                         onChange={(e) => updateSlideTiming({
                           subtitle: { startTime: slide.timing?.subtitle?.startTime || 500, duration: parseInt(e.target.value) || 2000, delay: slide.timing?.subtitle?.delay || 0 }
                         })}
                         className="w-full bg-purple-800/30 border border-purple-600/50 rounded px-2 py-1 text-white text-sm"
                       />
                     </div>
                   </div>
                 </div>

                                 {/* Bridge Text Timing */}
                 <div>
                   <label className="block text-sm font-medium text-purple-300 mb-1">Bridge Text:</label>
                   <textarea
                     value={slide.content.bridgeText || ''}
                     onChange={(e) => updateSlideContent({ bridgeText: e.target.value })}
                     className="w-full bg-purple-800/30 border border-purple-600/50 rounded-md px-3 py-2 text-white mb-2 resize-none"
                     rows={3}
                   />
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="block text-xs text-purple-300 mb-1">Start Time (ms):</label>
                       <input
                         type="number"
                         value={slide.timing?.bridgeText?.startTime || 1000}
                         onChange={(e) => updateSlideTiming({
                           bridgeText: { startTime: parseInt(e.target.value) || 1000, duration: slide.timing?.bridgeText?.duration || 3000, delay: slide.timing?.bridgeText?.delay || 0 }
                         })}
                         className="w-full bg-purple-800/30 border border-purple-600/50 rounded px-2 py-1 text-white text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs text-purple-300 mb-1">Duration (ms):</label>
                       <input
                         type="number"
                         value={slide.timing?.bridgeText?.duration || 3000}
                         onChange={(e) => updateSlideTiming({
                           bridgeText: { startTime: slide.timing?.bridgeText?.startTime || 1000, duration: parseInt(e.target.value) || 3000, delay: slide.timing?.bridgeText?.delay || 0 }
                         })}
                         className="w-full bg-purple-800/30 border border-purple-600/50 rounded px-2 py-1 text-white text-sm"
                       />
                     </div>
                   </div>
                 </div>

                {/* Floating Icon */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">Floating Icon:</label>
                  <select
                    value={slide.content.floatingIcon || 'lightbulb'}
                    onChange={(e) => updateSlideContent({ floatingIcon: e.target.value })}
                    className="w-full bg-purple-800/30 border border-purple-600/50 rounded-md px-3 py-2 text-white mb-2"
                  >
                    <option value="lightbulb">Lightbulb</option>
                    <option value="book">Book</option>
                    <option value="cpu">CPU</option>
                    <option value="trending-up">Trending Up</option>
                    <option value="zap">Zap</option>
                    <option value="star">Star</option>
                    <option value="target">Target</option>
                    <option value="globe">Globe</option>
                  </select>
                                     <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="block text-xs text-purple-300 mb-1">Start Time (ms):</label>
                       <input
                         type="number"
                         value={slide.timing?.floatingIcon?.startTime || 1500}
                         onChange={(e) => updateSlideTiming({
                           floatingIcon: { startTime: parseInt(e.target.value) || 1500, duration: slide.timing?.floatingIcon?.duration || 2000, delay: slide.timing?.floatingIcon?.delay || 0 }
                         })}
                         className="w-full bg-purple-800/30 border border-purple-600/50 rounded px-2 py-1 text-white text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs text-purple-300 mb-1">Duration (ms):</label>
                       <input
                         type="number"
                         value={slide.timing?.floatingIcon?.duration || 2000}
                         onChange={(e) => updateSlideTiming({
                           floatingIcon: { startTime: slide.timing?.floatingIcon?.startTime || 1500, duration: parseInt(e.target.value) || 2000, delay: slide.timing?.floatingIcon?.delay || 0 }
                         })}
                         className="w-full bg-purple-800/30 border border-purple-600/50 rounded px-2 py-1 text-white text-sm"
                       />
                     </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Layout Cycling Settings */}
        <div className="space-y-4">
          <button
            onClick={() => toggleSection('layout')}
            className="w-full flex items-center justify-between p-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg transition-colors"
          >
            <span className="font-medium text-white flex items-center gap-2">
              {renderIcon('refresh-cw', { size: 16, className: 'text-purple-400' })}
              Layout Cycling
            </span>
            {renderIcon(expandedSection === 'layout' ? 'chevron-down' : 'chevron-right', 
              { size: 16, className: 'text-purple-400' })}
          </button>

          <AnimatePresence>
            {expandedSection === 'layout' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pl-4"
              >
                                 <div>
                   <label className="block text-sm font-medium text-purple-300 mb-1">Vocabulary Section Start (ms):</label>
                   <input
                     type="number"
                     value={slide.timing?.vocabularySection?.startTime || 0}
                     onChange={(e) => updateSlideTiming({
                       vocabularySection: { startTime: parseInt(e.target.value) || 0, duration: slide.timing?.vocabularySection?.duration || 4000, delay: slide.timing?.vocabularySection?.delay || 0 }
                     })}
                     className="w-full bg-purple-800/30 border border-purple-600/50 rounded-md px-3 py-2 text-white"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-purple-300 mb-1">Concepts Section Start (ms):</label>
                   <input
                     type="number"
                     value={slide.timing?.conceptsSection?.startTime || 0}
                     onChange={(e) => updateSlideTiming({
                       conceptsSection: { startTime: parseInt(e.target.value) || 0, duration: slide.timing?.conceptsSection?.duration || 4000, delay: slide.timing?.conceptsSection?.delay || 0 }
                     })}
                     className="w-full bg-purple-800/30 border border-purple-600/50 rounded-md px-3 py-2 text-white"
                   />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};