/**
 * Single Slide Editor Component
 * Editor pentru UN SINGUR SLIDE cu layout cycling și editare completă
 * Păstrează funcționalitatea din single slide view + editare
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EducationalTemplate } from '../../framework/components/templates/EducationalTemplate';
import { renderIcon } from '../../framework/utils/iconRegistry';
import type { SlideConfig, VocabularyItem, ConceptItem } from '../../framework/types/slide.types';

export interface SingleSlideEditorProps {
  initialSlide: SlideConfig;
  onSlideUpdate?: (slide: SlideConfig) => void;
  className?: string;
}

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export const SingleSlideEditor: React.FC<SingleSlideEditorProps> = ({
  initialSlide,
  onSlideUpdate,
  className = ''
}) => {
  const [slide, setSlide] = useState<SlideConfig>(initialSlide);
  const [isPlaying, setIsPlaying] = useState(true); // Pentru layout cycling
  const [showEditor, setShowEditor] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const iconOptions = [
    'lightbulb', 'book', 'cpu', 'trending-up', 'zap', 'star', 
    'target', 'globe', 'lock', 'shield', 'database', 'code',
    'briefcase', 'users', 'settings', 'chart-bar'
  ];

  // Update slide and notify parent
  const updateSlide = useCallback((updates: Partial<SlideConfig>) => {
    const newSlide = { ...slide, ...updates };
    setSlide(newSlide);
    onSlideUpdate?.(newSlide);
  }, [slide, onSlideUpdate]);

  // Update content within slide
  const updateContent = useCallback((updates: Partial<typeof slide.content>) => {
    updateSlide({
      content: { ...slide.content, ...updates }
    });
  }, [slide.content, updateSlide]);

  // Vocabulary management
  const addVocabularyItem = useCallback(() => {
    const newItem: VocabularyItem = {
      id: `vocab-${Date.now()}`,
      term: 'Termen nou',
      definition: 'Definiție nouă...',
      icon: 'book'
    };
    
    updateContent({
      vocabulary: [...(slide.content.vocabulary || []), newItem]
    });
  }, [slide.content.vocabulary, updateContent]);

  const updateVocabularyItem = useCallback((id: string, updates: Partial<VocabularyItem>) => {
    updateContent({
      vocabulary: slide.content.vocabulary?.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    });
  }, [slide.content.vocabulary, updateContent]);

  const removeVocabularyItem = useCallback((id: string) => {
    updateContent({
      vocabulary: slide.content.vocabulary?.filter(item => item.id !== id)
    });
  }, [slide.content.vocabulary, updateContent]);

  // Concepts management
  const addConceptItem = useCallback(() => {
    const newItem: ConceptItem = {
      id: `concept-${Date.now()}`,
      text: 'Concept nou...',
      icon: 'lightbulb',
      emphasis: 'normal'
    };
    
    updateContent({
      concepts: [...(slide.content.concepts || []), newItem]
    });
  }, [slide.content.concepts, updateContent]);

  const updateConceptItem = useCallback((id: string, updates: Partial<ConceptItem>) => {
    updateContent({
      concepts: slide.content.concepts?.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    });
  }, [slide.content.concepts, updateContent]);

  const removeConceptItem = useCallback((id: string) => {
    updateContent({
      concepts: slide.content.concepts?.filter(item => item.id !== id)
    });
  }, [slide.content.concepts, updateContent]);

  // Audio management
  const handleAudioFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      updateSlide({
        audio: {
          src: audioUrl,
          volume: audioState.volume,
          loop: false
        }
      });
      
      // Load audio to get duration
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        setAudioState(prev => ({ ...prev, duration: audio.duration }));
      });
    }
  }, [audioState.volume, updateSlide]);

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (audioState.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  }, [audioState.isPlaying]);

  const handleVolumeChange = useCallback((volume: number) => {
    setAudioState(prev => ({ ...prev, volume }));
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (slide.audio) {
      updateSlide({
        audio: { ...slide.audio, volume }
      });
    }
  }, [slide.audio, updateSlide]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Set audio volume when it changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioState.volume;
    }
  }, [audioState.volume]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 ${className}`}>
      <div className="h-screen flex">
        
        {/* Main Slide Area - Full Screen ca în Single Slide */}
        <div className="flex-1 relative">
          {/* Control Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between"
          >
            {/* Layout Cycling Control */}
            <div className="flex items-center gap-3">
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
            </div>

            {/* Audio Controls */}
            {slide.audio && (
              <div className="flex items-center gap-3 bg-black/50 backdrop-blur-lg rounded-lg p-3">
                <button
                  onClick={toggleAudio}
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  {renderIcon(audioState.isPlaying ? 'pause' : 'play', { size: 14, className: 'text-white' })}
                </button>
                
                <div className="flex items-center gap-2">
                  {renderIcon('volume-2', { size: 12, className: 'text-white' })}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={audioState.volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16"
                  />
                </div>
                
                <span className="text-white text-xs">
                  {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
                </span>
              </div>
            )}

            {/* Editor Toggle */}
            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                showEditor
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {renderIcon('edit-3', { size: 14 })}
              Editor
            </button>
          </motion.div>

          {/* Educational Template - Full Screen */}
          <EducationalTemplate 
            config={slide}
            isSlideActive={isPlaying}
            className="w-full h-full"
          />

          {/* Hidden Audio Element */}
          {slide.audio && (
            <audio
              ref={audioRef}
              src={slide.audio.src}
              onTimeUpdate={(e) => setAudioState(prev => ({ 
                ...prev, 
                currentTime: (e.target as HTMLAudioElement).currentTime 
              }))}
              onLoadedMetadata={(e) => setAudioState(prev => ({ 
                ...prev, 
                duration: (e.target as HTMLAudioElement).duration 
              }))}
              onPlay={() => setAudioState(prev => ({ ...prev, isPlaying: true }))}
              onPause={() => setAudioState(prev => ({ ...prev, isPlaying: false }))}
            />
          )}
        </div>

        {/* Editor Panel */}
        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl overflow-y-auto"
            >
              <div className="p-4">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  {renderIcon('edit-3', { size: 18, className: 'text-blue-400' })}
                  Slide Editor
                </h2>

                {/* Main Content Section */}
                <div className="space-y-4">
                  <button
                    onClick={() => toggleSection('main')}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-white flex items-center gap-2">
                      {renderIcon('type', { size: 16, className: 'text-blue-400' })}
                      Conținut Principal
                    </span>
                    {renderIcon(expandedSection === 'main' ? 'chevron-down' : 'chevron-right', 
                      { size: 16, className: 'text-slate-400' })}
                  </button>

                  <AnimatePresence>
                    {expandedSection === 'main' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pl-4"
                      >
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Title:</label>
                          <input
                            type="text"
                            value={slide.content.title}
                            onChange={(e) => updateContent({ title: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>

                        {/* Subtitle */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Subtitle:</label>
                          <input
                            type="text"
                            value={slide.content.subtitle || ''}
                            onChange={(e) => updateContent({ subtitle: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>

                        {/* Bridge Text */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Bridge Text:</label>
                          <textarea
                            value={slide.content.bridgeText || ''}
                            onChange={(e) => updateContent({ bridgeText: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                            rows={3}
                          />
                        </div>

                        {/* Floating Icon */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Floating Icon:</label>
                          <div className="grid grid-cols-8 gap-2">
                            {iconOptions.map(icon => (
                              <button
                                key={icon}
                                onClick={() => updateContent({ floatingIcon: icon })}
                                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                                  slide.content.floatingIcon === icon
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                              >
                                {renderIcon(icon, { size: 14 })}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Audio Section */}
                <div className="space-y-4 mt-6">
                  <button
                    onClick={() => toggleSection('audio')}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-white flex items-center gap-2">
                      {renderIcon('volume-2', { size: 16, className: 'text-purple-400' })}
                      Audio
                    </span>
                    {renderIcon(expandedSection === 'audio' ? 'chevron-down' : 'chevron-right', 
                      { size: 16, className: 'text-slate-400' })}
                  </button>

                  <AnimatePresence>
                    {expandedSection === 'audio' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pl-4"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioFileSelect}
                          className="hidden"
                        />
                        
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full bg-purple-600/80 hover:bg-purple-500 text-white py-2 px-3 rounded-md text-sm transition-all flex items-center justify-center gap-2"
                        >
                          {renderIcon('upload', { size: 14 })}
                          {slide.audio ? 'Schimbă Audio' : 'Adaugă Audio'}
                        </button>

                        {slide.audio && (
                          <div className="text-xs text-slate-400">
                            Audio încărcat: {slide.audio.src.split('/').pop()}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Vocabulary Section */}
                <div className="space-y-4 mt-6">
                  <button
                    onClick={() => toggleSection('vocabulary')}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-white flex items-center gap-2">
                      {renderIcon('book', { size: 16, className: 'text-amber-400' })}
                      Vocabular ({slide.content.vocabulary?.length || 0})
                    </span>
                    {renderIcon(expandedSection === 'vocabulary' ? 'chevron-down' : 'chevron-right', 
                      { size: 16, className: 'text-slate-400' })}
                  </button>

                  <AnimatePresence>
                    {expandedSection === 'vocabulary' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pl-4"
                      >
                        <button
                          onClick={addVocabularyItem}
                          className="w-full bg-green-600/80 hover:bg-green-500 text-white py-2 px-3 rounded-md text-sm transition-all flex items-center justify-center gap-2"
                        >
                          {renderIcon('plus', { size: 14 })}
                          Adaugă Termen
                        </button>

                        {slide.content.vocabulary?.map((item, index) => (
                          <div key={item.id} className="bg-slate-800/30 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-amber-300">#{index + 1}</span>
                              <button
                                onClick={() => removeVocabularyItem(item.id)}
                                className="w-6 h-6 bg-red-600/80 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
                              >
                                {renderIcon('trash-2', { size: 12, className: 'text-white' })}
                              </button>
                            </div>
                            
                            <input
                              type="text"
                              value={item.term}
                              onChange={(e) => updateVocabularyItem(item.id, { term: e.target.value })}
                              className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                              placeholder="Termen..."
                            />
                            
                            <textarea
                              value={item.definition}
                              onChange={(e) => updateVocabularyItem(item.id, { definition: e.target.value })}
                              className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-sm text-white resize-none"
                              rows={2}
                              placeholder="Definiție..."
                            />

                            <div className="grid grid-cols-8 gap-1">
                              {iconOptions.slice(0, 8).map(icon => (
                                <button
                                  key={icon}
                                  onClick={() => updateVocabularyItem(item.id, { icon })}
                                  className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                                    item.icon === icon
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  }`}
                                >
                                  {renderIcon(icon, { size: 10 })}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Concepts Section */}
                <div className="space-y-4 mt-6 pb-6">
                  <button
                    onClick={() => toggleSection('concepts')}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-white flex items-center gap-2">
                      {renderIcon('lightbulb', { size: 16, className: 'text-green-400' })}
                      Concepte ({slide.content.concepts?.length || 0})
                    </span>
                    {renderIcon(expandedSection === 'concepts' ? 'chevron-down' : 'chevron-right', 
                      { size: 16, className: 'text-slate-400' })}
                  </button>

                  <AnimatePresence>
                    {expandedSection === 'concepts' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pl-4"
                      >
                        <button
                          onClick={addConceptItem}
                          className="w-full bg-green-600/80 hover:bg-green-500 text-white py-2 px-3 rounded-md text-sm transition-all flex items-center justify-center gap-2"
                        >
                          {renderIcon('plus', { size: 14 })}
                          Adaugă Concept
                        </button>

                        {slide.content.concepts?.map((item, index) => (
                          <div key={item.id} className="bg-slate-800/30 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-300">#{index + 1}</span>
                              <button
                                onClick={() => removeConceptItem(item.id)}
                                className="w-6 h-6 bg-red-600/80 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
                              >
                                {renderIcon('trash-2', { size: 12, className: 'text-white' })}
                              </button>
                            </div>
                            
                            <textarea
                              value={item.text}
                              onChange={(e) => updateConceptItem(item.id, { text: e.target.value })}
                              className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-sm text-white resize-none"
                              rows={2}
                              placeholder="Text concept..."
                            />

                            <select
                              value={item.emphasis || 'normal'}
                              onChange={(e) => updateConceptItem(item.id, { emphasis: e.target.value as 'normal' | 'strong' | 'subtle' })}
                              className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                            >
                              <option value="normal">Normal</option>
                              <option value="strong">Strong</option>
                              <option value="subtle">Subtle</option>
                            </select>

                            <div className="grid grid-cols-8 gap-1">
                              {iconOptions.slice(0, 8).map(icon => (
                                <button
                                  key={icon}
                                  onClick={() => updateConceptItem(item.id, { icon })}
                                  className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                                    item.icon === icon
                                      ? 'bg-green-600 text-white'
                                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  }`}
                                >
                                  {renderIcon(icon, { size: 10 })}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};