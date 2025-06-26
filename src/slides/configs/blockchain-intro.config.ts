/**
 * Basic Blockchain Introduction Slide Configuration
 * Demonstrates adaptive sidebar system with minimal elements
 * Testing: 2 vocabulary items + 1 concept item for adaptive height distribution
 */

import type { SlideConfig } from '../../framework/types/slide.types';

export const blockchainIntroSlide: SlideConfig = {
  id: 'blockchain-intro',
  template: 'educational',
  content: {
    vocabulary: [
      {
        id: 'blockchain',
        term: 'Blockchain',
        definition: 'Registru distribuit și criptat de tranzacții digitale',
        icon: 'database'
      },
      {
        id: 'block',
        term: 'Block',
        definition: 'Container de date cu tranzacții verificate și hash unic',
        icon: 'box'
      }
    ],
    concepts: [
      {
        id: 'trust',
        text: 'Trust distribuit',
        icon: 'heart',
        emphasis: 'strong'
      }
    ]
  },
  theme: 'dark-blue',
  animations: 'smooth-3d'
}; 