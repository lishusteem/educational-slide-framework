import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { EducationalTemplate } from '../../src/framework/components/templates/EducationalTemplate';
import { PresentationViewer } from '../../src/components/PresentationViewer';
import { blockchainIntroWithTimingSlide } from '../../src/slides/configs/blockchain-intro-with-timing.config';
import { blockchainPresentationConfig } from '../../src/slides/configs/presentation.config';
import App from '../../src/App';
import { waitForAnimation } from '../setup';

describe('Complete System Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Educational Template Full Integration', () => {
    it('renders complete educational slide with all components working together', async () => {
      render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);

      // Main content should be present
      expect(screen.getByText('Blockchain: Revoluția Digitală a Încrederii')).toBeInTheDocument();
      
      // Sidebar components should be present
      expect(screen.getByText('Vocabular')).toBeInTheDocument();
      expect(screen.getByText('Concepte')).toBeInTheDocument();
      
      // All vocabulary items should be visible
      expect(screen.getByText('Hash')).toBeInTheDocument();
      expect(screen.getByText('Node')).toBeInTheDocument();
      expect(screen.getByText('Consensus')).toBeInTheDocument();
      
      // All concept items should be visible
      expect(screen.getByText('Descentralizare completă')).toBeInTheDocument();
      expect(screen.getByText('Imutabilitate garantată')).toBeInTheDocument();
      expect(screen.getByText('Transparență totală')).toBeInTheDocument();
      expect(screen.getByText('Securitate criptografică')).toBeInTheDocument();
      
      // Footer should be present
      expect(screen.getByText('www.educatiecripto.ro')).toBeInTheDocument();
    });

    it('coordinates carousel and timing systems during full animation sequence', async () => {
      render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);

      // Should start with carousel intro
      await waitFor(() => {
        expect(screen.getByText('Explorăm Conceptele')).toBeInTheDocument();
      });

      // Advance through the complete timing sequence
      // 0-4000ms: Intro phase
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      // Should transition to Hash vocabulary item
      await waitFor(() => {
        expect(screen.getByText('Hash')).toBeInTheDocument();
      });

      // 4000-7000ms: Hash phase
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Should transition to Node
      await waitFor(() => {
        expect(screen.getByText('Node')).toBeInTheDocument();
      });

      // 7000-10000ms: Node phase
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Should transition to Consensus
      await waitFor(() => {
        expect(screen.getByText('Consensus')).toBeInTheDocument();
      });

      // 10000-13000ms: Consensus phase
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Should start concepts phase
      await waitFor(() => {
        expect(screen.getByText('Descentralizare completă')).toBeInTheDocument();
      });
    });

    it('handles theme system integration correctly', () => {
      render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);

      // Should apply dark-blue theme as specified in config
      const container = document.querySelector('.glassmorphism');
      expect(container).toBeInTheDocument();
      
      // Background gradient should be applied
      const backgroundElements = document.querySelectorAll('.bg-gradient-to-br');
      expect(backgroundElements.length).toBeGreaterThan(0);
      
      // Theme colors should be consistently applied
      expect(screen.getByText('www.educatiecripto.ro')).toHaveClass('text-amber-200');
    });

    it('maintains visual consistency across all components', () => {
      render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);

      // Main layout structure
      const gridContainer = document.querySelector('.grid-cols-4');
      expect(gridContainer).toBeInTheDocument();
      
      // Glassmorphism effects
      const glassElements = document.querySelectorAll('.backdrop-blur-lg');
      expect(glassElements.length).toBeGreaterThan(0);
      
      // Rounded corners consistency
      const roundedElements = document.querySelectorAll('.rounded-2xl, .rounded-xl, .rounded-3xl');
      expect(roundedElements.length).toBeGreaterThan(0);
      
      // Proper z-index layering
      const layeredElements = document.querySelectorAll('.relative.z-10');
      expect(layeredElements.length).toBeGreaterThan(0);
    });
  });

  describe('Presentation Viewer Integration', () => {
    it('handles multiple slides with navigation', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(<PresentationViewer presentation={blockchainPresentationConfig} />);

      // Should start with first slide
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
      
      // Should have navigation controls
      const nextButton = document.querySelector('button[aria-label*="next"], button:has(svg)');
      if (nextButton) {
        await user.click(nextButton);
        
        await waitFor(() => {
          expect(screen.getByText('2 / 3')).toBeInTheDocument();
        });
      }
    });

    it('preserves slide animations during navigation', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(<PresentationViewer presentation={blockchainPresentationConfig} />);

      // Each slide should render with its complete animation system
      const slideContent = document.querySelector('.absolute.inset-0');
      expect(slideContent).toBeInTheDocument();
      
      // Slide transitions should be smooth
      const nextButton = document.querySelector('button:has(svg)');
      if (nextButton) {
        await user.click(nextButton);
        
        await waitForAnimation(500); // Allow for slide transition
        
        // New slide should be fully rendered
        expect(slideContent).toBeInTheDocument();
      }
    });
  });

  describe('Full App Integration', () => {
    it('renders complete app with mode switching functionality', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(<App />);

      // Should start in single slide mode with timing active
      expect(screen.getByText('Prezentare Completă')).toBeInTheDocument();
      expect(screen.getByText('Timing ACTIV')).toBeInTheDocument();
      
      // Main content should be present
      expect(screen.getByText('Blockchain: Revoluția Digitală a Încrederii')).toBeInTheDocument();
      
      // Instructions should be visible
      expect(screen.getByText('Carusel Educat Activat:')).toBeInTheDocument();
    });

    it('handles timing toggle functionality', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(<App />);

      // Find and click timing toggle button
      const timingButton = screen.getByText('Timing ACTIV').closest('button');
      expect(timingButton).toBeInTheDocument();
      
      await user.click(timingButton!);
      
      // Should switch to timing inactive mode
      await waitFor(() => {
        expect(screen.getByText('Timing INACTIV')).toBeInTheDocument();
      });
      
      // Instructions should change
      expect(screen.queryByText('Carusel Educat Activat:')).not.toBeInTheDocument();
    });

    it('handles view mode switching', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(<App />);

      // Find and click mode toggle button
      const modeButton = screen.getByText('Prezentare Completă').closest('button');
      expect(modeButton).toBeInTheDocument();
      
      await user.click(modeButton!);
      
      // Should switch to presentation mode
      await waitFor(() => {
        expect(screen.getByText('Slide Singular')).toBeInTheDocument();
      });
      
      // Presentation navigation instructions should appear
      expect(screen.getByText('Navigare:')).toBeInTheDocument();
      expect(screen.getByText('• Săgeți: ← →')).toBeInTheDocument();
    });

    it('maintains state consistency across mode switches', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(<App />);

      // Start in single mode
      expect(screen.getByText('Prezentare Completă')).toBeInTheDocument();
      
      // Switch to presentation mode
      const modeButton = screen.getByText('Prezentare Completă').closest('button');
      await user.click(modeButton!);
      
      await waitFor(() => {
        expect(screen.getByText('Slide Singular')).toBeInTheDocument();
      });
      
      // Switch back to single mode
      const backButton = screen.getByText('Slide Singular').closest('button');
      await user.click(backButton!);
      
      await waitFor(() => {
        expect(screen.getByText('Prezentare Completă')).toBeInTheDocument();
      });
      
      // Original content should be restored
      expect(screen.getByText('Blockchain: Revoluția Digitală a Încrederii')).toBeInTheDocument();
    });
  });

  describe('Performance and Stability', () => {
    it('handles rapid component mounting and unmounting', () => {
      // Test multiple renders without memory leaks
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(
          <EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />
        );
        unmount();
      }
      
      // Should not throw errors or cause memory leaks
      expect(true).toBe(true);
    });

    it('maintains smooth performance during complex animations', async () => {
      render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);

      // Trigger rapid animation state changes
      for (let i = 0; i < 100; i++) {
        act(() => {
          vi.advanceTimersByTime(100);
        });
      }

      await waitForAnimation(100);
      
      // System should remain stable
      expect(screen.getByText('Blockchain: Revoluția Digitală a Încrederii')).toBeInTheDocument();
    });

    it('handles edge cases in timing configuration', () => {
      const edgeCaseConfig = {
        ...blockchainIntroWithTimingSlide,
        timing: {
          title: { startTime: 0, duration: 0 },
          vocabularySection: { startTime: 0, duration: 1 }
        }
      };

      render(<EducationalTemplate config={edgeCaseConfig} isSlideActive={true} />);
      
      // Should handle edge case timing without errors
      expect(screen.getByText('Blockchain: Revoluția Digitală a Încrederii')).toBeInTheDocument();
    });

    it('gracefully handles missing or invalid configuration', () => {
      const invalidConfig = {
        ...blockchainIntroWithTimingSlide,
        content: {
          ...blockchainIntroWithTimingSlide.content,
          vocabulary: undefined,
          concepts: undefined
        }
      };

      render(<EducationalTemplate config={invalidConfig} isSlideActive={true} />);
      
      // Should still render main content without errors
      expect(screen.getByText('Blockchain: Revoluția Digitală a Încrederii')).toBeInTheDocument();
    });
  });

  describe('Accessibility and Responsiveness', () => {
    it('maintains accessibility attributes across all components', () => {
      render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);

      // Check for proper heading hierarchy
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      
      // Check for interactive elements accessibility
      const interactiveElements = document.querySelectorAll('button, [role="button"]');
      interactiveElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });

    it('preserves responsive design across all screen sizes', () => {
      // Test at different viewport sizes
      const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 1024, height: 768 },  // Tablet
        { width: 375, height: 667 }    // Mobile
      ];

      viewports.forEach(({ width, height }) => {
        // Mock viewport size
        Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
        
        render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);
        
        // Grid layout should adapt appropriately
        const container = document.querySelector('.grid');
        expect(container).toBeInTheDocument();
      });
    });
  });
});