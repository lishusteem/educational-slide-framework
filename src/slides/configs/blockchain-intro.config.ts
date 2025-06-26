/**
 * Blockchain Introduction Slide Configuration
 * Recreates the original blockchain slide template with Romanian content
 */

import type { SlideConfig } from '../../framework/types/slide.types';

export const blockchainIntroSlide: SlideConfig = {
  id: 'blockchain-intro',
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
  animations: 'smooth-3d'
}; 