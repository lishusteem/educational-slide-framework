/**
 * Comparison Layout Component
 * Shows traditional systems vs blockchain technology comparison
 * Two-column layout highlighting differences and advantages
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { BaseLayoutProps } from '../../types/layout.types';
import { renderIcon } from '../../utils/iconRegistry';

export const ComparisonLayout: React.FC<BaseLayoutProps> = ({
  content,
  className = '',
  isSlideActive = true
}) => {
  const { vocabulary, concepts } = content;

  const contentVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const columnVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const rightColumnVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Generate comparison data
  const comparisonData = [
    {
      traditional: {
        title: "Sisteme Centralizate",
        icon: "building-2",
        color: "from-red-400 to-orange-500",
        features: [
          "Control centralizat",
          "Intermediari obligatorii", 
          "Transparență limitată",
          "Risc de punct unic de eșec",
          "Costuri de tranzacție mari"
        ]
      },
      blockchain: {
        title: "Tehnologia Blockchain",
        icon: "blocks",
        color: "from-green-400 to-blue-500", 
        features: [
          "Descentralizare completă",
          "Eliminarea intermediarilor",
          "Transparență totală",
          "Securitate distribuită",
          "Costuri reduse"
        ]
      }
    }
  ];

  return (
    <motion.div 
      className={`h-full flex flex-col px-6 py-4 ${className}`}
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="text-center mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-white/30 mb-2">
          <div className="relative z-10 drop-shadow-lg">
            {renderIcon('git-compare', { size: 24, className: 'text-white' })}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-1">
          Tradiționala vs Blockchain
        </h2>
        <p className="text-blue-100/80 text-sm max-w-2xl mx-auto">
          O comparație clară între sistemele tradiționale și avantajele revoluționare ale blockchain
        </p>
      </motion.div>

      {/* VS Badge */}
      <motion.div 
        className="flex justify-center mb-3"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4, type: "spring" }}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
          <span className="text-white font-black text-sm">VS</span>
        </div>
      </motion.div>

      {/* Main Comparison */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        
        {/* Traditional Systems */}
        <motion.div 
          className="space-y-3 min-h-0 flex flex-col"
          variants={columnVariants}
        >
          <div className="backdrop-blur-lg border border-white/15 rounded-lg p-3 bg-gradient-to-br from-red-500/10 to-orange-500/5 relative overflow-hidden flex-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-transparent rounded-lg" />
            
            <div className="relative z-10 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                  {renderIcon('building-2', { size: 14, className: 'text-white' })}
                </div>
                <h3 className="text-lg font-bold text-red-300">Sisteme Tradiționale</h3>
              </div>

              {/* Features */}
              <div className="space-y-2 flex-1">
                {[
                  { icon: "users", text: "Control centralizat de către instituții", negative: true },
                  { icon: "user-circle", text: "Intermediari obligatorii pentru validare", negative: true },
                  { icon: "eye-off", text: "Transparență limitată sau inexistentă", negative: true },
                  { icon: "alert-triangle", text: "Risc ridicat de puncte unice de eșec", negative: true },
                  { icon: "credit-card", text: "Costuri de tranzacție și taxe mari", negative: true }
                ].slice(0, 4).map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-2 p-2 rounded bg-red-500/5 border border-red-400/20"
                  >
                    <div className="w-4 h-4 rounded bg-red-400/20 flex items-center justify-center flex-shrink-0">
                      {renderIcon(feature.icon, { size: 10, className: 'text-red-300' })}
                    </div>
                    <span className="text-blue-100/90 text-xs">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Problems Badge */}
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-red-400/10 rounded-full border border-red-400/20">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                <span className="text-red-300 text-xs font-medium">Limitări și Probleme</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blockchain Technology */}
        <motion.div 
          className="space-y-3 min-h-0 flex flex-col"
          variants={rightColumnVariants}
        >
          <div className="backdrop-blur-lg border border-white/15 rounded-lg p-3 bg-gradient-to-br from-green-500/10 to-blue-500/5 relative overflow-hidden flex-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-lg" />
            
            <div className="relative z-10 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  {renderIcon('blocks', { size: 14, className: 'text-white' })}
                </div>
                <h3 className="text-lg font-bold text-green-300">Tehnologia Blockchain</h3>
              </div>

              {/* Features */}
              <div className="space-y-2 flex-1">
                {[
                  { icon: "globe", text: "Descentralizare completă și autonomie", positive: true },
                  { icon: "zap", text: "Eliminarea totală a intermediarilor", positive: true },
                  { icon: "eye", text: "Transparență totală și verificabilitate", positive: true },
                  { icon: "shield", text: "Securitate distribuită și reziliență", positive: true },
                  { icon: "trending-down", text: "Costuri reduse și eficiență maximă", positive: true }
                ].slice(0, 4).map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-2 p-2 rounded bg-green-500/5 border border-green-400/20"
                  >
                    <div className="w-4 h-4 rounded bg-green-400/20 flex items-center justify-center flex-shrink-0">
                      {renderIcon(feature.icon, { size: 10, className: 'text-green-300' })}
                    </div>
                    <span className="text-blue-100/90 text-xs">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Solutions Badge */}
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-400/10 rounded-full border border-green-400/20">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-green-300 text-xs font-medium">Soluții și Avantaje</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Summary */}
      <motion.div 
        className="mt-3 p-3 backdrop-blur-lg border border-white/15 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <div className="text-center space-y-2">
          <h4 className="text-purple-300 font-bold text-sm">Conceptele Fundamentale în Acțiune</h4>
          <div className="flex flex-wrap justify-center gap-1">
            {concepts?.slice(0, 4).map((concept, index) => (
              <motion.div
                key={concept.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-400/10 rounded-full border border-purple-400/20"
              >
                <div className="w-2 h-2 rounded-full bg-purple-400/20 flex items-center justify-center">
                  {renderIcon(concept.icon || 'zap', { size: 6, className: 'text-purple-300' })}
                </div>
                <span className="text-purple-200 text-xs font-medium">{concept.text}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-blue-100/80 text-xs leading-relaxed max-w-2xl mx-auto">
            Aceste concepte blockchain elimină limitările sistemelor tradiționale și creează un ecosistem digital mai sigur, transparent și eficient.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}; 