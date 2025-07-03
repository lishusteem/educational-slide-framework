import React from 'react';

// Mock pentru iconRegistry
vi.mock('../../src/framework/utils/iconRegistry', () => ({
  renderIcon: vi.fn(() => '🔍')
}));

// Mock pentru framer-motion
vi.mock('framer-motion', () => {
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

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SlideConfig } from '../../src/framework/types/slide.types';

describe('Sidebar Control Panel Tests', () => {
  let mockSlide: SlideConfig;
  let mockOnSlideUpdate: (slide: SlideConfig) => void;

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
      theme: 'dark-blue'
    };
  });

  describe('Concepts Sidebar Control Panel', () => {
    it('should add new concept item when Add button is clicked', async () => {
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
      const user = userEvent.setup();
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      // Select first concept
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

    it('should duplicate selected concept items', async () => {
      const user = userEvent.setup();
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      // Select first concept
      const firstConceptCheckbox = screen.getByTestId('concept-1-checkbox');
      await user.click(firstConceptCheckbox);

      // Click duplicate button
      const duplicateButton = screen.getByTitle('Duplicate Selected');
      await user.click(duplicateButton);

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.concepts).toHaveLength(3);
        expect(updatedSlide.content.concepts![2].text).toBe('First Concept (Copy)');
      });
    });

    it('should update concept text when edited', async () => {
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

    it('should update concept icon when changed', async () => {
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

    it('should update concept emphasis level', async () => {
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

    it('should update concept animation start time', async () => {
      const user = userEvent.setup();
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const startTimeInput = screen.getByTestId('concept-1-start-time');
      await user.clear(startTimeInput);
      await user.type(startTimeInput, '1500');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.concepts![0].startTime).toBe(1500);
      });
    });

    it('should update concept animation duration', async () => {
      const user = userEvent.setup();
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const durationInput = screen.getByTestId('concept-1-duration');
      await user.clear(durationInput);
      await user.type(durationInput, '3000');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.concepts![0].duration).toBe(3000);
      });
    });

    it('should filter concepts by search term', async () => {
      const user = userEvent.setup();
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search concepts...');
      await user.type(searchInput, 'First');

      await waitFor(() => {
        expect(screen.getByDisplayValue('First Concept')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('Second Concept')).not.toBeInTheDocument();
      });
    });

    it('should filter concepts by emphasis level', async () => {
      const user = userEvent.setup();
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const emphasisFilter = screen.getByDisplayValue('All Emphasis Levels');
      await user.selectOptions(emphasisFilter, 'strong');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Second Concept')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('First Concept')).not.toBeInTheDocument();
      });
    });

    it('should select all concepts when Select All is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const selectAllButton = screen.getByText('Select All (2)');
      await user.click(selectAllButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox).toBeChecked();
        });
      });
    });

    it('should clear selection when Clear is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      // First select all
      const selectAllButton = screen.getByText('Select All (2)');
      await user.click(selectAllButton);

      // Then clear selection
      const clearButton = screen.getByText('Clear (2)');
      await user.click(clearButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox).not.toBeChecked();
        });
      });
    });
  });

  describe('Vocabulary Sidebar Control Panel', () => {
    it('should add new vocabulary item when Add button is clicked', async () => {
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

    it('should duplicate selected vocabulary items', async () => {
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

      // Click duplicate button
      const duplicateButton = screen.getByTitle('Duplicate Selected');
      await user.click(duplicateButton);

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.vocabulary).toHaveLength(3);
        expect(updatedSlide.content.vocabulary![2].term).toBe('Blockchain (Copy)');
      });
    });

    it('should update vocabulary term when edited', async () => {
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

    it('should update vocabulary definition when edited', async () => {
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

    it('should update vocabulary icon when changed', async () => {
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

    it('should update vocabulary animation start time', async () => {
      const user = userEvent.setup();
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const startTimeInput = screen.getByTestId('vocab-1-start-time');
      await user.clear(startTimeInput);
      await user.type(startTimeInput, '2000');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.vocabulary![0].startTime).toBe(2000);
      });
    });

    it('should update vocabulary animation duration', async () => {
      const user = userEvent.setup();
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const durationInput = screen.getByTestId('vocab-1-duration');
      await user.clear(durationInput);
      await user.type(durationInput, '4000');

      await waitFor(() => {
        expect(mockOnSlideUpdate).toHaveBeenCalled();
        const updatedSlide = mockOnSlideUpdate.mock.calls[0][0];
        expect(updatedSlide.content.vocabulary![0].duration).toBe(4000);
      });
    });

    it('should filter vocabulary by search term', async () => {
      const user = userEvent.setup();
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search vocabulary...');
      await user.type(searchInput, 'Blockchain');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Blockchain')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('Cryptocurrency')).not.toBeInTheDocument();
      });
    });

    it('should filter vocabulary by definition', async () => {
      const user = userEvent.setup();
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search vocabulary...');
      await user.type(searchInput, 'cryptography');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Cryptocurrency')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('Blockchain')).not.toBeInTheDocument();
      });
    });

    it('should select all vocabulary items when Select All is clicked', async () => {
      const user = userEvent.setup();
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      const selectAllButton = screen.getByText('Select All (2)');
      await user.click(selectAllButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox).toBeChecked();
        });
      });
    });

    it('should clear selection when Clear is clicked', async () => {
      const user = userEvent.setup();
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
        />
      );

      // First select all
      const selectAllButton = screen.getByText('Select All (2)');
      await user.click(selectAllButton);

      // Then clear selection
      const clearButton = screen.getByText('Clear (2)');
      await user.click(clearButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox).not.toBeChecked();
        });
      });
    });
  });

  describe('Sidebar Collapse/Expand Functionality', () => {
    it('should collapse concepts sidebar when toggle button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnToggleCollapse = vi.fn();
      
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
          onToggleCollapse={mockOnToggleCollapse}
        />
      );

      const toggleButton = screen.getByRole('button', { name: /chevron-right/i });
      await user.click(toggleButton);

      expect(mockOnToggleCollapse).toHaveBeenCalled();
    });

    it('should collapse vocabulary sidebar when toggle button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnToggleCollapse = vi.fn();
      
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
          onToggleCollapse={mockOnToggleCollapse}
        />
      );

      const toggleButton = screen.getByRole('button', { name: /chevron-left/i });
      await user.click(toggleButton);

      expect(mockOnToggleCollapse).toHaveBeenCalled();
    });

    it('should render collapsed concepts sidebar correctly', () => {
      render(
        <ConceptsSidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
          isCollapsed={true}
        />
      );

      expect(screen.getByText('Concepts')).toBeInTheDocument();
      expect(screen.queryByText('Add')).not.toBeInTheDocument();
    });

    it('should render collapsed vocabulary sidebar correctly', () => {
      render(
        <VocabularySidebar
          slide={mockSlide}
          onSlideUpdate={mockOnSlideUpdate}
          isCollapsed={true}
        />
      );

      expect(screen.getByText('Vocabulary')).toBeInTheDocument();
      expect(screen.queryByText('Add')).not.toBeInTheDocument();
    });
  });
}); 