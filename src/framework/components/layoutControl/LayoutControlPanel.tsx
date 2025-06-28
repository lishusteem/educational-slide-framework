/**
 * Layout Control Panel Component
 * Main control interface for managing layouts, timing, and highlights
 * Positioned on the left side of the screen, separate from existing panels
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { renderIcon } from '../../utils/iconRegistry';
import { useLayoutControl } from '../../contexts/LayoutControlContext';
import type { ManagedLayoutConfig, LayoutControlPanelProps, TimingHighlight } from '../../types/layoutControl.types';
import { LayoutItemControl } from './LayoutItemControl';
import { LayoutTimingEditor } from './LayoutTimingEditor';

export const LayoutControlPanel: React.FC<LayoutControlPanelProps> = ({
  className = ''
}) => {
  const { state, actions } = useLayoutControl();
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [isAddingLayout, setIsAddingLayout] = useState(false);

  const panelVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: -100,
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

  const enabledLayouts = state.layouts.filter(layout => layout.isEnabled);
  const selectedLayout = selectedLayoutId 
    ? state.layouts.find(layout => layout.id === selectedLayoutId)
    : null;

  const handleAddLayout = () => {
    // This will open a dropdown/modal for selecting new layout templates
    setIsAddingLayout(true);
  };

  const handleLayoutSelect = (layoutId: string) => {
    setSelectedLayoutId(selectedLayoutId === layoutId ? null : layoutId);
  };

  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    if (fromIndex !== toIndex) {
      actions.reorderLayouts(fromIndex, toIndex);
    }
  };

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className={`w-[480px] max-h-[90vh] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/20 to-indigo-600/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              {renderIcon('layers', { size: 18, className: 'text-purple-400' })}
              Layout Control
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Gestionează layout-uri și timing-ul pentru highlight-uri
            </p>
          </div>
          
          {/* Playback Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={actions.play}
              disabled={state.isPlaying && !state.isPaused}
              className="w-8 h-8 bg-green-600/80 hover:bg-green-500 disabled:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
            >
              {renderIcon(state.isPlaying && !state.isPaused ? 'pause' : 'play', { 
                size: 14, 
                className: 'text-white' 
              })}
            </button>
            <button
              onClick={actions.stop}
              className="w-8 h-8 bg-red-600/80 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors"
            >
              {renderIcon('square', { size: 14, className: 'text-white' })}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            style={{ 
              width: `${enabledLayouts.length > 0 ? ((state.currentLayoutIndex + 1) / enabledLayouts.length) * 100 : 0}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Layout {state.currentLayoutIndex + 1} / {enabledLayouts.length}</span>
          <span>{state.playbackSpeed}x speed</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full max-h-[calc(90vh-140px)] overflow-hidden">
        
        {/* Add Layout Button */}
        <div className="p-4 border-b border-slate-700/50">
          <button
            onClick={handleAddLayout}
            className="w-full bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-500/80 hover:to-indigo-500/80 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            {renderIcon('plus', { size: 16 })}
            Adaugă Layout Nou
          </button>
        </div>

        {/* Layouts List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-slate-300 font-medium text-sm">Layouts ({state.layouts.length})</h4>
              <span className="text-xs text-slate-400">
                {enabledLayouts.length} activat{enabledLayouts.length !== 1 ? 'e' : ''}
              </span>
            </div>

            {state.layouts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  {renderIcon('layers', { size: 20, className: 'text-slate-500' })}
                </div>
                <p className="text-sm">Niciun layout disponibil</p>
                <p className="text-xs mt-1">Adaugă primul layout pentru a începe</p>
              </div>
            ) : (
              <div className="space-y-2">
                {state.layouts.map((layout, index) => (
                  <LayoutItemControl
                    key={layout.id}
                    layout={layout}
                    isActive={state.currentLayoutIndex === index}
                    isSelected={selectedLayoutId === layout.id}
                    onSelect={() => handleLayoutSelect(layout.id)}
                    onToggleEnabled={() => actions.toggleLayoutEnabled(layout.id)}
                    onDurationChange={(duration: number) => actions.updateLayoutDuration(layout.id, duration)}
                    onRemove={() => actions.removeLayout(layout.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Layout Editor Section */}
        <AnimatePresence>
          {selectedLayout && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-slate-700/50 bg-slate-800/30 overflow-hidden"
            >
              <LayoutTimingEditor
                layout={selectedLayout}
                onAddHighlight={(highlight: TimingHighlight) => actions.addHighlight(selectedLayout.id, highlight)}
                onRemoveHighlight={(highlightId: string) => actions.removeHighlight(selectedLayout.id, highlightId)}
                onUpdateHighlight={(highlightId: string, updates: Partial<TimingHighlight>) => actions.updateHighlight(selectedLayout.id, highlightId, updates)}
                onPreviewHighlight={(highlightId: string) => actions.previewHighlight(selectedLayout.id, highlightId)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Layout Control System</span>
          <div className="flex items-center gap-4">
            <span>Preview: {state.previewMode ? 'ON' : 'OFF'}</span>
            <div className={`w-2 h-2 rounded-full ${state.isPlaying ? 'bg-green-400' : 'bg-slate-500'}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 