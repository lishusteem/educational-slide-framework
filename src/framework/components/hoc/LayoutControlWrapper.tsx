/**
 * Layout Control Wrapper (HOC)
 * Wraps EducationalTemplate to add layout control system without modifying existing code
 * Creates the 3-panel layout: [Layout Control (480px)] [Canvas (flex-1)] [Sidebar (320px)]
 */

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutControlProvider } from '../../contexts/LayoutControlContext';
import { LayoutControlPanel } from '../layoutControl';
import { EducationalTemplate } from '../templates/EducationalTemplate';
import type { TemplateProps } from '../../types/template.types';

export const LayoutControlWrapper: React.FC<TemplateProps> = ({
  config,
  ...templateProps
}) => {
  return (
    <LayoutControlProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-[2000px] mx-auto h-[calc(100vh-2rem)] flex gap-4"
        >
          {/* Layout Control Panel - Left Side */}
          <div className="flex-shrink-0">
            <LayoutControlPanel className="h-full" />
          </div>

          {/* Canvas Area + Sidebar - Right Side */}
          <div className="flex-1 min-w-0 h-full">
            <EducationalTemplate 
              config={config}
              {...templateProps}
            />
          </div>
        </motion.div>
      </div>
    </LayoutControlProvider>
  );
};

// HOC Factory function for wrapping existing templates
export function withLayoutControl<T extends TemplateProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  
  const WithLayoutControlComponent = (props: T) => {
    return (
      <LayoutControlProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-[2000px] mx-auto h-[calc(100vh-2rem)] flex gap-4"
          >
            {/* Layout Control Panel - Left Side */}
            <div className="flex-shrink-0">
              <LayoutControlPanel className="h-full" />
            </div>

            {/* Canvas Area + Sidebar - Right Side */}
            <div className="flex-1 min-w-0 h-full">
              <WrappedComponent {...props} />
            </div>
          </motion.div>
        </div>
      </LayoutControlProvider>
    );
  };

  WithLayoutControlComponent.displayName = `withLayoutControl(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithLayoutControlComponent;
}

// Enhanced Educational Template with Layout Control
export { LayoutControlWrapper as EnhancedEducationalTemplate }; 