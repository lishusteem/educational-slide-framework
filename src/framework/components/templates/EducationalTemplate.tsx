/**
 * EducationalTemplate Component
 * Main template that recreates the blockchain slide design
 * Combines MainContent, VocabularySection, and ConceptsSection in a 4-column layout
 * Fixed layout with proper adaptive sidebar heights and permanent editor panel
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { EducationalTemplateProps } from '../../types/template.types';
// import { getThemeClasses } from '../../utils/themeSystem';
import { MainContent, useLayoutSystem } from '../sections/MainContent';
import { VocabularySection } from '../sections/VocabularySection';
import { ConceptsSection } from '../sections/ConceptsSection';
import { AudioControls } from '../sections/AudioControls';
import { SidebarEditorPanel } from '../editor/SidebarEditorPanel';
import { useSidebarEditor } from '../../utils/editorSystem';
import { 
  definitionLayoutConfig,
  propertiesGridLayoutConfig,
  comparisonLayoutConfig
} from '../../layouts';
import type { SlideContent, SlideTiming } from '../../types/slide.types';

export const EducationalTemplate: React.FC<EducationalTemplateProps> = ({
  config,
  showVocabulary = true,
  showConcepts = true,
  maxVocabularyItems = 5,
  maxConceptItems = 5,
  className = '',
  isSlideActive = true
}) => {
  const [_hoveredContainer, setHoveredContainer] = useState<string | null>(null);
  
  // Editor system integration
  const { editorState, actions, modifiedConfig } = useSidebarEditor({ 
    originalConfig: config 
  });
  
  // Always use modified config since editor is permanently visible
  const activeConfig = modifiedConfig;
  
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

  const hasVocabulary = showVocabulary && activeConfig.content.vocabulary && activeConfig.content.vocabulary.length > 0;
  const hasConcepts = showConcepts && activeConfig.content.concepts && activeConfig.content.concepts.length > 0;
  const showSidebar = hasVocabulary || hasConcepts;

  // Layout system for progress tracking
  const layoutConfigs = [
    definitionLayoutConfig,
    propertiesGridLayoutConfig,
    comparisonLayoutConfig
  ];
  
  const layoutSystem = useLayoutSystem({
    layoutConfigs,
    isSlideActive,
    autoAdvance: true
  });

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

      {/* Main Layout Container */}
      <div className="relative z-10 flex gap-2 w-full max-w-full h-full">
        
        {/* Canvas Area - Left Side */}
        <div className="flex-1 flex items-center justify-center">
          {/* Audio Controls - Positioned at top-left of canvas */}
          <AudioControls 
            audioConfig={activeConfig.audio}
            isSlideActive={isSlideActive}
            className="absolute top-6 left-6 z-20"
          />

      <motion.div 
        className="w-full max-w-7xl aspect-video relative perspective-1000 preserve-3d"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main container with glassmorphism */}
        <div className="w-full h-full glassmorphism rounded-3xl overflow-hidden">
          {/* Fixed Grid Layout with Stable Dimensions */}
          <div className={`${showSidebar ? 'grid grid-cols-4' : 'flex'} gap-8 h-full p-8`}>
            
            {/* Main Content Area - Fixed Container */}
            <div className={`${showSidebar ? 'col-span-3' : 'flex-1'} flex flex-col min-h-0 relative`}>
              <MainContent 
                content={activeConfig.content}
                className="flex-1"
                slideTiming={activeConfig.timing}
                isSlideActive={isSlideActive}
              />
            </div>

            {/* Enhanced 3D Sidebar - Proper Flex Layout with Editor Integration */}
            {showSidebar && (
              <motion.div
                className="col-span-1 flex flex-col perspective-1000 preserve-3d"
                variants={sidebarVariants}
                onHoverStart={() => setHoveredContainer('sidebar')}
                onHoverEnd={() => setHoveredContainer(null)}
              >
                <div className="flex-1 flex flex-col min-h-0 p-3 glassmorphism rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden">
                  {/* Enhanced gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl" />
                  
                  {/* Content container with equal distribution */}
                  <div className="relative z-10 flex-1 flex flex-col min-h-0">
                    {hasVocabulary && (
                      <VocabularySection 
                        items={activeConfig.content.vocabulary || []} 
                            maxItems={editorState.vocabulary.maxItems}
                            fontSize={editorState.vocabulary.fontSize}
                        className="flex-1"
                      />
                    )}
                    {hasConcepts && (
                      <ConceptsSection 
                        items={activeConfig.content.concepts || []} 
                            maxItems={editorState.concepts.maxItems}
                            fontSize={editorState.concepts.fontSize}
                        className="flex-1"
                      />
                    )}
                      </div>
                    </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
        </div>

        {/* Permanent Control Panel - Right Side */}
        <div className="flex items-center justify-center">
          <SidebarEditorPanel
            editorState={editorState}
            actions={actions}
          />
        </div>
      </div>
    </div>
  );
}; 