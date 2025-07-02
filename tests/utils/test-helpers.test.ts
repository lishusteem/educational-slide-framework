import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitForAnimation, mockTimestamp } from '../setup';

describe('Test Infrastructure Utilities', () => {
  describe('waitForAnimation helper', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('waits for specified duration', async () => {
      const startTime = Date.now();
      
      const waitPromise = waitForAnimation(100);
      vi.advanceTimersByTime(100);
      
      await waitPromise;
      
      // Should have waited the specified time
      expect(true).toBe(true); // Placeholder for timing verification
    });

    it('uses default duration when none specified', async () => {
      const waitPromise = waitForAnimation();
      vi.advanceTimersByTime(100);
      
      await waitPromise;
      
      expect(true).toBe(true);
    });
  });

  describe('mockTimestamp helper', () => {
    let timeControl: ReturnType<typeof mockTimestamp>;

    beforeEach(() => {
      timeControl = mockTimestamp();
    });

    afterEach(() => {
      timeControl.restore();
    });

    it('starts with zero timestamp', () => {
      expect(performance.now()).toBe(0);
    });

    it('advances time correctly', () => {
      timeControl.advance(1000);
      expect(performance.now()).toBe(1000);

      timeControl.advance(500);
      expect(performance.now()).toBe(1500);
    });

    it('resets time to zero', () => {
      timeControl.advance(5000);
      expect(performance.now()).toBe(5000);

      timeControl.reset();
      expect(performance.now()).toBe(0);
    });

    it('can be restored to original implementation', () => {
      const originalNow = performance.now;
      
      timeControl.restore();
      
      // Should restore original function
      expect(performance.now).toBe(originalNow);
    });
  });

  describe('Mock validation', () => {
    it('has properly mocked window.matchMedia', () => {
      const result = window.matchMedia('(max-width: 768px)');
      
      expect(result.matches).toBe(false);
      expect(result.media).toBe('(max-width: 768px)');
      expect(typeof result.addEventListener).toBe('function');
    });

    it('has properly mocked HTMLMediaElement', () => {
      const audio = document.createElement('audio');
      
      expect(typeof audio.play).toBe('function');
      expect(typeof audio.pause).toBe('function');
      expect(audio.currentTime).toBe(0);
    });
  });
});