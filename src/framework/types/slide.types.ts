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

// Timing configuration types for carousel system
export interface ElementTiming {
  startTime: number; // milliseconds when highlight should start
  duration: number;  // how long highlight should last
  delay?: number;    // optional delay before starting
}

export interface SlideTiming {
  // Timing for vocabulary section and individual items
  vocabularySection?: ElementTiming;
  vocabulary?: Record<string, ElementTiming>; // keyed by item.id
  
  // Timing for concepts section and individual items  
  conceptsSection?: ElementTiming;
  concepts?: Record<string, ElementTiming>; // keyed by item.id
}

export interface SlideContent {
  vocabulary?: VocabularyItem[];
  concepts?: ConceptItem[];
}

export interface SlideAudio {
  src: string;          // "blockchain-intro.mp3" - will be loaded from /public/audio/
  autoPlay?: boolean;   // Default: false
  loop?: boolean;       // Default: false
  volume?: number;      // 0.0 to 1.0, Default: 0.8
}

export interface SlideConfig {
  id: string;
  template: string;
  content: SlideContent;
  theme: ThemeOrVariant;
  animations?: string;
  timing?: SlideTiming;
  audio?: SlideAudio;
}

export interface SlideProps {
  config: SlideConfig;
  isActive?: boolean;
  className?: string;
} 