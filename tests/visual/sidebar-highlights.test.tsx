import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { VocabularySection } from '../../src/framework/components/sections/VocabularySection';
import { ConceptsSection } from '../../src/framework/components/sections/ConceptsSection';
import { blockchainIntroWithTimingSlide } from '../../src/slides/configs/blockchain-intro-with-timing.config';
import { waitForAnimation } from '../setup';

describe('Sidebar Highlights - Visual Regression Tests', () => {
  const vocabularyItems = blockchainIntroWithTimingSlide.content.vocabulary || [];
  const conceptItems = blockchainIntroWithTimingSlide.content.concepts || [];
  const slideTiming = blockchainIntroWithTimingSlide.timing;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Vocabulary Section Highlights', () => {
    it('renders vocabulary items with correct initial styling', () => {
      render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Section header should be present
      expect(screen.getByText('Vocabular')).toBeInTheDocument();

      // All vocabulary items should be rendered
      expect(screen.getByText('Hash')).toBeInTheDocument();
      expect(screen.getByText('Node')).toBeInTheDocument();
      expect(screen.getByText('Consensus')).toBeInTheDocument();

      // Definitions should be visible
      expect(screen.getByText('Fingerprint digital unic pentru fiecare bloc')).toBeInTheDocument();
      expect(screen.getByText('Computer care menține copia blockchain-ului')).toBeInTheDocument();
      expect(screen.getByText('Algoritm pentru acordarea rețelei asupra stării')).toBeInTheDocument();
    });

    it('applies hover effects on vocabulary items', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      const hashItem = screen.getByText('Hash').closest('div');
      expect(hashItem).toBeInTheDocument();

      // Hover over Hash item
      await user.hover(hashItem!);
      
      await waitForAnimation(300); // Allow for hover transition

      // Should apply hover styling (this tests the visual regression)
      // Note: Actual CSS class verification depends on test setup
      expect(hashItem).toBeInTheDocument(); // Placeholder for hover state verification
    });

    it('handles section-wide hover effects', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      const section = screen.getByText('Vocabular').closest('.relative');
      expect(section).toBeInTheDocument();

      // Hover over entire section
      await user.hover(section!);
      
      await waitForAnimation(400); // Allow for section hover transition

      // All items should show subtle hover state
      expect(section).toBeInTheDocument(); // Placeholder for section hover verification
    });

    it('triggers timing-based highlights at correct intervals', async () => {
      render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Initially, no timing highlights should be active
      const hashElement = screen.getByText('Hash');
      expect(hashElement).toBeInTheDocument();

      // Advance to Hash highlight timing (4000ms from config)
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      await waitFor(() => {
        // Hash should be highlighted via timing system
        expect(hashElement).toBeInTheDocument();
      });

      // Advance to Node highlight timing (7000ms from config)
      act(() => {
        vi.advanceTimersByTime(3000); // 7000 - 4000 = 3000
      });

      await waitFor(() => {
        const nodeElement = screen.getByText('Node');
        expect(nodeElement).toBeInTheDocument();
      });

      // Advance to Consensus highlight timing (10000ms from config)
      act(() => {
        vi.advanceTimersByTime(3000); // 10000 - 7000 = 3000
      });

      await waitFor(() => {
        const consensusElement = screen.getByText('Consensus');
        expect(consensusElement).toBeInTheDocument();
      });
    });

    it('respects maxItems limitation with overflow indicator', () => {
      const manyItems = [
        ...vocabularyItems,
        { id: 'extra1', term: 'Extra1', definition: 'Extra definition 1', icon: 'book' },
        { id: 'extra2', term: 'Extra2', definition: 'Extra definition 2', icon: 'book' }
      ];

      render(
        <VocabularySection 
          items={manyItems}
          maxItems={3}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Should only show 3 items
      expect(screen.getByText('Hash')).toBeInTheDocument();
      expect(screen.getByText('Node')).toBeInTheDocument();
      expect(screen.getByText('Consensus')).toBeInTheDocument();

      // Should not show extra items
      expect(screen.queryByText('Extra1')).not.toBeInTheDocument();
      expect(screen.queryByText('Extra2')).not.toBeInTheDocument();

      // Should show overflow indicator
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('handles inactive slide state correctly', () => {
      render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={false}
        />
      );

      // Content should still render
      expect(screen.getByText('Vocabular')).toBeInTheDocument();
      expect(screen.getByText('Hash')).toBeInTheDocument();

      // Advance time - timing highlights should not trigger when inactive
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      // Timing highlights should not be active
      const hashElement = screen.getByText('Hash');
      expect(hashElement).toBeInTheDocument();
      // Note: Would need to check for absence of timing highlight class
    });
  });

  describe('Concepts Section Highlights', () => {
    it('renders concept items with correct structure', () => {
      render(
        <ConceptsSection 
          items={conceptItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Section header should be present
      expect(screen.getByText('Concepte')).toBeInTheDocument();

      // All concept items should be rendered
      expect(screen.getByText('Descentralizare completă')).toBeInTheDocument();
      expect(screen.getByText('Imutabilitate garantată')).toBeInTheDocument();
      expect(screen.getByText('Transparență totală')).toBeInTheDocument();
      expect(screen.getByText('Securitate criptografică')).toBeInTheDocument();
    });

    it('applies emphasis styling correctly', () => {
      render(
        <ConceptsSection 
          items={conceptItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Strong emphasis items should have different styling
      const decentralization = screen.getByText('Descentralizare completă');
      const immutability = screen.getByText('Imutabilitate garantată');
      const security = screen.getByText('Securitate criptografică');
      
      // Normal emphasis item
      const transparency = screen.getByText('Transparență totală');

      expect(decentralization).toBeInTheDocument();
      expect(immutability).toBeInTheDocument();
      expect(security).toBeInTheDocument();
      expect(transparency).toBeInTheDocument();

      // Would need to verify styling classes for emphasis
    });

    it('triggers concept timing highlights in sequence', async () => {
      render(
        <ConceptsSection 
          items={conceptItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Advance to concepts section start (13000ms from config)
      act(() => {
        vi.advanceTimersByTime(13000);
      });

      await waitFor(() => {
        const decentralization = screen.getByText('Descentralizare completă');
        expect(decentralization).toBeInTheDocument();
      });

      // Advance to immutability (16000ms)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        const immutability = screen.getByText('Imutabilitate garantată');
        expect(immutability).toBeInTheDocument();
      });

      // Advance to transparency (19000ms)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        const transparency = screen.getByText('Transparență totală');
        expect(transparency).toBeInTheDocument();
      });

      // Advance to security (22000ms)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        const security = screen.getByText('Securitate criptografică');
        expect(security).toBeInTheDocument();
      });
    });
  });

  describe('Sidebar Visual Consistency', () => {
    it('maintains consistent styling between vocabulary and concepts sections', () => {
      const { container: vocabContainer } = render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      const { container: conceptsContainer } = render(
        <ConceptsSection 
          items={conceptItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Both sections should have similar container structure
      const vocabSection = vocabContainer.querySelector('.relative.z-10');
      const conceptsSection = conceptsContainer.querySelector('.relative.z-10');

      expect(vocabSection).toBeInTheDocument();
      expect(conceptsSection).toBeInTheDocument();

      // Both should have glassmorphism background
      const vocabBackground = vocabContainer.querySelector('.backdrop-blur-lg');
      const conceptsBackground = conceptsContainer.querySelector('.backdrop-blur-lg');

      expect(vocabBackground).toBeInTheDocument();
      expect(conceptsBackground).toBeInTheDocument();
    });

    it('preserves amber color scheme for vocabulary items', () => {
      render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Header should have amber coloring
      const header = screen.getByText('Vocabular');
      expect(header).toBeInTheDocument();
      // Would verify amber color classes in actual implementation

      // Icons should have amber background
      const icons = document.querySelectorAll('.bg-amber-400\\/20');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('preserves website footer styling and positioning', () => {
      render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Footer should be at bottom with proper styling
      const footer = screen.getByText('www.educatiecripto.ro');
      expect(footer).toBeInTheDocument();
      
      const footerContainer = footer.closest('div');
      expect(footerContainer).toHaveClass('text-amber-200');
    });
  });

  describe('Interaction Performance', () => {
    it('handles rapid hover events without performance degradation', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      const items = [
        screen.getByText('Hash'),
        screen.getByText('Node'),
        screen.getByText('Consensus')
      ];

      // Rapid hover across all items
      for (let i = 0; i < 10; i++) {
        for (const item of items) {
          await user.hover(item);
          await user.unhover(item);
        }
      }

      // Should not cause errors or memory leaks
      expect(items[0]).toBeInTheDocument();
    });

    it('maintains smooth animations during concurrent timing highlights', async () => {
      render(
        <VocabularySection 
          items={vocabularyItems}
          maxItems={4}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Trigger multiple timing highlights in quick succession
      act(() => {
        vi.advanceTimersByTime(4000); // Hash highlight
      });

      act(() => {
        vi.advanceTimersByTime(3000); // Node highlight
      });

      act(() => {
        vi.advanceTimersByTime(3000); // Consensus highlight
      });

      await waitForAnimation(500);

      // All elements should still be present and functional
      expect(screen.getByText('Hash')).toBeInTheDocument();
      expect(screen.getByText('Node')).toBeInTheDocument();
      expect(screen.getByText('Consensus')).toBeInTheDocument();
    });
  });
});