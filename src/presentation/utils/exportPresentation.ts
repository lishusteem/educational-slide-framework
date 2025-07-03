import type { PresentationConfig, ExportOptions, ExportBundle } from '../types';

export async function exportPresentation(
  presentation: PresentationConfig,
  options: ExportOptions
): Promise<ExportBundle> {
  const files: ExportFile[] = [];
  
  // Generate HTML
  const html = generateHTML(presentation, options);
  files.push({
    path: 'index.html',
    content: html,
    type: 'html',
  });

  // Generate CSS (extract from Tailwind)
  const css = await generateCSS(presentation, options);
  files.push({
    path: 'styles.css',
    content: css,
    type: 'css',
  });

  // Generate JavaScript runtime
  const js = generateJavaScript(presentation, options);
  files.push({
    path: 'app.js',
    content: js,
    type: 'js',
  });

  // Copy audio files
  for (const slide of presentation.slides) {
    if (slide.audio.src) {
      const audioData = await fetchAudioFile(slide.audio.src);
      files.push({
        path: `audio/slide-${slide.id}.mp3`,
        content: audioData,
        type: 'audio',
      });
    }
  }

  // Create manifest
  const manifest = {
    version: '1.0.0',
    created: new Date().toISOString(),
    presentation: presentation.title,
    totalSlides: presentation.slides.length,
    duration: calculateTotalDuration(presentation),
    files: files.map(f => f.path),
  };

  return {
    files,
    manifest,
    size: calculateBundleSize(files),
  };
}

function generateHTML(presentation: PresentationConfig, options: ExportOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${presentation.title}</title>
    <link rel="stylesheet" href="styles.css">
    <style>
      /* Critical inline styles for immediate render */
      body { margin: 0; padding: 0; background: #0f172a; }
      #root { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
      .canvas-container { width: 100%; max-width: 1920px; aspect-ratio: 16/9; }
    </style>
</head>
<body>
    <div id="root">
        <div class="canvas-container" data-export-root="true">
            <!-- Navigation Controls -->
            <div class="navigation-controls"></div>
            
            <!-- Slide Container -->
            <div class="slide-container"></div>
            
            <!-- Progress Bar -->
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
    </div>
    
    <!-- Presentation Data -->
    <script type="application/json" id="presentation-data">
        ${JSON.stringify(presentation, null, options.minify ? 0 : 2)}
    </script>
    
    <!-- Runtime -->
    <script src="app.js"></script>
</body>
</html>`;
}

function generateJavaScript(presentation: PresentationConfig, options: ExportOptions): string {
  return `
// Educational Slide Framework - Standalone Runtime
(function() {
  'use strict';
  
  // State
  let currentSlideIndex = 0;
  let isPlaying = false;
  let currentAudio = null;
  let animationFrame = null;
  let startTime = 0;
  let pausedTime = 0;
  
  // Get presentation data
  const presentationData = JSON.parse(
    document.getElementById('presentation-data').textContent
  );
  
  // Initialize
  function init() {
    setupNavigationControls();
    loadSlide(0);
    setupKeyboardControls();
    restoreProgress();
  }
  
  // Navigation controls
  function setupNavigationControls() {
    const navContainer = document.querySelector('.navigation-controls');
    navContainer.innerHTML = `
      <div class="nav-controls">
        <button id="prev-btn" aria-label="Previous slide">
          <svg><!-- Skip back icon --></svg>
        </button>
        <button id="play-pause-btn" aria-label="Play">
          <svg><!-- Play icon --></svg>
        </button>
        <button id="next-btn" aria-label="Next slide">
          <svg><!-- Skip forward icon --></svg>
        </button>
        <span class="slide-counter">1 / ${presentationData.slides.length}</span>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('prev-btn').addEventListener('click', previousSlide);
    document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
    document.getElementById('next-btn').addEventListener('click', nextSlide);
  }
  
  // Slide management
  function loadSlide(index) {
    currentSlideIndex = index;
    const slide = presentationData.slides[index];
    
    // Update UI
    renderSlide(slide);
    updateSlideCounter();
    
    // Load audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    
    if (slide.audio.src) {
      currentAudio = new Audio(`audio/slide-${slide.id}.mp3`);
      currentAudio.addEventListener('ended', handleAudioEnded);
    }
    
    // Save progress
    saveProgress();
  }
  
  // Animation system
  function startAnimations(slide) {
    startTime = performance.now() - pausedTime;
    
    function animate() {
      const elapsed = performance.now() - startTime;
      
      // Update layout based on timing
      updateLayout(slide, elapsed);
      
      // Update sidebar highlights
      updateHighlights(slide, elapsed);
      
      // Update progress bar
      updateProgressBar(elapsed, slide.audio.duration);
      
      if (isPlaying) {
        animationFrame = requestAnimationFrame(animate);
      }
    }
    
    animate();
  }
  
  // Layout updates
  function updateLayout(slide, elapsed) {
    const activeLayout = slide.layouts.find(layout => 
      elapsed >= layout.startTime && 
      elapsed < layout.startTime + layout.duration
    );
    
    if (activeLayout) {
      // Apply layout changes
      document.querySelector('.main-content').setAttribute('data-layout', activeLayout.layoutType);
    }
  }
  
  // Play/Pause
  function togglePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }
  
  function play() {
    isPlaying = true;
    if (currentAudio) currentAudio.play();
    startAnimations(presentationData.slides[currentSlideIndex]);
    updatePlayButton();
  }
  
  function pause() {
    isPlaying = false;
    if (currentAudio) currentAudio.pause();
    pausedTime = performance.now() - startTime;
    cancelAnimationFrame(animationFrame);
    updatePlayButton();
  }
  
  // Navigation
  function nextSlide() {
    if (currentSlideIndex < presentationData.slides.length - 1) {
      loadSlide(currentSlideIndex + 1);
      if (isPlaying) play();
    }
  }
  
  function previousSlide() {
    if (currentSlideIndex > 0) {
      loadSlide(currentSlideIndex - 1);
      if (isPlaying) play();
    }
  }
  
  // Keyboard controls
  function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case 'ArrowLeft':
          previousSlide();
          break;
      }
    });
  }
  
  // Progress persistence
  function saveProgress() {
    localStorage.setItem('presentation-progress', JSON.stringify({
      slideIndex: currentSlideIndex,
      timestamp: Date.now()
    }));
  }
  
  function restoreProgress() {
    const saved = localStorage.getItem('presentation-progress');
    if (saved) {
      const progress = JSON.parse(saved);
      loadSlide(progress.slideIndex);
    }
  }
  
  // Initialize on load
  document.addEventListener('DOMContentLoaded', init);
})();
`;
}

// Helper to generate CSS
async function generateCSS(presentation: PresentationConfig, options: ExportOptions): Promise<string> {
  // This would extract all used Tailwind classes and generate minimal CSS
  // For now, return a placeholder
  return `
/* Educational Slide Framework - Exported Styles */

/* Reset and base styles */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* Glassmorphism effects */
.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

/* Layout styles */
.slide-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

/* Add all necessary styles... */
`;
}

function calculateTotalDuration(presentation: PresentationConfig): number {
  return presentation.slides.reduce((total, slide) => total + (slide.timing?.duration || 0), 0);
}

function calculateBundleSize(files: ExportFile[]): number {
  return files.reduce((total, file) => total + (typeof file.content === 'string' ? file.content.length : file.content.byteLength), 0);
}

async function fetchAudioFile(src: string): Promise<Uint8Array> {
  const response = await fetch(src);
  return new Uint8Array(await response.arrayBuffer());
}

</rewritten_file> 