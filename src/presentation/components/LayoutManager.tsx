/**
 * Layout Manager Component
 * Left sidebar for managing presentation slides: add, delete, reorder, duplicate
 */

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { renderIcon } from '../../framework/utils/iconRegistry';
import type { PresentationConfig } from '../types/presentation.types';
import type { SlideConfig } from '../../framework/types/slide.types';

export interface LayoutManagerProps {
  presentation: PresentationConfig;
  currentSlideIndex: number;
  onPresentationUpdate: (presentation: PresentationConfig) => void;
  onSlideSelect: (index: number) => void;
  className?: string;
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({
  presentation,
  currentSlideIndex,
  onPresentationUpdate,
  onSlideSelect,
  className = ''
}) => {
  const [draggedSlide, setDraggedSlide] = useState<string | null>(null);

  // Template definitions
  const slideTemplates = {
    educational: {
      title: 'Educational Template',
      icon: 'book',
      content: {
        title: 'Educational Topic',
        subtitle: 'Learning objectives and key concepts',
        bridgeText: 'Explore the fundamental concepts...',
        floatingIcon: 'lightbulb',
        vocabulary: [
          { id: 'v1', term: 'Key Term', definition: 'Definition here...', icon: 'book' }
        ],
        concepts: [
          { id: 'c1', text: 'Important concept to understand', icon: 'lightbulb', emphasis: 'normal' as const }
        ]
      }
    },
    technical: {
      title: 'Technical Template',
      icon: 'cpu',
      content: {
        title: 'Technical Implementation',
        subtitle: 'Step-by-step technical guide',
        bridgeText: 'Understanding the technical aspects...',
        floatingIcon: 'cpu',
        vocabulary: [
          { id: 'v1', term: 'API', definition: 'Application Programming Interface', icon: 'cpu' }
        ],
        concepts: [
          { id: 'c1', text: 'Scalable architecture patterns', icon: 'cpu', emphasis: 'strong' as const }
        ]
      }
    },
    business: {
      title: 'Business Template',
      icon: 'trending-up',
      content: {
        title: 'Business Strategy',
        subtitle: 'Market analysis and growth opportunities',
        bridgeText: 'Analyzing market trends and opportunities...',
        floatingIcon: 'trending-up',
        vocabulary: [
          { id: 'v1', term: 'ROI', definition: 'Return on Investment', icon: 'trending-up' }
        ],
        concepts: [
          { id: 'c1', text: 'Customer-centric approach', icon: 'trending-up', emphasis: 'strong' as const }
        ]
      }
    }
  };

  // Add new slide from template
  const addSlideFromTemplate = (templateKey: keyof typeof slideTemplates) => {
    const template = slideTemplates[templateKey];
    const newSlide: SlideConfig = {
      id: `slide-${Date.now()}`,
      template: 'educational',
      theme: 'dark-blue',
      content: { ...template.content }
    };

    const newPresentation = {
      ...presentation,
      slides: [...presentation.slides, newSlide]
    };

    onPresentationUpdate(newPresentation);
    onSlideSelect(presentation.slides.length);
  };

  // Duplicate slide
  const duplicateSlide = (index: number) => {
    const slideToClone = presentation.slides[index];
    const duplicatedSlide: SlideConfig = {
      ...slideToClone,
      id: `slide-${Date.now()}`,
      content: {
        ...slideToClone.content,
        title: `${slideToClone.content.title} (Copy)`,
        vocabulary: slideToClone.content.vocabulary?.map(item => ({
          ...item,
          id: `vocab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })) || [],
        concepts: slideToClone.content.concepts?.map(item => ({
          ...item,
          id: `concept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })) || []
      }
    };

    const newSlides = [...presentation.slides];
    newSlides.splice(index + 1, 0, duplicatedSlide);

    const newPresentation = {
      ...presentation,
      slides: newSlides
    };

    onPresentationUpdate(newPresentation);
    onSlideSelect(index + 1);
  };

  // Delete slide
  const deleteSlide = (index: number) => {
    if (presentation.slides.length <= 1) {
      alert('Cannot delete the last slide');
      return;
    }

    const newSlides = presentation.slides.filter((_, i) => i !== index);
    const newPresentation = {
      ...presentation,
      slides: newSlides
    };

    onPresentationUpdate(newPresentation);
    
    // Adjust current selection
    if (currentSlideIndex >= index && currentSlideIndex > 0) {
      onSlideSelect(currentSlideIndex - 1);
    } else if (currentSlideIndex >= newSlides.length) {
      onSlideSelect(newSlides.length - 1);
    }
  };

  // Reorder slides
  const reorderSlides = (newOrder: SlideConfig[]) => {
    const newPresentation = {
      ...presentation,
      slides: newOrder
    };

    onPresentationUpdate(newPresentation);
    
    // Find new index of current slide
    const currentSlideId = presentation.slides[currentSlideIndex]?.id;
    const newIndex = newOrder.findIndex(slide => slide.id === currentSlideId);
    if (newIndex !== -1) {
      onSlideSelect(newIndex);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      className={`w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          {renderIcon('layers', { size: 18, className: 'text-blue-400' })}
          Layout Manager
        </h3>
        <p className="text-slate-300 text-sm mt-1">
          Manage slides and layouts
        </p>
      </div>

      {/* Template Selection */}
      <div className="p-4 border-b border-slate-700/30">
        <h4 className="text-slate-300 text-sm font-medium mb-3">Adaugă Slide din Template:</h4>
        <div className="space-y-2">
          {Object.entries(slideTemplates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => addSlideFromTemplate(key as keyof typeof slideTemplates)}
              className="w-full bg-slate-700/50 hover:bg-slate-600/60 text-white py-2 px-3 rounded-lg text-sm transition-all flex items-center gap-2 shadow-md"
            >
              {renderIcon(template.icon, { size: 14, className: 'text-blue-400' })}
              {template.title}
            </button>
          ))}
        </div>
      </div>

      {/* Slides List */}
      <div className="flex-1 overflow-y-auto p-2">
        <Reorder.Group 
          axis="y" 
          values={presentation.slides} 
          onReorder={reorderSlides}
          className="space-y-2"
        >
          <AnimatePresence>
            {presentation.slides.map((slide, index) => (
              <Reorder.Item
                key={slide.id}
                value={slide}
                onDragStart={() => setDraggedSlide(slide.id)}
                onDragEnd={() => setDraggedSlide(null)}
                className="cursor-move"
              >
                                <motion.div
                  layout
                  className={`
                    p-3 rounded-lg border transition-all relative group
                    ${currentSlideIndex === index
                      ? 'bg-blue-600/20 border-blue-500/50 shadow-lg'
                      : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50'
                    }
                    ${draggedSlide === slide.id ? 'rotate-2 scale-105 shadow-xl' : ''}
                  `}
                  onClick={() => onSlideSelect(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Slide Number & Title */}
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${currentSlideIndex === index 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-600 text-slate-300'
                      }
                    `}>
                      {index + 1}
                    </div>
                    
                    <SlideEditableContent
                      slide={slide}
                      isSelected={currentSlideIndex === index}
                      onUpdate={(updatedSlide) => {
                        const newPresentation = {
                          ...presentation,
                          slides: presentation.slides.map((s, i) => i === index ? updatedSlide : s)
                        };
                        onPresentationUpdate(newPresentation);
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSlide(index);
                      }}
                      className="w-6 h-6 bg-amber-600/80 hover:bg-amber-500 rounded flex items-center justify-center transition-colors"
                      title="Duplicate Slide"
                    >
                      {renderIcon('copy', { size: 10, className: 'text-white' })}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(index);
                      }}
                      className="w-6 h-6 bg-red-600/80 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
                      title="Delete Slide"
                    >
                      {renderIcon('trash-2', { size: 10, className: 'text-white' })}
                    </button>
                  </div>

                  {/* Drag Handle */}
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {renderIcon('grip-vertical', { size: 12, className: 'text-slate-400' })}
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Total Slides:</span>
            <span className="text-white font-medium">{presentation.slides.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Current:</span>
            <span className="text-blue-400 font-medium">{currentSlideIndex + 1}</span>
          </div>
                     <div className="flex justify-between">
             <span>Theme:</span>
             <span className="text-white font-medium">{typeof presentation.theme === 'string' ? presentation.theme : 'custom'}</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// Slide Editable Content Component
const SlideEditableContent: React.FC<{
  slide: SlideConfig;
  isSelected: boolean;
  onUpdate: (slide: SlideConfig) => void;
}> = ({ slide, isSelected, onUpdate }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [isEditingIcon, setIsEditingIcon] = useState(false);
  const [tempTitle, setTempTitle] = useState(slide.content.title);
  const [tempSubtitle, setTempSubtitle] = useState(slide.content.subtitle || '');
  const [tempIcon, setTempIcon] = useState(slide.content.floatingIcon || 'lightbulb');

  const iconOptions = ['lightbulb', 'book', 'cpu', 'trending-up', 'zap', 'star', 'target', 'globe', 'lock', 'shield'];

  const handleSaveTitle = () => {
    onUpdate({
      ...slide,
      content: { ...slide.content, title: tempTitle }
    });
    setIsEditingTitle(false);
  };

  const handleSaveSubtitle = () => {
    onUpdate({
      ...slide,
      content: { ...slide.content, subtitle: tempSubtitle }
    });
    setIsEditingSubtitle(false);
  };

  const handleSaveIcon = (icon: string) => {
    onUpdate({
      ...slide,
      content: { ...slide.content, floatingIcon: icon }
    });
    setTempIcon(icon);
    setIsEditingIcon(false);
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Title */}
      {isEditingTitle ? (
        <div className="flex gap-1">
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-xs text-white"
            onBlur={handleSaveTitle}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
            autoFocus
          />
        </div>
      ) : (
        <h4 
          className={`font-medium text-sm truncate cursor-pointer hover:bg-white/5 rounded px-1 ${
            isSelected ? 'text-white' : 'text-slate-300'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditingTitle(true);
          }}
        >
          {slide.content.title}
        </h4>
      )}

      {/* Subtitle */}
      {isEditingSubtitle ? (
        <div className="flex gap-1 mt-1">
          <input
            type="text"
            value={tempSubtitle}
            onChange={(e) => setTempSubtitle(e.target.value)}
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-xs text-white"
            onBlur={handleSaveSubtitle}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveSubtitle()}
            autoFocus
          />
        </div>
      ) : (
        <p 
          className="text-xs text-slate-400 mt-1 truncate cursor-pointer hover:bg-white/5 rounded px-1"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditingSubtitle(true);
          }}
        >
          {slide.content.subtitle || 'Click pentru a adăuga subtitle'}
        </p>
      )}

      {/* Icon & Stats */}
      <div className="flex items-center gap-3 mt-2 text-xs">
        {/* Floating Icon Selector */}
        <div className="relative">
          {isEditingIcon ? (
            <div className="absolute top-0 left-0 z-50 bg-slate-800 border border-slate-600 rounded-lg p-2 grid grid-cols-5 gap-1">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveIcon(icon);
                  }}
                  className="w-6 h-6 hover:bg-blue-600/50 rounded flex items-center justify-center"
                >
                  {renderIcon(icon, { size: 12, className: 'text-white' })}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingIcon(true);
              }}
              className="hover:bg-white/10 rounded p-1"
              title="Schimbă iconița"
            >
              {renderIcon(tempIcon, { size: 12, className: 'text-blue-400' })}
            </button>
          )}
        </div>

        <span className={`px-2 py-1 rounded text-xs ${
          isSelected 
            ? 'bg-blue-500/30 text-blue-200' 
            : 'bg-slate-700/50 text-slate-400'
        }`}>
          {typeof slide.theme === 'string' ? slide.theme : 'custom'}
        </span>
        
        {slide.content.vocabulary && slide.content.vocabulary.length > 0 && (
          <span className="text-amber-400">
            {renderIcon('book', { size: 10 })} {slide.content.vocabulary.length}
          </span>
        )}
        
        {slide.content.concepts && slide.content.concepts.length > 0 && (
          <span className="text-green-400">
            {renderIcon('lightbulb', { size: 10 })} {slide.content.concepts.length}
          </span>
        )}
        
        {slide.audio && (
          <span className="text-purple-400">
            {renderIcon('volume-2', { size: 10 })}
          </span>
        )}
      </div>
    </div>
  );
};