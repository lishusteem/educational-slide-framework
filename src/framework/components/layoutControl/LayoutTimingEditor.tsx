/**
 * Layout Timing Editor Component
 * Detailed editor for managing highlights and timing configurations for individual layouts
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { renderIcon } from '../../utils/iconRegistry';
import type { ManagedLayoutConfig, TimingHighlight } from '../../types/layoutControl.types';

interface LayoutTimingEditorProps {
  layout: ManagedLayoutConfig;
  onAddHighlight: (highlight: TimingHighlight) => void;
  onRemoveHighlight: (highlightId: string) => void;
  onUpdateHighlight: (highlightId: string, updates: Partial<TimingHighlight>) => void;
  onPreviewHighlight: (highlightId: string) => void;
}

export const LayoutTimingEditor: React.FC<LayoutTimingEditorProps> = ({
  layout,
  onAddHighlight,
  onRemoveHighlight,
  onUpdateHighlight,
  onPreviewHighlight
}) => {
  const [isAddingHighlight, setIsAddingHighlight] = useState(false);
  const [newHighlight, setNewHighlight] = useState<Partial<TimingHighlight>>({
    elementSelector: '',
    startTime: 0,
    duration: 1000,
    animationType: 'glow',
    color: '#FFD700',
    intensity: 0.8
  });

  const handleAddHighlight = () => {
    if (newHighlight.elementSelector && newHighlight.startTime !== undefined && newHighlight.duration) {
      const highlight: TimingHighlight = {
        id: `highlight-${Date.now()}`,
        elementSelector: newHighlight.elementSelector,
        startTime: newHighlight.startTime,
        duration: newHighlight.duration,
        animationType: newHighlight.animationType || 'glow',
        color: newHighlight.color,
        intensity: newHighlight.intensity
      };
      
      onAddHighlight(highlight);
      
      // Reset form
      setNewHighlight({
        elementSelector: '',
        startTime: 0,
        duration: 1000,
        animationType: 'glow',
        color: '#FFD700',
        intensity: 0.8
      });
      setIsAddingHighlight(false);
    }
  };

  const animationTypes = [
    { value: 'glow', label: 'Glow', icon: 'circle' },
    { value: 'pulse', label: 'Pulse', icon: 'activity' },
    { value: 'scale', label: 'Scale', icon: 'maximize' },
    { value: 'border', label: 'Border', icon: 'square' },
    { value: 'swirl', label: 'Swirl', icon: 'rotate-cw' }
  ] as const;

  const highlights = layout.timingConfig?.highlights || [];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-white font-medium text-sm">Timing Editor</h5>
          <p className="text-slate-400 text-xs mt-0.5">
            {layout.name} - {highlights.length} highlight{highlights.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={() => setIsAddingHighlight(!isAddingHighlight)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            isAddingHighlight
              ? 'bg-red-600/80 hover:bg-red-500 text-white'
              : 'bg-green-600/80 hover:bg-green-500 text-white'
          }`}
        >
          {isAddingHighlight ? 'Anulează' : 'Adaugă Highlight'}
        </button>
      </div>

      {/* Add Highlight Form */}
      <AnimatePresence>
        {isAddingHighlight && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-700/30 rounded-lg p-3 space-y-3"
          >
            <h6 className="text-slate-300 text-xs font-medium">Adaugă Highlight Nou</h6>
            
            {/* Element Selector */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Element Selector (CSS)</label>
              <input
                type="text"
                value={newHighlight.elementSelector || ''}
                onChange={(e) => setNewHighlight(prev => ({ ...prev, elementSelector: e.target.value }))}
                placeholder="Ex: .concept-title, #main-content, [data-element]"
                className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Timing */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Start Time (ms)</label>
                <input
                  type="number"
                  value={newHighlight.startTime || 0}
                  onChange={(e) => setNewHighlight(prev => ({ ...prev, startTime: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Duration (ms)</label>
                <input
                  type="number"
                  value={newHighlight.duration || 1000}
                  onChange={(e) => setNewHighlight(prev => ({ ...prev, duration: parseInt(e.target.value) || 1000 }))}
                  className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Animation Type */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Animation Type</label>
              <div className="grid grid-cols-5 gap-1">
                {animationTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setNewHighlight(prev => ({ ...prev, animationType: type.value }))}
                    className={`p-2 rounded text-xs flex flex-col items-center gap-1 transition-colors ${
                      newHighlight.animationType === type.value
                        ? 'bg-purple-600/80 text-white'
                        : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {renderIcon(type.icon, { size: 12 })}
                    <span className="text-[10px]">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color and Intensity */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Color</label>
                <input
                  type="color"
                  value={newHighlight.color || '#FFD700'}
                  onChange={(e) => setNewHighlight(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-8 bg-slate-600 border border-slate-500 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Intensity</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={newHighlight.intensity || 0.8}
                  onChange={(e) => setNewHighlight(prev => ({ ...prev, intensity: parseFloat(e.target.value) }))}
                  className="w-full h-8 bg-slate-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleAddHighlight}
                disabled={!newHighlight.elementSelector}
                className="flex-1 bg-green-600/80 hover:bg-green-500 disabled:bg-slate-600 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
              >
                Adaugă
              </button>
              <button
                onClick={() => setIsAddingHighlight(false)}
                className="flex-1 bg-slate-600/80 hover:bg-slate-500 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
              >
                Anulează
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Highlights List */}
      <div className="space-y-2">
        {highlights.length === 0 ? (
          <div className="text-center py-4 text-slate-400">
            <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-2">
              {renderIcon('zap', { size: 14, className: 'text-slate-500' })}
            </div>
            <p className="text-xs">Niciun highlight configurat</p>
          </div>
        ) : (
          highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              layout
              className="bg-slate-700/30 rounded-lg p-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full border-2"
                      style={{ backgroundColor: highlight.color || '#FFD700' }}
                    />
                    <span className="text-xs font-medium text-white truncate">
                      {highlight.elementSelector}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">
                      {highlight.animationType}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{highlight.startTime}ms - {highlight.startTime + highlight.duration}ms</span>
                    <span>({highlight.duration}ms)</span>
                    <span>Intensity: {Math.round((highlight.intensity || 0.8) * 100)}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => onPreviewHighlight(highlight.id)}
                    className="w-6 h-6 bg-blue-600/80 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
                    title="Preview"
                  >
                    {renderIcon('eye', { size: 10, className: 'text-white' })}
                  </button>
                  <button
                    onClick={() => onRemoveHighlight(highlight.id)}
                    className="w-6 h-6 bg-red-600/80 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
                    title="Șterge"
                  >
                    {renderIcon('trash-2', { size: 10, className: 'text-white' })}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Timeline Preview */}
      {highlights.length > 0 && (
        <div className="mt-4">
          <h6 className="text-slate-300 text-xs font-medium mb-2">Timeline Preview</h6>
          <div className="h-4 bg-slate-700/50 rounded-lg overflow-hidden relative">
            {highlights.map((highlight, index) => {
              const startPercent = (highlight.startTime / layout.duration) * 100;
              const widthPercent = (highlight.duration / layout.duration) * 100;
              
              return (
                <div
                  key={highlight.id}
                  className="absolute h-4 rounded opacity-80 cursor-pointer hover:opacity-100 transition-opacity"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    backgroundColor: highlight.color || '#FFD700',
                    zIndex: index
                  }}
                  onClick={() => onPreviewHighlight(highlight.id)}
                  title={`${highlight.elementSelector} (${highlight.startTime}ms - ${highlight.startTime + highlight.duration}ms)`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0ms</span>
            <span>{layout.duration}ms</span>
          </div>
        </div>
      )}
    </div>
  );
}; 