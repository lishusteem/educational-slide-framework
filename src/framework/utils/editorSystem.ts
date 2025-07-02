/**
 * Editor System for Sidebar Control Panel
 * Manages editor state while preserving original slide configuration
 */

import { useState, useCallback, useMemo } from 'react';
import type { SlideConfig } from '../types/slide.types';
import type { SidebarEditorState, SidebarEditorActions } from '../types/editor.types';

interface UseSidebarEditorOptions {
  originalConfig: SlideConfig;
}

export const useSidebarEditor = ({ originalConfig }: UseSidebarEditorOptions) => {
  // Initialize editor state from original config
  const [editorState, setEditorState] = useState<SidebarEditorState>(() => ({
    vocabulary: {
      maxItems: 5,
      fontSize: 0.7, // Default vocabulary font size
      items: originalConfig.content.vocabulary?.map(item => ({
        id: item.id,
        term: item.term,
        definition: item.definition,
        icon: item.icon
      })) || []
    },
    concepts: {
      maxItems: 5,
      fontSize: 0.75, // Default concepts font size
      items: originalConfig.content.concepts?.map(item => ({
        id: item.id,
        text: item.text,
        icon: item.icon,
        emphasis: item.emphasis
      })) || []
    }
  }));

  // Generate modified config for rendering
  const modifiedConfig = useMemo<SlideConfig>(() => ({
    ...originalConfig,
    content: {
      ...originalConfig.content,
      vocabulary: editorState.vocabulary.items.map(item => ({
        id: item.id,
        term: item.term,
        definition: item.definition,
        icon: item.icon
      })),
      concepts: editorState.concepts.items.map(item => ({
        id: item.id,
        text: item.text,
        icon: item.icon,
        emphasis: item.emphasis
      }))
    }
  }), [originalConfig, editorState]);

  // Action handlers
  const actions: SidebarEditorActions = {
    updateVocabularyMaxItems: useCallback((count: number) => {
      const clampedCount = Math.max(1, Math.min(5, count));
      setEditorState(prev => ({
        ...prev,
        vocabulary: {
          ...prev.vocabulary,
          maxItems: clampedCount
        }
      }));
    }, []),

    updateConceptsMaxItems: useCallback((count: number) => {
      const clampedCount = Math.max(1, Math.min(5, count));
      setEditorState(prev => ({
        ...prev,
        concepts: {
          ...prev.concepts,
          maxItems: clampedCount
        }
      }));
    }, []),

    updateVocabularyFontSize: useCallback((size: number) => {
      const clampedSize = Math.max(0.5, Math.min(1.2, size));
      setEditorState(prev => ({
        ...prev,
        vocabulary: {
          ...prev.vocabulary,
          fontSize: clampedSize
        }
      }));
    }, []),

    updateConceptsFontSize: useCallback((size: number) => {
      const clampedSize = Math.max(0.5, Math.min(1.2, size));
      setEditorState(prev => ({
        ...prev,
        concepts: {
          ...prev.concepts,
          fontSize: clampedSize
        }
      }));
    }, []),

    updateVocabularyItem: useCallback((id: string, updates: Partial<{ term: string; definition: string; icon: string }>) => {
      setEditorState(prev => ({
        ...prev,
        vocabulary: {
          ...prev.vocabulary,
          items: prev.vocabulary.items.map(item => 
            item.id === id ? { ...item, ...updates } : item
          )
        }
      }));
    }, []),

    updateConceptItem: useCallback((id: string, updates: Partial<{ text: string; icon: string; emphasis: 'normal' | 'strong' | 'subtle' }>) => {
      setEditorState(prev => ({
        ...prev,
        concepts: {
          ...prev.concepts,
          items: prev.concepts.items.map(item => 
            item.id === id ? { ...item, ...updates } : item
          )
        }
      }));
    }, []),

    addVocabularyItem: useCallback(() => {
      const newId = `vocab_${Date.now()}`;
      setEditorState(prev => ({
        ...prev,
        vocabulary: {
          ...prev.vocabulary,
          items: [...prev.vocabulary.items, {
            id: newId,
            term: 'Termen Nou',
            definition: 'Definiție nouă',
            icon: 'book'
          }]
        }
      }));
    }, []),

    addConceptItem: useCallback(() => {
      const newId = `concept_${Date.now()}`;
      setEditorState(prev => ({
        ...prev,
        concepts: {
          ...prev.concepts,
          items: [...prev.concepts.items, {
            id: newId,
            text: 'Concept Nou',
            icon: 'lightbulb',
            emphasis: 'normal' as const
          }]
        }
      }));
    }, []),

    removeVocabularyItem: useCallback((id: string) => {
      setEditorState(prev => ({
        ...prev,
        vocabulary: {
          ...prev.vocabulary,
          items: prev.vocabulary.items.filter(item => item.id !== id)
        }
      }));
    }, []),

    removeConceptItem: useCallback((id: string) => {
      setEditorState(prev => ({
        ...prev,
        concepts: {
          ...prev.concepts,
          items: prev.concepts.items.filter(item => item.id !== id)
        }
      }));
    }, []),

    resetToDefaults: useCallback(() => {
      setEditorState({
        vocabulary: {
          maxItems: 5,
          fontSize: 0.7,
          items: originalConfig.content.vocabulary?.map(item => ({
            id: item.id,
            term: item.term,
            definition: item.definition,
            icon: item.icon
          })) || []
        },
        concepts: {
          maxItems: 5,
          fontSize: 0.75,
          items: originalConfig.content.concepts?.map(item => ({
            id: item.id,
            text: item.text,
            icon: item.icon,
            emphasis: item.emphasis
          })) || []
        }
      });
    }, [originalConfig])
  };

  return {
    editorState,
    actions,
    modifiedConfig
  };
}; 