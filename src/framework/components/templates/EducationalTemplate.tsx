/**
 * EducationalTemplate Component
 * Main template that recreates the blockchain slide design
 * Combines MainContent, VocabularySection, and ConceptsSection in a 4-column layout
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { EducationalTemplateProps } from '../../types/template.types';
// import { getThemeClasses } from '../../utils/themeSystem';
import { MainContent } from '../sections/MainContent';
import { VocabularySection } from '../sections/VocabularySection';
import { ConceptsSection } from '../sections/ConceptsSection';

export const EducationalTemplate: React.FC<EducationalTemplateProps> = ({
  config,
  showVocabulary = true,
  showConcepts = true,
  maxVocabularyItems = 4,
  maxConceptItems = 4,
  className = '',
  isSlideActive = true
}) => {
  const [_hoveredContainer, setHoveredContainer] = useState<string | null>(null);
  
  // Get theme classes (currently unused but available for theming)
  // const themeClasses = getThemeClasses(config.theme);
  
  // Animation variants for the container
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, rotateX: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const sidebarVariants: Variants = {
    hidden: { opacity: 0, x: 60, rotateY: -15 },
    visible: { 
      opacity: 1, 
      x: 0, 
      rotateY: 0,
      transition: {
        duration: 1,
        delay: 0.5
      }
    }
  };

  const hasVocabulary = showVocabulary && config.content.vocabulary && config.content.vocabulary.length > 0;
  const hasConcepts = showConcepts && config.content.concepts && config.content.concepts.length > 0;
  const showSidebar = hasVocabulary || hasConcepts;

  return (
    <div className={`slide-container ${className}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1], 
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2], 
            rotate: [360, 180, 0] 
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1], 
            x: [-50, 50, -50], 
            y: [-50, 50, -50] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      <motion.div 
        className="w-full max-w-7xl aspect-video relative perspective-1000 preserve-3d"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main container with glassmorphism */}
        <div className="w-full h-full glassmorphism rounded-3xl overflow-hidden">
          <div className={`grid ${showSidebar ? 'grid-cols-4' : 'grid-cols-1'} gap-8 h-full p-8`}>
            
            {/* Main Content Area */}
            <MainContent 
              content={config.content}
              className={showSidebar ? '' : 'col-span-1'}
              slideTiming={config.timing}
              isSlideActive={isSlideActive}
            />

            {/* Enhanced 3D Sidebar */}
            {showSidebar && (
              <motion.div 
                className="bg-gradient-to-b from-slate-800/95 to-blue-900/90 backdrop-blur-xl rounded-2xl border border-blue-700/40 p-4 flex flex-col relative overflow-hidden shadow-2xl h-full preserve-3d"
                variants={sidebarVariants}
                onHoverStart={() => setHoveredContainer('sidebar')}
                onHoverEnd={() => setHoveredContainer(null)}
              >
                {/* Sidebar inner glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-800/20 to-indigo-900/15 rounded-2xl" />
                
                {/* Vocabulary Section */}
                {hasVocabulary && (
                  <VocabularySection
                    items={config.content.vocabulary!}
                    maxItems={maxVocabularyItems}
                    className="mb-3"
                    slideTiming={config.timing}
                    isSlideActive={isSlideActive}
                  />
                )}

                {/* Concepts Section */}
                {hasConcepts && (
                  <ConceptsSection
                    items={config.content.concepts!}
                    maxItems={maxConceptItems}
                    className="mb-3"
                    slideTiming={config.timing}
                    isSlideActive={isSlideActive}
                  />
                )}

                {/* Fixed Footer */}
                <motion.div 
                  className="relative z-20 mt-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.5 }}
                >
                  <motion.div 
                    className="text-center text-xs font-semibold bg-gradient-to-r from-slate-700/90 to-blue-800/80 backdrop-blur-lg rounded-lg py-2 px-3 border border-blue-600/40 relative overflow-hidden shadow-lg"
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)" 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg" />
                    <span className="relative z-10 text-amber-200">www.educatiecripto.ro</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 