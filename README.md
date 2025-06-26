# Educational Slide Framework

A powerful, modern educational presentation framework built with **Vite + React + TypeScript**. Perfect for creating interactive, animated educational content with blockchain and technology themes.

## 🌟 Features

### **Core Framework**
- **4-column responsive grid layout** with glassmorphism effects
- **Multi-slide navigation** with progress tracking
- **Hot reload development** environment
- **TypeScript** throughout for type safety

### **Animation System**
- **5 animation presets**: smooth-3d, floating, minimal, energetic, professional
- **Elastic stretch animations** for dynamic content transitions
- **Time-based animations** with precise timing control
- **Synchronized highlights** between sections

### **Content Management**
- **Dynamic carousel system** for MainContent progression
- **Vocabulary and Concepts sections** with hover effects
- **Properties and Functions zones** for detailed explanations
- **Icon registry** with 30+ Lucide React icons

### **Themes**
- `dark-blue` - Professional blockchain theme
- `purple-cosmic` - Cosmic technology theme  
- `green-nature` - Natural, organic theme
- `orange-energy` - High-energy, dynamic theme
- `minimal-light` - Clean, minimal theme

### **Educational Features**
- **Vocabulary explanations** with term highlighting
- **Concept breakdowns** with emphasis levels
- **Progressive content revelation** through carousel
- **Timing synchronization** between sections

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd educational-slide-framework

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development
```bash
# Start dev server (usually localhost:5173-5175)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── framework/              # Core framework (immutable)
│   ├── components/
│   │   ├── sections/       # VocabularySection, ConceptsSection, MainContent
│   │   └── templates/      # EducationalTemplate
│   ├── types/              # TypeScript definitions
│   └── utils/              # Theme system, animations, carousel
├── slides/
│   └── configs/            # Slide configurations
├── components/             # App-specific components
└── App.tsx                # Main application
```

## 🎨 Creating Content

### Basic Slide Configuration
```typescript
import { SlideConfig } from '../framework/types';

export const mySlide: SlideConfig = {
  id: "my-slide",
  template: "educational",
  theme: "dark-blue",
  animation: "smooth-3d",
  
  content: {
    title: "My Topic",
    subtitle: "Introduction",
    bridgeText: "Exploring the fundamentals...",
    
    vocabulary: [
      {
        id: "term1",
        term: "Important Term",
        definition: "Clear explanation of the term",
        icon: "hash"
      }
    ],
    
    concepts: [
      {
        id: "concept1", 
        title: "Key Concept",
        description: "Detailed concept explanation",
        emphasis: "high",
        icon: "shield"
      }
    ]
  }
};
```

### With Timing Animation
```typescript
export const timedSlide: SlideConfig = {
  // ... basic config
  timing: {
    title: { startTime: 500, duration: 2000 },
    vocabulary: {
      'term1': { startTime: 3000, duration: 2000 }
    },
    concepts: {
      'concept1': { startTime: 6000, duration: 2000 }
    }
  }
};
```

## 🔧 Customization

### Adding New Themes
```typescript
// In themeSystem.ts
export const myCustomTheme: ThemeConfig = {
  name: 'my-theme',
  colors: {
    primary: '#your-color',
    secondary: '#your-color',
    // ... more colors
  },
  effects: {
    glow: 'your-glow-settings',
    // ... more effects
  }
};
```

### Custom Animation Presets
```typescript
// In animationPresets.ts
export const myAnimation: AnimationPreset = {
  name: 'my-animation',
  variants: {
    // Framer Motion variants
  },
  transition: {
    // Transition settings
  }
};
```

## 🎯 Use Cases

- **Educational presentations** for blockchain/crypto topics
- **Technology training** materials
- **Interactive learning** experiences  
- **Conference presentations** with dynamic content
- **Online courses** with timed content delivery

## 🛠️ Built With

- **Vite** - Fast build tool and dev server
- **React 18** - UI library with latest features
- **TypeScript** - Type safety and better DX
- **Framer Motion** - Advanced animations
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library

## 📊 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| ✅ Multi-slide Navigation | Complete | Navigate between slides with progress tracking |
| ✅ Dynamic Carousel | Complete | Auto-advancing content in MainContent |
| ✅ Time-based Animations | Complete | Precise timing control for highlights |
| ✅ Theme System | Complete | 5 built-in themes with easy customization |
| ✅ Responsive Layout | Complete | 4-column grid that adapts to screen size |
| ✅ Icon Registry | Complete | 30+ icons with fallback system |
| ✅ TypeScript Support | Complete | Full type safety throughout |

## 🎪 Demo Content

The framework includes sample blockchain educational content:
- **Blockchain Introduction** - Core concepts and terminology
- **Cryptographic Basics** - Security fundamentals
- **Advanced timing examples** - Synchronized animations

## 💻 Development

### Hot Reload
The development server supports hot module replacement for instant updates during development.

### TypeScript
Full TypeScript support with comprehensive type definitions for all framework components.

### Performance
Optimized animations and efficient re-rendering for smooth educational experiences.

## 📄 License

MIT License - feel free to use for educational and commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built for educators, by developers** 🎓✨
