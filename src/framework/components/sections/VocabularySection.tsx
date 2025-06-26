/**
 * VocabularySection Component
 * Adaptive sidebar with flex-based height distribution
 * Supports 1-5 elements with automatic height calculation
 * Vocabulary text 10% smaller than concepts
 * Uses flex layout for proper space distribution
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { VocabularyItem } from '../../types/slide.types';
import { renderIcon } from '../../utils/iconRegistry';

interface VocabularySectionProps {
  items: VocabularyItem[];
  maxItems?: number;
  fontSize?: number;       // Font size in rem units
  onItemHover?: (itemId: string | null) => void;
  className?: string;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({
  items,
  maxItems = 5,
  fontSize = 0.7,         // Default vocabulary font size
  onItemHover,
  className = ''
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  
  // Limit items to maxItems (1-5 elements)
  const displayItems = items.slice(0, Math.min(maxItems, 5));
  const itemCount = displayItems.length;
  
  // Calculate adaptive height distribution for flex items
  const getItemFlexBasis = () => {
    if (itemCount === 0) return '0%';
    return `${100 / itemCount}%`;
  };
  
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
      boxShadow: "0 8px 32px rgba(245, 158, 11, 0.25)",
      borderColor: "rgba(245, 158, 11, 0.4)",
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
      borderColor: "rgba(245, 158, 11, 0.4)",
      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
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
      color: "rgb(252 211 77)",
      textShadow: "0 0 0px rgba(245, 158, 11, 0)"
    },
    hover: { 
      color: "rgb(250 204 21)",
      textShadow: "0 0 4px rgba(245, 158, 11, 0.2)",
      transition: { 
        duration: 0.3, 
        ease: smoothEase
      }
    }
  };

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`relative z-10 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onHoverStart={() => handleSectionHover(true)}
      onHoverEnd={() => handleSectionHover(false)}
    >
      <motion.div 
        className="bg-gradient-to-br from-slate-700/80 to-blue-800/70 backdrop-blur-lg rounded-xl p-3 border shadow-lg h-full flex flex-col preserve-3d relative"
        variants={sectionVariants}
        initial="rest"
        animate={isSectionHovered ? "hover" : "rest"}
      >
        {/* Subtle animated background glow */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl"
          animate={{
            opacity: isSectionHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: smoothEase }}
        />
        
        {/* Section Header - Compact */}
        <motion.h3 
          className="flex items-center gap-2 font-bold text-xs mb-2 uppercase tracking-wider relative z-10 flex-shrink-0"
          variants={headerVariants}
          initial="rest"
          animate={isSectionHovered ? "hover" : "rest"}
        >
          <motion.div
            animate={{
              rotate: isSectionHovered ? 360 : 0
            }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            {renderIcon('file-text', { 
              size: 12, 
              className: 'text-amber-400' 
            })}
          </motion.div>
          VOCABULAR
        </motion.h3>
        
        {/* Vocabulary Items - Flex Distribution */}
        <div className="flex-1 relative z-10 flex flex-col gap-1" style={{ minHeight: 0 }}>
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="cursor-pointer"
              style={{ 
                flexBasis: getItemFlexBasis(),
                flexGrow: 1,
                flexShrink: 1,
                minHeight: '0'
              }}
              onHoverStart={() => handleItemHover(item.id)}
              onHoverEnd={() => handleItemHover(null)}
            >
              <motion.div
                variants={itemHighlightVariants}
                initial="rest"
                animate={
                  hoveredItem === item.id ? "hover" :
                  isSectionHovered ? "sectionHover" : "rest"
                }
                className="border rounded-lg p-2 backdrop-blur-sm transition-all h-full flex items-center preserve-3d relative overflow-hidden"
              >
                {/* Item background glow */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg"
                  animate={{
                    opacity: hoveredItem === item.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                />
                
                <div className="relative z-10 flex items-center gap-2 w-full">
                  {/* Icon Container - Compact */}
                  <motion.div 
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
                    animate={{
                      rotate: hoveredItem === item.id ? 360 : 0,
                      scale: hoveredItem === item.id ? 1.1 : 1
                    }}
                    transition={{ duration: 0.4, ease: smoothEase }}
                  >
                    {renderIcon(item.icon || 'book', { 
                      size: 12, 
                      className: hoveredItem === item.id 
                        ? 'text-amber-300' 
                        : 'text-amber-400' 
                    })}
                  </motion.div>
                  
                  {/* Compact Text - 10% smaller than concepts */}
                  <div 
                    className="flex-1 leading-tight"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: `${fontSize}rem`,
                      lineHeight: '1.1'
                    }}
                  >
                    <span className="font-bold text-blue-100">{item.term}</span>
                    <span className="font-normal text-blue-200"> - {item.definition}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}; 