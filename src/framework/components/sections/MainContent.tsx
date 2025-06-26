/**
 * MainContent Component - Layout Manager
 * Manages different layout presentations cycling through the content
 * Orchestrates layout switching while keeping sidebar unchanged
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { SlideContent, SlideTiming } from '../../types/slide.types';
import { useLayoutSystem } from '../../utils/layoutSystem';
import { 
  getLayoutComponent, 
  definitionLayoutConfig,
  propertiesGridLayoutConfig,
  comparisonLayoutConfig
} from '../../layouts';

interface MainContentProps {
  content: SlideContent;
  className?: string;
  slideTiming?: SlideTiming;
  isSlideActive?: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({
  content,
  className = '',
  slideTiming,
  isSlideActive = true
}) => {
  // All 3 layouts cycling system
  const layoutConfigs = [
    definitionLayoutConfig,
    propertiesGridLayoutConfig,
    comparisonLayoutConfig
  ];
  
  // Layout system hook
  const layoutSystem = useLayoutSystem({
    layoutConfigs,
    isSlideActive,
    autoAdvance: true
  });

  const contentVariants: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 1,
        delay: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  // Return empty if no layout is available
  if (!layoutSystem.currentLayout) {
    return (
      <motion.div 
        className={`flex items-center justify-center ${className}`}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-blue-100/50 text-lg">
          Nu există layout disponibil pentru afișare
        </div>
      </motion.div>
    );
  }

  // Get the layout component
  const LayoutComponent = getLayoutComponent(layoutSystem.currentLayout.component);

  if (!LayoutComponent) {
    return (
      <motion.div 
        className={`flex items-center justify-center ${className}`}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-blue-100/50 text-lg">
          Layout component "{layoutSystem.currentLayout.component}" nu a fost găsit
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`flex flex-col relative preserve-3d h-full overflow-hidden ${className}`}
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      style={{
        maxHeight: "100vh",
        padding: "1rem"
      }}
    >
      {/* Layout Content with Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={layoutSystem.currentLayout.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex-1 min-h-0 overflow-hidden"
          style={{
            maxHeight: "calc(100vh - 2rem)",
            height: "100%"
          }}
        >
          <LayoutComponent
            content={content}
            slideTiming={slideTiming}
            isSlideActive={isSlideActive}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Export layout system state for use in other components
export { useLayoutSystem }; 