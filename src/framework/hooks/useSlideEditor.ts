/**
 * Slide Editor Hook
 * Clean, type-safe editing of slide content with real-time updates
 */

import { useState, useCallback, useMemo } from 'react';
import type { SlideConfig, VocabularyItem, ConceptItem } from '../types/slide.types';

export interface SlideEditorState {
  slide: SlideConfig;
  isDirty: boolean;
  isEditing: boolean;
}

export interface SlideEditorActions {
  // Slide-level actions
  updateTitle: (title: string) => void;
  updateSubtitle: (subtitle: string) => void;
  updateBridgeText: (bridgeText: string) => void;
  updateFloatingIcon: (icon: string) => void;
  
  // Vocabulary actions
  addVocabularyItem: () => void;
  updateVocabularyItem: (id: string, updates: Partial<VocabularyItem>) => void;
  removeVocabularyItem: (id: string) => void;
  reorderVocabulary: (fromIndex: number, toIndex: number) => void;
  
  // Concept actions
  addConceptItem: () => void;
  updateConceptItem: (id: string, updates: Partial<ConceptItem>) => void;
  removeConceptItem: (id: string) => void;
  reorderConcepts: (fromIndex: number, toIndex: number) => void;
  
  // Editor state
  setEditing: (isEditing: boolean) => void;
  resetSlide: () => void;
  saveSlide: () => SlideConfig;
}

export function useSlideEditor(initialSlide: SlideConfig): SlideEditorState & SlideEditorActions {
  const [slide, setSlide] = useState<SlideConfig>(initialSlide);
  const [originalSlide] = useState<SlideConfig>(initialSlide);
  const [isEditing, setIsEditing] = useState(false);

  const isDirty = useMemo(() => {
    return JSON.stringify(slide) !== JSON.stringify(originalSlide);
  }, [slide, originalSlide]);

  // Slide-level updates
  const updateTitle = useCallback((title: string) => {
    setSlide(prev => ({
      ...prev,
      content: { ...prev.content, title }
    }));
  }, []);

  const updateSubtitle = useCallback((subtitle: string) => {
    setSlide(prev => ({
      ...prev,
      content: { ...prev.content, subtitle }
    }));
  }, []);

  const updateBridgeText = useCallback((bridgeText: string) => {
    setSlide(prev => ({
      ...prev,
      content: { ...prev.content, bridgeText }
    }));
  }, []);

  const updateFloatingIcon = useCallback((icon: string) => {
    setSlide(prev => ({
      ...prev,
      content: { ...prev.content, floatingIcon: icon }
    }));
  }, []);

  // Vocabulary management
  const addVocabularyItem = useCallback(() => {
    const newItem: VocabularyItem = {
      id: `vocab-${Date.now()}`,
      term: 'New Term',
      definition: 'Enter definition here...',
      icon: 'book'
    };

    setSlide(prev => ({
      ...prev,
      content: {
        ...prev.content,
        vocabulary: [...(prev.content.vocabulary || []), newItem]
      }
    }));
  }, []);

  const updateVocabularyItem = useCallback((id: string, updates: Partial<VocabularyItem>) => {
    setSlide(prev => ({
      ...prev,
      content: {
        ...prev.content,
        vocabulary: prev.content.vocabulary?.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ) || []
      }
    }));
  }, []);

  const removeVocabularyItem = useCallback((id: string) => {
    setSlide(prev => ({
      ...prev,
      content: {
        ...prev.content,
        vocabulary: prev.content.vocabulary?.filter(item => item.id !== id) || []
      }
    }));
  }, []);

  const reorderVocabulary = useCallback((fromIndex: number, toIndex: number) => {
    setSlide(prev => {
      const items = [...(prev.content.vocabulary || [])];
      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
      
      return {
        ...prev,
        content: { ...prev.content, vocabulary: items }
      };
    });
  }, []);

  // Concept management
  const addConceptItem = useCallback(() => {
    const newItem: ConceptItem = {
      id: `concept-${Date.now()}`,
      text: 'New concept text...',
      icon: 'lightbulb',
      emphasis: 'normal'
    };

    setSlide(prev => ({
      ...prev,
      content: {
        ...prev.content,
        concepts: [...(prev.content.concepts || []), newItem]
      }
    }));
  }, []);

  const updateConceptItem = useCallback((id: string, updates: Partial<ConceptItem>) => {
    setSlide(prev => ({
      ...prev,
      content: {
        ...prev.content,
        concepts: prev.content.concepts?.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ) || []
      }
    }));
  }, []);

  const removeConceptItem = useCallback((id: string) => {
    setSlide(prev => ({
      ...prev,
      content: {
        ...prev.content,
        concepts: prev.content.concepts?.filter(item => item.id !== id) || []
      }
    }));
  }, []);

  const reorderConcepts = useCallback((fromIndex: number, toIndex: number) => {
    setSlide(prev => {
      const items = [...(prev.content.concepts || [])];
      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
      
      return {
        ...prev,
        content: { ...prev.content, concepts: items }
      };
    });
  }, []);

  // Editor state management
  const setEditing = useCallback((editing: boolean) => {
    setIsEditing(editing);
  }, []);

  const resetSlide = useCallback(() => {
    setSlide(originalSlide);
    setIsEditing(false);
  }, [originalSlide]);

  const saveSlide = useCallback(() => {
    setIsEditing(false);
    return slide;
  }, [slide]);

  return {
    // State
    slide,
    isDirty,
    isEditing,
    
    // Slide actions
    updateTitle,
    updateSubtitle,
    updateBridgeText,
    updateFloatingIcon,
    
    // Vocabulary actions
    addVocabularyItem,
    updateVocabularyItem,
    removeVocabularyItem,
    reorderVocabulary,
    
    // Concept actions
    addConceptItem,
    updateConceptItem,
    removeConceptItem,
    reorderConcepts,
    
    // Editor actions
    setEditing,
    resetSlide,
    saveSlide
  };
}