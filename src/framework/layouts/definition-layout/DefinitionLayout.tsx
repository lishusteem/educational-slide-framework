/**
 * Definition Layout Component
 * Displays a single blockchain definition with classic layout
 * Simple and focused presentation without carousel cycling
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { BaseLayoutProps } from '../../types/layout.types';
import { renderIcon } from '../../utils/iconRegistry';

export const DefinitionLayout: React.FC<BaseLayoutProps> = ({
  content,
  className = '',
  isSlideActive = true
}) => {
  const floatingAnimation = {
    y: [0, -4, 0],
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
        staggerChildren: 0.15
      }
    }
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotateY: -180 },
    visible: { 
      scale: 1, 
      rotateY: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
        type: "spring",
        stiffness: 80
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div 
      className={`h-full flex flex-col justify-center px-6 py-4 ${className}`}
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Section: Blockchain Icon */}
      <motion.div 
        className="flex justify-center mb-4"
        variants={iconVariants}
      >
        <motion.div 
          className="relative"
          animate={floatingAnimation}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border border-white/30 relative overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            
            <div className="relative z-10 drop-shadow-lg">
              {renderIcon('blocks', { 
                size: 32, 
                className: 'text-white' 
              })}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-2xl" />
          </div>
          
          <div className="absolute inset-0 rounded-2xl blur-xl bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-indigo-600/15 opacity-15 scale-105" />
        </motion.div>
      </motion.div>

      {/* Title - Blockchain */}
      <motion.h1 
        className="text-4xl font-black leading-tight relative text-center mb-4"
        variants={itemVariants}
        style={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #e0f2fe 30%, #b3e5fc 60%, #81d4fa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 2px 10px rgba(129, 212, 250, 0.3)"
        }}
      >
        Blockchain
      </motion.h1>

      {/* Main Definition Area */}
      <motion.div 
        className="mb-4 flex-1 flex items-center"
        variants={itemVariants}
      >
        <motion.div 
          className="backdrop-blur-lg border-l-4 p-4 rounded-xl border border-white/20 relative overflow-hidden bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border-l-cyan-400 w-full"
          whileHover={{ 
            scale: 1.01,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 30
            }
          }}
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/2 to-transparent" />
          
          <div className="relative z-10">
            <span className="text-blue-100 text-base leading-relaxed block">
              O tehnologie revoluționară care funcționează ca un registru digital distribuit, 
              în care tranzacțiile sunt înregistrate în blocuri conectate criptografic. 
              Această structură elimină necesitatea unei autorități centrale și asigură 
              transparența, securitatea și imutabilitatea datelor prin consensul rețelei.
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Section: Properties and Functions */}
      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={itemVariants}
      >
        {/* Properties Box */}
        <motion.div 
          className="backdrop-blur-lg border-l-4 border-cyan-400 p-4 rounded-xl border border-white/15 relative overflow-hidden bg-gradient-to-r from-cyan-500/8 to-blue-500/4"
          whileHover={{ 
            scale: 1.02,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 30
            }
          }}
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/2 to-transparent" />
          <div className="relative z-10">
            <h3 className="text-cyan-300 text-sm font-bold mb-2">Proprietăți Cheie</h3>
            <ul className="text-blue-100/80 text-xs leading-relaxed space-y-0.5">
              <li>• Descentralizare completă</li>
              <li>• Imutabilitate garantată</li>
              <li>• Transparență totală</li>
              <li>• Securitate criptografică</li>
            </ul>
          </div>
        </motion.div>

        {/* Functions Box */}
        <motion.div 
          className="backdrop-blur-lg border-l-4 border-purple-400 p-4 rounded-xl border border-white/15 relative overflow-hidden bg-gradient-to-r from-purple-500/8 to-pink-500/4"
          whileHover={{ 
            scale: 1.02,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 30
            }
          }}
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/2 to-transparent" />
          <div className="relative z-10">
            <h3 className="text-purple-300 text-sm font-bold mb-2">Funcții Principale</h3>
            <ul className="text-blue-100/80 text-xs leading-relaxed space-y-0.5">
              <li>• Validarea tranzacțiilor</li>
              <li>• Crearea consensului</li>
              <li>• Stocarea sigură</li>
              <li>• Eliminarea intermediarilor</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}; 