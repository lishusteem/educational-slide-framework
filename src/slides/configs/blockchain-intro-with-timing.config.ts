/**
 * Blockchain Introduction Slide Configuration WITH TIMING
 * Demonstrates time-based highlight animations for educational presentations
 */

import type { SlideConfig } from '../../framework/types/slide.types';

export const blockchainIntroWithTimingSlide: SlideConfig = {
  id: 'blockchain-intro-timing',
  template: 'educational',
  content: {
    title: 'Blockchain: Revoluția Digitală a Încrederii',
    subtitle: 'Înțelegerea tehnologiei care redefinește tranzacțiile și contractele digitale',
    bridgeText: 'Știi deja cum funcționează banca tradițională. Blockchain elimină necesitatea unui intermediar de încredere.',
    floatingIcon: 'chain',
    vocabulary: [
      {
        id: 'hash',
        term: 'Hash',
        definition: 'Fingerprint digital unic pentru fiecare bloc',
        icon: 'hash'
      },
      {
        id: 'node',
        term: 'Node',
        definition: 'Computer care menține copia blockchain-ului',
        icon: 'server'
      },
      {
        id: 'consensus',
        term: 'Consensus',
        definition: 'Algoritm pentru acordarea rețelei asupra stării',
        icon: 'users'
      }
    ],
    concepts: [
      {
        id: 'decentralization',
        text: 'Descentralizare completă',
        icon: 'network',
        emphasis: 'strong'
      },
      {
        id: 'immutability',
        text: 'Imutabilitate garantată',
        icon: 'lock',
        emphasis: 'strong'
      },
      {
        id: 'transparency',
        text: 'Transparență totală',
        icon: 'eye',
        emphasis: 'normal'
      },
      {
        id: 'security',
        text: 'Securitate criptografică',
        icon: 'shield',
        emphasis: 'strong'
      }
    ]
  },
  theme: 'dark-blue',
  animations: 'smooth-3d',
  
  // TIMING CONFIGURATION - easy to edit!
  timing: {
    // Main content timing
    title: {
      startTime: 500,      // Start highlighting title after 0.5 seconds
      duration: 2000,      // Highlight for 2 seconds
      delay: 0            
    },
    subtitle: {
      startTime: 3000,     // Start after 3 seconds
      duration: 3000       // Highlight for 3 seconds
    },
    bridgeText: {
      startTime: 7000,     // Start after 7 seconds
      duration: 4000       // Highlight for 4 seconds
    },
    floatingIcon: {
      startTime: 1000,     // Start after 1 second  
      duration: 2500       // Highlight for 2.5 seconds
    },
    
    // Vocabulary section timing (synchronized with carousel)
    vocabularySection: {
      startTime: 4000,     // Start when carousel begins vocabulary explanations
      duration: 2000       // Highlight section for 2 seconds
    },
    vocabulary: {
      'hash': {
        startTime: 4000,   // Carousel intro (4s) -> Hash explanation starts
        duration: 3000     // Hash explanation duration in carousel
      },
      'node': {
        startTime: 7000,   // Hash ends, Node explanation starts
        duration: 3000     // Node explanation duration
      },
      'consensus': {
        startTime: 10000,  // Node ends, Consensus explanation starts
        duration: 3000     // Consensus explanation duration
      }
    },
    
    // Concepts section timing (synchronized with carousel)
    conceptsSection: {
      startTime: 13000,    // Start when concepts begin in carousel
      duration: 2000       // Highlight section for 2 seconds
    },
    concepts: {
      'decentralization': {
        startTime: 13000,  // Concepts start - Decentralization explanation
        duration: 3000     // Decentralization explanation duration
      },
      'immutability': {
        startTime: 16000,  // Decentralization ends, Immutability starts
        duration: 3000     // Immutability explanation duration
      },
      'transparency': {
        startTime: 19000,  // Immutability ends, Transparency starts
        duration: 3000     // Transparency explanation duration
      },
      'security': {
        startTime: 22000,  // Transparency ends, Security starts
        duration: 3000     // Security explanation duration
      }
    }
  }
}; 