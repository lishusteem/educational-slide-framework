/**
 * Unified Animation Context
 * Single context replacing all animation-related contexts
 * Provides unified animation system to all components
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useUnifiedAnimation, createUnifiedConfig } from '../hooks/useUnifiedAnimation';
import type { UnifiedAnimationState, UnifiedAnimationConfig } from '../hooks/useUnifiedAnimation';
import type { VocabularyItem, ConceptItem, SlideTiming } from '../framework/types/slide.types';

// Context type
interface UnifiedAnimationContextType extends UnifiedAnimationState {}

// Create context
const UnifiedAnimationContext = createContext<UnifiedAnimationContextType | null>(null);

// Provider props
interface UnifiedAnimationProviderProps {
  children: React.ReactNode;
  vocabularyItems?: VocabularyItem[];
  conceptItems?: ConceptItem[];
  slideTiming?: SlideTiming;
  isSlideActive?: boolean;
  autoStart?: boolean;
  customConfig?: UnifiedAnimationConfig; // Allow custom configuration
}

/**
 * Unified Animation Provider
 * Replaces all animation-related contexts with single unified provider
 */
export const UnifiedAnimationProvider: React.FC<UnifiedAnimationProviderProps> = ({
  children,
  vocabularyItems = [],
  conceptItems = [],
  slideTiming,
  isSlideActive = true,
  autoStart = true,
  customConfig
}) => {
  // Create unified configuration
  const config = useMemo(() => {
    if (customConfig) {
      return customConfig;
    }
    
    // Convert old system configuration to unified configuration
    return createUnifiedConfig(vocabularyItems, conceptItems, slideTiming);
  }, [vocabularyItems, conceptItems, slideTiming, customConfig]);
  
  // Use unified animation hook
  const animationState = useUnifiedAnimation({
    ...config,
    isSlideActive,
    autoStart
  });
  
  return (
    <UnifiedAnimationContext.Provider value={animationState}>
      {children}
    </UnifiedAnimationContext.Provider>
  );
};

/**
 * Hook to access unified animation state
 * Replaces all individual animation hooks
 */
export const useUnifiedAnimationContext = (): UnifiedAnimationContextType => {
  const context = useContext(UnifiedAnimationContext);
  
  if (!context) {
    throw new Error('useUnifiedAnimationContext must be used within a UnifiedAnimationProvider');
  }
  
  return context;
};

/**
 * Backwards compatibility hooks
 * These allow existing components to work during transition
 */

// Replaces useMainContentCarousel
export const useMainContentCarousel = () => {
  const { currentLayout, progress, isTransitioning, currentLayoutIndex, totalLayouts } = useUnifiedAnimationContext();
  
  return {
    currentSlide: currentLayout?.content || null,
    progress,
    isTransitioning,
    currentSlideIndex: currentLayoutIndex,
    totalSlides: totalLayouts,
    carouselSlides: [], // Empty for now, not needed in new system
    nextSlide: () => {}, // Will be implemented if needed
    goToSlide: () => {}  // Will be implemented if needed
  };
};

// Replaces useTimingAnimation
export const useTimingAnimation = ({ elementId }: { elementId: string }) => {
  const { activeHighlights } = useUnifiedAnimationContext();
  
  return {
    isTimingHighlighted: activeHighlights.has(elementId),
    triggerHighlight: () => {}, // Manual trigger not needed in unified system
    stopHighlight: () => {}      // Manual stop not needed in unified system
  };
};

// Replaces useSectionTiming
export const useSectionTiming = (sectionKey: string) => {
  const { activeHighlights } = useUnifiedAnimationContext();
  
  return {
    isTimingHighlighted: activeHighlights.has(`${sectionKey}Section`)
  };
};

// Replaces useItemTiming
export const useItemTiming = (itemId: string) => {
  const { activeHighlights } = useUnifiedAnimationContext();
  
  return {
    isTimingHighlighted: activeHighlights.has(itemId)
  };
};