import React from 'react';
import '@testing-library/jest-dom';

// Mock pentru iconRegistry
vi.mock('../../src/framework/utils/iconRegistry', () => ({
  renderIcon: vi.fn(() => '🔍')
}));

// Mock pentru framer-motion
// vi.mock('framer-motion', () => {
//   const React = require('react');
  
//   // Funcție helper pentru a crea elemente cu toate proprietățile
//   const createMotionElement = (tag: string) => {
//     return React.forwardRef((props: any, ref: any) => {
//       const { children, ...restProps } = props;
//       return React.createElement(tag, { ...restProps, ref }, children);
//     });
//   };

//   return {
//     motion: {
//       div: createMotionElement('div'),
//       button: createMotionElement('button'),
//       input: createMotionElement('input'),
//       select: createMotionElement('select'),
//       span: createMotionElement('span'),
//       h3: createMotionElement('h3'),
//       p: createMotionElement('p'),
//       label: createMotionElement('label'),
//       option: createMotionElement('option'),
//       ul: createMotionElement('ul'),
//       li: createMotionElement('li')
//     },
//     AnimatePresence: ({ children }: any) => React.createElement('div', {}, children),
//     Reorder: ({ children, ...props }: any) => React.createElement('div', props, children),
//     ReorderItem: ({ children, ...props }: any) => React.createElement('div', props, children)
//   };
// });

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SlideConfig } from '../../src/framework/types/slide.types';

describe('Sidebar Control Functions Tests', () => {
  let mockSlide: SlideConfig;
  let mockOnSlideUpdate: any;

  beforeEach(() => {
    mockOnSlideUpdate = vi.fn();
    
    mockSlide = {
      id: 'test-slide',
      template: 'educational',
      content: {
        title: 'Test Content',
        subtitle: 'Test Subtitle',
        concepts: [
          {
            id: 'concept-1',
            text: 'First Concept',
            icon: 'lightbulb',
            emphasis: 'normal'
          },
          {
            id: 'concept-2',
            text: 'Second Concept',
            icon: 'star',
            emphasis: 'strong'
          }
        ],
        vocabulary: [
          {
            id: 'vocab-1',
            term: 'Blockchain',
            definition: 'A distributed ledger technology',
            icon: 'book'
          },
          {
            id: 'vocab-2',
            term: 'Cryptocurrency',
            definition: 'Digital currency using cryptography',
            icon: 'coin'
          }
        ]
      },
      theme: 'dark-blue' as const
    };
  });

  describe('Concepts Sidebar - Control Functions', () => {
    it('should add new concept item', async () => {
      const { ConceptsSidebar } = await import('../../src/presentation/components/ConceptsSidebar');
      const user = userEvent.setup();
      
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.concepts).toHaveLength(3);
        expect(updatedSlide.content.concepts![2].text).toBe('New concept text...');
      });
    });

    it('should delete selected concept items', async () => {
      const { ConceptsSidebar } = await import('../../src/presentation/components/ConceptsSidebar');
      const user = userEvent.setup();
      
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      // Select first concept (checkbox)
      const firstConceptCheckbox = screen.getByTestId('concept-1-checkbox');
      await user.click(firstConceptCheckbox);

      // Click delete button
      const deleteButton = screen.getByTitle('Delete Selected');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.concepts).toHaveLength(1);
        expect(updatedSlide.content.concepts![0].id).toBe('concept-2');
      });
    });

    it('should edit concept text', async () => {
      const { ConceptsSidebar } = await import('../../src/presentation/components/ConceptsSidebar');
      const user = userEvent.setup();
      
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const conceptTextInput = screen.getByDisplayValue('First Concept');
      await user.clear(conceptTextInput);
      await user.type(conceptTextInput, 'Updated Concept Text');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.concepts![0].text).toBe('Updated Concept Text');
      });
    });

    it('should change concept icon', async () => {
      const { ConceptsSidebar } = await import('../../src/presentation/components/ConceptsSidebar');
      const user = userEvent.setup();
      
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const iconSelect = screen.getByTestId('concept-1-icon-select');
      await user.selectOptions(iconSelect, 'star');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.concepts![0].icon).toBe('star');
      });
    });

    it('should change concept emphasis level', async () => {
      const { ConceptsSidebar } = await import('../../src/presentation/components/ConceptsSidebar');
      const user = userEvent.setup();
      
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const emphasisSelect = screen.getByTestId('concept-1-emphasis-select');
      await user.selectOptions(emphasisSelect, 'strong');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.concepts![0].emphasis).toBe('strong');
      });
    });

    it('should control concept animation timing', async () => {
      const { ConceptsSidebar } = await import('../../src/presentation/components/ConceptsSidebar');
      const user = userEvent.setup();
      
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      // Test start time control
      const startTimeInput = screen.getByTestId('concept-1-start-time');
      await user.clear(startTimeInput);
      await user.type(startTimeInput, '1500');

      // Test duration control
      const durationInput = screen.getByTestId('concept-1-duration');
      await user.clear(durationInput);
      await user.type(durationInput, '3000');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        // Verify timing controls work
        expect(startTimeInput).toHaveValue(1500);
        expect(durationInput).toHaveValue(3000);
      });
    });
  });

  describe('Vocabulary Sidebar - Control Functions', () => {
    it('should add new vocabulary item', async () => {
      const { VocabularySidebar } = await import('../../src/presentation/components/VocabularySidebar');
      const user = userEvent.setup();
      
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.vocabulary).toHaveLength(3);
        expect(updatedSlide.content.vocabulary![2].term).toBe('New Term');
      });
    });

    it('should delete selected vocabulary items', async () => {
      const { VocabularySidebar } = await import('../../src/presentation/components/VocabularySidebar');
      const user = userEvent.setup();
      
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      // Select first vocabulary item
      const firstVocabCheckbox = screen.getByTestId('vocab-1-checkbox');
      await user.click(firstVocabCheckbox);

      // Click delete button
      const deleteButton = screen.getByTitle('Delete Selected');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.vocabulary).toHaveLength(1);
        expect(updatedSlide.content.vocabulary![0].id).toBe('vocab-2');
      });
    });

    it('should edit vocabulary term', async () => {
      const { VocabularySidebar } = await import('../../src/presentation/components/VocabularySidebar');
      const user = userEvent.setup();
      
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const termInput = screen.getByDisplayValue('Blockchain');
      await user.clear(termInput);
      await user.type(termInput, 'Updated Term');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.vocabulary![0].term).toBe('Updated Term');
      });
    });

    it('should edit vocabulary definition', async () => {
      const { VocabularySidebar } = await import('../../src/presentation/components/VocabularySidebar');
      const user = userEvent.setup();
      
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const definitionInput = screen.getByDisplayValue('A distributed ledger technology');
      await user.clear(definitionInput);
      await user.type(definitionInput, 'Updated definition text');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.vocabulary![0].definition).toBe('Updated definition text');
      });
    });

    it('should change vocabulary icon', async () => {
      const { VocabularySidebar } = await import('../../src/presentation/components/VocabularySidebar');
      const user = userEvent.setup();
      
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const iconSelect = screen.getByTestId('vocab-1-icon-select');
      await user.selectOptions(iconSelect, 'star');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.vocabulary![0].icon).toBe('star');
      });
    });

    it('should control vocabulary animation timing', async () => {
      const { VocabularySidebar } = await import('../../src/presentation/components/VocabularySidebar');
      const user = userEvent.setup();
      
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      // Test start time control
      const startTimeInput = screen.getByTestId('vocab-1-start-time');
      await user.clear(startTimeInput);
      await user.type(startTimeInput, '2000');

      // Test duration control
      const durationInput = screen.getByTestId('vocab-1-duration');
      await user.clear(durationInput);
      await user.type(durationInput, '4000');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        // Verify timing controls work
        expect(startTimeInput).toHaveValue(2000);
        expect(durationInput).toHaveValue(4000);
      });
    });
  });

  describe('Minimal Component Render Test', () => {
    it('should render ConceptsSidebar without errors', async () => {
      const { ConceptsSidebar } = await import('../../src/presentation/components/ConceptsSidebar');
      const user = userEvent.setup();
      
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const header = screen.getByText('Concepts');
      expect(header).toBeInTheDocument();
    });

    it('should render VocabularySidebar without errors', async () => {
      const { VocabularySidebar } = await import('../../src/presentation/components/VocabularySidebar');
      const user = userEvent.setup();
      
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const header = screen.getByText('Vocabulary');
      expect(header).toBeInTheDocument();
    });
  });
}); 