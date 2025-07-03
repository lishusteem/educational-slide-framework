import React, { useEffect } from 'react';
import { SlideListBar } from './SlideListBar';
import { CanvasArea } from './CanvasArea';
import { LayoutControlPanel } from '../../framework/components/layoutControl';
import { SidebarEditorPanel } from '../../framework/components/editor';
import { PresentationProvider } from '../contexts/PresentationContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { defaultPresentation } from '../configs/defaultPresentation';
import { usePresentation } from '../hooks/usePresentation';

export const PresentationView: React.FC = () => {
  return (
    <PresentationProvider>
      <NavigationProvider>
        <InitializePresentation />
        <div className="min-h-screen bg-slate-950 flex flex-col">
          {/* Top bar with slide management */}
          <SlideListBar />
          
          {/* Main content area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left control panel */}
            <div className="w-80 border-r border-white/10 bg-slate-900/50">
              <LayoutControlPanel />
            </div>
            
            {/* Canvas area (exportable) */}
            <div className="flex-1 p-8 flex items-center justify-center">
              <CanvasArea />
            </div>
            
            {/* Right control panel */}
            <div className="w-80 border-l border-white/10 bg-slate-900/50">
              <SidebarEditorPanel />
            </div>
          </div>
        </div>
      </NavigationProvider>
    </PresentationProvider>
  );
};

// Helper component to load presentation once
const InitializePresentation: React.FC = () => {
  const { presentation, loadPresentation } = usePresentation();
  useEffect(() => {
    if (!presentation) {
      loadPresentation(defaultPresentation);
    }
  }, [presentation, loadPresentation]);
  return null;
}; 