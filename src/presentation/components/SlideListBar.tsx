import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { Plus, Trash2, Copy, Download, GripVertical } from 'lucide-react';
import { usePresentation } from '../hooks/usePresentation';
import { createDefaultSlide } from '../utils/slideTemplates';

export const SlideListBar: React.FC = () => {
  const {
    presentation,
    currentSlideIndex,
    addSlide,
    deleteSlide,
    duplicateSlide,
    reorderSlides,
    exportPresentation,
  } = usePresentation();

  if (!presentation) return null;

  const handleAddSlide = () => {
    const newSlide = createDefaultSlide(presentation.slides.length);
    addSlide(newSlide);
  };

  const handleReorder = (newOrder: typeof presentation.slides) => {
    const oldOrder = presentation.slides;
    let fromIndex = -1;
    let toIndex = -1;

    for (let i = 0; i < newOrder.length; i++) {
      if (newOrder[i].id !== oldOrder[i].id) {
        const movedSlide = newOrder[i];
        fromIndex = oldOrder.findIndex(s => s.id === movedSlide.id);
        toIndex = i;
        break;
      }
    }

    if (fromIndex !== -1 && toIndex !== -1) {
      reorderSlides(fromIndex, toIndex);
    }
  };

  return (
    <motion.div
      className="w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 p-4">
        <h1 className="text-xl font-semibold text-white">
          {presentation.title}
        </h1>

        <div className="flex-1 overflow-x-auto">
          <Reorder.Group
            axis="x"
            values={presentation.slides}
            onReorder={handleReorder}
            className="flex gap-3 p-1"
          >
            {presentation.slides.map((slide, index) => (
              <Reorder.Item
                key={slide.id}
                value={slide}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1 }}
              >
                <motion.div
                  className={`
                    relative w-32 h-20 rounded-lg overflow-hidden cursor-pointer
                    border-2 transition-all duration-200
                    ${index === currentSlideIndex 
                      ? 'border-blue-400 shadow-lg shadow-blue-400/30' 
                      : 'border-white/20 hover:border-white/40'
                    }
                  `}
                  layoutId={`slide-thumb-${slide.id}`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 p-2">
                    <div className="text-xs text-white/80 truncate">
                      {slide.content.title}
                    </div>
                    <div className="text-[10px] text-white/60 mt-1">
                      Slide {index + 1}
                    </div>
                  </div>

                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={14} className="text-white/60" />
                  </div>

                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSlide(slide.id);
                      }}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Duplicate slide"
                    >
                      <Copy size={12} className="text-white" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(slide.id);
                      }}
                      className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
                      aria-label="Delete slide"
                      disabled={presentation.slides.length === 1}
                    >
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={handleAddSlide}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-blue-500/20 hover:bg-blue-500/30
              border border-blue-400/50 text-blue-300
              transition-all duration-200
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            Add Slide
          </motion.button>

          <motion.button
            onClick={() => exportPresentation()}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-green-500/20 hover:bg-green-500/30
              border border-green-400/50 text-green-300
              transition-all duration-200
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={18} />
            Export
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}; 