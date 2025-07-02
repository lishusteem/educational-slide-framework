# 📋 **VISUAL DESIGN SPECIFICATION**

> **CRITICAL**: This document captures the EXACT visual behavior that must be preserved 100% during refactoring. Any deviation breaks the working design.

## 🎨 **LAYOUT & STRUCTURE**

### **Main Container Layout**
- **Overall Structure**: 4-column grid layout (3 columns main content + 1 column sidebar)
- **Aspect Ratio**: Fixed `aspect-video` container with max-width `max-w-7xl`
- **Background**: Dark gradient `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`
- **Container**: Glassmorphism effect with `rounded-3xl` corners and `p-8` padding
- **Responsive Behavior**: Sidebar collapses on smaller screens, main content becomes full-width

### **Animated Background Elements**
- **Orb 1**: Blue orb (`bg-blue-400/10`) at `-top-40 -left-40`, size `w-80 h-80`
  - Animation: Scale [1, 1.2, 1] + Rotate [0°, 180°, 360°] over 20s
- **Orb 2**: Indigo orb (`bg-indigo-400/10`) at `-bottom-40 -right-40`, size `w-96 h-96`  
  - Animation: Scale [1.2, 1, 1.2] + Rotate [360°, 180°, 0°] over 25s
- **Orb 3**: Cyan orb (`bg-cyan-400/5`) at center, size `w-64 h-64`
  - Animation: Scale [1, 1.3, 1] + Movement X/Y [-50px, 50px, -50px] over 15s

## 🎬 **ANIMATION SYSTEMS & TIMING**

### **Dual Animation Architecture** ⚠️ 
**CRITICAL**: Two separate animation systems that must work in perfect synchronization:

#### **System 1: Duration-Based Main Content (carouselSystem.ts)**
- **Purpose**: Drives main content area layout changes
- **Timing**: Fixed 5-second intervals per slide
- **Slides**: Intro (4s) → Vocabulary items (3s each) → Concept items (3s each) → Outro (5s)
- **Visual Effects**: 
  - Elastic stretch transitions (`scaleX: 0.4→1→1.6, scaleY: 1.6→1→0.4`)
  - Spring animations (stiffness: 280, damping: 30)
  - Icon morphing with `rotateY: -180°→0°→180°`
  - Background color transitions based on content type

#### **System 2: Precise-Timing Sidebar (timingSystem.ts)**
- **Purpose**: Triggers sidebar highlight effects
- **Timing**: Exact millisecond precision (0ms, 5000ms, 8000ms, 13000ms, etc.)
- **Visual Effects**:
  - Purple glow effect on highlighted items
  - Scale increase (1.015x) with subtle rotation
  - Border color change to `border-amber-400`
  - Box shadow expansion

### **Animation Timelines (EXACT TIMING)**
```
0ms:     Audio starts, both systems initialize
500ms:   Title highlight starts (2s duration)
1000ms:  Floating icon highlight (2.5s duration)  
3000ms:  Subtitle highlight starts (3s duration)
4000ms:  Vocabulary section highlight (2s) + Carousel starts vocabulary
5000ms:  Main content switches to first vocabulary term
7000ms:  Hash term highlight ends, Node term starts
8000ms:  Main content switches to Node vocabulary  
10000ms: Node highlight ends, Consensus starts
11000ms: Main content switches to Consensus
13000ms: Concepts section highlight starts + Carousel switches to concepts
16000ms: First concept highlight ends, second starts
19000ms: Second concept ends, third starts
22000ms: Third concept ends, fourth starts
25000ms: Final concept ends, outro begins
```

## 🎯 **MAIN CONTENT VISUAL BEHAVIORS**

### **Static Mode** (Original Design)
- **Floating Icon**: 
  - Size: `w-28 h-28` with `rounded-3xl`
  - Gradient: `from-cyan-400 via-blue-500 to-indigo-600`
  - Animation: Floating Y-axis [0, -8px, 0] over 3s infinite
  - Glow effect: `blur-xl opacity-30 scale-110`

- **Title Typography**:
  - Size: `text-7xl font-black`
  - Gradient text: `linear-gradient(135deg, #ffffff 0%, #e0f2fe 30%, #b3e5fc 60%, #81d4fa 100%)`
  - Text shadow: `0 4px 20px rgba(129, 212, 250, 0.3)`

- **Bridge Text Card**:
  - Background: `from-white/15 to-white/10` with `backdrop-blur-lg`
  - Border: `border-l-4 border-cyan-400` + `border border-white/20`
  - Hover effect: Scale 1.02 + `rotateX: 2deg` + enhanced shadow

### **Carousel Mode** (Dynamic Content)
- **Progress Bar**: 
  - Position: `absolute top-0` with `h-0.5`
  - Background: `from-cyan-400/60 via-blue-500/80 to-indigo-500/60`
  - Width animates based on progress percentage

- **Content Transitions**:
  - **Enter**: `scaleX: 0.4, scaleY: 1.6, rotateZ: -3deg, opacity: 0`
  - **Active**: `scaleX: 1, scaleY: 1, rotateZ: 0deg, opacity: 1`
  - **Exit**: `scaleX: 1.6, scaleY: 0.4, rotateZ: 3deg, opacity: 0`
  - **Duration**: 0.5s with spring physics

- **Icon Morphing**:
  - Color changes based on content type:
    - Vocabulary: `from-amber-400 via-orange-500 to-red-500`
    - Concepts: `from-green-400 via-blue-500 to-purple-600`
    - Default: `from-cyan-400 via-blue-500 to-indigo-600`

## 🎛️ **SIDEBAR VISUAL BEHAVIORS**

### **Vocabulary Section**
- **Container**: 
  - Background: `from-slate-700/80 to-blue-800/70` with `backdrop-blur-lg`
  - Border: `rounded-xl` with responsive shadow
  - Hover state: Scale 1.015 with amber glow overlay

- **Items (1-4 displayed)**:
  - **Default State**: `bg-slate-700/30` with `border-blue-600/25`
  - **Hover State**: Scale 1.015 + amber border + enhanced shadow
  - **Timing Highlight**: Purple glow effect identical to hover
  - **Icon Container**: `w-5 h-5` amber background with `rounded-md`

### **Concepts Section**
- **Identical structure** to vocabulary but with different color accents
- **Item Animation**: Same hover and timing behaviors
- **Overflow Indicator**: Shows "+X more" when items exceed maxItems

### **Footer Section**
- **Website Badge**: `www.educatiecripto.ro`
- **Background**: `from-slate-700/90 to-blue-800/80` with `backdrop-blur-lg`
- **Hover Effect**: Scale 1.02 with blue glow shadow

## 🎨 **THEME SYSTEM VISUAL OUTPUT**

### **Current Active Theme: "dark-blue"**
- **Primary Colors**: 
  - Background: `#0f172a` (slate-900)
  - Primary: `#1e40af` (blue-700)
  - Secondary: `#3b82f6` (blue-500)
  - Accent: `#f59e0b` (amber-500)

- **Gradient Applications**:
  - Main background: `from-blue-900 via-blue-800 to-indigo-900`
  - Card backgrounds: `from-slate-700/80 to-blue-800/70`
  - Accent elements: `from-cyan-400 via-blue-500 to-indigo-600`

## 🔊 **AUDIO SYNCHRONIZATION BEHAVIOR**

### **Audio Trigger System**
- **Play Button**: Starts both animation systems simultaneously
- **Pause Button**: Pauses both systems and preserves state
- **Reset Behavior**: Both systems return to initial state (0ms)
- **Sync Mechanism**: Single audio element triggers both timing systems

### **Visual Audio Indicators**
- **Play State**: Button shows pause icon with blue accent
- **Pause State**: Button shows play icon
- **Audio Progress**: No visual progress bar (timing is internal)

## ⚡ **PERFORMANCE SPECIFICATIONS**

### **Animation Performance**
- **60 FPS Target**: All animations must maintain smooth 60fps
- **Hardware Acceleration**: `transform3d`, `will-change: transform`
- **Transition Timing**: Maximum 0.5s for content switches
- **Memory Usage**: Efficient AnimatePresence with proper cleanup

### **Responsive Breakpoints**
- **Large Screens** (1200px+): Full 4-column layout
- **Medium Screens** (768px-1199px): Sidebar below main content  
- **Small Screens** (<768px): Single column, compressed spacing

## 🎯 **CRITICAL SUCCESS METRICS**

### **Visual Consistency Requirements**
- ✅ **Color Accuracy**: All gradients and colors exactly as specified
- ✅ **Animation Timing**: Millisecond-precise synchronization between systems
- ✅ **Layout Stability**: No layout shifts during transitions
- ✅ **Hover States**: All interactive elements maintain smooth hover effects
- ✅ **Typography**: Exact font sizes, weights, and text effects preserved
- ✅ **Responsive Behavior**: Consistent experience across all screen sizes

### **Animation Synchronization Requirements**
- ✅ **Dual System Sync**: Main content carousel and sidebar highlights perfectly aligned
- ✅ **Audio Triggers**: Both systems start/stop with audio control
- ✅ **State Preservation**: Pause/resume maintains exact timing positions
- ✅ **Transition Smoothness**: No visual glitches during content switches

---

**⚠️ REFACTORING CONSTRAINT**: Every single visual detail in this specification must be preserved exactly. Any change to colors, timing, animations, or layouts that differs from this spec breaks the working design and fails the refactoring goal.