/**
 * Presentation configuration type definitions for the Educational Slide Framework
 */

import type { SlideConfig } from './slide.types';

export interface PresentationSettings {
  autoAdvance: boolean;
  autoAdvanceDelay?: number;
  controls: boolean;
  fullscreenOnStart?: boolean;
  showProgress?: boolean;
  allowKeyboardNavigation?: boolean;
  loop?: boolean;
}

export interface PresentationConfig {
  id: string;
  title: string;
  description?: string;
  author?: string;
  slides: SlideConfig[];
  settings: PresentationSettings;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
    category?: string;
    duration?: number;
  };
}

export interface PresentationState {
  currentSlideIndex: number;
  isPlaying: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  startTime?: Date;
  totalSlides: number;
}

export interface NavigationDirection {
  direction: 'next' | 'previous' | 'goto';
  targetIndex?: number;
} 