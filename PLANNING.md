# 📋 Educational Slide Framework - PLANNING

*Last Updated: December 26, 2024*

## 🎯 Project Overview

Educational Slide Framework este un framework modern React/TypeScript pentru crearea prezentărilor educaționale prin configurare în cod. Este construit pentru dezvoltatori care vor control maxim cu complexitate minimă.

## 🏗️ Architecture Decisions

### **File Structure Standards**
- **500-line maximum per file** - Pentru mentenabilitate și claritate
- **Modular architecture** - Separare clară între framework, slides, și app
- **TypeScript strict mode** - Pentru siguranță și developer experience

### **Framework Layers**

```
src/
├── framework/           # Core framework (DON'T MODIFY)
│   ├── components/      # Reusable slide components
│   │   ├── templates/   # Slide templates (Educational, Title, etc.)
│   │   ├── sections/    # Content sections (Vocabulary, Concepts)
│   │   └── ui/          # Base UI components
│   ├── hooks/           # Framework hooks
│   ├── utils/           # Animation, theme, validation utilities
│   └── types/           # TypeScript definitions
├── slides/              # Your content (MODIFY THESE!)
│   ├── configs/         # Individual slide configurations
│   ├── presentations/   # Presentation collections
│   └── assets/          # Images, icons, videos
└── app/                 # Application layer
    ├── components/      # App-specific components
    ├── pages/           # Route pages
    └── router/          # Routing setup
```

## 🎨 Design Principles

### **Visual Consistency**
- **4-column grid layout** pentru template-ul educational
- **Glassmorphism effects** cu backdrop blur și transparență
- **3D animations** cu Framer Motion
- **Dark theme primary** cu accente amber/orange

### **Animation System**
- **5 preset-uri de animație**: smooth-3d, floating, minimal, energetic, professional
- **Accessibility first** - suport pentru `prefers-reduced-motion`
- **Performance optimized** - animații 60fps

### **Theme System**
- **5 teme built-in**: dark-blue, purple-cosmic, green-nature, orange-energy, minimal-light
- **Theme variants** pentru customizare ușoară
- **CSS custom properties** pentru consistency

## 🧩 Component Architecture

### **EducationalTemplate**
- Main template combinând toate secțiunile
- 4-column grid (3 cols main + 1 col sidebar)
- Responsive și accessible

### **Content Sections**
- **VocabularySection**: 1-4 termeni cu definiții și icoane
- **ConceptsSection**: 1-4 concepte cheie cu emphasis
- **MainContent**: titlu, subtitlu, bridge text, floating icon

### **Animation Components**
- Framer Motion integration
- Custom easing curves
- Staggered animations pentru children

## 🎯 Content Guidelines

### **Slide Configuration**
```typescript
export const exampleSlide: SlideConfig = {
  id: 'unique-id',
  template: 'educational',
  content: {
    title: 'Clear, Action-Oriented Title (50 chars max)',
    subtitle: 'Context and Value Proposition (100 chars max)',
    bridgeText: 'Connect to existing knowledge',
    vocabulary: [/* 1-4 items max */],
    concepts: [/* 1-4 items max */]
  },
  theme: 'dark-blue',
  animations: 'smooth-3d'
};
```

### **Content Constraints**
- **Title**: 50 caractere maximum, action-oriented
- **Subtitle**: 100 caractere maximum, context și value proposition
- **Vocabulary**: maximum 4 itemi per slide
- **Concepts**: maximum 4 itemi per slide

## 🔧 Technical Stack

### **Core Dependencies**
- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool și dev server
- **Tailwind CSS 3** - Styling (NOT v4 beta)
- **Framer Motion 12** - Animations
- **Lucide React** - Icon system

### **Development Tools**
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **TypeScript strict mode** - Type checking

## 🎨 Theme Configuration

### **Primary Theme: Dark Blue**
```typescript
'dark-blue': {
  colors: {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#f59e0b',
    vocabulary: 'text-amber-300',
    concepts: 'text-orange-300'
  },
  gradients: {
    background: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900'
  }
}
```

## 🚀 Performance Targets

### **Technical Metrics**
- ✅ Build time < 30 seconds
- ✅ Hot reload < 1 second
- ✅ Smooth 60fps animations
- ✅ TypeScript strict compliance
- ✅ All files < 500 lines

### **Developer Experience**
- ✅ Adding new slide < 5 minutes
- ✅ Theme customization < 2 minutes
- ✅ Zero configuration for basic usage
- ✅ Instant feedback cu hot reload

## 📝 Naming Conventions

### **Files & Directories**
- **PascalCase** pentru React components: `EducationalTemplate.tsx`
- **camelCase** pentru utilities: `themeSystem.ts`
- **kebab-case** pentru slide configs: `blockchain-intro.config.ts`

### **Code Style**
- **Descriptive names** - `hoveredVocabularyItem` nu `hoverItem`
- **Consistent imports** - relative paths within packages
- **JSDoc comments** pentru toate funcțiile publice

## 🧪 Testing Strategy

### **Unit Tests**
- Toate componentele au teste Vitest
- Minimum 3 teste per component: normal use, edge case, failure case
- 90%+ coverage target

### **Component Tests**
- React Testing Library pentru user interactions
- Accessibility testing cu aXe
- Visual regression testing

## 🔄 Development Workflow

### **Git Strategy**
- Feature branches pentru dezvoltare
- Clear commit messages
- Code review pentru toate schimbările

### **Task Management**
- TASK.md pentru tracking progres
- Mark completed tasks imediat
- Add discovered tasks în "Discovered During Work"

## 🎯 Next Phase Goals

### **Phase 2: Content System**
- Slide configuration system
- Icon registry expansion
- Animation utilities completion
- Example slide configurations

### **Phase 3: Presentation Features**
- Navigation system
- Full-screen presentation mode
- Keyboard controls
- Progress tracking

---

**Remember**: This framework prioritizes developer experience, performance, and maintainability. Every decision should align with these core values. 