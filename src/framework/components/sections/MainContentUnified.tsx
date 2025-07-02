/**
 * MainContent Component - Unified Animation System
 * Updated to use unified animation system instead of dual carousel + timing systems
 * Preserves 100% of visual behavior while simplifying architecture
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { SlideContent, SlideTiming } from '../../types/slide.types';
import { renderIcon } from '../../utils/iconRegistry';
import { useUnifiedAnimationContext } from '../../../contexts/UnifiedAnimationContext';

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
  const { title, subtitle, bridgeText, floatingIcon, vocabulary, concepts } = content;
  
  // Use unified animation system
  const { currentLayout, progress, activeHighlights } = useUnifiedAnimationContext();
  
  // Detect if we should use carousel mode (when timing exists for vocabulary/concepts)
  const shouldUseCarousel = Boolean(
    slideTiming && 
    (slideTiming.vocabulary || slideTiming.concepts) &&
    (vocabulary?.length || concepts?.length)
  );
  
  // Check for timing-based highlights using unified system
  const isTitleTimingHighlighted = activeHighlights.has('title');
  const isSubtitleTimingHighlighted = activeHighlights.has('subtitle');
  const isBridgeTextTimingHighlighted = activeHighlights.has('bridgeText');
  const isFloatingIconTimingHighlighted = activeHighlights.has('floatingIcon');

  const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, rotateX: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotateY: -180 },
    visible: { 
      scale: 1, 
      rotateY: 0,
      transition: {
        duration: 1,
        delay: 0.6,
        type: "spring",
        stiffness: 80
      }
    }
  };

  const bridgeVariants: Variants = {
    hidden: { opacity: 0, y: 30, rotateX: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1,
        delay: 1.2
      }
    }
  };

  // Render carousel mode if enabled and we have current layout
  if (shouldUseCarousel && currentLayout?.content) {
    const currentSlide = currentLayout.content;
    
    return (
      <motion.div 
        className={`col-span-3 flex flex-col relative preserve-3d ${className}`}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Ambient Progress Bar - subtle and at the top */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="h-0.5 bg-white/10 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-400/60 via-blue-500/80 to-indigo-500/60 shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                filter: "blur(0.5px)",
                boxShadow: "0 0 8px rgba(6, 182, 212, 0.3)"
              }}
            />
          </div>
        </motion.div>

        {/* Top Section: Icon positioned high */}
        <motion.div 
          className="flex justify-center pt-8 pb-6"
          variants={iconVariants}
        >
          <motion.div 
            className="relative"
            animate={floatingAnimation}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id || currentLayout.id}
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0, rotateY: 180 }}
                transition={{ duration: 0.5, type: "spring" }}
                className={`w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 relative overflow-hidden ${
                  currentSlide.type === 'vocabulary' 
                    ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500'
                    : currentSlide.type === 'concept'
                    ? 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600'
                    : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600'
                }`}
              >
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                
                <div className="relative z-10 drop-shadow-lg">
                  {renderIcon(currentSlide.icon, { 
                    size: 56, 
                    className: 'text-white' 
                  })}
                </div>
                
                {/* Reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-3xl" />
              </motion.div>
            </AnimatePresence>
            
            {/* Subtle ambient glow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`glow-${currentSlide.id || currentLayout.id}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.15, scale: 1.05 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8 }}
                className={`absolute inset-0 rounded-3xl blur-2xl ${
                  currentSlide.type === 'vocabulary' 
                    ? 'bg-gradient-to-br from-amber-400/40 via-orange-500/30 to-red-500/20'
                    : currentSlide.type === 'concept'
                    ? 'bg-gradient-to-br from-green-400/40 via-blue-500/30 to-purple-600/20'
                    : 'bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-indigo-600/20'
                }`}
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* Dynamic Content with Clean Elastic Stretch */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlide.id || currentLayout.id}
              initial={{ 
                opacity: 0, 
                scaleX: 0.4, 
                scaleY: 1.6,
                rotateZ: -3
              }}
              animate={{ 
                opacity: 1, 
                scaleX: 1, 
                scaleY: 1,
                rotateZ: 0
              }}
              exit={{ 
                opacity: 0, 
                scaleX: 1.6, 
                scaleY: 0.4,
                rotateZ: 3
              }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 280,
                damping: 30,
                mass: 0.6,
                restDelta: 0.001
              }}
              className="space-y-8"
              style={{ 
                willChange: "transform, opacity",
                backfaceVisibility: "hidden"
              }}
            >

              {/* Title - larger and prominent */}
              <motion.h1 
                initial={{ scaleY: 0.3, scaleX: 1.4, opacity: 0 }}
                animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
                exit={{ scaleY: 0.3, scaleX: 1.4, opacity: 0 }}
                transition={{
                  delay: 0.08,
                  type: "spring",
                  stiffness: 220,
                  damping: 28,
                  mass: 0.8,
                  restDelta: 0.001
                }}
                className="text-7xl font-black leading-tight relative preserve-3d text-center"
                style={{ 
                  background: "linear-gradient(135deg, #ffffff 0%, #e0f2fe 30%, #b3e5fc 60%, #81d4fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 20px rgba(129, 212, 250, 0.3)",
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden"
                }}
              >
                {currentSlide.title}
              </motion.h1>

              {/* Main Definition Area - expanded */}
              <motion.div 
                initial={{ scaleX: 0.6, scaleY: 1.4, opacity: 0 }}
                animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
                exit={{ scaleX: 0.6, scaleY: 1.4, opacity: 0 }}
                transition={{
                  delay: 0.25,
                  type: "spring",
                  stiffness: 200,
                  damping: 26,
                  mass: 0.7,
                  restDelta: 0.001
                }}
                className="relative"
                style={{ 
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden"
                }}
              >
                <motion.div 
                  className={`backdrop-blur-lg border-l-4 p-8 rounded-2xl border border-white/20 relative overflow-hidden preserve-3d ${
                    currentSlide.type === 'vocabulary' 
                      ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-l-amber-400'
                      : currentSlide.type === 'concept'
                      ? 'bg-gradient-to-r from-green-500/10 to-blue-500/5 border-l-green-400'
                      : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border-l-cyan-400'
                  }`}
                  whileHover={{ 
                    scale: 1.015,
                    transition: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30,
                      restDelta: 0.001
                    }
                  }}
                  style={{ 
                    willChange: "transform",
                    backfaceVisibility: "hidden"
                  }}
                >
                  {/* Minimal inner accent */}
                  <div className={`absolute inset-0 rounded-2xl ${
                    currentSlide.type === 'vocabulary' 
                      ? 'bg-gradient-to-r from-amber-400/2 to-transparent'
                      : currentSlide.type === 'concept'
                      ? 'bg-gradient-to-r from-green-400/2 to-transparent'
                      : 'bg-gradient-to-r from-cyan-400/2 to-transparent'
                  }`} />
                  
                  <div className="relative z-10">
                    <span className="text-blue-100 text-xl leading-relaxed block">
                      {currentSlide.description}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Bottom Section: Properties and Functions */}
              <motion.div 
                initial={{ scaleX: 0.8, scaleY: 1.2, opacity: 0 }}
                animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
                exit={{ scaleX: 0.8, scaleY: 1.2, opacity: 0 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 180,
                  damping: 24,
                  mass: 0.8,
                  restDelta: 0.001
                }}
                className="grid grid-cols-2 gap-6"
                style={{ 
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden"
                }}
              >
                {/* Properties Box */}
                <motion.div 
                  className="backdrop-blur-lg border-l-4 border-cyan-400 p-6 rounded-2xl border border-white/15 relative overflow-hidden preserve-3d bg-gradient-to-r from-cyan-500/8 to-blue-500/4"
                  whileHover={{ 
                    scale: 1.02,
                    transition: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30
                    }
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/2 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="text-cyan-300 text-lg font-bold mb-3">Proprietăți</h3>
                    <p className="text-blue-100/80 text-sm leading-relaxed">
                      Caracteristicile distinctive și atributele fundamentale care definesc acest concept în ecosistemul blockchain.
                    </p>
                  </div>
                </motion.div>

                {/* Functions Box */}
                <motion.div 
                  className="backdrop-blur-lg border-l-4 border-purple-400 p-6 rounded-2xl border border-white/15 relative overflow-hidden preserve-3d bg-gradient-to-r from-purple-500/8 to-pink-500/4"
                  whileHover={{ 
                    scale: 1.02,
                    transition: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30
                    }
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/2 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="text-purple-300 text-lg font-bold mb-3">Funcții</h3>
                    <p className="text-blue-100/80 text-sm leading-relaxed">
                      Rolurile active și operațiunile pe care le îndeplinește în cadrul rețelei blockchain descentralizate.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

            </motion.div>
          </AnimatePresence>
        </div>

      </motion.div>
    );
  }

  // Default static mode (original content)
  return (
    <motion.div 
      className={`col-span-3 flex flex-col justify-center gap-10 relative preserve-3d ${className}`}
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating Icon */}
      {(floatingIcon || title) && (
        <motion.div 
          className="flex justify-center"
          variants={iconVariants}
        >
          <motion.div 
            className="relative"
            animate={floatingAnimation}
          >
            <div className="w-28 h-28 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 relative overflow-hidden">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
              
              <div className="relative z-10 drop-shadow-lg">
                {floatingIcon ? renderIcon(floatingIcon, { 
                  size: 56, 
                  className: 'text-white' 
                }) : renderIcon('book', { 
                  size: 56, 
                  className: 'text-white' 
                })}
              </div>
              
              {/* Reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-3xl" />
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl blur-xl opacity-30 scale-110" />
          </motion.div>
        </motion.div>
      )}

      {/* Title with 3D effect */}
      {title && (
        <motion.h1 
          className="text-7xl font-black text-center leading-tight relative preserve-3d"
          variants={itemVariants}
          style={{ 
            background: "linear-gradient(135deg, #ffffff 0%, #e0f2fe 30%, #b3e5fc 60%, #81d4fa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 20px rgba(129, 212, 250, 0.3)"
          }}
        >
          {title}
        </motion.h1>
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p 
          className="text-2xl text-blue-100/90 text-center max-w-4xl mx-auto leading-relaxed font-medium"
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Bridge with 3D card effect */}
      {bridgeText && (
        <motion.div 
          className="relative max-w-5xl mx-auto"
          variants={bridgeVariants}
        >
          <motion.div 
            className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-lg border-l-4 border-cyan-400 p-8 rounded-2xl border border-white/20 relative overflow-hidden preserve-3d"
            whileHover={{ 
              scale: 1.02, 
              rotateX: 2,
              boxShadow: "0 25px 50px rgba(6, 182, 212, 0.3)" 
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-transparent rounded-2xl" />
            
            <div className="flex items-center gap-4 relative z-10">
              <motion.span 
                className="text-3xl filter drop-shadow-lg"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🔗
              </motion.span>
              <span className="font-bold text-cyan-300 text-xl">Conectare:</span>
              <span className="text-blue-100 text-lg leading-relaxed">
                {bridgeText}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};