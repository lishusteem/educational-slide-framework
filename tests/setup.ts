import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLMediaElement for audio tests
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

// Custom test utilities
export const createTestWrapper = (ui: React.ReactElement) => {
  return ui;
};

// Timing test helpers
export const waitForAnimation = (duration = 100) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

export const mockTimestamp = () => {
  let currentTime = 0;
  const spy = vi.spyOn(performance, 'now').mockImplementation(() => currentTime);
  
  return {
    advance: (ms: number) => {
      currentTime += ms;
    },
    reset: () => {
      currentTime = 0;
    },
    restore: () => {
      spy.mockRestore();
    }
  };
};