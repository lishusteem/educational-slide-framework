/**
 * Layout Control Context
 * Provides state and actions for the layout control system without modifying existing components
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import type { 
  LayoutControlContextValue, 
  LayoutControlState, 
  LayoutControlActions,
  ManagedLayoutConfig,
  LayoutTimingConfig,
  TimingHighlight
} from '../types/layoutControl.types';
import type { LayoutConfig } from '../types/layout.types';
import { 
  definitionLayoutConfig,
  propertiesGridLayoutConfig,
  comparisonLayoutConfig
} from '../layouts';

const LayoutControlContext = createContext<LayoutControlContextValue | null>(null);

// Initial state with existing layouts
const initialState: LayoutControlState = {
  layouts: [
    { ...definitionLayoutConfig, isEnabled: true, order: 0 },
    { ...propertiesGridLayoutConfig, isEnabled: true, order: 1 },
    { ...comparisonLayoutConfig, isEnabled: true, order: 2 }
  ],
  currentLayoutIndex: 0,
  isPlaying: false,
  isPaused: false,
  currentTime: 0,
  playbackSpeed: 1.0,
  previewMode: false
};

// Action types
type LayoutControlAction =
  | { type: 'ADD_LAYOUT'; payload: LayoutConfig }
  | { type: 'REMOVE_LAYOUT'; payload: string }
  | { type: 'REORDER_LAYOUTS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'TOGGLE_LAYOUT_ENABLED'; payload: string }
  | { type: 'UPDATE_LAYOUT_DURATION'; payload: { layoutId: string; duration: number } }
  | { type: 'SET_CURRENT_LAYOUT'; payload: number }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_PAUSED'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_PLAYBACK_SPEED'; payload: number }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'ADD_HIGHLIGHT'; payload: { layoutId: string; highlight: TimingHighlight } }
  | { type: 'REMOVE_HIGHLIGHT'; payload: { layoutId: string; highlightId: string } }
  | { type: 'UPDATE_HIGHLIGHT'; payload: { layoutId: string; highlightId: string; updates: Partial<TimingHighlight> } };

// Reducer
function layoutControlReducer(state: LayoutControlState, action: LayoutControlAction): LayoutControlState {
  switch (action.type) {
    case 'ADD_LAYOUT':
      const newLayout: ManagedLayoutConfig = {
        ...action.payload,
        isEnabled: true,
        order: state.layouts.length
      };
      return {
        ...state,
        layouts: [...state.layouts, newLayout]
      };

    case 'REMOVE_LAYOUT':
      return {
        ...state,
        layouts: state.layouts.filter(layout => layout.id !== action.payload)
      };

    case 'REORDER_LAYOUTS':
      const { fromIndex, toIndex } = action.payload;
      const newLayouts = [...state.layouts];
      const [removed] = newLayouts.splice(fromIndex, 1);
      newLayouts.splice(toIndex, 0, removed);
      
      // Update order property
      const reorderedLayouts = newLayouts.map((layout, index) => ({
        ...layout,
        order: index
      }));
      
      return {
        ...state,
        layouts: reorderedLayouts
      };

    case 'TOGGLE_LAYOUT_ENABLED':
      return {
        ...state,
        layouts: state.layouts.map(layout =>
          layout.id === action.payload
            ? { ...layout, isEnabled: !layout.isEnabled }
            : layout
        )
      };

    case 'UPDATE_LAYOUT_DURATION':
      return {
        ...state,
        layouts: state.layouts.map(layout =>
          layout.id === action.payload.layoutId
            ? { ...layout, duration: action.payload.duration }
            : layout
        )
      };

    case 'SET_CURRENT_LAYOUT':
      return { ...state, currentLayoutIndex: action.payload };

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };

    case 'SET_PAUSED':
      return { ...state, isPaused: action.payload };

    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };

    case 'SET_PLAYBACK_SPEED':
      return { ...state, playbackSpeed: action.payload };

    case 'SET_PREVIEW_MODE':
      return { ...state, previewMode: action.payload };

    case 'ADD_HIGHLIGHT':
      return {
        ...state,
        layouts: state.layouts.map(layout => {
          if (layout.id === action.payload.layoutId) {
            const timingConfig = layout.timingConfig || {
              layoutId: layout.id,
              highlights: [],
              totalDuration: layout.duration,
              autoAdvance: true
            };
            
            return {
              ...layout,
              timingConfig: {
                ...timingConfig,
                highlights: [...timingConfig.highlights, action.payload.highlight]
              }
            };
          }
          return layout;
        })
      };

    case 'REMOVE_HIGHLIGHT':
      return {
        ...state,
        layouts: state.layouts.map(layout => {
          if (layout.id === action.payload.layoutId && layout.timingConfig) {
            return {
              ...layout,
              timingConfig: {
                ...layout.timingConfig,
                highlights: layout.timingConfig.highlights.filter(h => h.id !== action.payload.highlightId)
              }
            };
          }
          return layout;
        })
      };

    case 'UPDATE_HIGHLIGHT':
      return {
        ...state,
        layouts: state.layouts.map(layout => {
          if (layout.id === action.payload.layoutId && layout.timingConfig) {
            return {
              ...layout,
              timingConfig: {
                ...layout.timingConfig,
                highlights: layout.timingConfig.highlights.map(highlight =>
                  highlight.id === action.payload.highlightId
                    ? { ...highlight, ...action.payload.updates }
                    : highlight
                )
              }
            };
          }
          return layout;
        })
      };

    default:
      return state;
  }
}

interface LayoutControlProviderProps {
  children: React.ReactNode;
}

export const LayoutControlProvider: React.FC<LayoutControlProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(layoutControlReducer, initialState);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Actions
  const actions: LayoutControlActions = {
    // Layout Management
    addLayout: useCallback((layoutConfig: LayoutConfig) => {
      dispatch({ type: 'ADD_LAYOUT', payload: layoutConfig });
    }, []),

    removeLayout: useCallback((layoutId: string) => {
      dispatch({ type: 'REMOVE_LAYOUT', payload: layoutId });
    }, []),

    reorderLayouts: useCallback((fromIndex: number, toIndex: number) => {
      dispatch({ type: 'REORDER_LAYOUTS', payload: { fromIndex, toIndex } });
    }, []),

    toggleLayoutEnabled: useCallback((layoutId: string) => {
      dispatch({ type: 'TOGGLE_LAYOUT_ENABLED', payload: layoutId });
    }, []),

    updateLayoutDuration: useCallback((layoutId: string, duration: number) => {
      dispatch({ type: 'UPDATE_LAYOUT_DURATION', payload: { layoutId, duration } });
    }, []),

    // Playback Control
    play: useCallback(() => {
      dispatch({ type: 'SET_PLAYING', payload: true });
      dispatch({ type: 'SET_PAUSED', payload: false });
    }, []),

    pause: useCallback(() => {
      dispatch({ type: 'SET_PAUSED', payload: true });
    }, []),

    stop: useCallback(() => {
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_PAUSED', payload: false });
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
      dispatch({ type: 'SET_CURRENT_LAYOUT', payload: 0 });
    }, []),

    goToLayout: useCallback((index: number) => {
      const enabledLayouts = state.layouts.filter(l => l.isEnabled);
      if (index >= 0 && index < enabledLayouts.length) {
        dispatch({ type: 'SET_CURRENT_LAYOUT', payload: index });
      }
    }, [state.layouts]),

    nextLayout: useCallback(() => {
      const enabledLayouts = state.layouts.filter(l => l.isEnabled);
      const nextIndex = (state.currentLayoutIndex + 1) % enabledLayouts.length;
      dispatch({ type: 'SET_CURRENT_LAYOUT', payload: nextIndex });
    }, [state.currentLayoutIndex, state.layouts]),

    previousLayout: useCallback(() => {
      const enabledLayouts = state.layouts.filter(l => l.isEnabled);
      const prevIndex = state.currentLayoutIndex === 0 
        ? enabledLayouts.length - 1 
        : state.currentLayoutIndex - 1;
      dispatch({ type: 'SET_CURRENT_LAYOUT', payload: prevIndex });
    }, [state.currentLayoutIndex, state.layouts]),

    setPlaybackSpeed: useCallback((speed: number) => {
      dispatch({ type: 'SET_PLAYBACK_SPEED', payload: speed });
    }, []),

    // Timing Control
    addHighlight: useCallback((layoutId: string, highlight: TimingHighlight) => {
      dispatch({ type: 'ADD_HIGHLIGHT', payload: { layoutId, highlight } });
    }, []),

    removeHighlight: useCallback((layoutId: string, highlightId: string) => {
      dispatch({ type: 'REMOVE_HIGHLIGHT', payload: { layoutId, highlightId } });
    }, []),

    updateHighlight: useCallback((layoutId: string, highlightId: string, updates: Partial<TimingHighlight>) => {
      dispatch({ type: 'UPDATE_HIGHLIGHT', payload: { layoutId, highlightId, updates } });
    }, []),

    triggerHighlight: useCallback((layoutId: string, highlightId: string) => {
      // This will be implemented to trigger visual highlights
      console.log(`Triggering highlight ${highlightId} for layout ${layoutId}`);
    }, []),

    // Preview
    enablePreview: useCallback(() => {
      dispatch({ type: 'SET_PREVIEW_MODE', payload: true });
    }, []),

    disablePreview: useCallback(() => {
      dispatch({ type: 'SET_PREVIEW_MODE', payload: false });
    }, []),

    previewHighlight: useCallback((layoutId: string, highlightId: string) => {
      // Trigger a preview of the highlight without affecting playback
      console.log(`Previewing highlight ${highlightId} for layout ${layoutId}`);
    }, [])
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
    };
  }, []);

  const contextValue: LayoutControlContextValue = {
    state,
    actions,
    isControllerReady: true
  };

  return (
    <LayoutControlContext.Provider value={contextValue}>
      {children}
    </LayoutControlContext.Provider>
  );
};

export const useLayoutControl = (): LayoutControlContextValue => {
  const context = useContext(LayoutControlContext);
  if (!context) {
    throw new Error('useLayoutControl must be used within a LayoutControlProvider');
  }
  return context;
}; 