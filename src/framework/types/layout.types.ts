/**
 * Layout System Types for MainContent
 * Defines the modular layout architecture for different content presentations
 */

import type { SlideContent, SlideTiming } from './slide.types';

export interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  duration: number; // how long this layout should be displayed (ms)
  component: string; // component identifier for the layout registry
}

export interface LayoutTiming {
  startTime: number;
  duration: number;
  transitions?: {
    enter?: number;
    exit?: number;
  };
}

export interface LayoutSystemConfig {
  layouts: LayoutConfig[];
  autoAdvance: boolean;
  timing?: Record<string, LayoutTiming>; // keyed by layout.id
}

export interface BaseLayoutProps {
  content: SlideContent;
  className?: string;
  slideTiming?: SlideTiming;
  isSlideActive?: boolean;
  layoutTiming?: LayoutTiming;
}

export interface LayoutSystemState {
  currentLayoutIndex: number;
  currentLayout: LayoutConfig | null;
  isTransitioning: boolean;
  progress: number;
  totalLayouts: number;
} 