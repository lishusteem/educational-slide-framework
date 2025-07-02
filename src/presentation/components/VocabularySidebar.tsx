/**
 * Vocabulary Sidebar Component
 * Dedicated sidebar for managing vocabulary items with advanced features
 */

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { renderIcon } from '../../framework/utils/iconRegistry';
import { useSlideEditor } from '../../framework/hooks/useSlideEditor';
import type { SlideConfig, VocabularyItem } from '../../framework/types/slide.types';

export interface VocabularySidebarProps {
  slide: SlideConfig;
  onSlideUpdate: (slide: SlideConfig) => void;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const VocabularySidebar: React.FC<VocabularySidebarProps> = ({
  slide,
  onSlideUpdate,
  className = '',
  isCollapsed = false,
  onToggleCollapse
}) => {
  const editor = useSlideEditor(slide);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Sync changes with parent
  React.useEffect(() => {
    if (editor.isDirty) {
      onSlideUpdate(editor.slide);
    }
  }, [editor.slide, editor.isDirty, onSlideUpdate]);

  // Filter vocabulary items
  const filteredItems = editor.slide.content.vocabulary?.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Bulk actions
  const deleteSelected = () => {
    selectedItems.forEach(id => editor.removeVocabularyItem(id));
    setSelectedItems(new Set());
  };

  const duplicateSelected = () => {
    const itemsToDuplicate = editor.slide.content.vocabulary?.filter(item => 
      selectedItems.has(item.id)
    ) || [];
    
    itemsToDuplicate.forEach(item => {
      const newItem: VocabularyItem = {
        ...item,
        id: `vocab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        term: `${item.term} (Copy)`
      };
      
      // Adaugă direct prin setarea slide-ului
      const currentVocabulary = editor.slide.content.vocabulary || [];
      const newVocabulary = [...currentVocabulary, newItem];
      
      const updatedSlide = {
        ...editor.slide,
        content: {
          ...editor.slide.content,
          vocabulary: newVocabulary
        }
      };
      
      onSlideUpdate(updatedSlide);
    });
    
    setSelectedItems(new Set());
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
        className={`bg-amber-900/95 backdrop-blur-xl border-r border-amber-700/50 shadow-2xl overflow-hidden ${className}`}
      >
        <div className="p-3 h-full flex flex-col items-center">
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 bg-amber-600/80 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-colors mb-4"
          >
            {renderIcon('book', { size: 16, className: 'text-white' })}
          </button>
          
          <div className="text-xs text-amber-300 transform -rotate-90 whitespace-nowrap">
            Vocabulary
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 48 }}
      animate={{ width: 280 }}
      className={`w-[280px] bg-amber-900/95 backdrop-blur-xl border-r border-amber-700/50 shadow-2xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-amber-700/50 bg-gradient-to-r from-amber-600/20 to-orange-600/20">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            {renderIcon('book', { size: 18, className: 'text-amber-400' })}
            Vocabulary
          </h3>
          <button
            onClick={onToggleCollapse}
            className="w-6 h-6 bg-amber-600/80 hover:bg-amber-500 rounded flex items-center justify-center transition-colors"
          >
            {renderIcon('chevron-left', { size: 12, className: 'text-white' })}
          </button>
        </div>
        <p className="text-amber-200 text-sm mt-1">
          Manage vocabulary terms and definitions
        </p>
      </div>

      {/* Search & Actions */}
      <div className="p-4 border-b border-amber-700/30 space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-amber-800/30 border border-amber-600/50 rounded-md pl-8 pr-3 py-2 text-white placeholder-amber-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            placeholder="Search vocabulary..."
          />
          {renderIcon('search', { 
            size: 14, 
            className: 'absolute left-2.5 top-1/2 transform -translate-y-1/2 text-amber-400' 
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={editor.addVocabularyItem}
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

        {/* Selection Actions */}
        {filteredItems.length > 0 && (
          <div className="flex justify-between text-xs">
            <button
              onClick={selectAll}
              className="text-amber-300 hover:text-white transition-colors"
            >
              Select All ({filteredItems.length})
            </button>
            {selectedItems.size > 0 && (
              <button
                onClick={clearSelection}
                className="text-amber-300 hover:text-white transition-colors"
              >
                Clear ({selectedItems.size})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Vocabulary Items */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-amber-400 mb-2">
              {renderIcon('book-open', { size: 32 })}
            </div>
            <p className="text-amber-300 text-sm">
              {searchTerm ? 'No matching vocabulary items' : 'No vocabulary items yet'}
            </p>
                         <button
               onClick={editor.addVocabularyItem}
               className="mt-3 text-amber-400 hover:text-white text-sm underline transition-colors"
             >
               Adaugă primul termen din vocabular
             </button>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={filteredItems}
            onReorder={(newOrder) => {
                             // Simplified reorder - update each item to maintain order
               newOrder.forEach((item) => {
                 editor.updateVocabularyItem(item.id, item);
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
                  <VocabularyItemCard
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
                    onUpdate={(updates) => editor.updateVocabularyItem(item.id, updates)}
                    onRemove={() => editor.removeVocabularyItem(item.id)}
                    slide={editor.slide}
                    onSlideUpdate={onSlideUpdate}
                    onDuplicate={() => {
                      const newItem: VocabularyItem = {
                        ...item,
                        id: `vocab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        term: `${item.term} (Copy)`
                      };
                      
                      const currentVocabulary = editor.slide.content.vocabulary || [];
                      const newVocabulary = [...currentVocabulary, newItem];
                      
                      const updatedSlide = {
                        ...editor.slide,
                        content: {
                          ...editor.slide.content,
                          vocabulary: newVocabulary
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
      <div className="p-4 border-t border-amber-700/50 bg-amber-800/30">
        <div className="text-xs text-amber-300 space-y-1">
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span className="text-white font-medium">{editor.slide.content.vocabulary?.length || 0}</span>
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
              <span className="text-amber-200 font-medium">{selectedItems.size}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Vocabulary Item Card Component
const VocabularyItemCard: React.FC<{
  item: VocabularyItem;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onUpdate: (updates: Partial<VocabularyItem>) => void;
  onRemove: () => void;
  slide: SlideConfig;
  onSlideUpdate: (slide: SlideConfig) => void;
  onDuplicate: () => void;
}> = ({ item, isSelected, onSelect, onUpdate, onRemove, slide, onSlideUpdate, onDuplicate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTerm, setEditedTerm] = useState(item.term);
  const [editedDefinition, setEditedDefinition] = useState(item.definition);

  const updateVocabularyTiming = (itemId: string, property: 'startTime' | 'duration', value: number) => {
    const currentTiming = slide.timing?.vocabulary?.[itemId] || { startTime: 0, duration: 2000, delay: 0 };
    
    const updatedSlide = {
      ...slide,
      timing: {
        ...slide.timing,
        vocabulary: {
          ...slide.timing?.vocabulary,
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
      term: editedTerm,
      definition: editedDefinition
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTerm(item.term);
    setEditedDefinition(item.definition);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      className={`
        p-3 rounded-lg border transition-all relative group
        ${isSelected
          ? 'bg-amber-600/30 border-amber-500/70 shadow-lg'
          : 'bg-amber-800/30 border-amber-700/50 hover:bg-amber-700/30 hover:border-amber-600/50'
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
          className="w-3 h-3 text-amber-600 bg-amber-800/50 border-amber-600 rounded focus:ring-amber-500"
        />
      </div>

      {/* Content */}
      <div className="ml-6">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editedTerm}
              onChange={(e) => setEditedTerm(e.target.value)}
              className="w-full bg-amber-800/50 border border-amber-600/50 rounded-md px-2 py-1 text-sm text-white placeholder-amber-300/60 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              placeholder="Term..."
            />
            <textarea
              value={editedDefinition}
              onChange={(e) => setEditedDefinition(e.target.value)}
              className="w-full bg-amber-800/50 border border-amber-600/50 rounded-md px-2 py-1 text-sm text-white placeholder-amber-300/60 focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
              rows={3}
              placeholder="Definition..."
            />
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
            <h4 className="font-medium text-white text-sm mb-1">{item.term}</h4>
            <p className="text-amber-200 text-xs leading-relaxed mb-2">{item.definition}</p>
            
            {/* Timing Controls */}
            <div className="border-t border-amber-600/30 pt-2 mt-2">
              <div className="text-xs text-amber-300 mb-1">Highlight Timing:</div>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <input
                    type="number"
                    value={slide.timing?.vocabulary?.[item.id]?.startTime || 0}
                    onChange={(e) => updateVocabularyTiming(item.id, 'startTime', parseInt(e.target.value) || 0)}
                    className="w-full bg-amber-800/30 border border-amber-600/50 rounded px-1 py-1 text-white text-xs"
                    placeholder="Start"
                    title="Start Time (ms)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={slide.timing?.vocabulary?.[item.id]?.duration || 2000}
                    onChange={(e) => updateVocabularyTiming(item.id, 'duration', parseInt(e.target.value) || 2000)}
                    className="w-full bg-amber-800/30 border border-amber-600/50 rounded px-1 py-1 text-white text-xs"
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
          className="w-5 h-5 bg-amber-600/80 hover:bg-amber-500 rounded flex items-center justify-center transition-colors"
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
        {renderIcon('grip-vertical', { size: 10, className: 'text-amber-400' })}
      </div>
    </motion.div>
  );
};