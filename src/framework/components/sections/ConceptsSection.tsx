/**
 * ConceptsSection Component
 * Displays concept items with icons and text
 * Supports 1-4 items with overflow handling and smooth animations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ConceptItem, SlideTiming } from '../../types/slide.types';
import { renderIcon } from '../../utils/iconRegistry';
import { useSectionTiming, useItemTiming } from '../../utils/timingSystem';

interface ConceptsSectionProps {
  items: ConceptItem[];
  maxItems?: number;
  onItemHover?: (itemId: string | null) => void;
  className?: string;
  // New timing props
  slideTiming?: SlideTiming;
  isSlideActive?: boolean;
}

export const ConceptsSection: React.FC<ConceptsSectionProps> = ({
  items,
  maxItems = 4,
  onItemHover,
  className = '',
  slideTiming,
  isSlideActive = true
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  
  // Add timing-based highlights
  const { isTimingHighlighted: isSectionTimingHighlighted } = useSectionTiming(
    'conceptsSection', 
    slideTiming, 
    isSlideActive
  );
  
  // Limit items to maxItems
  const displayItems = items.slice(0, maxItems);
  
  const handleItemHover = (itemId: string | null) => {
    setHoveredItem(itemId);
    onItemHover?.(itemId);
  };

  const handleSectionHover = (isHovered: boolean) => {
    setIsSectionHovered(isHovered);
  };

  // Custom smooth ease
  const smoothEase = [0.25, 0.1, 0.25, 1] as const;

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.12,
        ease: smoothEase
      }
    }
  };

  const sectionVariants: Variants = {
    rest: { 
      scale: 1,
      boxShadow: "0 4px 16px rgba(30, 58, 138, 0.15)",
      borderColor: "rgba(59, 130, 246, 0.3)",
      backgroundColor: "rgba(71, 85, 105, 0.4)"
    },
    hover: { 
      scale: 1.015,
      boxShadow: "0 8px 32px rgba(234, 88, 12, 0.25)",
      borderColor: "rgba(234, 88, 12, 0.4)",
      backgroundColor: "rgba(71, 85, 105, 0.5)",
      transition: { 
        duration: 0.4, 
        ease: smoothEase
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: smoothEase
      }
    }
  };

  const itemHighlightVariants: Variants = {
    rest: { 
      scale: 1, 
      rotateX: 0,
      backgroundColor: "rgba(71, 85, 105, 0.3)",
      borderColor: "rgba(59, 130, 246, 0.25)",
      boxShadow: "0 2px 8px rgba(30, 58, 138, 0.1)"
    },
    hover: { 
      scale: 1.015, 
      rotateX: 0.5,
      backgroundColor: "rgba(71, 85, 105, 0.5)",
      borderColor: "rgba(234, 88, 12, 0.4)",
      boxShadow: "0 4px 12px rgba(234, 88, 12, 0.15)",
      transition: { 
        duration: 0.3, 
        ease: smoothEase
      }
    },
    sectionHover: {
      scale: 1.005,
      backgroundColor: "rgba(71, 85, 105, 0.35)",
      borderColor: "rgba(59, 130, 246, 0.3)",
      boxShadow: "0 3px 10px rgba(30, 58, 138, 0.12)",
      transition: { 
        duration: 0.3, 
        ease: smoothEase
      }
    }
  };

  const headerVariants: Variants = {
    rest: { 
      color: "rgb(253 186 116)",
      textShadow: "0 0 0px rgba(234, 88, 12, 0)"
    },
    hover: { 
      color: "rgb(252 165 83)",
      textShadow: "0 0 4px rgba(234, 88, 12, 0.2)",
      transition: { 
        duration: 0.3, 
        ease: smoothEase
      }
    }
  };

  const getEmphasisStyle = (emphasis?: ConceptItem['emphasis']) => {
    switch (emphasis) {
      case 'strong':
        return 'font-bold text-orange-100';
      case 'subtle':
        return 'font-normal text-orange-300';
      default:
        return 'font-semibold text-orange-200';
    }
  };

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`relative z-10 flex-1 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onHoverStart={() => handleSectionHover(true)}
      onHoverEnd={() => handleSectionHover(false)}
    >
      <motion.div 
        className="bg-gradient-to-br from-slate-700/80 to-blue-800/70 backdrop-blur-lg rounded-xl p-4 border shadow-lg h-full flex flex-col preserve-3d relative"
        variants={sectionVariants}
        initial="rest"
        animate={isSectionHovered || isSectionTimingHighlighted ? "hover" : "rest"}
      >
        {/* Subtle animated background glow */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl"
          animate={{
            opacity: isSectionHovered || isSectionTimingHighlighted ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: smoothEase }}
        />
        
        {/* Section Header */}
        <motion.h3 
          className="flex items-center gap-2 font-bold text-xs mb-3 uppercase tracking-wider relative z-10"
          variants={headerVariants}
          initial="rest"
          animate={isSectionHovered || isSectionTimingHighlighted ? "hover" : "rest"}
        >
          <motion.div
            animate={{
              rotate: isSectionHovered || isSectionTimingHighlighted ? 360 : 0
            }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            {renderIcon('info', { 
              size: 12, 
              className: 'text-orange-400' 
            })}
          </motion.div>
          Concepte Cheie
        </motion.h3>
        
        {/* Concept Items */}
        <div className="space-y-2 flex-1 relative z-10 px-1">
          {displayItems.map((item, _index) => {
            const { isTimingHighlighted: isItemTimingHighlighted } = useItemTiming(
              item.id,
              'concepts',
              slideTiming,
              isSlideActive
            );
            
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="cursor-pointer"
                onHoverStart={() => handleItemHover(item.id)}
                onHoverEnd={() => handleItemHover(null)}
                style={{ zIndex: hoveredItem === item.id ? 20 : 10 }}
              >
                <motion.div
                  variants={itemHighlightVariants}
                  initial="rest"
                  animate={
                    hoveredItem === item.id || isItemTimingHighlighted
                      ? 'hover' 
                      : isSectionHovered && !hoveredItem 
                        ? 'sectionHover' 
                        : 'rest'
                  }
                className="rounded-lg p-2.5 border relative overflow-hidden preserve-3d"
              >
                {/* Dynamic accent overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg"
                  animate={{
                    opacity: hoveredItem === item.id ? 0.6 : isSectionHovered ? 0.3 : 0.2,
                    x: hoveredItem === item.id ? 0 : isSectionHovered ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                />
                
                <div className="flex items-center gap-2 relative z-10">
                  {/* Icon with subtle glow effect */}
                  <motion.div 
                    className="flex-shrink-0 w-5 h-5 bg-orange-400/20 rounded-md flex items-center justify-center relative"
                    animate={{
                      backgroundColor: hoveredItem === item.id 
                        ? "rgba(234, 88, 12, 0.25)" 
                        : "rgba(234, 88, 12, 0.2)"
                    }}
                    transition={{ duration: 0.3, ease: smoothEase }}
                  >
                    <motion.div 
                      className="text-orange-300"
                      animate={{
                        scale: hoveredItem === item.id ? 1.05 : 1,
                        color: hoveredItem === item.id ? "rgb(252 165 83)" : "rgb(253 186 116)"
                      }}
                      transition={{ duration: 0.3, ease: smoothEase }}
                    >
                      {item.icon ? renderIcon(item.icon, { 
                        size: 12, 
                        className: 'text-current' 
                      }) : renderIcon('lightbulb', { 
                        size: 12, 
                        className: 'text-current' 
                      })}
                    </motion.div>
                    
                    {/* Subtle icon glow - much more discrete */}
                    {hoveredItem === item.id && (
                      <motion.div
                        className="absolute inset-0 bg-orange-400/15 rounded-md blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Content with subtle color changes */}
                  <div className="flex-1 min-w-0">
                    <motion.span 
                      className={`block text-xs leading-tight ${getEmphasisStyle(item.emphasis)}`}
                      animate={{
                        color: hoveredItem === item.id 
                          ? "rgb(254 237 213)" 
                          : item.emphasis === 'strong' 
                            ? "rgb(254 215 170)"
                            : item.emphasis === 'subtle'
                              ? "rgb(253 186 116)"
                              : "rgb(254 215 170)"
                      }}
                      transition={{ duration: 0.3, ease: smoothEase }}
                    >
                      {item.text}
                    </motion.span>
                  </div>
                </div>
                              </motion.div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Overflow indicator */}
        {items.length > maxItems && (
          <motion.div
            className="mt-2 text-center relative z-10"
            variants={itemVariants}
          >
            <span className="text-xs text-orange-300/60">
              +{items.length - maxItems} more
            </span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}; 