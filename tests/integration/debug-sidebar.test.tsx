import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock pentru iconRegistry
vi.mock('../../src/framework/utils/iconRegistry', () => ({
  renderIcon: vi.fn(() => '🔍')
}));

// Mock pentru framer-motion - mai complet
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: (props: any) => React.createElement('div', props),
      button: (props: any) => React.createElement('button', props),
      input: (props: any) => React.createElement('input', props),
      select: (props: any) => React.createElement('select', props),
      span: (props: any) => React.createElement('span', props),
      h3: (props: any) => React.createElement('h3', props),
      p: (props: any) => React.createElement('p', props),
      label: (props: any) => React.createElement('label', props),
      option: (props: any) => React.createElement('option', props)
    },
    AnimatePresence: (props: any) => React.createElement('div', {}, props.children),
    Reorder: (props: any) => React.createElement('div', props),
    ReorderItem: (props: any) => React.createElement('div', props)
  };
});

// Mock pentru useSlideEditor
vi.mock('../../src/framework/hooks/useSlideEditor', () => ({
  useSlideEditor: vi.fn(() => ({
    slide: {
      id: 'test-slide',
      template: 'educational',
      content: {
        title: 'Test Content',
        subtitle: 'Test Subtitle',
        concepts: [],
        vocabulary: []
      },
      theme: 'dark-blue'
    },
    isDirty: false,
    isEditing: false,
    addConceptItem: vi.fn(),
    updateConceptItem: vi.fn(),
    removeConceptItem: vi.fn(),
    reorderConcepts: vi.fn(),
    addVocabularyItem: vi.fn(),
    updateVocabularyItem: vi.fn(),
    removeVocabularyItem: vi.fn(),
    reorderVocabulary: vi.fn(),
    setEditing: vi.fn(),
    resetSlide: vi.fn(),
    saveSlide: vi.fn()
  }))
}));

describe('Debug Sidebar Test', () => {
  it('should import components and check their types', async () => {
    // Test import dinamic
    const conceptsModule = await import('../../src/presentation/components/ConceptsSidebar');
    const vocabularyModule = await import('../../src/presentation/components/VocabularySidebar');
    
    console.log('ConceptsSidebar type:', typeof conceptsModule.ConceptsSidebar);
    console.log('VocabularySidebar type:', typeof vocabularyModule.VocabularySidebar);
    console.log('ConceptsSidebar value:', conceptsModule.ConceptsSidebar);
    console.log('VocabularySidebar value:', vocabularyModule.VocabularySidebar);
    
    expect(typeof conceptsModule.ConceptsSidebar).toBe('function');
    expect(typeof vocabularyModule.VocabularySidebar).toBe('function');
    expect(conceptsModule.ConceptsSidebar).not.toBeUndefined();
    expect(vocabularyModule.VocabularySidebar).not.toBeUndefined();
  });

  it('should import components statically and check their types', () => {
    // Test import static
    const { ConceptsSidebar, VocabularySidebar } = require('../../src/presentation/components/ConceptsSidebar');
    const { VocabularySidebar: VocabSidebar } = require('../../src/presentation/components/VocabularySidebar');
    
    console.log('Static ConceptsSidebar type:', typeof ConceptsSidebar);
    console.log('Static VocabularySidebar type:', typeof VocabSidebar);
    console.log('Static ConceptsSidebar value:', ConceptsSidebar);
    console.log('Static VocabularySidebar value:', VocabSidebar);
    
    expect(typeof ConceptsSidebar).toBe('function');
    expect(typeof VocabSidebar).toBe('function');
    expect(ConceptsSidebar).not.toBeUndefined();
    expect(VocabSidebar).not.toBeUndefined();
  });

  it('should render a simple div', () => {
    const { container } = render(<div>Test</div>);
    expect(container.textContent).toBe('Test');
  });

  it('should try to render ConceptsSidebar with minimal props', async () => {
    const { ConceptsSidebar } = await import('../../src/presentation/components/ConceptsSidebar');
    
    const mockSlide = {
      id: 'test-slide',
      template: 'educational',
      content: {
        title: 'Test Content',
        subtitle: 'Test Subtitle',
        concepts: [],
        vocabulary: []
      },
      theme: 'dark-blue' as const
    };

    const mockOnSlideUpdate = vi.fn();

    expect(() => {
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );
    }).not.toThrow();
  });
}); 