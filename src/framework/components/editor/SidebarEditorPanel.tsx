/**
 * Sidebar Editor Panel Component
 * Control panel for editing sidebar properties in real-time
 * Permanently visible on the right side outside the slide canvas
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { renderIcon } from '../../utils/iconRegistry';
import type { EditorPanelProps } from '../../types/editor.types';
import { IconSelector } from './IconSelector';

export const SidebarEditorPanel: React.FC<EditorPanelProps> = ({
  editorState,
  actions
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
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="w-80 max-h-[90vh] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
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
                    <div className="flex items-center gap-1">
                      {/* Icon Selector */}
                      <IconSelector
                        currentIcon={item.icon || 'lightbulb'}
                        onIconChange={(icon) => {
                          if (activeSection === 'vocabulary') {
                            actions.updateVocabularyItem(item.id, { icon });
                          } else {
                            actions.updateConceptItem(item.id, { icon });
                          }
                        }}
                        size="sm"
                      />
                      {/* Delete Button */}
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
                  </div>
                  
                  {activeSection === 'vocabulary' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={('term' in item) ? item.term : ''}
                        onChange={(e) => actions.updateVocabularyItem(item.id, { term: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-2 py-1 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        placeholder="Termen..."
                      />
                      <textarea
                        value={('definition' in item) ? item.definition : ''}
                        onChange={(e) => actions.updateVocabularyItem(item.id, { definition: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-2 py-1 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                        rows={2}
                        placeholder="Definiție..."
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={('text' in item) ? item.text : ''}
                        onChange={(e) => actions.updateConceptItem(item.id, { text: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-2 py-1 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        placeholder="Text concept..."
                      />
                      <select
                        value={('emphasis' in item) ? item.emphasis : 'normal'}
                        onChange={(e) => actions.updateConceptItem(item.id, { emphasis: e.target.value as 'normal' | 'strong' | 'subtle' })}
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="normal">Normal</option>
                        <option value="strong">Emphatic</option>
                        <option value="subtle">Subtil</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-slate-700/50">
            <button
              onClick={actions.resetToDefaults}
              className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              {renderIcon('refresh-ccw', { size: 14 })}
              Resetează la valorile inițiale
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 