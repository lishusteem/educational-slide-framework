/**
 * Sidebar Editor Panel Component
 * Control panel for editing sidebar properties in real-time
 * Positioned on the right side outside the slide canvas
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { renderIcon } from '../../utils/iconRegistry';
import type { EditorPanelProps } from '../../types/editor.types';

export const SidebarEditorPanel: React.FC<EditorPanelProps> = ({
  editorState,
  actions,
  isVisible,
  onToggleVisibility
}) => {
  const [activeSection, setActiveSection] = useState<'vocabulary' | 'concepts'>('vocabulary');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const panelVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={onToggleVisibility}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-lg rounded-xl border border-indigo-500/30 shadow-lg flex items-center justify-center transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ rotate: isVisible ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderIcon('settings', { size: 20, className: 'text-white' })}
        </motion.div>
      </motion.button>

      {/* Editor Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-4 right-20 z-40 w-80 max-h-[90vh] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                {renderIcon('edit-3', { size: 18, className: 'text-indigo-400' })}
                Control Sidebar
              </h3>
              <p className="text-slate-300 text-sm mt-1">
                Editează proprietățile sidebar-ului în timp real
              </p>
            </div>

            {/* Content */}
            <div className="flex flex-col h-full max-h-[calc(90vh-120px)] overflow-y-auto">
              
              {/* Section Tabs */}
              <div className="flex bg-slate-800/50 m-4 rounded-lg p-1">
                {(['vocabulary', 'concepts'] as const).map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      activeSection === section
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {section === 'vocabulary' ? 'Vocabular' : 'Concepte'}
                  </button>
                ))}
              </div>

              {/* Section Content */}
              <div className="px-4 pb-4 space-y-4">
                
                {/* Max Items Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    {renderIcon('hash', { size: 14 })}
                    Numărul de elemente ({activeSection === 'vocabulary' ? editorState.vocabulary.maxItems : editorState.concepts.maxItems}/5)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={activeSection === 'vocabulary' ? editorState.vocabulary.maxItems : editorState.concepts.maxItems}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (activeSection === 'vocabulary') {
                          actions.updateVocabularyMaxItems(value);
                        } else {
                          actions.updateConceptsMaxItems(value);
                        }
                      }}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                      {activeSection === 'vocabulary' ? editorState.vocabulary.maxItems : editorState.concepts.maxItems}
                    </div>
                  </div>
                </div>

                {/* Font Size Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    {renderIcon('type', { size: 14 })}
                    Mărimea textului ({(activeSection === 'vocabulary' ? editorState.vocabulary.fontSize : editorState.concepts.fontSize).toFixed(2)}rem)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.5"
                      max="1.2"
                      step="0.05"
                      value={activeSection === 'vocabulary' ? editorState.vocabulary.fontSize : editorState.concepts.fontSize}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (activeSection === 'vocabulary') {
                          actions.updateVocabularyFontSize(value);
                        } else {
                          actions.updateConceptsFontSize(value);
                        }
                      }}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="w-12 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                      {(activeSection === 'vocabulary' ? editorState.vocabulary.fontSize : editorState.concepts.fontSize).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      {renderIcon('list', { size: 14 })}
                      Editează elemente
                    </label>
                    <button
                      onClick={() => {
                        if (activeSection === 'vocabulary') {
                          actions.addVocabularyItem();
                        } else {
                          actions.addConceptItem();
                        }
                      }}
                      className="w-6 h-6 bg-green-600/80 hover:bg-green-500 rounded-md flex items-center justify-center transition-colors"
                    >
                      {renderIcon('plus', { size: 12, className: 'text-white' })}
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {(activeSection === 'vocabulary' ? editorState.vocabulary.items : editorState.concepts.items).map((item, index) => (
                      <div key={item.id} className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">#{index + 1}</span>
                          <button
                            onClick={() => {
                              if (activeSection === 'vocabulary') {
                                actions.removeVocabularyItem(item.id);
                              } else {
                                actions.removeConceptItem(item.id);
                              }
                            }}
                            className="w-5 h-5 bg-red-600/80 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
                          >
                            {renderIcon('x', { size: 10, className: 'text-white' })}
                          </button>
                        </div>
                        
                        {activeSection === 'vocabulary' ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={(item as any).term}
                              onChange={(e) => actions.updateVocabularyItem(item.id, { term: e.target.value })}
                              placeholder="Termen"
                              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                            />
                            <textarea
                              value={(item as any).definition}
                              onChange={(e) => actions.updateVocabularyItem(item.id, { definition: e.target.value })}
                              placeholder="Definiție"
                              rows={2}
                              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={(item as any).text}
                              onChange={(e) => actions.updateConceptItem(item.id, { text: e.target.value })}
                              placeholder="Concept"
                              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                            />
                            <select
                              value={(item as any).emphasis || 'normal'}
                              onChange={(e) => actions.updateConceptItem(item.id, { emphasis: e.target.value as any })}
                              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-indigo-500"
                            >
                              <option value="normal">Normal</option>
                              <option value="strong">Puternic</option>
                              <option value="subtle">Subtil</option>
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={actions.resetToDefaults}
                  className="w-full py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {renderIcon('refresh-cw', { size: 14 })}
                  Resetează la valorile inițiale
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 