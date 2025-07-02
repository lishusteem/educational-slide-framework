/**
 * Sample Multi-Slide Presentation Configuration
 * Demonstrates the multi-slide system with 3 educational slides
 */

import type { PresentationConfig } from '../../presentation/types/presentation.types';
import { blockchainIntroSlide } from './blockchain-intro.config';

// Create additional slides based on the working blockchain intro
const blockchainConsensusSlide = {
  id: 'blockchain-consensus',
  template: 'educational',
  theme: 'purple-cosmic' as const,
  animations: 'smooth',
  content: {
    title: 'Mecanisme de Consens',
    subtitle: 'Cum se ajunge la acordul în rețelele descentralizate',
    bridgeText: 'Consensul este fundamentul încrederii în blockchain, asigurând că toate nodurile sunt de acord asupra stării rețelei.',
    floatingIcon: 'users',
    vocabulary: [
      {
        id: 'proof-of-work',
        term: 'Proof of Work',
        definition: 'Mecanismul prin care minerii competiționează pentru a rezolva puzzle-uri matematice complexe.',
        icon: 'cpu'
      },
      {
        id: 'proof-of-stake',
        term: 'Proof of Stake',
        definition: 'Validatorii sunt aleși în funcție de investiția lor în rețea, consumând mai puțină energie.',
        icon: 'award'
      },
      {
        id: 'finality',
        term: 'Finalitate',
        definition: 'Momentul în care o tranzacție este considerată ireversibilă și permanent înregistrată.',
        icon: 'check-circle'
      }
    ],
    concepts: [
      {
        id: 'distributed-consensus',
        text: 'Consensul distribuit elimină nevoia unei autorități centrale',
        icon: 'globe',
        emphasis: 'strong' as const
      },
      {
        id: 'energy-efficiency',
        text: 'Noi mecanisme reduc semnificativ consumul energetic',
        icon: 'zap',
        emphasis: 'normal' as const
      },
      {
        id: 'security-guarantees',
        text: 'Securitatea crește cu numărul de participanți',
        icon: 'shield',
        emphasis: 'subtle' as const
      }
    ]
  }
};

const blockchainApplicationsSlide = {
  id: 'blockchain-applications',
  template: 'educational',
  theme: 'green-nature' as const,
  animations: 'dynamic',
  content: {
    title: 'Aplicații Blockchain',
    subtitle: 'Cazuri de utilizare reale și viitorul tehnologiei',
    bridgeText: 'De la criptomonede la contracte inteligente, blockchain revolutionează multiple industrii.',
    floatingIcon: 'layers',
    vocabulary: [
      {
        id: 'smart-contracts',
        term: 'Contracte Inteligente',
        definition: 'Programe autonome care se execută automat când condițiile sunt îndeplinite.',
        icon: 'file-text'
      },
      {
        id: 'defi',
        term: 'DeFi',
        definition: 'Finanțe descentralizate care recreează serviciile financiare fără intermediari.',
        icon: 'trending-up'
      },
      {
        id: 'nft',
        term: 'NFT',
        definition: 'Token-uri non-fungibile care reprezintă proprietatea digitală unică.',
        icon: 'image'
      }
    ],
    concepts: [
      {
        id: 'financial-inclusion',
        text: 'Accesul la servicii financiare pentru toți',
        icon: 'users',
        emphasis: 'strong' as const
      },
      {
        id: 'digital-ownership',
        text: 'Proprietatea digitală verificabilă și transferabilă',
        icon: 'key',
        emphasis: 'normal' as const
      },
      {
        id: 'programmable-money',
        text: 'Banii programabili cu logică automatizată',
        icon: 'code',
        emphasis: 'subtle' as const
      }
    ]
  }
};

// Sample Multi-Slide Presentation
export const samplePresentation: PresentationConfig = {
  id: 'blockchain-fundamentals',
  title: 'Fundamentele Blockchain',
  description: 'O introducere completă în tehnologia blockchain și aplicațiile sale',
  author: 'Educational Framework',
  version: '1.0.0',
  theme: 'dark-blue',
  aspectRatio: '16:9',
  slides: [
    blockchainIntroSlide,
    blockchainConsensusSlide,
    blockchainApplicationsSlide
  ],
  settings: {
    autoPlay: false,
    loop: false,
    showProgress: true,
    showNavigation: true,
    allowUserControl: true,
    transitionDuration: 1000, // 1 second between slides
    globalAudio: {
      volume: 0.7
    }
  }
};