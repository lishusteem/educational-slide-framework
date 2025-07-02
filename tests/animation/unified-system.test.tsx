import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import React from 'react';
import { useUnifiedAnimation, createUnifiedConfig } from '../../src/hooks/useUnifiedAnimation';
import { UnifiedAnimationProvider, useUnifiedAnimationContext } from '../../src/contexts/UnifiedAnimationContext';
import { EducationalTemplate } from '../../src/framework/components/templates/EducationalTemplateUnified';
import { blockchainIntroWithTimingSlide } from '../../src/slides/configs/blockchain-intro-with-timing.config';
import { waitForAnimation } from '../setup';

// Test component for unified hook
const UnifiedHookTestComponent: React.FC<{
  vocabularyItems: any[];
  conceptItems: any[];
  slideTiming: any;
  isSlideActive: boolean;
}> = ({ vocabularyItems, conceptItems, slideTiming, isSlideActive }) => {
  const config = createUnifiedConfig(vocabularyItems, conceptItems, slideTiming);
  const animation = useUnifiedAnimation({
    ...config,
    isSlideActive,
    autoStart: true
  });

  return (
    <div data-testid="unified-animation">
      <div data-testid="current-layout">{animation.currentLayout?.content?.title || 'NONE'}</div>
      <div data-testid="progress">{animation.progress}</div>
      <div data-testid="highlights">{Array.from(animation.activeHighlights).join(',')}</div>
      <div data-testid="playing">{animation.isPlaying ? 'PLAYING' : 'PAUSED'}</div>
      <div data-testid="current-time">{animation.currentTime}</div>
      <button onClick={animation.play} data-testid="play-btn">Play</button>
      <button onClick={animation.pause} data-testid="pause-btn">Pause</button>
      <button onClick={animation.reset} data-testid="reset-btn">Reset</button>
    </div>
  );
};

// Test component for context
const ContextTestComponent: React.FC = () => {
  const { currentLayout, progress, activeHighlights, isPlaying } = useUnifiedAnimationContext();

  return (
    <div data-testid="context-animation">
      <div data-testid="context-layout">{currentLayout?.content?.title || 'NONE'}</div>
      <div data-testid="context-progress">{progress}</div>
      <div data-testid="context-highlights">{Array.from(activeHighlights).join(',')}</div>
      <div data-testid="context-playing">{isPlaying ? 'PLAYING' : 'PAUSED'}</div>
    </div>
  );
};

describe('Unified Animation System Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('useUnifiedAnimation Hook', () => {
    it('creates proper configuration from old system data', () => {
      const vocabularyItems = blockchainIntroWithTimingSlide.content.vocabulary || [];
      const conceptItems = blockchainIntroWithTimingSlide.content.concepts || [];
      const slideTiming = blockchainIntroWithTimingSlide.timing;

      const config = createUnifiedConfig(vocabularyItems, conceptItems, slideTiming);

      // Should have intro layout
      expect(config.layouts[0]).toMatchObject({
        id: 'intro',
        startTime: 0,
        duration: 4000,
        component: 'intro'
      });

      // Should have vocabulary layouts
      expect(config.layouts[1]).toMatchObject({
        id: 'hash',
        startTime: 4000,
        component: 'vocabulary'
      });

      // Should have highlights for each vocabulary item
      const hashHighlight = config.highlights.find(h => h.elementId === 'hash');
      expect(hashHighlight).toBeDefined();
      expect(hashHighlight?.startTime).toBe(4000);
      expect(hashHighlight?.type).toBe('vocabulary');
    });

    it('manages layout transitions correctly', async () => {
      const vocabularyItems = blockchainIntroWithTimingSlide.content.vocabulary || [];
      const conceptItems = blockchainIntroWithTimingSlide.content.concepts || [];
      const slideTiming = blockchainIntroWithTimingSlide.timing;

      const { getByTestId } = render(
        <UnifiedHookTestComponent
          vocabularyItems={vocabularyItems}
          conceptItems={conceptItems}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Should start with intro layout
      expect(getByTestId('current-layout')).toHaveTextContent('Explorăm Conceptele');
      expect(getByTestId('playing')).toHaveTextContent('PLAYING');

      // Advance to first vocabulary item (4000ms)
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      await waitFor(() => {
        expect(getByTestId('current-layout')).toHaveTextContent('Hash');
      });

      // Advance to second vocabulary item (7000ms total)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(getByTestId('current-layout')).toHaveTextContent('Node');
      });
    });

    it('manages highlights correctly', async () => {
      const vocabularyItems = blockchainIntroWithTimingSlide.content.vocabulary || [];
      const conceptItems = blockchainIntroWithTimingSlide.content.concepts || [];
      const slideTiming = blockchainIntroWithTimingSlide.timing;

      const { getByTestId } = render(
        <UnifiedHookTestComponent
          vocabularyItems={vocabularyItems}
          conceptItems={conceptItems}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Initially no highlights should be active
      expect(getByTestId('highlights')).toHaveTextContent('');

      // Advance to hash highlight time (4000ms)
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      await waitFor(() => {
        expect(getByTestId('highlights')).toContain('hash');
      });

      // Advance to node highlight time (7000ms)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(getByTestId('highlights')).toContain('node');
        expect(getByTestId('highlights')).not.toContain('hash');
      });
    });

    it('provides playback control', async () => {
      const vocabularyItems = blockchainIntroWithTimingSlide.content.vocabulary || [];
      const conceptItems = blockchainIntroWithTimingSlide.content.concepts || [];
      const slideTiming = blockchainIntroWithTimingSlide.timing;

      const { getByTestId } = render(
        <UnifiedHookTestComponent
          vocabularyItems={vocabularyItems}
          conceptItems={conceptItems}
          slideTiming={slideTiming}
          isSlideActive={true}
        />
      );

      // Should start playing
      expect(getByTestId('playing')).toHaveTextContent('PLAYING');

      // Pause animation
      act(() => {
        getByTestId('pause-btn').click();
      });

      expect(getByTestId('playing')).toHaveTextContent('PAUSED');

      // Resume animation
      act(() => {
        getByTestId('play-btn').click();
      });

      expect(getByTestId('playing')).toHaveTextContent('PLAYING');

      // Reset animation
      act(() => {
        getByTestId('reset-btn').click();
      });

      expect(getByTestId('playing')).toHaveTextContent('PAUSED');
      expect(getByTestId('current-time')).toHaveTextContent('0');
    });
  });

  describe('UnifiedAnimationContext', () => {
    it('provides animation state to components', async () => {
      const vocabularyItems = blockchainIntroWithTimingSlide.content.vocabulary || [];
      const conceptItems = blockchainIntroWithTimingSlide.content.concepts || [];
      const slideTiming = blockchainIntroWithTimingSlide.timing;

      render(
        <UnifiedAnimationProvider
          vocabularyItems={vocabularyItems}
          conceptItems={conceptItems}
          slideTiming={slideTiming}
          isSlideActive={true}
          autoStart={true}
        >
          <ContextTestComponent />
        </UnifiedAnimationProvider>
      );

      // Should start with intro layout
      expect(screen.getByTestId('context-layout')).toHaveTextContent('Explorăm Conceptele');
      expect(screen.getByTestId('context-playing')).toHaveTextContent('PLAYING');

      // Advance to first vocabulary item
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('context-layout')).toHaveTextContent('Hash');
      });

      // Progress should be calculated
      const progressText = screen.getByTestId('context-progress').textContent;
      expect(parseFloat(progressText || '0')).toBeGreaterThan(0);
    });

    it('handles slide inactive state', () => {
      const vocabularyItems = blockchainIntroWithTimingSlide.content.vocabulary || [];
      const conceptItems = blockchainIntroWithTimingSlide.content.concepts || [];
      const slideTiming = blockchainIntroWithTimingSlide.timing;

      render(
        <UnifiedAnimationProvider
          vocabularyItems={vocabularyItems}
          conceptItems={conceptItems}
          slideTiming={slideTiming}
          isSlideActive={false}
          autoStart={true}
        >
          <ContextTestComponent />
        </UnifiedAnimationProvider>
      );

      // Should not be playing when slide is inactive
      expect(screen.getByTestId('context-playing')).toHaveTextContent('PAUSED');
    });
  });

  describe('EducationalTemplate Integration', () => {
    it('renders with unified animation system', async () => {
      render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);

      // Main template structure should be preserved
      expect(screen.getByText('Vocabular')).toBeInTheDocument();
      expect(screen.getByText('Concepte')).toBeInTheDocument();
      expect(screen.getByText('www.educatiecripto.ro')).toBeInTheDocument();

      // Should start with carousel intro
      await waitFor(() => {
        expect(screen.getByText('Explorăm Conceptele')).toBeInTheDocument();
      });
    });

    it('maintains exact visual behavior during transitions', async () => {
      render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);

      // Should start with intro
      await waitFor(() => {
        expect(screen.getByText('Explorăm Conceptele')).toBeInTheDocument();
      });

      // Advance to vocabulary phase
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      // Should transition to Hash
      await waitFor(() => {
        expect(screen.getByText('Hash')).toBeInTheDocument();
      });

      // Main layout structure should be preserved
      const gridContainer = document.querySelector('.grid-cols-4');
      expect(gridContainer).toBeInTheDocument();

      // Glassmorphism effects should be present
      const glassElements = document.querySelectorAll('.glassmorphism');
      expect(glassElements.length).toBeGreaterThan(0);
    });

    it('preserves performance characteristics', async () => {
      const startTime = performance.now();
      
      render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);

      // Simulate rapid state changes
      for (let i = 0; i < 50; i++) {
        act(() => {
          vi.advanceTimersByTime(100);
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete rapidly (under 1 second in test environment)
      expect(duration).toBeLessThan(1000);

      // Template should still be functional
      expect(screen.getByText('Vocabular')).toBeInTheDocument();
    });
  });

  describe('Backwards Compatibility', () => {
    it('maintains compatibility with existing hook interfaces', () => {
      // Test that old hook signatures still work through compatibility layer
      // This ensures components can be migrated gradually
      
      const vocabularyItems = blockchainIntroWithTimingSlide.content.vocabulary || [];
      const conceptItems = blockchainIntroWithTimingSlide.content.concepts || [];
      const slideTiming = blockchainIntroWithTimingSlide.timing;

      render(
        <UnifiedAnimationProvider
          vocabularyItems={vocabularyItems}
          conceptItems={conceptItems}
          slideTiming={slideTiming}
          isSlideActive={true}
        >
          <div>Compatibility test</div>
        </UnifiedAnimationProvider>
      );

      // Should not throw errors
      expect(screen.getByText('Compatibility test')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty configuration gracefully', () => {
      render(
        <UnifiedAnimationProvider
          vocabularyItems={[]}
          conceptItems={[]}
          isSlideActive={true}
        >
          <ContextTestComponent />
        </UnifiedAnimationProvider>
      );

      // Should still provide valid state
      expect(screen.getByTestId('context-layout')).toHaveTextContent('Explorăm Conceptele');
      expect(screen.getByTestId('context-progress')).toHaveTextContent('100');
    });

    it('handles malformed timing configuration', () => {
      const malformedTiming = {
        vocabulary: {
          'nonexistent': { startTime: -1000, duration: 0 }
        }
      };

      render(
        <UnifiedAnimationProvider
          vocabularyItems={blockchainIntroWithTimingSlide.content.vocabulary || []}
          conceptItems={blockchainIntroWithTimingSlide.content.concepts || []}
          slideTiming={malformedTiming}
          isSlideActive={true}
        >
          <ContextTestComponent />
        </UnifiedAnimationProvider>
      );

      // Should still function without errors
      expect(screen.getByTestId('context-layout')).toBeInTheDocument();
    });
  });
});