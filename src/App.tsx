/**
 * Main App Component
 * Educational Slide Framework - Single Slide Demo with Multiple Layouts and Audio
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnhancedEducationalTemplate } from './framework/components/hoc';
import { blockchainIntroSlide } from './slides/configs/blockchain-intro.config';
import { blockchainIntroWithTimingConfig } from './slides/configs/blockchain-intro-with-timing.config';
import { renderIcon } from './framework/utils/iconRegistry';

function App() {
  const [useTiming, setUseTiming] = useState(false);

  return (
    <div className="relative">
      {/* Control Toggle */}
      <motion.div
        className="fixed top-4 left-4 z-50 bg-slate-900/90 backdrop-blur-xl rounded-lg border border-slate-700/50 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-4 space-y-3">
          <h3 className="text-white font-semibold text-sm">Configuration</h3>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useTiming}
                onChange={(e) => setUseTiming(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                useTiming 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-slate-400 hover:border-slate-300'
              }`}>
                {useTiming && renderIcon('check', { size: 12, className: 'text-white' })}
              </div>
              <span className="ml-2 text-sm text-slate-300">Use Timing Config</span>
            </label>
          </div>
          
          <div className="text-xs text-slate-400">
            {useTiming ? 'Using timing configuration' : 'Using standard configuration'}
          </div>
        </div>
      </motion.div>

      {/* Main Slide Content */}
      <EnhancedEducationalTemplate 
        config={useTiming ? blockchainIntroWithTimingConfig : blockchainIntroSlide} 
      />
    </div>
  );
}

export default App;
