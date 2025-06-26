/**
 * Timing System for Educational Slide Framework
 * Manages time-based highlight animations alongside existing hover triggers
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import type { ElementTiming, SlideTiming } from '../types/slide.types';

interface UseTimingAnimationOptions {
  elementId: string;
  timing?: ElementTiming;
  isSlideActive?: boolean;
  onHighlightStart?: (elementId: string) => void;
  onHighlightEnd?: (elementId: string) => void;
}

export const useTimingAnimation = ({
  elementId,
  timing,
  isSlideActive = true,
  onHighlightStart,
  onHighlightEnd
}: UseTimingAnimationOptions) => {
  const [isTimingHighlighted, setIsTimingHighlighted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startHighlight = useCallback(() => {
    setIsTimingHighlighted(true);
    onHighlightStart?.(elementId);
    
    if (timing?.duration) {
      endTimeoutRef.current = setTimeout(() => {
        setIsTimingHighlighted(false);
        onHighlightEnd?.(elementId);
      }, timing.duration);
    }
  }, [elementId, timing?.duration, onHighlightStart, onHighlightEnd]);

  useEffect(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (endTimeoutRef.current) {
      clearTimeout(endTimeoutRef.current);
    }

    // Reset state when slide becomes inactive
    if (!isSlideActive) {
      setIsTimingHighlighted(false);
      return;
    }

    // Schedule timing-based highlight if timing is configured
    if (timing && isSlideActive) {
      const totalDelay = (timing.delay || 0) + timing.startTime;
      
      timeoutRef.current = setTimeout(() => {
        startHighlight();
      }, totalDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (endTimeoutRef.current) {
        clearTimeout(endTimeoutRef.current);
      }
    };
  }, [timing, isSlideActive, startHighlight]);

  return {
    isTimingHighlighted,
    // Method to manually trigger highlight (for testing or manual control)
    triggerHighlight: startHighlight,
    // Method to stop highlight early
    stopHighlight: () => {
      setIsTimingHighlighted(false);
      if (endTimeoutRef.current) {
        clearTimeout(endTimeoutRef.current);
      }
    }
  };
};

// Hook for section-level timing (vocabulary section, concepts section)
export const useSectionTiming = (
  sectionKey: keyof SlideTiming,
  slideTiming?: SlideTiming,
  isSlideActive?: boolean
) => {
  const timing = slideTiming?.[sectionKey] as ElementTiming | undefined;
  
  return useTimingAnimation({
    elementId: `section-${sectionKey}`,
    timing,
    isSlideActive
  });
};

// Hook for item-level timing (individual vocabulary/concept items)
export const useItemTiming = (
  itemId: string,
  itemType: 'vocabulary' | 'concepts',
  slideTiming?: SlideTiming,
  isSlideActive?: boolean
) => {
  const timing = slideTiming?.[itemType]?.[itemId];
  
  return useTimingAnimation({
    elementId: itemId,
    timing,
    isSlideActive
  });
}; 