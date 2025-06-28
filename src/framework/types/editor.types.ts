/**
 * Editor Types for Sidebar Control Panel
 * Allows editing existing properties without modifying core functionality
 */

export interface SidebarEditorState {
  vocabulary: {
    maxItems: number;        // 1-5 elements
    fontSize: number;        // rem units (0.5-1.2)
    items: Array<{
      id: string;
      term: string;
      definition: string;
      icon?: string;
    }>;
  };
  concepts: {
    maxItems: number;        // 1-5 elements  
    fontSize: number;        // rem units (0.5-1.2)
    items: Array<{
      id: string;
      text: string;
      icon?: string;
      emphasis?: 'normal' | 'strong' | 'subtle';
    }>;
  };
}

export interface SidebarEditorActions {
  updateVocabularyMaxItems: (count: number) => void;
  updateConceptsMaxItems: (count: number) => void;
  updateVocabularyFontSize: (size: number) => void;
  updateConceptsFontSize: (size: number) => void;
  updateVocabularyItem: (id: string, updates: Partial<{ term: string; definition: string; icon: string }>) => void;
  updateConceptItem: (id: string, updates: Partial<{ text: string; icon: string; emphasis: 'normal' | 'strong' | 'subtle' }>) => void;
  addVocabularyItem: () => void;
  addConceptItem: () => void;
  removeVocabularyItem: (id: string) => void;
  removeConceptItem: (id: string) => void;
  resetToDefaults: () => void;
}

export interface EditorPanelProps {
  editorState: SidebarEditorState;
  actions: SidebarEditorActions;
} 