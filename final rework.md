# 🎓 Educational Slide Framework - Complete Architecture & Implementation Guide

## 📋 Project Overview & Current State

You are working on an Educational Slide Framework built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion. The current implementation has a beautiful single-slide demo with glassmorphism effects, 3D animations, and a 4-column grid layout. 

**Your mission**: Refactor the codebase to support multi-slide presentations while preserving ALL current visual functionality. The framework must support navigation, audio synchronization, and export to standalone HTML/CSS/JS.

### 🎯 Critical Requirements
1. **DO NOT BREAK** the current visual design - it must look EXACTLY the same
2. Add multi-slide support with navigation controls
3. Audio synchronization with pause/resume functionality (animations freeze on pause)
4. Export capability for standalone presentations
5. Three control panels: top (slide list), left (main content), right (sidebar)
6. Canvas area (16:9) contains everything that gets exported
7. Slide management: add, delete, reorder slides
8. Export entire presentation as standalone web app

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              SlideListBar (Top) - Add/Delete/Reorder             │
├─────────────────┬────────────────────────────┬─────────────────┤
│ LeftControlPanel│      CanvasArea (16:9)      │RightControlPanel│
│                 │  ┌─────────────────────┐   │                 │
│ Layout Controls │  │ NavigationControls   │   │ Sidebar Editor  │
│                 │  └─────────────────────┘   │                 │
│                 │  ┌─────────────────────┐   │                 │
│                 │  │                     │   │                 │
│                 │  │   MainContent       │   │                 │
│                 │  │   + Sidebar         │   │                 │
│                 │  │                     │   │                 │
│                 │  └─────────────────────┘   │                 │
└─────────────────┴────────────────────────────┴─────────────────┘
```

## 📁 Complete File Structure

```bash
src/
├── presentation/                    # NEW - Multi-slide system
│   ├── types/
│   │   ├── presentation.types.ts   # Core presentation types
│   │   ├── navigation.types.ts     # Navigation state types
│   │   └── export.types.ts         # Export configuration
│   ├── contexts/
│   │   ├── PresentationContext.tsx # Global presentation state
│   │   └── NavigationContext.tsx   # Navigation state management
│   ├── components/
│   │   ├── PresentationView.tsx    # Root component (replaces App)
│   │   ├── SlideListBar.tsx       # Top control bar with CRUD
│   │   ├── NavigationControls.tsx  # Play/pause/next/prev
│   │   ├── CanvasArea.tsx         # Exportable canvas wrapper
│   │   └── ExportDialog.tsx       # Export configuration UI
│   ├── hooks/
│   │   ├── usePresentation.ts     # Presentation state hook
│   │   ├── useNavigation.ts       # Navigation logic
│   │   ├── useAudioSync.ts        # Audio synchronization
│   │   ├── useSlideManager.ts     # Add/delete/reorder slides
│   │   └── useProgress.ts         # Progress & cookies
│   ├── utils/
│   │   ├── exportPresentation.ts   # Export functionality
│   │   ├── presentationLoader.ts   # Load/save presentations
│   │   ├── audioController.ts      # Audio control class
│   │   └── slideTemplates.ts       # Default slide templates
│   └── configs/
│       └── defaultPresentation.ts  # Default presentation config
│
├── framework/                       # EXISTING - Refactor carefully
│   ├── components/
│   │   ├── Canvas.tsx              # NEW - Extract canvas wrapper
│   │   ├── templates/              # KEEP - EducationalTemplate
│   │   ├── sections/               # REFACTOR - Simplify MainContent
│   │   ├── controls/               # RENAME from layoutControl
│   │   └── editor/                 # KEEP - Sidebar editor
│   ├── layouts/
│   │   ├── LayoutManager.tsx       # NEW - Centralized layout control
│   │   ├── layouts/                # Individual layout components
│   │   └── transitions/            # Layout transition animations
│   └── systems/
│       ├── theme.system.ts         # KEEP as-is
│       ├── animation.system.ts     # KEEP as-is
│       ├── icon.system.ts          # KEEP as-is
│       └── audio.system.ts         # NEW - Audio controller
│
├── slides/                         # KEEP - Individual slide configs
└── App.tsx                        # REPLACE with PresentationView
```

## 🔧 Core Type Definitions

### 1. Presentation Types (`presentation.types.ts`)

```typescript
// Core presentation configuration
export interface PresentationConfig {
  id: string;
  title: string;
  description?: string;
  theme: string; // 'dark-blue' | 'purple-cosmic' | etc.
  slides: SlideConfig[];
  settings: PresentationSettings;
  metadata: PresentationMetadata;
  version: string;
}

export interface PresentationSettings {
  aspectRatio: '16:9' | '4:3';
  defaultTransition: 'fade' | 'slide' | '3d-rotate';
  autoPlayDelay?: number;
  loopPresentation?: boolean;
  showProgress?: boolean;
  enableKeyboardNav?: boolean;
}

export interface PresentationMetadata {
  author?: string;
  createdAt: string;
  lastModified: string;
  duration?: number; // Total duration in ms
  tags?: string[];
}

// Enhanced slide configuration with audio and layout timing
export interface SlideConfig {
  id: string;
  order: number;
  template: 'educational'; // For now, only educational
  theme?: string; // Override presentation theme
  audio: AudioConfig;
  content: SlideContent;
  layouts: LayoutSequence[];
  timing: SlideTiming;
  transition?: SlideTransition;
}

export interface AudioConfig {
  src: string;
  duration: number;
  volume?: number;
  startTime?: number; // Offset in ms
}

export interface LayoutSequence {
  layoutType: 'definition' | 'properties-grid' | 'comparison' | string;
  startTime: number;
  duration: number;
  content: LayoutContent;
  animation?: LayoutAnimation;
}

export interface SlideTransition {
  type: 'fade' | 'slide' | '3d-rotate' | 'zoom';
  duration: number;
  easing?: string;
}
```

### 2. Navigation Types (`navigation.types.ts`)

```typescript
export interface NavigationState {
  isPlaying: boolean;
  currentSlideIndex: number;
  currentTime: number;      // Time within current slide
  slideStartTime: number;   // When slide started playing
  totalElapsedTime: number; // Total presentation time
  playbackRate: number;     // 1.0 = normal speed
}

export interface NavigationControls {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (slideIndex: number, time?: number) => void;
  seekToTime: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
}

export interface ProgressState {
  slideProgress: number;    // 0-100% for current slide
  totalProgress: number;    // 0-100% for entire presentation
  currentSlideTime: string; // "00:45"
  totalTime: string;        // "12:30"
  slidesCompleted: number[];
}
```

### 3. Export Types (`export.types.ts`)

```typescript
export interface ExportOptions {
  format: 'html-bundle' | 'video' | 'pdf';
  quality: 'low' | 'medium' | 'high';
  includeAssets: boolean;
  embedAudio: boolean;
  embedFonts: boolean;
  minify: boolean;
  offlineSupport: boolean;
}

export interface ExportBundle {
  files: ExportFile[];
  manifest: ExportManifest;
  size: number;
}

export interface ExportFile {
  path: string;
  content: string | Uint8Array;
  type: 'html' | 'css' | 'js' | 'audio' | 'asset';
}

export interface ExportManifest {
  version: string;
  created: string;
  presentation: string;
  totalSlides: number;
  duration: number;
  files: string[];
}
```

## 🧩 Core Components Implementation

### 1. PresentationContext (`PresentationContext.tsx`)

```typescript
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { PresentationConfig, SlideConfig } from '../types/presentation.types';

interface PresentationState {
  presentation: PresentationConfig | null;
  currentSlideIndex: number;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean; // Has unsaved changes
}

interface PresentationContextValue extends PresentationState {
  // Actions
  loadPresentation: (config: PresentationConfig) => void;
  updateSlide: (slideId: string, updates: Partial<SlideConfig>) => void;
  addSlide: (slide: SlideConfig, index?: number) => void;
  deleteSlide: (slideId: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  duplicateSlide: (slideId: string) => void;
  savePresentation: () => Promise<void>;
  exportPresentation: (options: ExportOptions) => Promise<ExportBundle>;
}

const PresentationContext = createContext<PresentationContextValue | null>(null);

// Reducer for complex state management
type PresentationAction =
  | { type: 'LOAD_PRESENTATION'; payload: PresentationConfig }
  | { type: 'UPDATE_SLIDE'; payload: { slideId: string; updates: Partial<SlideConfig> } }
  | { type: 'ADD_SLIDE'; payload: { slide: SlideConfig; index?: number } }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'REORDER_SLIDES'; payload: { from: number; to: number } }
  | { type: 'SET_CURRENT_SLIDE'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_DIRTY'; payload: boolean };

function presentationReducer(
  state: PresentationState,
  action: PresentationAction
): PresentationState {
  switch (action.type) {
    case 'LOAD_PRESENTATION':
      return {
        ...state,
        presentation: action.payload,
        currentSlideIndex: 0,
        isDirty: false,
        error: null,
      };

    case 'UPDATE_SLIDE': {
      if (!state.presentation) return state;
      
      const slides = state.presentation.slides.map(slide =>
        slide.id === action.payload.slideId
          ? { ...slide, ...action.payload.updates }
          : slide
      );
      
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        isDirty: true,
      };
    }

    case 'ADD_SLIDE': {
      if (!state.presentation) return state;
      
      const { slide, index } = action.payload;
      const slides = [...state.presentation.slides];
      const insertIndex = index ?? slides.length;
      
      // Update order for all slides
      slides.splice(insertIndex, 0, slide);
      slides.forEach((s, i) => { s.order = i; });
      
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        isDirty: true,
      };
    }

    case 'DELETE_SLIDE': {
      if (!state.presentation) return state;
      
      const slides = state.presentation.slides.filter(s => s.id !== action.payload);
      slides.forEach((s, i) => { s.order = i; });
      
      // Adjust current slide if needed
      const newIndex = Math.min(state.currentSlideIndex, slides.length - 1);
      
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        currentSlideIndex: newIndex,
        isDirty: true,
      };
    }

    case 'REORDER_SLIDES': {
      if (!state.presentation) return state;
      
      const slides = [...state.presentation.slides];
      const [removed] = slides.splice(action.payload.from, 1);
      slides.splice(action.payload.to, 0, removed);
      slides.forEach((s, i) => { s.order = i; });
      
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        isDirty: true,
      };
    }

    default:
      return state;
  }
}

export const PresentationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(presentationReducer, {
    presentation: null,
    currentSlideIndex: 0,
    isLoading: false,
    error: null,
    isDirty: false,
  });

  // Action implementations
  const loadPresentation = useCallback((config: PresentationConfig) => {
    dispatch({ type: 'LOAD_PRESENTATION', payload: config });
  }, []);

  const addSlide = useCallback((slide: SlideConfig, index?: number) => {
    dispatch({ type: 'ADD_SLIDE', payload: { slide, index } });
  }, []);

  const deleteSlide = useCallback((slideId: string) => {
    if (state.presentation?.slides.length === 1) {
      dispatch({ type: 'SET_ERROR', payload: 'Cannot delete the last slide' });
      return;
    }
    dispatch({ type: 'DELETE_SLIDE', payload: slideId });
  }, [state.presentation]);

  const reorderSlides = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_SLIDES', payload: { from: fromIndex, to: toIndex } });
  }, []);

  const duplicateSlide = useCallback((slideId: string) => {
    if (!state.presentation) return;
    
    const slide = state.presentation.slides.find(s => s.id === slideId);
    if (!slide) return;
    
    const newSlide: SlideConfig = {
      ...slide,
      id: `${slide.id}-copy-${Date.now()}`,
      order: slide.order + 1,
    };
    
    addSlide(newSlide, slide.order + 1);
  }, [state.presentation, addSlide]);

  // Export function
  const exportPresentation = useCallback(async (options: ExportOptions) => {
    if (!state.presentation) throw new Error('No presentation to export');
    
    const { exportPresentation: exportFn } = await import('../utils/exportPresentation');
    return exportFn(state.presentation, options);
  }, [state.presentation]);

  const value: PresentationContextValue = {
    ...state,
    loadPresentation,
    updateSlide: (slideId, updates) => 
      dispatch({ type: 'UPDATE_SLIDE', payload: { slideId, updates } }),
    addSlide,
    deleteSlide,
    reorderSlides,
    duplicateSlide,
    savePresentation: async () => {
      // Implement save logic
      dispatch({ type: 'SET_DIRTY', payload: false });
    },
    exportPresentation,
  };

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within PresentationProvider');
  }
  return context;
};
```

### 2. NavigationControls Component (`NavigationControls.tsx`)

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
import { useAudioSync } from '../hooks/useAudioSync';

interface NavigationControlsProps {
  className?: string;
  embedded?: boolean; // true when inside canvas for export
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  className = '',
  embedded = false,
}) => {
  const { 
    isPlaying, 
    currentSlideIndex, 
    totalSlides,
    play, 
    pause, 
    next, 
    previous,
    canGoNext,
    canGoPrevious,
  } = useNavigation();
  
  const { volume, setVolume, isMuted, toggleMute } = useAudioSync();

  const buttonClass = `
    p-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20
    hover:bg-white/20 transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <motion.div
      className={`
        flex items-center gap-2 p-2 rounded-xl
        backdrop-blur-xl bg-slate-900/80 border border-white/10
        ${embedded ? 'shadow-lg' : 'shadow-2xl'}
        ${className}
      `}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Previous button */}
      <button
        onClick={previous}
        disabled={!canGoPrevious}
        className={buttonClass}
        aria-label="Previous slide"
      >
        <SkipBack size={20} className="text-white" />
      </button>

      {/* Play/Pause button */}
      <button
        onClick={isPlaying ? pause : play}
        className={`${buttonClass} px-3`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause size={20} className="text-white" />
        ) : (
          <Play size={20} className="text-white" />
        )}
      </button>

      {/* Next button */}
      <button
        onClick={next}
        disabled={!canGoNext}
        className={buttonClass}
        aria-label="Next slide"
      >
        <SkipForward size={20} className="text-white" />
      </button>

      {/* Slide counter */}
      <div className="px-3 text-sm text-white/80">
        {currentSlideIndex + 1} / {totalSlides}
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-2 ml-2">
        <button
          onClick={toggleMute}
          className={buttonClass}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <Volume2 
            size={18} 
            className={`text-white ${isMuted ? 'opacity-50' : ''}`} 
          />
        </button>
        
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume * 100}
          onChange={(e) => setVolume(Number(e.target.value) / 100)}
          className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          aria-label="Volume"
        />
      </div>

      {/* Progress bar */}
      <div className="flex-1 max-w-xs ml-4">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentSlideIndex / totalSlides) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
```

### 3. SlideListBar Component (`SlideListBar.tsx`)

```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Trash2, Copy, Download, GripVertical } from 'lucide-react';
import { usePresentation } from '../hooks/usePresentation';
import { createDefaultSlide } from '../utils/slideTemplates';

export const SlideListBar: React.FC = () => {
  const {
    presentation,
    currentSlideIndex,
    addSlide,
    deleteSlide,
    duplicateSlide,
    reorderSlides,
    exportPresentation,
  } = usePresentation();

  const [showExportDialog, setShowExportDialog] = useState(false);

  if (!presentation) return null;

  const handleAddSlide = () => {
    const newSlide = createDefaultSlide(presentation.slides.length);
    addSlide(newSlide);
  };

  const handleReorder = (newOrder: typeof presentation.slides) => {
    // Find what moved
    const oldOrder = presentation.slides;
    let fromIndex = -1;
    let toIndex = -1;

    for (let i = 0; i < newOrder.length; i++) {
      if (newOrder[i].id !== oldOrder[i].id) {
        const movedSlide = newOrder[i];
        fromIndex = oldOrder.findIndex(s => s.id === movedSlide.id);
        toIndex = i;
        break;
      }
    }

    if (fromIndex !== -1 && toIndex !== -1) {
      reorderSlides(fromIndex, toIndex);
    }
  };

  return (
    <motion.div
      className="w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Presentation title */}
        <h1 className="text-xl font-semibold text-white">
          {presentation.title}
        </h1>

        {/* Slide thumbnails - scrollable */}
        <div className="flex-1 overflow-x-auto">
          <Reorder.Group
            axis="x"
            values={presentation.slides}
            onReorder={handleReorder}
            className="flex gap-3 p-1"
          >
            <AnimatePresence mode="popLayout">
              {presentation.slides.map((slide, index) => (
                <Reorder.Item
                  key={slide.id}
                  value={slide}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1 }}
                >
                  <motion.div
                    className={`
                      relative w-32 h-20 rounded-lg overflow-hidden cursor-pointer
                      border-2 transition-all duration-200
                      ${index === currentSlideIndex 
                        ? 'border-blue-400 shadow-lg shadow-blue-400/30' 
                        : 'border-white/20 hover:border-white/40'
                      }
                    `}
                    layoutId={`slide-thumb-${slide.id}`}
                  >
                    {/* Thumbnail preview */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 p-2">
                      <div className="text-xs text-white/80 truncate">
                        {slide.content.title}
                      </div>
                      <div className="text-[10px] text-white/60 mt-1">
                        Slide {index + 1}
                      </div>
                    </div>

                    {/* Drag handle */}
                    <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical size={14} className="text-white/60" />
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateSlide(slide.id);
                        }}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Duplicate slide"
                      >
                        <Copy size={12} className="text-white" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSlide(slide.id);
                        }}
                        className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
                        aria-label="Delete slide"
                        disabled={presentation.slides.length === 1}
                      >
                        <Trash2 size={12} className="text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={handleAddSlide}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-blue-500/20 hover:bg-blue-500/30
              border border-blue-400/50 text-blue-300
              transition-all duration-200
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            Add Slide
          </motion.button>

          <motion.button
            onClick={() => setShowExportDialog(true)}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-green-500/20 hover:bg-green-500/30
              border border-green-400/50 text-green-300
              transition-all duration-200
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={18} />
            Export
          </motion.button>
        </div>
      </div>

      {/* Export dialog */}
      {showExportDialog && (
        <ExportDialog onClose={() => setShowExportDialog(false)} />
      )}
    </motion.div>
  );
};
```

### 4. Canvas Component (`Canvas.tsx`)

```typescript
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavigationControls } from '../../presentation/components/NavigationControls';
import { EducationalTemplate } from './templates/EducationalTemplate';
import type { SlideConfig } from '../types/slide.types';

interface CanvasProps {
  slide: SlideConfig;
  isPlaying: boolean;
  currentTime: number;
  showNavigation?: boolean;
  onTimeUpdate?: (time: number) => void;
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  slide,
  isPlaying,
  currentTime,
  showNavigation = true,
  onTimeUpdate,
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // This is the exportable area
  useEffect(() => {
    if (canvasRef.current) {
      // Mark this element for export
      canvasRef.current.setAttribute('data-export-root', 'true');
    }
  }, []);

  return (
    <div
      ref={canvasRef}
      className={`
        relative w-full aspect-video bg-gradient-to-br 
        from-blue-900 via-blue-800 to-indigo-900
        rounded-2xl overflow-hidden shadow-2xl
        ${className}
      `}
      data-slide-id={slide.id}
    >
      {/* Navigation controls - embedded in canvas for export */}
      {showNavigation && (
        <NavigationControls
          className="absolute top-4 left-4 z-50"
          embedded={true}
        />
      )}

      {/* The actual slide content */}
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <EducationalTemplate
          config={slide}
          isSlideActive={isPlaying}
          currentTime={currentTime}
          onTimeUpdate={onTimeUpdate}
        />
      </motion.div>

      {/* Progress overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
          style={{
            width: `${(currentTime / slide.audio.duration) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
```

### 5. Audio Sync Hook (`useAudioSync.ts`)

```typescript
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePresentation } from './usePresentation';
import { useNavigation } from './useNavigation';

interface AudioSyncState {
  isLoaded: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
}

export const useAudioSync = () => {
  const { presentation, currentSlideIndex } = usePresentation();
  const { isPlaying, pause } = useNavigation();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();
  
  const [state, setState] = useState<AudioSyncState>({
    isLoaded: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
    isMuted: false,
  });

  const currentSlide = presentation?.slides[currentSlideIndex];

  // Load audio when slide changes
  useEffect(() => {
    if (!currentSlide?.audio.src) return;

    const audio = new Audio(currentSlide.audio.src);
    audioRef.current = audio;

    audio.volume = state.isMuted ? 0 : state.volume;
    
    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        isLoaded: true,
        duration: audio.duration * 1000, // Convert to ms
      }));
    };

    const handleEnded = () => {
      pause();
      // Optionally auto-advance to next slide
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.src = '';
    };
  }, [currentSlide?.audio.src]);

  // Play/pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.isLoaded) return;

    if (isPlaying) {
      audio.play().catch(console.error);
      startTimeTracking();
    } else {
      audio.pause();
      stopTimeTracking();
    }
  }, [isPlaying, state.isLoaded]);

  // Time tracking for animations
  const startTimeTracking = useCallback(() => {
    const updateTime = () => {
      const audio = audioRef.current;
      if (!audio) return;

      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime * 1000, // Convert to ms
      }));

      animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    updateTime();
  }, []);

  const stopTimeTracking = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Volume control
  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
    setState(prev => ({ ...prev, volume, isMuted: false }));
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    setState(prev => {
      const newMuted = !prev.isMuted;
      if (audio) {
        audio.volume = newMuted ? 0 : prev.volume;
      }
      return { ...prev, isMuted: newMuted };
    });
  }, []);

  // Seek functionality
  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio && state.isLoaded) {
      audio.currentTime = time / 1000; // Convert from ms
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, [state.isLoaded]);

  return {
    ...state,
    setVolume,
    toggleMute,
    seekTo,
    audioElement: audioRef.current,
  };
};

```

### 6. Export Functionality (`exportPresentation.ts`)

```typescript
import type { PresentationConfig, ExportOptions, ExportBundle } from '../types';

export async function exportPresentation(
  presentation: PresentationConfig,
  options: ExportOptions
): Promise<ExportBundle> {
  const files: ExportFile[] = [];
  
  // Generate HTML
  const html = generateHTML(presentation, options);
  files.push({
    path: 'index.html',
    content: html,
    type: 'html',
  });

  // Generate CSS (extract from Tailwind)
  const css = await generateCSS(presentation, options);
  files.push({
    path: 'styles.css',
    content: css,
    type: 'css',
  });

  // Generate JavaScript runtime
  const js = generateJavaScript(presentation, options);
  files.push({
    path: 'app.js',
    content: js,
    type: 'js',
  });

  // Copy audio files
  for (const slide of presentation.slides) {
    if (slide.audio.src) {
      const audioData = await fetchAudioFile(slide.audio.src);
      files.push({
        path: `audio/slide-${slide.id}.mp3`,
        content: audioData,
        type: 'audio',
      });
    }
  }

  // Create manifest
  const manifest = {
    version: '1.0.0',
    created: new Date().toISOString(),
    presentation: presentation.title,
    totalSlides: presentation.slides.length,
    duration: calculateTotalDuration(presentation),
    files: files.map(f => f.path),
  };

  return {
    files,
    manifest,
    size: calculateBundleSize(files),
  };
}

function generateHTML(presentation: PresentationConfig, options: ExportOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${presentation.title}</title>
    <link rel="stylesheet" href="styles.css">
    <style>
      /* Critical inline styles for immediate render */
      body { margin: 0; padding: 0; background: #0f172a; }
      #root { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
      .canvas-container { width: 100%; max-width: 1920px; aspect-ratio: 16/9; }
    </style>
</head>
<body>
    <div id="root">
        <div class="canvas-container" data-export-root="true">
            <!-- Navigation Controls -->
            <div class="navigation-controls"></div>
            
            <!-- Slide Container -->
            <div class="slide-container"></div>
            
            <!-- Progress Bar -->
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
    </div>
    
    <!-- Presentation Data -->
    <script type="application/json" id="presentation-data">
        ${JSON.stringify(presentation, null, options.minify ? 0 : 2)}
    </script>
    
    <!-- Runtime -->
    <script src="app.js"></script>
</body>
</html>`;
}

function generateJavaScript(presentation: PresentationConfig, options: ExportOptions): string {
  return `
// Educational Slide Framework - Standalone Runtime
(function() {
  'use strict';
  
  // State
  let currentSlideIndex = 0;
  let isPlaying = false;
  let currentAudio = null;
  let animationFrame = null;
  let startTime = 0;
  let pausedTime = 0;
  
  // Get presentation data
  const presentationData = JSON.parse(
    document.getElementById('presentation-data').textContent
  );
  
  // Initialize
  function init() {
    setupNavigationControls();
    loadSlide(0);
    setupKeyboardControls();
    restoreProgress();
  }
  
  // Navigation controls
  function setupNavigationControls() {
    const navContainer = document.querySelector('.navigation-controls');
    navContainer.innerHTML = \`
      <div class="nav-controls">
        <button id="prev-btn" aria-label="Previous slide">
          <svg><!-- Skip back icon --></svg>
        </button>
        <button id="play-pause-btn" aria-label="Play">
          <svg><!-- Play icon --></svg>
        </button>
        <button id="next-btn" aria-label="Next slide">
          <svg><!-- Skip forward icon --></svg>
        </button>
        <span class="slide-counter">1 / \${presentationData.slides.length}</span>
      </div>
    \`;
    
    // Add event listeners
    document.getElementById('prev-btn').addEventListener('click', previousSlide);
    document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
    document.getElementById('next-btn').addEventListener('click', nextSlide);
  }
  
  // Slide management
  function loadSlide(index) {
    currentSlideIndex = index;
    const slide = presentationData.slides[index];
    
    // Update UI
    renderSlide(slide);
    updateSlideCounter();
    
    // Load audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    
    if (slide.audio.src) {
      currentAudio = new Audio(\`audio/slide-\${slide.id}.mp3\`);
      currentAudio.addEventListener('ended', handleAudioEnded);
    }
    
    // Save progress
    saveProgress();
  }
  
  // Animation system
  function startAnimations(slide) {
    startTime = performance.now() - pausedTime;
    
    function animate() {
      const elapsed = performance.now() - startTime;
      
      // Update layout based on timing
      updateLayout(slide, elapsed);
      
      // Update sidebar highlights
      updateHighlights(slide, elapsed);
      
      // Update progress bar
      updateProgressBar(elapsed, slide.audio.duration);
      
      if (isPlaying) {
        animationFrame = requestAnimationFrame(animate);
      }
    }
    
    animate();
  }
  
  // Layout updates
  function updateLayout(slide, elapsed) {
    const activeLayout = slide.layouts.find(layout => 
      elapsed >= layout.startTime && 
      elapsed < layout.startTime + layout.duration
    );
    
    if (activeLayout) {
      // Apply layout changes
      document.querySelector('.main-content').setAttribute('data-layout', activeLayout.layoutType);
    }
  }
  
  // Play/Pause
  function togglePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }
  
  function play() {
    isPlaying = true;
    if (currentAudio) currentAudio.play();
    startAnimations(presentationData.slides[currentSlideIndex]);
    updatePlayButton();
  }
  
  function pause() {
    isPlaying = false;
    if (currentAudio) currentAudio.pause();
    pausedTime = performance.now() - startTime;
    cancelAnimationFrame(animationFrame);
    updatePlayButton();
  }
  
  // Navigation
  function nextSlide() {
    if (currentSlideIndex < presentationData.slides.length - 1) {
      loadSlide(currentSlideIndex + 1);
      if (isPlaying) play();
    }
  }
  
  function previousSlide() {
    if (currentSlideIndex > 0) {
      loadSlide(currentSlideIndex - 1);
      if (isPlaying) play();
    }
  }
  
  // Keyboard controls
  function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case 'ArrowLeft':
          previousSlide();
          break;
      }
    });
  }
  
  // Progress persistence
  function saveProgress() {
    localStorage.setItem('presentation-progress', JSON.stringify({
      slideIndex: currentSlideIndex,
      timestamp: Date.now()
    }));
  }
  
  function restoreProgress() {
    const saved = localStorage.getItem('presentation-progress');
    if (saved) {
      const progress = JSON.parse(saved);
      loadSlide(progress.slideIndex);
    }
  }
  
  // Initialize on load
  document.addEventListener('DOMContentLoaded', init);
})();
`;
}

// Helper to generate CSS
async function generateCSS(presentation: PresentationConfig, options: ExportOptions): Promise<string> {
  // This would extract all used Tailwind classes and generate minimal CSS
  // For now, return a placeholder
  return `
/* Educational Slide Framework - Exported Styles */

/* Reset and base styles */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* Glassmorphism effects */
.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

/* Layout styles */
.slide-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

/* Add all necessary styles... */
`;
}

```

### 7. Layout Manager (`LayoutManager.tsx`)

```typescript
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LayoutSequence, SlideContent } from '../types';
import { 
  DefinitionLayout,
  PropertiesGridLayout,
  ComparisonLayout,
  // Add more layouts as needed
} from './layouts';

interface LayoutManagerProps {
  content: SlideContent;
  layouts: LayoutSequence[];
  currentTime: number;
  isActive: boolean;
  className?: string;
}

const layoutComponents = {
  'definition': DefinitionLayout,
  'properties-grid': PropertiesGridLayout,
  'comparison': ComparisonLayout,
  // Register new layouts here
};

export const LayoutManager: React.FC<LayoutManagerProps> = ({
  content,
  layouts,
  currentTime,
  isActive,
  className = '',
}) => {
  // Determine active layout based on current time
  const activeLayout = useMemo(() => {
    if (!isActive || !layouts.length) return null;
    
    return layouts.find(layout => {
      const endTime = layout.startTime + layout.duration;
      return currentTime >= layout.startTime && currentTime < endTime;
    }) || layouts[0]; // Default to first layout
  }, [layouts, currentTime, isActive]);

  if (!activeLayout) return null;

  const LayoutComponent = layoutComponents[activeLayout.layoutType];
  if (!LayoutComponent) {
    console.warn(`Unknown layout type: ${activeLayout.layoutType}`);
    return null;
  }

  // Calculate progress within current layout
  const layoutProgress = Math.min(
    (currentTime - activeLayout.startTime) / activeLayout.duration,
    1
  );

  return (
    <div className={`layout-manager h-full ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeLayout.layoutType}-${activeLayout.startTime}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="h-full"
        >
          <LayoutComponent
            content={{
              ...content,
              ...activeLayout.content, // Merge layout-specific content
            }}
            progress={layoutProgress}
            animation={activeLayout.animation}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

```

### 8. Export Dialog Component (`ExportDialog.tsx`)

```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Settings } from 'lucide-react';
import { usePresentation } from '../hooks/usePresentation';
import type { ExportOptions } from '../types/export.types';

interface ExportDialogProps {
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ onClose }) => {
  const { exportPresentation } = usePresentation();
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'html-bundle',
    quality: 'high',
    includeAssets: true,
    embedAudio: true,
    embedFonts: true,
    minify: false,
    offlineSupport: true,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const bundle = await exportPresentation(options);
      downloadBundle(bundle);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadBundle = (bundle: ExportBundle) => {
    // Create a zip file or download individual files
    // For simplicity, we'll create a blob and download
    const htmlFile = bundle.files.find(f => f.type === 'html');
    if (htmlFile) {
      const blob = new Blob([htmlFile.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presentation.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Download size={24} />
            Export Presentation
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-white/60" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {/* Format selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Export Format
            </label>
            <select
              value={options.format}
              onChange={(e) => setOptions({ ...options, format: e.target.value as any })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="html-bundle">HTML Bundle (Recommended)</option>
              <option value="video" disabled>Video (Coming Soon)</option>
              <option value="pdf" disabled>PDF (Coming Soon)</option>
            </select>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Quality
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((quality) => (
                <button
                  key={quality}
                  onClick={() => setOptions({ ...options, quality })}
                  className={`
                    flex-1 py-2 rounded-lg capitalize transition-all
                    ${options.quality === quality
                      ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                      : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
                    }
                  `}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>

          {/* Options toggles */}
          <div className="space-y-2">
            {[
              { key: 'embedAudio', label: 'Embed Audio Files' },
              { key: 'embedFonts', label: 'Embed Fonts' },
              { key: 'minify', label: 'Minify Code' },
              { key: 'offlineSupport', label: 'Offline Support' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key as keyof ExportOptions] as boolean}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="w-4 h-4 rounded bg-white/10 border-white/20"
                />
                <span className="text-sm text-white/80">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`
            w-full py-3 rounded-lg font-medium transition-all
            ${isExporting
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
            }
          `}
        >
          {isExporting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
              Exporting...
            </span>
          ) : (
            'Export Presentation'
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

```

### 9. Slide Templates (`slideTemplates.ts`)

```typescript
import { v4 as uuidv4 } from 'uuid';
import type { SlideConfig } from '../types/presentation.types';

export function createDefaultSlide(order: number): SlideConfig {
  const id = uuidv4();
  
  return {
    id,
    order,
    template: 'educational',
    audio: {
      src: '', // User needs to add audio
      duration: 30000, // Default 30 seconds
    },
    content: {
      title: `Slide ${order + 1} Title`,
      subtitle: 'Add your subtitle here',
      bridgeText: 'This connects to what we learned...',
      vocabulary: [
        {
          id: `${id}-vocab-1`,
          term: 'Term 1',
          definition: 'Definition for term 1',
          icon: 'book',
        },
      ],
      concepts: [
        {
          id: `${id}-concept-1`,
          title: 'Key Concept',
          description: 'Explain the concept here',
          icon: 'lightbulb',
          emphasis: 'normal',
        },
      ],
    },
    layouts: [
      {
        layoutType: 'definition',
        startTime: 0,
        duration: 10000,
        content: {
          mainIcon: 'presentation',
        },
      },
      {
        layoutType: 'properties-grid',
        startTime: 10000,
        duration: 10000,
        content: {},
      },
      {
        layoutType: 'comparison',
        startTime: 20000,
        duration: 10000,
        content: {},
      },
    ],
    timing: {
      title: { startTime: 0, duration: 2000 },
      subtitle: { startTime: 500, duration: 2000 },
      vocabulary: {},
      concepts: {},
    },
    transition: {
      type: 'fade',
      duration: 500,
    },
  };
}

export function duplicateSlide(slide: SlideConfig): SlideConfig {
  return {
    ...slide,
    id: uuidv4(),
    content: {
      ...slide.content,
      vocabulary: slide.content.vocabulary?.map(v => ({
        ...v,
        id: uuidv4(),
      })),
      concepts: slide.content.concepts?.map(c => ({
        ...c,
        id: uuidv4(),
      })),
    },
  };
}

```

### 10. PresentationView - Root Component (`PresentationView.tsx`)

```typescript
import React, { useEffect } from 'react';
import { PresentationProvider } from '../contexts/PresentationContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { SlideListBar } from './SlideListBar';
import { CanvasArea } from './CanvasArea';
import { LayoutControlPanel } from '../../framework/components/layoutControl';
import { SidebarEditorPanel } from '../../framework/components/editor';
import { defaultPresentation } from '../configs/defaultPresentation';

export const PresentationView: React.FC = () => {
  return (
    <PresentationProvider>
      <NavigationProvider>
        <div className="min-h-screen bg-slate-950 flex flex-col">
          {/* Top bar with slide management */}
          <SlideListBar />
          
          {/* Main content area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left control panel */}
            <div className="w-80 border-r border-white/10 bg-slate-900/50">
              <LayoutControlPanel />
            </div>
            
            {/* Canvas area (exportable) */}
            <div className="flex-1 p-8 flex items-center justify-center">
              <CanvasArea />
            </div>
            
            {/* Right control panel */}
            <div className="w-80 border-l border-white/10 bg-slate-900/50">
              <SidebarEditorPanel />
            </div>
          </div>
        </div>
      </NavigationProvider>
    </PresentationProvider>
  );
};

```

## 🚀 Implementation Steps - Detailed Action Plan

### Step 1: Initial Setup (1-2 hours)
1. Create the `presentation/` folder structure
2. Copy all type definitions from this guide
3. Create context providers (PresentationContext, NavigationContext)
4. Create basic hooks (usePresentation, useNavigation)
5. Test that existing app still works

### Step 2: Navigation Implementation (2-3 hours)
1. Build NavigationControls component
2. Implement play/pause logic with audio sync
3. Add keyboard controls
4. Create progress tracking with cookies
5. Test navigation between mock slides

### Step 3: Slide Management (2-3 hours)
1. Create SlideListBar with drag-and-drop
2. Implement add/delete/duplicate functions
3. Add slide reordering
4. Create slide templates
5. Test CRUD operations

### Step 4: Canvas Extraction (2-3 hours)
1. Extract Canvas component from current code
2. Ensure it's self-contained for export
3. Embed NavigationControls
4. Test that visuals remain identical
5. Add export markers

### Step 5: Layout System Refactor (3-4 hours)
1. Create LayoutManager component
2. Extract individual layout components
3. Implement timing-based transitions
4. Test with multiple layout sequences
5. Ensure smooth animations

### Step 6: Audio System (2-3 hours)
1. Create AudioController class
2. Implement useAudioSync hook
3. Connect to animation timing
4. Add pause/resume with state freeze
5. Test synchronization

### Step 7: Export Implementation (3-4 hours)
1. Create export utility functions
2. Generate standalone HTML/CSS/JS
3. Bundle assets and audio
4. Test exported presentations
5. Add export UI dialog

### Step 8: Integration & Testing (2-3 hours)
1. Replace App.tsx with PresentationView
2. Load default presentation
3. Test all features together
4. Fix any integration issues
5. Performance optimization

## ⚠️ Critical Preservation Checklist

Before making ANY changes, ensure:

- [ ] Current demo still displays correctly
- [ ] All animations work (3D, glassmorphism, floating)
- [ ] Theme system intact (all 5 themes)
- [ ] Icon registry working (30+ icons)
- [ ] Layout cycling functional
- [ ] Editor panels operational
- [ ] Hot reload on current slide

## 🐛 Common Pitfalls & Solutions

### Problem 1: Animations break when refactoring
**Solution**: Keep all Framer Motion variants and animation configs exactly as they are. Only change component structure.

### Problem 2: Tailwind classes not working
**Solution**: Ensure you're using Tailwind v3 (not v4 beta). Keep all existing class names.

### Problem 3: Audio sync issues
**Solution**: Use requestAnimationFrame for smooth timing. Always convert between ms and seconds correctly.

### Problem 4: Export breaks styling
**Solution**: Extract all critical CSS. Use inline styles for essential layout. Test in isolation.

### Problem 5: State management complexity
**Solution**: Use React Context wisely. Keep local state where possible. Only lift state when necessary.

## 📝 Testing Checklist

After each major step, verify:

- [ ] Visual appearance unchanged
- [ ] Animations smooth (60fps)
- [ ] Audio plays/pauses correctly
- [ ] Navigation works (next/prev/keyboard)
- [ ] Slides can be added/deleted/reordered
- [ ] Export generates valid HTML
- [ ] No console errors
- [ ] Hot reload still works

## 🎯 Success Criteria

The refactor is complete when:

1. **Multi-slide presentations work** with smooth navigation
2. **Audio synchronizes perfectly** with animations
3. **Export produces standalone presentations** that work offline
4. **All current visual features preserved** exactly
5. **Code is more modular** and easier to extend
6. **Performance remains excellent** (60fps, fast hot reload)

---

## 🔥 Final Notes for AI Agent

Remember:
- **DO NOT BREAK THE CURRENT DESIGN** - it must look identical
- Test frequently - after every significant change
- Keep the existing file structure where possible
- Use TypeScript strictly - no `any` types
- Preserve all animations and effects
- Make commits after each successful step

Start with Step 1 and proceed methodically. Good luck! 🚀
}