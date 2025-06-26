/**
 * Complete Presentation Configuration
 * Demonstrating multi-slide presentation capability
 */

import type { PresentationConfig } from '../../framework/types/presentation.types';
import { blockchainIntroSlide } from './blockchain-intro.config';
import { cryptoBasicsSlide } from './crypto-basics.config';

export const blockchainPresentationConfig: PresentationConfig = {
  id: 'blockchain-fundamentals',
  title: 'Blockchain: Fundamentele Tehnologiei Viitorului',
  description: 'O prezentare comprehensivă despre blockchain și criptografie',
  author: 'Educatie Cripto',
  slides: [
    blockchainIntroSlide,
    cryptoBasicsSlide
  ],
  settings: {
    autoAdvance: false,
    autoAdvanceDelay: 30000, // 30 seconds
    controls: true,
    fullscreenOnStart: false,
    showProgress: true,
    allowKeyboardNavigation: true,
    loop: false
  },
  metadata: {
    createdAt: new Date().toISOString(),
    tags: ['blockchain', 'crypto', 'educatie', 'tehnologie'],
    category: 'Educație Tehnologică',
    duration: 600 // 10 minutes estimated
  }
}; 