import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConceptsSidebar } from '../../src/presentation/components/ConceptsSidebar';
import type { SlideConfig } from '../../src/framework/types/slide.types';

// Mock pentru iconRegistry
vi.mock('../../src/framework/utils/iconRegistry', () => ({
  renderIcon: vi.fn(() => '🔍')
}));

// Mock pentru framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    input: ({ ...props }: any) => React.createElement('input', props),
    select: ({ children, ...props }: any) => React.createElement('select', props, children)
  },
  AnimatePresence: ({ children }: any) => React.createElement('div', {}, children),
  Reorder: ({ children, ...props }: any) => React.createElement('div', props, children),
  ReorderItem: ({ children, ...props }: any) => React.createElement('div', props, children)
}));

describe('Simple Sidebar Test', () => {
  it('should render concepts sidebar without crashing', () => {
    const mockSlide: SlideConfig = {
      id: 'test-slide',
      template: 'educational',
      content: {
        title: 'Test Content',
        subtitle: 'Test Subtitle',
        concepts: [],
        vocabulary: []
      },
      theme: 'dark-blue'
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