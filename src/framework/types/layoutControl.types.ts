/**
 * Layout Control System Types
 * Defines interfaces for the dynamic layout management and timing control system
 */

import type { LayoutConfig } from './layout.types';

export interface TimingHighlight {
  id: string;
  elementSelector: string;  // CSS selector for the element to highlight
  startTime: number;        // when to start highlight (ms)
  duration: number;         // how long to highlight (ms)
  animationType: 'glow' | 'pulse' | 'scale' | 'border' | 'swirl';
  color?: string;          // highlight color
  intensity?: number;      // highlight intensity (0.1 - 1.0)
}

export interface LayoutTimingConfig {
  layoutId: string;
  highlights: TimingHighlight[];
  totalDuration: number;
  autoAdvance: boolean;
}

export interface ManagedLayoutConfig extends LayoutConfig {
  isEnabled: boolean;
  order: number;
  timingConfig?: LayoutTimingConfig;
  customProperties?: Record<string, any>;
}

export interface LayoutControlState {
  layouts: ManagedLayoutConfig[];
  currentLayoutIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  playbackSpeed: number;
  previewMode: boolean;
}

export interface LayoutControlActions {
  // Layout Management
  addLayout: (layoutConfig: LayoutConfig) => void;
  removeLayout: (layoutId: string) => void;
  reorderLayouts: (fromIndex: number, toIndex: number) => void;
  toggleLayoutEnabled: (layoutId: string) => void;
  updateLayoutDuration: (layoutId: string, duration: number) => void;
  
  // Playback Control
  play: () => void;
  pause: () => void;
  stop: () => void;
  goToLayout: (index: number) => void;
  nextLayout: () => void;
  previousLayout: () => void;
  setPlaybackSpeed: (speed: number) => void;
  
  // Timing Control
  addHighlight: (layoutId: string, highlight: TimingHighlight) => void;
  removeHighlight: (layoutId: string, highlightId: string) => void;
  updateHighlight: (layoutId: string, highlightId: string, updates: Partial<TimingHighlight>) => void;
  triggerHighlight: (layoutId: string, highlightId: string) => void;
  
  // Preview
  enablePreview: () => void;
  disablePreview: () => void;
  previewHighlight: (layoutId: string, highlightId: string) => void;
}

export interface LayoutControlContextValue {
  state: LayoutControlState;
  actions: LayoutControlActions;
  isControllerReady: boolean;
}

export interface LayoutControlPanelProps {
  className?: string;
}

export interface LayoutItemControlProps {
  layout: ManagedLayoutConfig;
  isActive: boolean;
  onSelect: () => void;
} 