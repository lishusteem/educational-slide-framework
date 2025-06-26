/**
 * Blockchain Introduction Slide Configuration with Timing
 * Educational slide about blockchain basics with 3 vocabulary + 5 concepts
 * Tests adaptive sidebar with different element counts
 */

import type { SlideConfig } from '../../framework/types/slide.types';

export const blockchainIntroWithTimingConfig: SlideConfig = {
  id: 'blockchain-intro-with-timing',
  template: 'educational',
  theme: 'dark-blue',
  
  content: {
    vocabulary: [
      {
        id: 'hash',
        term: 'Hash',
        definition: 'Amprentă digitală unică pentru identificarea datelor',
        icon: 'fingerprint'
      },
      {
        id: 'nonce',
        term: 'Nonce',
        definition: 'Număr arbitrar folosit în minerit pentru găsirea unui hash valid',
        icon: 'hash'
      },
      {
        id: 'merkle',
        term: 'Merkle Tree',
        definition: 'Structură de date pentru verificarea eficientă a integrității',
        icon: 'git-branch'
      }
    ],
    
    concepts: [
      {
        id: 'transparency',
        text: 'Transparență',
        icon: 'eye',
        emphasis: 'strong'
      },
      {
        id: 'immutability',
        text: 'Imutabilitate',
        icon: 'shield',
        emphasis: 'strong'
      },
      {
        id: 'consensus',
        text: 'Consens',
        icon: 'users',
        emphasis: 'normal'
      },
      {
        id: 'cryptography',
        text: 'Criptografie',
        icon: 'lock',
        emphasis: 'normal'
      },
      {
        id: 'peer-to-peer',
        text: 'P2P',
        icon: 'network',
        emphasis: 'normal'
      }
    ]
  },

  timing: {
    vocabularySection: {
      startTime: 0,
      duration: 8000
    },
    vocabulary: {
      'hash': { startTime: 500, duration: 2000 },
      'nonce': { startTime: 2500, duration: 2000 },
      'merkle': { startTime: 5000, duration: 2000 }
    },
    conceptsSection: {
      startTime: 8000,
      duration: 12000
    },
    concepts: {
      'transparency': { startTime: 8500, duration: 2000 },
      'immutability': { startTime: 10500, duration: 2000 },
      'consensus': { startTime: 12500, duration: 2000 },
      'cryptography': { startTime: 14500, duration: 2000 },
      'peer-to-peer': { startTime: 16500, duration: 2000 }
    }
  },

  audio: {
    src: 'blockchain-intro-narration.mp3',
    autoPlay: false,
    loop: false,
    volume: 0.8
  },

  animations: 'spring'
}; 