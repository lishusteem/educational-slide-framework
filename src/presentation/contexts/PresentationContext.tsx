import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { PresentationConfig } from '../types/presentation.types';
import type { SlideConfig } from '../../framework/types/slide.types';
import type { ExportOptions, ExportBundle } from '../types/export.types';

interface PresentationState {
  presentation: PresentationConfig | null;
  currentSlideIndex: number;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean; // Has unsaved changes
}

interface PresentationContextValue extends PresentationState {
  loadPresentation: (config: PresentationConfig) => void;
  updateSlide: (slideId: string, updates: Partial<SlideConfig>) => void;
  addSlide: (slide: SlideConfig, index?: number) => void;
  deleteSlide: (slideId: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  duplicateSlide: (slideId: string) => void;
  savePresentation: () => Promise<void>;
  exportPresentation: (options: ExportOptions) => Promise<ExportBundle>;
}

const PresentationContext = createContext<PresentationContextValue | null>(null);

// Reducer for complex state management
type PresentationAction =
  | { type: 'LOAD_PRESENTATION'; payload: PresentationConfig }
  | { type: 'UPDATE_SLIDE'; payload: { slideId: string; updates: Partial<SlideConfig> } }
  | { type: 'ADD_SLIDE'; payload: { slide: SlideConfig; index?: number } }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'REORDER_SLIDES'; payload: { from: number; to: number } }
  | { type: 'SET_CURRENT_SLIDE'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_DIRTY'; payload: boolean };

function presentationReducer(
  state: PresentationState,
  action: PresentationAction
): PresentationState {
  switch (action.type) {
    case 'LOAD_PRESENTATION':
      return {
        ...state,
        presentation: action.payload,
        currentSlideIndex: 0,
        isDirty: false,
        error: null,
      };

    case 'UPDATE_SLIDE': {
      if (!state.presentation) return state;
      
      const slides = state.presentation.slides.map(slide =>
        slide.id === action.payload.slideId
          ? { ...slide, ...action.payload.updates }
          : slide
      );
      
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        isDirty: true,
      };
    }

    case 'ADD_SLIDE': {
      if (!state.presentation) return state;
      
      const { slide, index } = action.payload;
      const slides = [...state.presentation.slides];
      const insertIndex = index ?? slides.length;
      
      // Update order for all slides
      slides.splice(insertIndex, 0, slide);
      slides.forEach((s, i) => { s.order = i; });
      
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        isDirty: true,
      };
    }

    case 'DELETE_SLIDE': {
      if (!state.presentation) return state;
      
      const slides = state.presentation.slides.filter(s => s.id !== action.payload);
      slides.forEach((s, i) => { s.order = i; });
      
      // Adjust current slide if needed
      const newIndex = Math.min(state.currentSlideIndex, slides.length - 1);
      
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        currentSlideIndex: newIndex,
        isDirty: true,
      };
    }

    case 'REORDER_SLIDES': {
      if (!state.presentation) return state;
      
      const slides = [...state.presentation.slides];
      const [removed] = slides.splice(action.payload.from, 1);
      slides.splice(action.payload.to, 0, removed);
      slides.forEach((s, i) => { s.order = i; });
      
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        isDirty: true,
      };
    }

    default:
      return state;
  }
}

export const PresentationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(presentationReducer, {
    presentation: null,
    currentSlideIndex: 0,
    isLoading: false,
    error: null,
    isDirty: false,
  });

  // Action implementations
  const loadPresentation = useCallback((config: PresentationConfig) => {
    dispatch({ type: 'LOAD_PRESENTATION', payload: config });
  }, []);

  const addSlide = useCallback((slide: SlideConfig, index?: number) => {
    dispatch({ type: 'ADD_SLIDE', payload: { slide, index } });
  }, []);

  const deleteSlide = useCallback((slideId: string) => {
    if (state.presentation?.slides.length === 1) {
      dispatch({ type: 'SET_ERROR', payload: 'Cannot delete the last slide' });
      return;
    }
    dispatch({ type: 'DELETE_SLIDE', payload: slideId });
  }, [state.presentation]);

  const reorderSlides = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_SLIDES', payload: { from: fromIndex, to: toIndex } });
  }, []);

  const duplicateSlide = useCallback((slideId: string) => {
    if (!state.presentation) return;
    
    const slide = state.presentation.slides.find(s => s.id === slideId);
    if (!slide) return;
    
    const newSlide: SlideConfig = {
      ...slide,
      id: `${slide.id}-copy-${Date.now()}`,
      order: (slide.order ?? 0) + 1,
    };
    
    addSlide(newSlide, (slide.order ?? 0) + 1);
  }, [state.presentation, addSlide]);

  // Export function
  const exportPresentation = useCallback(async (options: ExportOptions) => {
    if (!state.presentation) throw new Error('No presentation to export');
    
    const { exportPresentation: exportFn } = await import('../utils/exportPresentation');
    return exportFn(state.presentation, options);
  }, [state.presentation]);

  const value: PresentationContextValue = {
    ...state,
    loadPresentation,
    updateSlide: (slideId, updates) => 
      dispatch({ type: 'UPDATE_SLIDE', payload: { slideId, updates } }),
    addSlide,
    deleteSlide,
    reorderSlides,
    duplicateSlide,
    savePresentation: async () => {
      // Implement save logic
      dispatch({ type: 'SET_DIRTY', payload: false });
    },
    exportPresentation,
  };

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within PresentationProvider');
  }
  return context;
};

export { PresentationContext }; 