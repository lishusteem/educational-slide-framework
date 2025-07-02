/**
 * Concepts Sidebar Component
 * Dedicated sidebar for managing concept items with emphasis levels
 */

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { renderIcon } from '../../framework/utils/iconRegistry';
import { useSlideEditor } from '../../framework/hooks/useSlideEditor';
import type { SlideConfig, ConceptItem } from '../../framework/types/slide.types';

export interface ConceptsSidebarProps {
  slide: SlideConfig;
  onSlideUpdate: (slide: SlideConfig) => void;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ConceptsSidebar: React.FC<ConceptsSidebarProps> = ({
  slide,
  onSlideUpdate,
  className = '',
  isCollapsed = false,
  onToggleCollapse
}) => {
  const editor = useSlideEditor(slide);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [emphasisFilter, setEmphasisFilter] = useState<'all' | 'normal' | 'strong' | 'subtle'>('all');

  // Sync changes with parent
  React.useEffect(() => {
    if (editor.isDirty) {
      onSlideUpdate(editor.slide);
    }
  }, [editor.slide, editor.isDirty, onSlideUpdate]);

  // Filter concept items
  const filteredItems = editor.slide.content.concepts?.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmphasis = emphasisFilter === 'all' || item.emphasis === emphasisFilter;
    return matchesSearch && matchesEmphasis;
  }) || [];

  // Bulk actions
  const deleteSelected = () => {
    selectedItems.forEach(id => editor.removeConceptItem(id));
    setSelectedItems(new Set());
  };

  const duplicateSelected = () => {
    const itemsToDuplicate = editor.slide.content.concepts?.filter(item => 
      selectedItems.has(item.id)
    ) || [];
    
    itemsToDuplicate.forEach(item => {
      const newItem: ConceptItem = {
        ...item,
        id: `concept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: `${item.text} (Copy)`
      };
      
      const currentConcepts = editor.slide.content.concepts || [];
      const newConcepts = [...currentConcepts, newItem];
      
      const updatedSlide = {
        ...editor.slide,
        content: {
          ...editor.slide.content,
          concepts: newConcepts
        }
      };
      
      onSlideUpdate(updatedSlide);
    });
    
    setSelectedItems(new Set());
  };

  const setEmphasisForSelected = (emphasis: 'normal' | 'strong' | 'subtle') => {
    selectedItems.forEach(id => {
      editor.updateConceptItem(id, { emphasis });
    });
  };

  const selectAll = () => {
    const allIds = new Set(filteredItems.map(item => item.id));
    setSelectedItems(allIds);
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: 48 }}
        className={`bg-green-900/95 backdrop-blur-xl border-r border-green-700/50 shadow-2xl overflow-hidden ${className}`}
      >
        <div className="p-3 h-full flex flex-col items-center">
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 bg-green-600/80 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors mb-4"
          >
            {renderIcon('lightbulb', { size: 16, className: 'text-white' })}
          </button>
          
          <div className="text-xs text-green-300 transform -rotate-90 whitespace-nowrap">
            Concepts
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 48 }}
      animate={{ width: 280 }}
      className={`w-[280px] bg-green-900/95 backdrop-blur-xl border-r border-green-700/50 shadow-2xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-green-700/50 bg-gradient-to-r from-green-600/20 to-emerald-600/20">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            {renderIcon('lightbulb', { size: 18, className: 'text-green-400' })}
            Concepts
          </h3>
          <button
            onClick={onToggleCollapse}
            className="w-6 h-6 bg-green-600/80 hover:bg-green-500 rounded flex items-center justify-center transition-colors"
          >
            {renderIcon('chevron-right', { size: 12, className: 'text-white' })}
          </button>
        </div>
        <p className="text-green-200 text-sm mt-1">
          Manage key concepts and emphasis levels
        </p>
      </div>

      {/* Search & Filters */}
      <div className="p-4 border-b border-green-700/30 space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-green-800/30 border border-green-600/50 rounded-md pl-8 pr-3 py-2 text-white placeholder-green-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
            placeholder="Search concepts..."
          />
          {renderIcon('search', { 
            size: 14, 
            className: 'absolute left-2.5 top-1/2 transform -translate-y-1/2 text-green-400' 
          })}
        </div>

        {/* Emphasis Filter */}
        <div>
          <label className="block text-xs font-medium text-green-300 mb-1">Filter by Emphasis:</label>
          <select
            value={emphasisFilter}
            onChange={(e) => setEmphasisFilter(e.target.value as any)}
            className="w-full bg-green-800/30 border border-green-600/50 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <option value="all">All Emphasis Levels</option>
            <option value="normal">Normal</option>
            <option value="strong">Strong</option>
            <option value="subtle">Subtle</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={editor.addConceptItem}
            className="flex-1 bg-green-600/80 hover:bg-green-500 text-white py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1"
          >
            {renderIcon('plus', { size: 12 })}
            Add
          </button>
          
          {selectedItems.size > 0 && (
            <>
              <button
                onClick={duplicateSelected}
                className="bg-blue-600/80 hover:bg-blue-500 text-white py-2 px-3 rounded-md text-sm transition-all"
                title="Duplicate Selected"
              >
                {renderIcon('copy', { size: 12 })}
              </button>
              
              <button
                onClick={deleteSelected}
                className="bg-red-600/80 hover:bg-red-500 text-white py-2 px-3 rounded-md text-sm transition-all"
                title="Delete Selected"
              >
                {renderIcon('trash-2', { size: 12 })}
              </button>
            </>
          )}
        </div>

        {/* Bulk Emphasis Actions */}
        {selectedItems.size > 0 && (
          <div>
            <label className="block text-xs font-medium text-green-300 mb-1">
              Set Emphasis for Selected ({selectedItems.size}):
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => setEmphasisForSelected('normal')}
                className="flex-1 bg-blue-600/60 hover:bg-blue-500/80 text-white py-1 px-2 rounded text-xs transition-colors"
              >
                Normal
              </button>
              <button
                onClick={() => setEmphasisForSelected('strong')}
                className="flex-1 bg-orange-600/60 hover:bg-orange-500/80 text-white py-1 px-2 rounded text-xs transition-colors"
              >
                Strong
              </button>
              <button
                onClick={() => setEmphasisForSelected('subtle')}
                className="flex-1 bg-purple-600/60 hover:bg-purple-500/80 text-white py-1 px-2 rounded text-xs transition-colors"
              >
                Subtle
              </button>
            </div>
          </div>
        )}

        {/* Selection Actions */}
        {filteredItems.length > 0 && (
          <div className="flex justify-between text-xs">
            <button
              onClick={selectAll}
              className="text-green-300 hover:text-white transition-colors"
            >
              Select All ({filteredItems.length})
            </button>
            {selectedItems.size > 0 && (
              <button
                onClick={clearSelection}
                className="text-green-300 hover:text-white transition-colors"
              >
                Clear ({selectedItems.size})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Concept Items */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-400 mb-2">
              {renderIcon('zap', { size: 32 })}
            </div>
            <p className="text-green-300 text-sm">
              {searchTerm || emphasisFilter !== 'all' ? 'No matching concepts' : 'No concepts yet'}
            </p>
                         <button
               onClick={editor.addConceptItem}
               className="mt-3 text-green-400 hover:text-white text-sm underline transition-colors"
             >
               Adaugă primul concept
             </button>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={filteredItems}
            onReorder={(newOrder) => {
                             // Simple reorder logic
               newOrder.forEach((item) => {
                 editor.updateConceptItem(item.id, item);
               });
            }}
            className="space-y-2"
          >
            <AnimatePresence>
                             {filteredItems.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="cursor-move"
                >
                  <ConceptItemCard
                    item={item}
                    isSelected={selectedItems.has(item.id)}
                    onSelect={(selected) => {
                      const newSelected = new Set(selectedItems);
                      if (selected) {
                        newSelected.add(item.id);
                      } else {
                        newSelected.delete(item.id);
                      }
                      setSelectedItems(newSelected);
                    }}
                                        onUpdate={(updates) => editor.updateConceptItem(item.id, updates)}
                    onRemove={() => editor.removeConceptItem(item.id)}
                    slide={editor.slide}
                    onSlideUpdate={onSlideUpdate}
                    onDuplicate={() => {
                       const newItem: ConceptItem = {
                         ...item,
                         id: `concept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                         text: `${item.text} (Copy)`
                       };
                       
                       const currentConcepts = editor.slide.content.concepts || [];
                       const newConcepts = [...currentConcepts, newItem];
                       
                       const updatedSlide = {
                         ...editor.slide,
                         content: {
                           ...editor.slide.content,
                           concepts: newConcepts
                         }
                       };
                       
                       onSlideUpdate(updatedSlide);
                     }}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-green-700/50 bg-green-800/30">
        <div className="text-xs text-green-300 space-y-1">
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span className="text-white font-medium">{editor.slide.content.concepts?.length || 0}</span>
          </div>
          {searchTerm && (
            <div className="flex justify-between">
              <span>Filtered:</span>
              <span className="text-white font-medium">{filteredItems.length}</span>
            </div>
          )}
          {selectedItems.size > 0 && (
            <div className="flex justify-between">
              <span>Selected:</span>
              <span className="text-green-200 font-medium">{selectedItems.size}</span>
            </div>
          )}
          
          {/* Emphasis Distribution */}
          {editor.slide.content.concepts && editor.slide.content.concepts.length > 0 && (
            <div className="pt-2 border-t border-green-700/50">
              <div className="text-xs text-green-400 mb-1">Emphasis Distribution:</div>
              <div className="flex gap-2 text-xs">
                <span className="text-blue-300">
                  Normal: {editor.slide.content.concepts.filter(c => !c.emphasis || c.emphasis === 'normal').length}
                </span>
                <span className="text-orange-300">
                  Strong: {editor.slide.content.concepts.filter(c => c.emphasis === 'strong').length}
                </span>
                <span className="text-purple-300">
                  Subtle: {editor.slide.content.concepts.filter(c => c.emphasis === 'subtle').length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Concept Item Card Component
const ConceptItemCard: React.FC<{
  item: ConceptItem;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onUpdate: (updates: Partial<ConceptItem>) => void;
  onRemove: () => void;
  slide: SlideConfig;
  onSlideUpdate: (slide: SlideConfig) => void;
  onDuplicate: () => void;
}> = ({ item, isSelected, onSelect, onUpdate, onRemove, slide, onSlideUpdate, onDuplicate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.text);
  const [editedEmphasis, setEditedEmphasis] = useState(item.emphasis || 'normal');

  const updateConceptTiming = (itemId: string, property: 'startTime' | 'duration', value: number) => {
    const currentTiming = slide.timing?.concepts?.[itemId] || { startTime: 0, duration: 2000, delay: 0 };
    
    const updatedSlide = {
      ...slide,
      timing: {
        ...slide.timing,
        concepts: {
          ...slide.timing?.concepts,
          [itemId]: {
            ...currentTiming,
            [property]: value
          }
        }
      }
    };
    
    onSlideUpdate(updatedSlide);
  };

  const handleSave = () => {
    onUpdate({
      text: editedText,
      emphasis: editedEmphasis
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(item.text);
    setEditedEmphasis(item.emphasis || 'normal');
    setIsEditing(false);
  };

  const emphasisColors = {
    normal: 'text-blue-300 bg-blue-600/20',
    strong: 'text-orange-300 bg-orange-600/20',
    subtle: 'text-purple-300 bg-purple-600/20'
  };

  return (
    <motion.div
      layout
      className={`
        p-3 rounded-lg border transition-all relative group
        ${isSelected
          ? 'bg-green-600/30 border-green-500/70 shadow-lg'
          : 'bg-green-800/30 border-green-700/50 hover:bg-green-700/30 hover:border-green-600/50'
        }
      `}
      whileHover={{ scale: 1.02 }}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-3 h-3 text-green-600 bg-green-800/50 border-green-600 rounded focus:ring-green-500"
        />
      </div>

      {/* Emphasis Badge */}
      <div className="absolute top-2 left-8">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${emphasisColors[item.emphasis || 'normal']}`}>
          {item.emphasis || 'normal'}
        </span>
      </div>

      {/* Content */}
      <div className="ml-6 mt-5">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full bg-green-800/50 border border-green-600/50 rounded-md px-2 py-1 text-sm text-white placeholder-green-300/60 focus:outline-none focus:ring-1 focus:ring-green-500/50 resize-none"
              rows={2}
              placeholder="Concept text..."
            />
            <select
              value={editedEmphasis}
              onChange={(e) => setEditedEmphasis(e.target.value as 'normal' | 'strong' | 'subtle')}
              className="w-full bg-green-800/50 border border-green-600/50 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/50"
            >
              <option value="normal">Normal</option>
              <option value="strong">Strong</option>
              <option value="subtle">Subtle</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600/80 hover:bg-green-500 text-white py-1 px-2 rounded text-xs transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600/80 hover:bg-gray-500 text-white py-1 px-2 rounded text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-white text-sm leading-relaxed mb-2">{item.text}</p>
            
            {/* Timing Controls */}
            <div className="border-t border-green-600/30 pt-2 mt-2">
              <div className="text-xs text-green-300 mb-1">Highlight Timing:</div>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <input
                    type="number"
                    value={slide.timing?.concepts?.[item.id]?.startTime || 0}
                    onChange={(e) => updateConceptTiming(item.id, 'startTime', parseInt(e.target.value) || 0)}
                    className="w-full bg-green-800/30 border border-green-600/50 rounded px-1 py-1 text-white text-xs"
                    placeholder="Start"
                    title="Start Time (ms)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={slide.timing?.concepts?.[item.id]?.duration || 2000}
                    onChange={(e) => updateConceptTiming(item.id, 'duration', parseInt(e.target.value) || 2000)}
                    className="w-full bg-green-800/30 border border-green-600/50 rounded px-1 py-1 text-white text-xs"
                    placeholder="Duration"
                    title="Duration (ms)"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-5 h-5 bg-blue-600/80 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
          title={isEditing ? "Cancel Edit" : "Edit Item"}
        >
          {renderIcon(isEditing ? 'x' : 'edit-3', { size: 8, className: 'text-white' })}
        </button>
        
        <button
          onClick={onDuplicate}
          className="w-5 h-5 bg-green-600/80 hover:bg-green-500 rounded flex items-center justify-center transition-colors"
          title="Duplicate Item"
        >
          {renderIcon('copy', { size: 8, className: 'text-white' })}
        </button>
        
        <button
          onClick={onRemove}
          className="w-5 h-5 bg-red-600/80 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
          title="Delete Item"
        >
          {renderIcon('trash-2', { size: 8, className: 'text-white' })}
        </button>
      </div>

      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        {renderIcon('grip-vertical', { size: 10, className: 'text-green-400' })}
      </div>
    </motion.div>
  );
};