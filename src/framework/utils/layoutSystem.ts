/**
 * Layout System for MainContent
 * Manages cycling between different layout presentations of the same content
 */

import { useEffect, useState, useMemo } from 'react';
import type { LayoutConfig, LayoutSystemConfig, LayoutSystemState } from '../types/layout.types';

interface UseLayoutSystemOptions {
  layoutConfigs: LayoutConfig[];
  isSlideActive?: boolean;
  autoAdvance?: boolean;
}

export const useLayoutSystem = ({
  layoutConfigs,
  isSlideActive = true,
  autoAdvance = true
}: UseLayoutSystemOptions) => {
  const [currentLayoutIndex, setCurrentLayoutIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance logic between layouts
  useEffect(() => {
    if (!isSlideActive || !autoAdvance || layoutConfigs.length === 0) return;

    const currentLayout = layoutConfigs[currentLayoutIndex];
    if (!currentLayout) return;

    const timer = setTimeout(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentLayoutIndex(prev => (prev + 1) % layoutConfigs.length);
        setIsTransitioning(false);
      }, 300); // Transition duration
      
    }, currentLayout.duration);

    return () => clearTimeout(timer);
  }, [currentLayoutIndex, layoutConfigs, isSlideActive, autoAdvance]);

  // Reset when slide becomes active
  useEffect(() => {
    if (isSlideActive && autoAdvance) {
      setCurrentLayoutIndex(0);
      setIsTransitioning(false);
    }
  }, [isSlideActive, autoAdvance]);

  const currentLayout = layoutConfigs[currentLayoutIndex] || null;
  const totalLayouts = layoutConfigs.length;
  const progress = totalLayouts > 0 ? ((currentLayoutIndex + 1) / totalLayouts) * 100 : 0;

  const state: LayoutSystemState = {
    currentLayoutIndex,
    currentLayout,
    isTransitioning,
    progress,
    totalLayouts
  };

  return {
    ...state,
    // Methods for manual control
    nextLayout: () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentLayoutIndex(prev => (prev + 1) % layoutConfigs.length);
        setIsTransitioning(false);
      }, 300);
    },
    goToLayout: (index: number) => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentLayoutIndex(Math.max(0, Math.min(index, layoutConfigs.length - 1)));
        setIsTransitioning(false);
      }, 300);
    }
  };
}; 