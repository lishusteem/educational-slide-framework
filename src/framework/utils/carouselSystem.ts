/**
 * Carousel System for MainContent
 * Generates dynamic content slides from vocabulary and concepts with automatic timing
 */

import { useEffect, useState, useMemo } from 'react';
import type { VocabularyItem, ConceptItem, SlideTiming } from '../types/slide.types';

export interface CarouselSlide {
  id: string;
  type: 'intro' | 'vocabulary' | 'concept' | 'outro';
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  startTime: number;
  duration: number;
}

interface UseMainContentCarouselOptions {
  vocabularyItems?: VocabularyItem[];
  conceptItems?: ConceptItem[];
  slideTiming?: SlideTiming;
  isSlideActive?: boolean;
  autoStart?: boolean;
}

export const useMainContentCarousel = ({
  vocabularyItems = [],
  conceptItems = [],
  slideTiming,
  isSlideActive = true,
  autoStart = true
}: UseMainContentCarouselOptions) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate carousel slides from vocabulary and concepts
  const carouselSlides = useMemo(() => {
    const slides: CarouselSlide[] = [];

    // Intro slide
    slides.push({
      id: 'intro',
      type: 'intro',
      title: 'Explorăm Conceptele',
      subtitle: 'Să înțelegem pas cu pas elementele fundamentale',
      description: 'Urmărește cum fiecare termen și concept se conectează pentru a forma imaginea completă a blockchain-ului.',
      icon: 'lightbulb',
      startTime: 0,
      duration: 4000
    });

    // Add vocabulary slides
    vocabularyItems.forEach((item, index) => {
      const timing = slideTiming?.vocabulary?.[item.id];
      slides.push({
        id: item.id,
        type: 'vocabulary',
        title: item.term,
        subtitle: 'Termen Vocabular',
        description: item.definition,
        icon: item.icon || 'book',
        startTime: timing?.startTime || (5000 + index * 3000),
        duration: timing?.duration || 3000
      });
    });

    // Add concept slides  
    conceptItems.forEach((item, index) => {
      const timing = slideTiming?.concepts?.[item.id];
      slides.push({
        id: item.id,
        type: 'concept',
        title: item.text,
        subtitle: 'Concept Cheie',
        description: generateConceptDescription(item),
        icon: item.icon || 'zap',
        startTime: timing?.startTime || (5000 + vocabularyItems.length * 3000 + index * 3000),
        duration: timing?.duration || 3000
      });
    });

    // Outro slide
    slides.push({
      id: 'outro',
      type: 'outro', 
      title: 'Sinteza Completă',
      subtitle: 'Toate elementele se unesc',
      description: 'Acum înțelegi cum vocabularul și conceptele formează ecosistemul blockchain complet și funcțional.',
      icon: 'check-circle',
      startTime: slides.length > 1 ? slides[slides.length - 1].startTime + 3500 : 30000,
      duration: 5000
    });

    return slides;
  }, [vocabularyItems, conceptItems, slideTiming]);

  // Auto-advance logic
  useEffect(() => {
    if (!isSlideActive || !autoStart || carouselSlides.length === 0) return;

    const currentSlide = carouselSlides[currentSlideIndex];
    if (!currentSlide) return;

    const timer = setTimeout(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentSlideIndex(prev => (prev + 1) % carouselSlides.length);
        setIsTransitioning(false);
      }, 300); // Transition duration
      
    }, currentSlide.duration);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, carouselSlides, isSlideActive, autoStart]);

  // Reset carousel when slide becomes active
  useEffect(() => {
    if (isSlideActive && autoStart) {
      setCurrentSlideIndex(0);
      setIsTransitioning(false);
    }
  }, [isSlideActive, autoStart]);

  const currentSlide = carouselSlides[currentSlideIndex];
  const totalSlides = carouselSlides.length;
  const progress = totalSlides > 0 ? ((currentSlideIndex + 1) / totalSlides) * 100 : 0;

  return {
    currentSlide,
    currentSlideIndex,
    totalSlides,
    progress,
    isTransitioning,
    carouselSlides,
    // Methods for manual control
    nextSlide: () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlideIndex(prev => (prev + 1) % carouselSlides.length);
        setIsTransitioning(false);
      }, 300);
    },
    goToSlide: (index: number) => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlideIndex(Math.max(0, Math.min(index, carouselSlides.length - 1)));
        setIsTransitioning(false);
      }, 300);
    }
  };
};

// Helper function to generate rich descriptions for concepts
function generateConceptDescription(concept: ConceptItem): string {
  const descriptions: Record<string, string> = {
    'decentralization': 'În blockchain, descentralizarea înseamnă că nu există o autoritate centrală care să controleze rețeaua. Datele sunt distribuite pe mii de noduri, fiecare având o copie completă a registrului.',
    'immutability': 'Odată ce o tranzacție este confirmată și adăugată în blockchain, aceasta nu mai poate fi modificată sau ștearsă. Această caracteristică asigură integritatea permanentă a datelor.',
    'transparency': 'Toate tranzacțiile din blockchain sunt vizibile public și pot fi verificate de oricine. Această transparență completă creează încredere fără nevoia unei autorități centrale.',
    'security': 'Securitatea blockchain-ului provine din criptografia avansată și din natura distribuită a rețelei. Pentru a compromiete sistemul, ar trebui atacate simultan peste 51% din noduri.',
    'consensus': 'Mecanismele de consens asigură că toate nodurile din rețea sunt de acord asupra stării curente a blockchain-ului, fără să fie nevoie de o autoritate centrală de validare.',
    'hash': 'Hash-ul este un fingerprint matematic unic pentru fiecare bloc. Orice modificare în date va genera un hash complet diferit, făcând imposibilă falsificarea informațiilor.',
    'node': 'Nodurile sunt calculatoarele din rețeaua blockchain care mențin, validează și sincronizează registrul distribuit. Cu cât sunt mai multe noduri, cu atât rețeaua este mai sigură.',
    'smart-contract': 'Contractele inteligente sunt programe care se execută automat când condițiile prestabilite sunt îndeplinite, eliminând nevoia de intermediari și reducând costurile.',
    'mining': 'Mining-ul este procesul prin care tranzacțiile sunt validate și adăugate în blockchain, în schimbul unor recompense. Acest proces securizează întreaga rețea.',
    'wallet': 'Portofelul cripto stochează cheile private necesare pentru a accesa și transfera activele digitale, fiind echivalentul digital al unui portofel tradițional.'
  };

  return descriptions[concept.id] || `${concept.text} reprezintă un element fundamental în ecosistemul blockchain, contribuind la funcționarea sigură și eficientă a întregii rețele descentralizate.`;
} 