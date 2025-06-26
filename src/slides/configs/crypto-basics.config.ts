/**
 * Crypto Basics Slide Configuration
 * Second slide demonstrating multiple pages capability
 */

import type { SlideConfig } from '../../framework/types/slide.types';

export const cryptoBasicsSlide: SlideConfig = {
  id: 'crypto-basics',
  template: 'educational',
  content: {
    title: 'Crypto: Fundamentele Securității',
    subtitle: 'Algoritmii criptografici care susțin blockchain-ul și tranzacțiile digitale',
    bridgeText: 'De la hashing la semnături digitale, crypto este fundamentul încrederii în lumea digitală.',
    floatingIcon: 'shield',
    vocabulary: [
      {
        id: 'private-key',
        term: 'Private Key',
        definition: 'Cheia secretă folosită pentru semnarea tranzacțiilor',
        icon: 'lock'
      },
      {
        id: 'public-key',
        term: 'Public Key',
        definition: 'Cheia publică derivată din private key pentru verificare',
        icon: 'eye'
      },
      {
        id: 'digital-signature',
        term: 'Digital Signature',
        definition: 'Proof criptografic al autenticității unei tranzacții',
        icon: 'check-circle'
      }
    ],
    concepts: [
      {
        id: 'asymmetric-crypto',
        text: 'Criptografie asimetrică',
        icon: 'arrows-exchange',
        emphasis: 'strong'
      },
      {
        id: 'hash-functions',
        text: 'Funcții hash criptografice',
        icon: 'hash',
        emphasis: 'strong'
      },
      {
        id: 'merkle-trees',
        text: 'Arbori Merkle',
        icon: 'network',
        emphasis: 'normal'
      },
      {
        id: 'zero-knowledge',
        text: 'Zero-Knowledge Proofs',
        icon: 'help-circle',
        emphasis: 'subtle'
      }
    ]
  },
  theme: 'purple-cosmic',
  animations: 'smooth-3d'
}; 