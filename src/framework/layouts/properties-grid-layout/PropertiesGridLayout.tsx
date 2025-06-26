/**
 * Properties Grid Layout Component
 * Displays vocabulary and concepts in a structured grid format
 * Shows technical vocabulary vs functional concepts
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { BaseLayoutProps } from '../../types/layout.types';
import { renderIcon } from '../../utils/iconRegistry';

export const PropertiesGridLayout: React.FC<BaseLayoutProps> = ({
  content,
  className = '',
  isSlideActive = true
}) => {
  const { vocabulary, concepts } = content;

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay: 0.2
      }
    }
  };

  return (
    <motion.div 
      className={`h-full flex flex-col px-6 py-4 ${className}`}
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-4"
        variants={headerVariants}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-white/30 mb-2">
          <div className="relative z-10 drop-shadow-lg">
            {renderIcon('grid-3x3', { size: 24, className: 'text-white' })}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-1">
          Proprietăți & Funcții Blockchain
        </h2>
        <p className="text-blue-100/80 text-sm max-w-2xl mx-auto">
          O viziune structurată asupra elementelor fundamentale și rolurilor lor în ecosistem
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        
        {/* Vocabulary Properties */}
        <motion.div 
          className="space-y-3 min-h-0 flex flex-col"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              {renderIcon('book', { size: 14, className: 'text-white' })}
            </div>
            <h3 className="text-lg font-bold text-amber-300">Vocabular Tehnic</h3>
          </div>
          
          <div className="space-y-2 flex-1 overflow-hidden">
            {vocabulary?.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="backdrop-blur-lg border-l-4 border-amber-400 p-3 rounded-lg border border-white/15 relative overflow-hidden bg-gradient-to-r from-amber-500/10 to-orange-500/5"
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/2 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded bg-amber-400/20 flex items-center justify-center">
                      {renderIcon(item.icon || 'hash', { size: 10, className: 'text-amber-300' })}
                    </div>
                    <h4 className="text-amber-200 font-bold text-sm">{item.term}</h4>
                  </div>
                  <p className="text-blue-100/90 text-xs leading-relaxed line-clamp-2">{item.definition}</p>
                  
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-400/10 rounded-full border border-amber-400/20">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                    <span className="text-amber-300 text-xs font-medium">Component Tehnic</span>
                  </div>
                </div>
              </motion.div>
            )) || (
              <div className="text-blue-100/50 text-center py-4 text-sm">
                Nu sunt disponibile elemente de vocabular
              </div>
            )}
          </div>
        </motion.div>

        {/* Concepts Functions */}
        <motion.div 
          className="space-y-3 min-h-0 flex flex-col"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              {renderIcon('zap', { size: 14, className: 'text-white' })}
            </div>
            <h3 className="text-lg font-bold text-green-300">Concepte Funcționale</h3>
          </div>
          
          <div className="space-y-2 flex-1 overflow-hidden">
            {concepts?.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="backdrop-blur-lg border-l-4 border-green-400 p-3 rounded-lg border border-white/15 relative overflow-hidden bg-gradient-to-r from-green-500/10 to-blue-500/5"
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/2 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded bg-green-400/20 flex items-center justify-center">
                      {renderIcon(item.icon || 'zap', { size: 10, className: 'text-green-300' })}
                    </div>
                    <h4 className="text-green-200 font-bold text-sm">{item.text}</h4>
                  </div>
                  
                  <p className="text-blue-100/90 text-xs leading-relaxed mb-2 line-clamp-2">
                    {getConceptDescription(item.id)}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-400/10 rounded-full border border-green-400/20">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-green-300 text-xs font-medium">Funcție Primară</span>
                    </div>
                    {item.emphasis === 'strong' && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-400/10 rounded-full border border-blue-400/20">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-blue-300 text-xs font-medium">Esențial</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )) || (
              <div className="text-blue-100/50 text-center py-4 text-sm">
                Nu sunt disponibile concepte
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Summary */}
      <motion.div 
        className="mt-3 p-3 backdrop-blur-lg border border-white/15 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-center">
          <h4 className="text-indigo-300 font-bold text-sm mb-1">Interconectarea Sistemului</h4>
          <p className="text-blue-100/80 text-xs leading-relaxed">
            Vocabularul tehnic definește componentele, iar conceptele funcționale stabilesc modul de operare și interacțiune în rețeaua blockchain descentralizată.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Helper function to generate concept descriptions
function getConceptDescription(conceptId: string): string {
  const descriptions: Record<string, string> = {
    'decentralization': 'Elimină punctele unice de eșec prin distribuirea controlului pe multiple noduri independente.',
    'immutability': 'Garantează că datele odată înregistrate nu pot fi alterate, asigurând integritatea istorică.',
    'transparency': 'Permite verificarea publică a tuturor tranzacțiilor fără compromiterea identității utilizatorilor.',
    'security': 'Folosește criptografia avansată și consensul distributed pentru protecția împotriva atacurilor.',
    'consensus': 'Coordonează acordul între noduri pentru validarea și acceptarea stării rețelei.',
    'smart-contract': 'Automatizează execuția contractelor prin cod, eliminând nevoia de intermediari.',
    'mining': 'Validează tranzacțiile și securizează rețeaua prin proces de calcul intensiv.',
    'wallet': 'Gestionează cheile criptografice necesare pentru controlul activelor digitale.'
  };

  return descriptions[conceptId] || 'Concept fundamental care contribuie la funcționarea eficientă a ecosistemului blockchain.';
} 