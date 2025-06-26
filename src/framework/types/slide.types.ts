/**
 * Core slide configuration types for the Educational Slide Framework
 */

import type { ThemeOrVariant } from './theme.types';

export interface VocabularyItem {
  id: string;
  term: string;
  definition: string;
  icon?: string;
}

export interface ConceptItem {
  id: string;
  text: string;
  icon?: string;
  emphasis?: 'normal' | 'strong' | 'subtle';
}

// New timing configuration types
export interface ElementTiming {
  startTime: number; // milliseconds when highlight should start
  duration: number;  // how long highlight should last
  delay?: number;    // optional delay before starting
}

export interface SlideTiming {
  // Timing for main content sections
  title?: ElementTiming;
  subtitle?: ElementTiming;
  bridgeText?: ElementTiming;
  floatingIcon?: ElementTiming;
  
  // Timing for vocabulary section and individual items
  vocabularySection?: ElementTiming;
  vocabulary?: Record<string, ElementTiming>; // keyed by item.id
  
  // Timing for concepts section and individual items  
  conceptsSection?: ElementTiming;
  concepts?: Record<string, ElementTiming>; // keyed by item.id
}

export interface SlideContent {
  title: string;
  subtitle?: string;
  bridgeText?: string;
  vocabulary?: VocabularyItem[];
  concepts?: ConceptItem[];
  floatingIcon?: string;
}

export interface SlideConfig {
  id: string;
  template: string;
  content: SlideContent;
  theme: ThemeOrVariant;
  animations?: string;
  timing?: SlideTiming; // New optional timing configuration
}

export interface SlideProps {
  config: SlideConfig;
  isActive?: boolean;
  className?: string;
} 