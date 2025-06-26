/**
 * Main App Component
 * Educational Slide Framework - Single Slide Demo
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EducationalTemplate } from './framework/components/templates/EducationalTemplate';
import { blockchainIntroSlide } from './slides/configs/blockchain-intro.config';
import { blockchainIntroWithTimingSlide } from './slides/configs/blockchain-intro-with-timing.config';
import { renderIcon } from './framework/utils/iconRegistry';

function App() {
  const [useTiming, setUseTiming] = useState(true); // Default to carousel mode

  const toggleTiming = () => {
    setUseTiming(prev => !prev);
  };

  return (
    <div className="min-h-screen relative">
      {/* Timing Toggle Button */}
      <div className="fixed top-6 left-6 z-50">
        <motion.button
          onClick={toggleTiming}
          className={`backdrop-blur-lg rounded-lg px-4 py-2 text-white border shadow-lg transition-all duration-200 flex items-center gap-2 ${
            useTiming 
              ? 'bg-amber-600/90 border-amber-500/50 hover:bg-amber-500/90' 
              : 'bg-slate-800/90 border-slate-700/50 hover:bg-slate-700/90'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {renderIcon('clock', { 
            size: 16, 
            className: useTiming ? 'text-amber-200' : 'text-blue-400' 
          })}
          <span className="text-sm font-medium">
            {useTiming ? 'Timing ACTIV' : 'Timing INACTIV'}
          </span>
        </motion.button>
      </div>

      {/* Main Slide Content */}
      <EducationalTemplate 
        config={useTiming ? blockchainIntroWithTimingSlide : blockchainIntroSlide} 
        isSlideActive={true}
      />

      {/* Timing instructions */}
      {useTiming && (
        <motion.div
          className="fixed bottom-6 left-6 bg-amber-800/90 backdrop-blur-lg rounded-lg px-4 py-3 text-white border border-amber-600/50 shadow-lg max-w-sm"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-xs text-amber-100">
            <div className="font-medium text-amber-300 mb-1 flex items-center gap-2">
              {renderIcon('play', { size: 12 })}
              Carusel Educativ Activ:
            </div>
            <div>• MainContent afișează conținut dinamic</div>
            <div>• Explicații detaliate pentru fiecare element</div>
            <div>• Sincronizat cu highlight-urile din sidebar</div>
            <div>• Tranziții automate cu animații elastice</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
