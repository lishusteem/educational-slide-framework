/**
 * Presentation Types for Multi-Slide Educational Framework
 * Builds on existing slide configuration while adding presentation-level management
 */

import type { SlideConfig } from '../../framework/types/slide.types';

// Presentation Configuration
export interface PresentationConfig {
  id: string;
  title: string;
  description?: string;
  author?: string;
  version: string;
  theme: 'dark-blue' | 'purple-cosmic' | 'green-nature' | 'orange-energy' | 'minimal-light';
  aspectRatio: '16:9' | '4:3' | '1:1';
  totalDuration?: number; // ms, calculated from slides
  slides: SlideConfig[];
  settings: PresentationSettings;
}

// Presentation Settings
export interface PresentationSettings {
  autoPlay: boolean;
  loop: boolean;
  showProgress: boolean;
  showNavigation: boolean;
  allowUserControl: boolean;
  transitionDuration: number; // ms between slides
  globalAudio?: {
    backgroundMusic?: string;
    volume: number;
  };
}

// Navigation State for Current Presentation
export interface NavigationState {
  currentSlideIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;        // Current time within active slide (ms)
  slideStartTime: number;     // When current slide started (ms)
  totalElapsed: number;       // Total time since presentation start (ms)
  progress: number;           // Overall progress percentage (0-100)
}

// Canvas Export Configuration
export interface CanvasExportConfig {
  width: number;
  height: number;
  includeNavigation: boolean;
  includeAudio: boolean;
  quality: 'low' | 'medium' | 'high';
  format: 'html' | 'video' | 'images';
}

// Slide Thumbnail for Navigation
export interface SlideThumb {
  id: string;
  index: number;
  title: string;
  duration: number;
  thumbnail?: string; // Base64 or URL
  isActive: boolean;
  isCompleted: boolean;
}

// Editor State per Slide
export interface SlideEditorState {
  slideId: string;
  isEditing: boolean;
  isDirty: boolean;
  lastModified: number;
  vocabulary: {
    maxItems: number;
    fontSize: number;
    items: any[]; // Will use existing VocabularyItem type
  };
  concepts: {
    maxItems: number;
    fontSize: number; 
    items: any[]; // Will use existing ConceptItem type
  };
  layout: {
    currentLayout: string;
    customTimings: any; // Will use existing timing types
  };
}

// Presentation Context State
export interface PresentationContextState {
  // Core State
  config: PresentationConfig;
  navigation: NavigationState;
  editors: { [slideId: string]: SlideEditorState };
  
  // UI State
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Control Methods
  loadPresentation: (config: PresentationConfig) => void;
  addSlide: (slideConfig: SlideConfig, index?: number) => void;
  removeSlide: (slideId: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  duplicateSlide: (slideId: string) => void;
  
  // Navigation Methods
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  
  // Editor Methods
  updateSlideEditor: (slideId: string, editorState: Partial<SlideEditorState>) => void;
  resetSlideEditor: (slideId: string) => void;
  
  // Export Methods
  exportPresentation: (config: CanvasExportConfig) => Promise<Blob>;
  generateThumbnails: () => Promise<void>;
}