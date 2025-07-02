/**
 * Content Editor Component
 * Clean, intuitive editor for slide content with real-time updates
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { renderIcon } from '../../framework/utils/iconRegistry';
import { useSlideEditor } from '../../framework/hooks/useSlideEditor';
import type { SlideConfig, VocabularyItem, ConceptItem } from '../../framework/types/slide.types';

export interface ContentEditorProps {
  slide: SlideConfig;
  onSlideUpdate: (slide: SlideConfig) => void;
  className?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  slide,
  onSlideUpdate,
  className = ''
}) => {
  const editor = useSlideEditor(slide);
  const [activeTab, setActiveTab] = useState<'main' | 'vocabulary' | 'concepts'>('main');

  // Sync changes with parent
  React.useEffect(() => {
    if (editor.isDirty) {
      onSlideUpdate(editor.slide);
    }
  }, [editor.slide, editor.isDirty, onSlideUpdate]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      className={`w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-green-600/20 to-blue-600/20">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            {renderIcon('edit-3', { size: 18, className: 'text-green-400' })}
            Content Editor
          </h3>
          {editor.isDirty && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Unsaved changes" />
          )}
        </div>
        <p className="text-slate-300 text-sm mt-1">
          Real-time slide content editing
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800/50">
        {([
          { id: 'main', label: 'Main', icon: 'file-text' },
          { id: 'vocabulary', label: 'Vocab', icon: 'book' },
          { id: 'concepts', label: 'Concepts', icon: 'lightbulb' }
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === tab.id
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {renderIcon(tab.icon, { size: 12 })}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[70vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editor.slide.content.title}
                  onChange={(e) => editor.updateTitle(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Slide title..."
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={editor.slide.content.subtitle || ''}
                  onChange={(e) => editor.updateSubtitle(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Subtitle (optional)..."
                />
              </div>

              {/* Bridge Text */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Bridge Text</label>
                <textarea
                  value={editor.slide.content.bridgeText || ''}
                  onChange={(e) => editor.updateBridgeText(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                  rows={3}
                  placeholder="Connecting text (optional)..."
                />
              </div>

              {/* Floating Icon */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Floating Icon</label>
                <select
                  value={editor.slide.content.floatingIcon || 'book'}
                  onChange={(e) => editor.updateFloatingIcon(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="book">📖 Book</option>
                  <option value="lightbulb">💡 Lightbulb</option>
                  <option value="zap">⚡ Zap</option>
                  <option value="users">👥 Users</option>
                  <option value="layers">📊 Layers</option>
                  <option value="globe">🌍 Globe</option>
                </select>
              </div>
            </motion.div>
          )}

          {activeTab === 'vocabulary' && (
            <motion.div
              key="vocabulary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-300">Vocabulary Items</h4>
                <button
                  onClick={editor.addVocabularyItem}
                  className="w-6 h-6 bg-green-600/80 hover:bg-green-500 rounded-md flex items-center justify-center transition-colors"
                >
                  {renderIcon('plus', { size: 12, className: 'text-white' })}
                </button>
              </div>

              <div className="space-y-3">
                {editor.slide.content.vocabulary?.map((item, _index) => (
                  <VocabularyItemEditor
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => editor.updateVocabularyItem(item.id, updates)}
                    onRemove={() => editor.removeVocabularyItem(item.id)}
                  />
                ))}
                {(!editor.slide.content.vocabulary || editor.slide.content.vocabulary.length === 0) && (
                  <p className="text-slate-400 text-sm text-center py-4">No vocabulary items yet</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'concepts' && (
            <motion.div
              key="concepts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-300">Concept Items</h4>
                <button
                  onClick={editor.addConceptItem}
                  className="w-6 h-6 bg-green-600/80 hover:bg-green-500 rounded-md flex items-center justify-center transition-colors"
                >
                  {renderIcon('plus', { size: 12, className: 'text-white' })}
                </button>
              </div>

              <div className="space-y-3">
                {editor.slide.content.concepts?.map((item, _index) => (
                  <ConceptItemEditor
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => editor.updateConceptItem(item.id, updates)}
                    onRemove={() => editor.removeConceptItem(item.id)}
                  />
                ))}
                {(!editor.slide.content.concepts || editor.slide.content.concepts.length === 0) && (
                  <p className="text-slate-400 text-sm text-center py-4">No concept items yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Vocabulary Item Editor
const VocabularyItemEditor: React.FC<{
  item: VocabularyItem;
  onUpdate: (updates: Partial<VocabularyItem>) => void;
  onRemove: () => void;
}> = ({ item, onUpdate, onRemove }) => (
  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400">Vocabulary Item</span>
      <button
        onClick={onRemove}
        className="w-5 h-5 bg-red-600/80 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
      >
        {renderIcon('x', { size: 10, className: 'text-white' })}
      </button>
    </div>
    
    <input
      type="text"
      value={item.term}
      onChange={(e) => onUpdate({ term: e.target.value })}
      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-2 py-1 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-green-500/50"
      placeholder="Term..."
    />
    
    <textarea
      value={item.definition}
      onChange={(e) => onUpdate({ definition: e.target.value })}
      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-2 py-1 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-green-500/50 resize-none"
      rows={2}
      placeholder="Definition..."
    />
  </div>
);

// Concept Item Editor
const ConceptItemEditor: React.FC<{
  item: ConceptItem;
  onUpdate: (updates: Partial<ConceptItem>) => void;
  onRemove: () => void;
}> = ({ item, onUpdate, onRemove }) => (
  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400">Concept Item</span>
      <button
        onClick={onRemove}
        className="w-5 h-5 bg-red-600/80 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
      >
        {renderIcon('x', { size: 10, className: 'text-white' })}
      </button>
    </div>
    
    <input
      type="text"
      value={item.text}
      onChange={(e) => onUpdate({ text: e.target.value })}
      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-2 py-1 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-green-500/50"
      placeholder="Concept text..."
    />
    
    <select
      value={item.emphasis || 'normal'}
      onChange={(e) => onUpdate({ emphasis: e.target.value as 'normal' | 'strong' | 'subtle' })}
      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/50"
    >
      <option value="normal">Normal</option>
      <option value="strong">Strong</option>
      <option value="subtle">Subtle</option>
    </select>
  </div>
);