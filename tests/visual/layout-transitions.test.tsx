import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { EducationalTemplate } from '../../src/framework/components/templates/EducationalTemplate';
import { blockchainIntroWithTimingSlide } from '../../src/slides/configs/blockchain-intro-with-timing.config';
import { waitForAnimation, mockTimestamp } from '../setup';

describe('Layout Transitions - Visual Regression Tests', () => {
  let timeControl: ReturnType<typeof mockTimestamp>;

  beforeEach(() => {
    timeControl = mockTimestamp();
  });

  afterEach(() => {
    timeControl.restore();
  });

  it('renders educational template with correct initial layout', () => {
    render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);
    
    // Verify main elements are present
    expect(screen.getByText('Blockchain: Revoluția Digitală a Încrederii')).toBeInTheDocument();
    expect(screen.getByText('Înțelegerea tehnologiei care redefinește tranzacțiile și contractele digitale')).toBeInTheDocument();
    
    // Verify vocabulary section exists
    expect(screen.getByText('Vocabular')).toBeInTheDocument();
    expect(screen.getByText('Hash')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();
    expect(screen.getByText('Consensus')).toBeInTheDocument();
    
    // Verify concepts section exists
    expect(screen.getByText('Concepte')).toBeInTheDocument();
    expect(screen.getByText('Descentralizare completă')).toBeInTheDocument();
    expect(screen.getByText('Imutabilitate garantată')).toBeInTheDocument();
    expect(screen.getByText('Transparență totală')).toBeInTheDocument();
    expect(screen.getByText('Securitate criptografică')).toBeInTheDocument();
  });

  it('displays static mode when no timing configuration is used', () => {
    const staticConfig = {
      ...blockchainIntroWithTimingSlide,
      timing: undefined
    };
    
    render(<EducationalTemplate config={staticConfig} isSlideActive={true} />);
    
    // In static mode, title should be visible immediately
    expect(screen.getByText('Blockchain: Revoluția Digitală a Încrederii')).toBeVisible();
    
    // Floating icon should be present
    const iconContainer = screen.getByText('Blockchain: Revoluția Digitală a Încrederii').closest('.preserve-3d');
    expect(iconContainer).toBeInTheDocument();
  });

  it('displays carousel mode when timing configuration is present', async () => {
    render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);
    
    // Should start with intro slide in carousel mode
    await waitFor(() => {
      expect(screen.getByText('Explorăm Conceptele')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Progress bar should be present in carousel mode
    const progressBar = document.querySelector('.h-0\\.5');
    expect(progressBar).toBeInTheDocument();
  });

  it('handles slide transitions correctly in carousel mode', async () => {
    render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);
    
    // Start with intro
    await waitFor(() => {
      expect(screen.getByText('Explorăm Conceptele')).toBeInTheDocument();
    });
    
    // Advance time to trigger first vocabulary item (4000ms)
    timeControl.advance(4000);
    
    await waitForAnimation(500); // Allow for transition
    
    // Should show Hash vocabulary item
    await waitFor(() => {
      expect(screen.getByText('Hash')).toBeInTheDocument();
    });
  });

  it('preserves responsive layout structure', () => {
    render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);
    
    // Main container should have proper grid structure
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-4'); // 3 cols main + 1 col sidebar
    
    // Main content should span 3 columns
    const mainContent = document.querySelector('.col-span-3');
    expect(mainContent).toBeInTheDocument();
  });

  it('applies correct glassmorphism and background effects', () => {
    render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);
    
    // Main container should have glassmorphism class
    const glassContainer = document.querySelector('.glassmorphism');
    expect(glassContainer).toBeInTheDocument();
    expect(glassContainer).toHaveClass('rounded-3xl');
    
    // Background orbs should be present
    const backgroundOrbs = document.querySelectorAll('.bg-blue-400\\/10, .bg-indigo-400\\/10, .bg-cyan-400\\/5');
    expect(backgroundOrbs.length).toBeGreaterThan(0);
  });

  it('maintains proper z-index layering', () => {
    render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);
    
    // Sidebar should have proper z-index
    const sidebar = document.querySelector('.relative.z-10');
    expect(sidebar).toBeInTheDocument();
    
    // Background elements should be behind content
    const backgroundElements = document.querySelector('.absolute.inset-0.overflow-hidden');
    expect(backgroundElements).toBeInTheDocument();
  });

  it('renders website footer correctly', () => {
    render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={true} />);
    
    // Footer should contain website URL
    expect(screen.getByText('www.educatiecripto.ro')).toBeInTheDocument();
    
    // Footer should have proper styling
    const footer = screen.getByText('www.educatiecripto.ro').closest('div');
    expect(footer).toHaveClass('text-amber-200');
  });

  it('handles inactive slide state correctly', () => {
    render(<EducationalTemplate config={blockchainIntroWithTimingSlide} isSlideActive={false} />);
    
    // Content should still render but animations should be paused
    expect(screen.getByText('Blockchain: Revoluția Digitală a Încrederii')).toBeInTheDocument();
    
    // Timing-based highlights should not be active when slide is inactive
    const timingElements = document.querySelectorAll('[data-timing-highlighted]');
    timingElements.forEach(element => {
      expect(element).not.toHaveAttribute('data-timing-highlighted', 'true');
    });
  });
});