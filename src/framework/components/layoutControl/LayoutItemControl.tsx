/**
 * Layout Item Control Component
 * Individual layout control interface in the layouts list
 * Supports drag and drop, enable/disable, duration editing
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { renderIcon } from '../../utils/iconRegistry';
import type { ManagedLayoutConfig } from '../../types/layoutControl.types';

interface LayoutItemControlProps {
  layout: ManagedLayoutConfig;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleEnabled: () => void;
  onDurationChange: (duration: number) => void;
  onRemove: () => void;
}

export const LayoutItemControl: React.FC<LayoutItemControlProps> = ({
  layout,
  isActive,
  isSelected,
  onSelect,
  onToggleEnabled,
  onDurationChange,
  onRemove
}) => {
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [durationInput, setDurationInput] = useState(layout.duration.toString());

  const handleDurationSubmit = () => {
    const newDuration = parseInt(durationInput);
    if (!isNaN(newDuration) && newDuration > 0) {
      onDurationChange(newDuration);
    } else {
      setDurationInput(layout.duration.toString()); // Reset to original
    }
    setIsEditingDuration(false);
  };

  const handleDurationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDurationSubmit();
    } else if (e.key === 'Escape') {
      setDurationInput(layout.duration.toString());
      setIsEditingDuration(false);
    }
  };

  const getStatusColor = () => {
    if (!layout.isEnabled) return 'bg-slate-600';
    if (isActive) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getStatusText = () => {
    if (!layout.isEnabled) return 'Dezactivat';
    if (isActive) return 'Activ';
    return 'Gata';
  };

  return (
    <motion.div
      layout
      className={`bg-slate-800/50 border rounded-lg transition-all duration-200 ${
        isSelected 
          ? 'border-purple-500/50 bg-purple-900/20' 
          : layout.isEnabled 
            ? 'border-slate-600/50 hover:border-slate-500/50' 
            : 'border-slate-700/30'
      }`}
      whileHover={layout.isEnabled ? { scale: 1.005 } : {}}
    >
      {/* Main Layout Info */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          {/* Layout Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Status Indicator */}
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              
              {/* Layout Name */}
              <h5 className={`font-medium text-sm truncate ${
                layout.isEnabled ? 'text-white' : 'text-slate-400'
              }`}>
                {layout.name}
              </h5>
              
              {/* Status Badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-green-500/20 text-green-300' 
                  : layout.isEnabled 
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-slate-600/20 text-slate-400'
              }`}>
                {getStatusText()}
              </span>
            </div>

            {/* Description */}
            <p className={`text-xs truncate ${
              layout.isEnabled ? 'text-slate-300' : 'text-slate-500'
            }`}>
              {layout.description}
            </p>

            {/* Duration and Highlights Info */}
            <div className="flex items-center gap-3 mt-2 text-xs">
              {/* Duration */}
              <div className="flex items-center gap-1">
                {renderIcon('clock', { size: 10, className: 'text-slate-400' })}
                {isEditingDuration ? (
                  <input
                    type="number"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                    onBlur={handleDurationSubmit}
                    onKeyDown={handleDurationKeyPress}
                    className="w-16 bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`cursor-pointer hover:text-purple-300 ${
                      layout.isEnabled ? 'text-slate-300' : 'text-slate-500'
                    }`}
                    onClick={() => setIsEditingDuration(true)}
                  >
                    {layout.duration}ms
                  </span>
                )}
              </div>

              {/* Highlights Count */}
              {layout.timingConfig && (
                <div className="flex items-center gap-1">
                  {renderIcon('zap', { size: 10, className: 'text-yellow-400' })}
                  <span className="text-slate-400">
                    {layout.timingConfig.highlights.length} highlight{layout.timingConfig.highlights.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 ml-2">
            {/* Enable/Disable Toggle */}
            <button
              onClick={onToggleEnabled}
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                layout.isEnabled 
                  ? 'bg-green-600/80 hover:bg-green-500 text-white' 
                  : 'bg-slate-600/80 hover:bg-slate-500 text-slate-300'
              }`}
              title={layout.isEnabled ? 'Dezactivează' : 'Activează'}
            >
              {renderIcon(layout.isEnabled ? 'eye' : 'eye-off', { size: 10 })}
            </button>

            {/* Expand/Collapse */}
            <button
              onClick={onSelect}
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-purple-600/80 hover:bg-purple-500 text-white'
                  : 'bg-slate-600/80 hover:bg-slate-500 text-slate-300'
              }`}
              title={isSelected ? 'Închide editor' : 'Deschide editor'}
            >
              {renderIcon(isSelected ? 'chevron-up' : 'chevron-down', { size: 10 })}
            </button>

            {/* Remove */}
            <button
              onClick={onRemove}
              className="w-6 h-6 bg-red-600/80 hover:bg-red-500 rounded flex items-center justify-center transition-colors text-white"
              title="Șterge layout"
            >
              {renderIcon('x', { size: 10 })}
            </button>
          </div>
        </div>

        {/* Quick Preview Bar */}
        {layout.timingConfig && layout.timingConfig.highlights.length > 0 && (
          <div className="mt-2 h-1 bg-slate-700/50 rounded-full overflow-hidden">
            {layout.timingConfig.highlights.map((highlight, index) => {
              const startPercent = (highlight.startTime / layout.duration) * 100;
              const widthPercent = (highlight.duration / layout.duration) * 100;
              
              return (
                <div
                  key={highlight.id}
                  className="absolute h-1 bg-yellow-400/60 rounded-full"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    zIndex: index
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}; 