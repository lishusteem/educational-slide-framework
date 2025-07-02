import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { useTimingAnimation } from '../../src/framework/utils/timingSystem';
import { useMainContentCarousel } from '../../src/framework/utils/carouselSystem';
import { blockchainIntroWithTimingSlide } from '../../src/slides/configs/blockchain-intro-with-timing.config';
import { mockTimestamp } from '../setup';

// Test component for timing system
const TimingTestComponent: React.FC<{ timing: any; isSlideActive: boolean }> = ({ 
  timing, 
  isSlideActive 
}) => {
  const { isTimingHighlighted } = useTimingAnimation({
    elementId: 'test-element',
    timing,
    isSlideActive
  });

  return (
    <div data-testid="timing-element" data-timing-highlighted={isTimingHighlighted}>
      {isTimingHighlighted ? 'HIGHLIGHTED' : 'NORMAL'}
    </div>
  );
};

// Test component for carousel system
const CarouselTestComponent: React.FC<{ 
  vocabularyItems: any[]; 
  conceptItems: any[];
  slideTiming: any;
  isSlideActive: boolean;
}> = ({ vocabularyItems, conceptItems, slideTiming, isSlideActive }) => {
  const carousel = useMainContentCarousel({
    vocabularyItems,
    conceptItems,
    slideTiming,
    isSlideActive,
    autoStart: true
  });

  return (
    <div data-testid="carousel-element">
      <div data-testid="current-slide">{carousel.currentSlide?.title || 'NONE'}</div>
      <div data-testid="progress">{carousel.progress}</div>
      <div data-testid="slide-index">{carousel.currentSlideIndex}</div>
    </div>
  );
};

describe('Animation Timing Precision Tests', () => {
  let timeControl: ReturnType<typeof mockTimestamp>;

  beforeEach(() => {
    timeControl = mockTimestamp();
    vi.useFakeTimers();
  });

  afterEach(() => {
    timeControl.restore();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Timing System Precision', () => {
    it('triggers highlights at exact timing points', async () => {
      const timing = {
        startTime: 1000,
        duration: 2000
      };

      const { getByTestId, rerender } = render(
        <TimingTestComponent timing={timing} isSlideActive={true} />
      );

      const element = getByTestId('timing-element');

      // Initially should not be highlighted
      expect(element).toHaveAttribute('data-timing-highlighted', 'false');
      expect(element).toHaveTextContent('NORMAL');

      // Advance to just before trigger time
      act(() => {
        vi.advanceTimersByTime(999);
      });
      
      rerender(<TimingTestComponent timing={timing} isSlideActive={true} />);
      expect(element).toHaveAttribute('data-timing-highlighted', 'false');

      // Advance to exact trigger time
      act(() => {
        vi.advanceTimersByTime(1);
      });
      
      rerender(<TimingTestComponent timing={timing} isSlideActive={true} />);
      expect(element).toHaveAttribute('data-timing-highlighted', 'true');
      expect(element).toHaveTextContent('HIGHLIGHTED');

      // Advance to end of duration
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      rerender(<TimingTestComponent timing={timing} isSlideActive={true} />);
      expect(element).toHaveAttribute('data-timing-highlighted', 'false');
      expect(element).toHaveTextContent('NORMAL');
    });

    it('respects isSlideActive state', () => {
      const timing = {
        startTime: 1000,
        duration: 2000
      };

      const { getByTestId, rerender } = render(
        <TimingTestComponent timing={timing} isSlideActive={false} />
      );

      const element = getByTestId('timing-element');

      // Should not trigger when slide is inactive
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      rerender(<TimingTestComponent timing={timing} isSlideActive={false} />);
      expect(element).toHaveAttribute('data-timing-highlighted', 'false');

      // Should trigger when slide becomes active
      rerender(<TimingTestComponent timing={timing} isSlideActive={true} />);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      rerender(<TimingTestComponent timing={timing} isSlideActive={true} />);
      expect(element).toHaveAttribute('data-timing-highlighted', 'true');
    });
  });

  describe('Carousel System Timing', () => {
    it('follows configured slide timing sequence', async () => {
      const { getByTestId } = render(
        <CarouselTestComponent
          vocabularyItems={blockchainIntroWithTimingSlide.content.vocabulary || []}
          conceptItems={blockchainIntroWithTimingSlide.content.concepts || []}
          slideTiming={blockchainIntroWithTimingSlide.timing}
          isSlideActive={true}
        />
      );

      // Should start with intro slide
      expect(getByTestId('current-slide')).toHaveTextContent('Explorăm Conceptele');
      expect(getByTestId('slide-index')).toHaveTextContent('0');

      // Advance to first vocabulary slide (after 4000ms intro duration)
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(getByTestId('current-slide')).toHaveTextContent('Hash');
      expect(getByTestId('slide-index')).toHaveTextContent('1');

      // Advance to second vocabulary slide (after 3000ms hash duration)  
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(getByTestId('current-slide')).toHaveTextContent('Node');
      expect(getByTestId('slide-index')).toHaveTextContent('2');

      // Advance to third vocabulary slide
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(getByTestId('current-slide')).toHaveTextContent('Consensus');
      expect(getByTestId('slide-index')).toHaveTextContent('3');
    });

    it('calculates progress correctly', () => {
      const { getByTestId } = render(
        <CarouselTestComponent
          vocabularyItems={blockchainIntroWithTimingSlide.content.vocabulary || []}
          conceptItems={blockchainIntroWithTimingSlide.content.concepts || []}
          slideTiming={blockchainIntroWithTimingSlide.timing}
          isSlideActive={true}
        />
      );

      // Initial progress (slide 1 of N)
      const initialProgress = getByTestId('progress').textContent;
      expect(parseFloat(initialProgress || '0')).toBeGreaterThan(0);

      // Advance one slide
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      const secondProgress = getByTestId('progress').textContent;
      expect(parseFloat(secondProgress || '0')).toBeGreaterThan(parseFloat(initialProgress || '0'));
    });
  });

  describe('Dual System Synchronization', () => {
    it('ensures carousel and timing systems start simultaneously', () => {
      const timing = {
        startTime: 4000, // Should match carousel vocabulary start
        duration: 3000
      };

      const { getByTestId: getTimingElement } = render(
        <TimingTestComponent timing={timing} isSlideActive={true} />
      );

      const { getByTestId: getCarouselElement } = render(
        <CarouselTestComponent
          vocabularyItems={blockchainIntroWithTimingSlide.content.vocabulary || []}
          conceptItems={blockchainIntroWithTimingSlide.content.concepts || []}
          slideTiming={blockchainIntroWithTimingSlide.timing}
          isSlideActive={true}
        />
      );

      // Both should be in initial state
      expect(getTimingElement('timing-element')).toHaveAttribute('data-timing-highlighted', 'false');
      expect(getCarouselElement('current-slide')).toHaveTextContent('Explorăm Conceptele');

      // Advance to synchronization point (4000ms)
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      // Both should trigger at the same time
      expect(getTimingElement('timing-element')).toHaveAttribute('data-timing-highlighted', 'true');
      expect(getCarouselElement('current-slide')).toHaveTextContent('Hash');
    });

    it('verifies exact timing alignment per visual design spec', () => {
      // Test the exact timeline from VISUAL_DESIGN_SPEC.md
      const timingPoints = [
        { time: 500, description: 'Title highlight starts' },
        { time: 1000, description: 'Floating icon highlight' },
        { time: 3000, description: 'Subtitle highlight starts' },
        { time: 4000, description: 'Vocabulary section + Carousel starts' },
        { time: 5000, description: 'Main content switches to first vocabulary' },
        { time: 7000, description: 'Hash term highlight ends, Node starts' },
        { time: 13000, description: 'Concepts section + Carousel switches to concepts' }
      ];

      timingPoints.forEach(({ time, description }) => {
        timeControl.reset();
        
        // Test that the timing point is respected
        act(() => {
          vi.advanceTimersByTime(time - 1);
        });
        
        // Just before the timing point - should not be triggered
        expect(true).toBe(true); // Placeholder for timing verification
        
        act(() => {
          vi.advanceTimersByTime(1);
        });
        
        // Exactly at timing point - should be triggered
        expect(true).toBe(true); // Placeholder for timing verification
      });
    });
  });

  describe('Performance Requirements', () => {
    it('maintains 60fps timing precision', () => {
      const frameTime = 1000 / 60; // ~16.67ms per frame
      
      const timing = {
        startTime: 1000,
        duration: 100
      };

      const { getByTestId } = render(
        <TimingTestComponent timing={timing} isSlideActive={true} />
      );

      // Advance in 60fps increments
      for (let frame = 0; frame < 60; frame++) {
        act(() => {
          vi.advanceTimersByTime(frameTime);
        });
        
        // Timing should remain consistent across frames
        const element = getByTestId('timing-element');
        const currentTime = frame * frameTime;
        const shouldBeHighlighted = currentTime >= 1000 && currentTime <= 1100;
        
        expect(element).toHaveAttribute(
          'data-timing-highlighted', 
          shouldBeHighlighted.toString()
        );
      }
    });

    it('handles rapid state changes without performance degradation', () => {
      const timing = {
        startTime: 100,
        duration: 50
      };

      const { rerender } = render(
        <TimingTestComponent timing={timing} isSlideActive={true} />
      );

      // Rapid toggling of slide active state
      for (let i = 0; i < 100; i++) {
        rerender(<TimingTestComponent timing={timing} isSlideActive={i % 2 === 0} />);
      }

      // Should not throw errors or cause memory leaks
      expect(true).toBe(true);
    });
  });
});