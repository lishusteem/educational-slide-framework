/**
 * Unified Animation System
 * Replaces both carouselSystem.ts and timingSystem.ts with single coherent system
 * Preserves 100% of visual behavior while simplifying architecture
 */

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import type { VocabularyItem, ConceptItem, SlideTiming } from '../framework/types/slide.types';

// Unified animation configuration types
export interface LayoutTiming {
  id: string;
  startTime: number;    // When to show (ms from start)
  duration: number;     // How long to show (ms)
  component: string;    // Component identifier
  content?: any;        // Content data for the layout
}

export interface HighlightTiming {
  elementId: string;
  startTime: number;    // When to highlight (ms from start)  
  duration: number;     // How long to highlight (ms)
  type?: 'vocabulary' | 'concept' | 'section' | 'element';
}

export interface UnifiedAnimationConfig {
  layouts: LayoutTiming[];
  highlights: HighlightTiming[];
  isSlideActive?: boolean;
  autoStart?: boolean;
}

export interface UnifiedAnimationState {
  // Layout state (replaces carousel system)
  currentLayout: LayoutTiming | null;
  currentLayoutIndex: number;
  totalLayouts: number;
  progress: number;
  isTransitioning: boolean;
  
  // Highlight state (replaces timing system)
  activeHighlights: Set<string>;
  
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  startTime: number | null;
  
  // Control methods
  play: () => void;
  pause: () => void;
  reset: () => void;
  goToTime: (time: number) => void;
  goToLayout: (index: number) => void;
}

/**
 * Unified Animation Hook
 * Single system managing both layout transitions AND highlights
 */
export const useUnifiedAnimation = ({
  layouts,
  highlights,
  isSlideActive = true,
  autoStart = true
}: UnifiedAnimationConfig): UnifiedAnimationState => {
  
  // Core state
  const [currentLayoutIndex, setCurrentLayoutIndex] = useState(0);
  const [activeHighlights, setActiveHighlights] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Refs for cleanup
  const timeoutRefs = useRef<Set<number>>(new Set());
  const animationFrameRef = useRef<number | null>(null);
  
  // Clear all timeouts helper
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current.clear();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);
  
  // Calculate current layout
  const currentLayout = useMemo(() => {
    return layouts[currentLayoutIndex] || null;
  }, [layouts, currentLayoutIndex]);
  
  // Calculate progress
  const progress = useMemo(() => {
    if (layouts.length === 0) return 0;
    return ((currentLayoutIndex + 1) / layouts.length) * 100;
  }, [layouts.length, currentLayoutIndex]);
  
  // Update current time and trigger transitions
  const updateAnimation = useCallback((newTime: number) => {
    setCurrentTime(newTime);
    
    // Update current layout based on time
    const newLayoutIndex = layouts.findIndex((layout, index) => {
      const nextLayout = layouts[index + 1];
      return newTime >= layout.startTime && (!nextLayout || newTime < nextLayout.startTime);
    });
    
    if (newLayoutIndex !== -1 && newLayoutIndex !== currentLayoutIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentLayoutIndex(newLayoutIndex);
        setIsTransitioning(false);
      }, 100); // Brief transition delay
    }
    
    // Update active highlights
    const newActiveHighlights = new Set<string>();
    highlights.forEach(highlight => {
      const endTime = highlight.startTime + highlight.duration;
      if (newTime >= highlight.startTime && newTime < endTime) {
        newActiveHighlights.add(highlight.elementId);
      }
    });
    
    setActiveHighlights(newActiveHighlights);
  }, [layouts, highlights, currentLayoutIndex]);
  
  // Animation loop
  const animationLoop = useCallback(() => {
    if (!isPlaying || !startTime) return;
    
    const elapsed = Date.now() - startTime;
    updateAnimation(elapsed);
    
    // Continue animation if still playing
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    }
  }, [isPlaying, startTime, updateAnimation]);
  
  // Control methods
  const play = useCallback(() => {
    if (!isSlideActive) return;
    
    setIsPlaying(true);
    if (!startTime) {
      setStartTime(Date.now() - currentTime);
    }
  }, [isSlideActive, startTime, currentTime]);
  
  const pause = useCallback(() => {
    setIsPlaying(false);
    clearAllTimeouts();
  }, [clearAllTimeouts]);
  
  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentLayoutIndex(0);
    setActiveHighlights(new Set());
    setStartTime(null);
    clearAllTimeouts();
  }, [clearAllTimeouts]);
  
  const goToTime = useCallback((time: number) => {
    setCurrentTime(time);
    updateAnimation(time);
    if (isPlaying) {
      setStartTime(Date.now() - time);
    }
  }, [updateAnimation, isPlaying]);
  
  const goToLayout = useCallback((index: number) => {
    const targetLayout = layouts[index];
    if (targetLayout) {
      goToTime(targetLayout.startTime);
    }
  }, [layouts, goToTime]);
  
  // Auto-start effect
  useEffect(() => {
    if (isSlideActive && autoStart && !isPlaying && !startTime) {
      play();
    } else if (!isSlideActive) {
      pause();
    }
  }, [isSlideActive, autoStart, isPlaying, startTime, play, pause]);
  
  // Animation loop effect
  useEffect(() => {
    if (isPlaying && startTime) {
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, startTime, animationLoop]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);
  
  return {
    // Layout state
    currentLayout,
    currentLayoutIndex,
    totalLayouts: layouts.length,
    progress,
    isTransitioning,
    
    // Highlight state
    activeHighlights,
    
    // Playback state
    isPlaying,
    currentTime,
    startTime,
    
    // Control methods
    play,
    pause,
    reset,
    goToTime,
    goToLayout
  };
};

/**
 * Helper function to convert old carousel + timing configs to unified config
 */
export const createUnifiedConfig = (
  vocabularyItems: VocabularyItem[],
  conceptItems: ConceptItem[],
  slideTiming?: SlideTiming
): UnifiedAnimationConfig => {
  const layouts: LayoutTiming[] = [];
  const highlights: HighlightTiming[] = [];
  
  // Create intro layout
  layouts.push({
    id: 'intro',
    startTime: 0,
    duration: 4000,
    component: 'intro',
    content: {
      title: 'Explorăm Conceptele',
      subtitle: 'Să înțelegem pas cu pas elementele fundamentale',
      description: 'Urmărește cum fiecare termen și concept se conectează pentru a forma imaginea completă a blockchain-ului.',
      icon: 'lightbulb',
      type: 'intro'
    }
  });
  
  let currentTime = 4000;
  
  // Add vocabulary layouts
  vocabularyItems.forEach((item, _index) => {
    const timing = slideTiming?.vocabulary?.[item.id];
    const duration = timing?.duration || 3000;
    
    layouts.push({
      id: item.id,
      startTime: currentTime,
      duration,
      component: 'vocabulary',
      content: {
        title: item.term,
        subtitle: 'Termen Vocabular',
        description: item.definition,
        icon: item.icon || 'book',
        type: 'vocabulary'
      }
    });
    
    // Add corresponding highlight
    highlights.push({
      elementId: item.id,
      startTime: currentTime,
      duration,
      type: 'vocabulary'
    });
    
    currentTime += duration;
  });
  
  // Add concept layouts
  conceptItems.forEach((item, _index) => {
    const timing = slideTiming?.concepts?.[item.id];
    const duration = timing?.duration || 3000;
    
    layouts.push({
      id: item.id,
      startTime: currentTime,
      duration,
      component: 'concept',
      content: {
        title: item.text,
        subtitle: 'Concept Cheie',
        description: generateConceptDescription(item),
        icon: item.icon || 'zap',
        type: 'concept'
      }
    });
    
    // Add corresponding highlight
    highlights.push({
      elementId: item.id,
      startTime: currentTime,
      duration,
      type: 'concept'
    });
    
    currentTime += duration;
  });
  
  // Add outro layout
  layouts.push({
    id: 'outro',
    startTime: currentTime,
    duration: 5000,
    component: 'outro',
    content: {
      title: 'Sinteza Completă',
      subtitle: 'Toate elementele se unesc',
      description: 'Acum înțelegi cum vocabularul și conceptele formează ecosistemul blockchain complet și funcțional.',
      icon: 'check-circle',
      type: 'outro'
    }
  });
  
  // Add section highlights if configured
  if (slideTiming?.vocabularySection) {
    highlights.push({
      elementId: 'vocabularySection',
      startTime: slideTiming.vocabularySection.startTime,
      duration: slideTiming.vocabularySection.duration,
      type: 'section'
    });
  }
  
  if (slideTiming?.conceptsSection) {
    highlights.push({
      elementId: 'conceptsSection',
      startTime: slideTiming.conceptsSection.startTime,
      duration: slideTiming.conceptsSection.duration,
      type: 'section'
    });
  }
  
  // Add element highlights (title, subtitle, etc.)
  if (slideTiming?.title) {
    highlights.push({
      elementId: 'title',
      startTime: slideTiming.title.startTime,
      duration: slideTiming.title.duration,
      type: 'element'
    });
  }
  
  if (slideTiming?.subtitle) {
    highlights.push({
      elementId: 'subtitle',
      startTime: slideTiming.subtitle.startTime,
      duration: slideTiming.subtitle.duration,
      type: 'element'
    });
  }
  
  if (slideTiming?.bridgeText) {
    highlights.push({
      elementId: 'bridgeText',
      startTime: slideTiming.bridgeText.startTime,
      duration: slideTiming.bridgeText.duration,
      type: 'element'
    });
  }
  
  if (slideTiming?.floatingIcon) {
    highlights.push({
      elementId: 'floatingIcon',
      startTime: slideTiming.floatingIcon.startTime,
      duration: slideTiming.floatingIcon.duration,
      type: 'element'
    });
  }
  
  return { layouts, highlights };
};

// Helper function for concept descriptions (preserved from carouselSystem.ts)
function generateConceptDescription(concept: ConceptItem): string {
  const descriptions: Record<string, string> = {
    'decentralization': 'În blockchain, descentralizarea înseamnă că nu există o autoritate centrală care să controleze rețeaua. Datele sunt distribuite pe mii de noduri, fiecare având o copie completă a registrului.',
    'immutability': 'Odată ce o tranzacție este confirmată și adăugată în blockchain, aceasta nu mai poate fi modificată sau ștearsă. Această caracteristică asigură integritatea permanentă a datelor.',
    'transparency': 'Toate tranzacțiile din blockchain sunt vizibile public și pot fi verificate de oricine. Această transparență completă creează încredere fără nevoia unei autorități centrale.',
    'security': 'Securitatea blockchain-ului provine din criptografia avansată și din natura distribuită a rețelei. Pentru a compromiete sistemul, ar trebui atacate simultan peste 51% din noduri.',
    'consensus': 'Mecanismele de consens asigură că toate nodurile din rețea sunt de acord asupra stării curente a blockchain-ului, fără să fie nevoie de o autoritate centrală de validare.',
    'hash': 'Hash-ul este un fingerprint matematic unic pentru fiecare bloc. Orice modificare în date va genera un hash complet diferit, făcând imposibilă falsificarea informațiilor.',
    'node': 'Nodurile sunt calculatoarele din rețeaua blockchain care mențin, validează și sincronizează registrul distribuit. Cu cât sunt mai multe noduri, cu atât rețeaua este mai sigură.',
    'smart-contract': 'Contractele inteligente sunt programe care se execută automat când condițiile prestabilite sunt îndeplinite, eliminând nevoia de intermediari și reducând costurile.',
    'mining': 'Mining-ul este procesul prin care tranzacțiile sunt validate și adăugate în blockchain, în schimbul unor recompense. Acest proces securizează întreaga rețea.',
    'wallet': 'Portofelul cripto stochează cheile private necesare pentru a accesa și transfera activele digitale, fiind echivalentul digital al unui portofel tradițional.'
  };

  return descriptions[concept.id] || `${concept.text} reprezintă un element fundamental în ecosistemul blockchain, contribuind la funcționarea sigură și eficientă a întregii rețele descentralizate.`;
}