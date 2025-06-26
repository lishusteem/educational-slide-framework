/**
 * Main App Component
 * Educational Slide Framework - Single Slide Demo with Multiple Layouts and Audio
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EducationalTemplate } from './framework/components/templates/EducationalTemplate';
import { blockchainIntroSlide } from './slides/configs/blockchain-intro.config';
import { blockchainIntroWithTimingConfig } from './slides/configs/blockchain-intro-with-timing.config';
import { renderIcon } from './framework/utils/iconRegistry';

function App() {
  const [useTiming, setUseTiming] = useState(true); // Default to layout cycling mode

  const toggleTiming = () => {
    setUseTiming(prev => !prev);
  };

  return (
    <div className="min-h-screen relative">
      {/* Layout Toggle Button - Positioned to not interfere with Audio Controls */}
      <div className="fixed top-6 right-6 z-50">
        <motion.button
          onClick={toggleTiming}
          className={`backdrop-blur-lg rounded-lg px-4 py-2 text-white border shadow-lg transition-all duration-200 flex items-center gap-2 ${
            useTiming 
              ? 'bg-purple-600/90 border-purple-500/50 hover:bg-purple-500/90' 
              : 'bg-slate-800/90 border-slate-700/50 hover:bg-slate-700/90'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {renderIcon('layout-grid', { 
            size: 16, 
            className: useTiming ? 'text-purple-200' : 'text-blue-400' 
          })}
          <span className="text-sm font-medium">
            {useTiming ? 'Multi-Layout + Audio' : 'Layout Static'}
          </span>
        </motion.button>
      </div>

      {/* Main Slide Content */}
      <EducationalTemplate 
        config={useTiming ? blockchainIntroWithTimingConfig : blockchainIntroSlide} 
        isSlideActive={true}
      />

      {/* Layout system instructions */}
      {useTiming && (
        <motion.div
          className="fixed bottom-6 right-6 bg-purple-800/90 backdrop-blur-lg rounded-lg px-4 py-3 text-white border border-purple-600/50 shadow-lg max-w-sm"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-xs text-purple-100">
            <div className="font-medium text-purple-300 mb-1 flex items-center gap-2">
              {renderIcon('layers', { size: 12 })}
              Sistem Multi-Layout + Audio Activ:
            </div>
            <div>• <span className="text-cyan-300">Definiție</span> - Blockchain fix (5s)</div>
            <div>• <span className="text-emerald-300">Grid Proprietăți</span> - Grid structurat (5s)</div>
            <div>• <span className="text-violet-300">Comparație</span> - Tradiționala vs Blockchain (5s)</div>
            <div className="mt-2 text-purple-200 text-xs">
              <span className="text-green-300">🎵 Audio:</span> Buton play stânga-sus, independent de layout-uri!
            </div>
          </div>
        </motion.div>
      )}
      </div>
  );
}

export default App;
