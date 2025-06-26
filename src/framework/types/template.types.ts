/**
 * Template type definitions for the Educational Slide Framework
 */

import type { SlideConfig } from './slide.types';

export type TemplateName = 
  | 'educational' 
  | 'title-slide' 
  | 'concept-focus' 
  | 'comparison';

export interface TemplateProps {
  config: SlideConfig;
  isActive?: boolean;
  className?: string;
}

export interface EducationalTemplateProps extends TemplateProps {
  showVocabulary?: boolean;
  showConcepts?: boolean;
  maxVocabularyItems?: number;
  maxConceptItems?: number;
  isSlideActive?: boolean; // For timing system
}

export interface TitleSlideTemplateProps extends TemplateProps {
  showSubtitle?: boolean;
  showBridgeText?: boolean;
}

export interface ConceptFocusTemplateProps extends TemplateProps {
  highlightConcept?: string;
  conceptId?: string;
}

export interface ComparisonTemplateProps extends TemplateProps {
  leftContent?: any;
  rightContent?: any;
} 