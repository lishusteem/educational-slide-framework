/**
 * Icon Selector Component
 * Searchable dropdown for selecting icons from Lucide React library
 * Used in the control panel for editing sidebar element icons
 * Uses React Portal to render dropdown outside normal hierarchy
 */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { renderIcon, getAvailableIcons, type IconName } from '../../utils/iconRegistry';

interface IconSelectorProps {
  currentIcon: string;
  onIconChange: (icon: string) => void;
  size?: 'sm' | 'md';
}

interface DropdownPosition {
  x: number;
  y: number;
  width: number;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  currentIcon,
  onIconChange,
  size = 'sm'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const buttonSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const iconSize = size === 'sm' ? 10 : 12;

  // Get all available icons
  const availableIcons = getAvailableIcons();
  
  // Filter icons based on search term
  const filteredIcons = availableIcons.filter(icon =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dropdown position based on button position
  const calculateDropdownPosition = (): DropdownPosition | null => {
    if (!buttonRef.current) return null;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 256; // w-64 = 16rem = 256px
    const dropdownHeight = 300; // Approximate max height
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let x = buttonRect.left;
    let y = buttonRect.bottom + 4; // mt-1 = 4px
    
    // Adjust if dropdown would go off right edge
    if (x + dropdownWidth > viewportWidth) {
      x = buttonRect.right - dropdownWidth;
    }
    
    // Adjust if dropdown would go off bottom edge
    if (y + dropdownHeight > viewportHeight) {
      y = buttonRect.top - dropdownHeight - 4;
    }
    
    // Ensure minimum distance from edges
    x = Math.max(8, Math.min(x, viewportWidth - dropdownWidth - 8));
    y = Math.max(8, Math.min(y, viewportHeight - dropdownHeight - 8));
    
    return {
      x,
      y,
      width: dropdownWidth
    };
  };

  // Handle opening dropdown
  const handleToggleDropdown = () => {
    if (!isOpen) {
      const position = calculateDropdownPosition();
      if (position) {
        setDropdownPosition(position);
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Update position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        const newPosition = calculateDropdownPosition();
        if (newPosition) {
          setDropdownPosition(newPosition);
        }
      }
    };

    if (isOpen) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const handleIconSelect = (icon: IconName) => {
    onIconChange(icon);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Portal dropdown component
  const DropdownPortal = () => {
    if (!isOpen || !dropdownPosition) return null;

    return createPortal(
      <AnimatePresence>
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="fixed bg-slate-800/95 backdrop-blur-xl rounded-lg border border-slate-700/50 shadow-2xl z-[9999]"
          style={{
            left: dropdownPosition.x,
            top: dropdownPosition.y,
            width: dropdownPosition.width,
          }}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-slate-700/50">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              autoFocus
            />
          </div>

          {/* Icons Grid */}
          <div className="p-2 max-h-48 overflow-y-auto">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-8 gap-1">
                {filteredIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => handleIconSelect(icon)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-all hover:bg-slate-700/50 ${
                      currentIcon === icon 
                        ? 'bg-indigo-600/50 border border-indigo-500' 
                        : 'hover:bg-slate-600/50'
                    }`}
                    title={icon}
                  >
                    {renderIcon(icon, { size: 14, className: 'text-slate-300' })}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400 text-sm">
                No icons found for "{searchTerm}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-700/50 text-xs text-slate-400 text-center">
            {filteredIcons.length} of {availableIcons.length} icons
          </div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      {/* Icon Button */}
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        className={`${buttonSize} bg-slate-700/50 hover:bg-slate-600/50 rounded flex items-center justify-center transition-colors border border-slate-600/50 hover:border-slate-500/50`}
        title="Select Icon"
      >
        {renderIcon(currentIcon, { size: iconSize, className: 'text-slate-300' })}
      </button>

      {/* Portal Dropdown */}
      <DropdownPortal />
    </>
  );
}; 