# Animated Brand Text Feature

## Overview

The background brand text now **animates smoothly** when you change basketball themes, creating a dynamic, video game-like experience. Each theme has its own unique brand name that transitions with sophisticated GSAP animations.

## Brand Names by Theme

### 🏆 SPAING (Champion Gold)
**Theme:** Champion Gold  
**Brand:** SPAING  
**Identity:** Original championship brand, premium and prestigious

---

### 🌙 NOCTURNE (Midnight Blue)
**Theme:** Midnight Blue  
**Brand:** NOCTURNE  
**Identity:** Night-themed, mysterious and professional

---

### 🔥 INFERNO (Crimson Fire)
**Theme:** Crimson Fire  
**Brand:** INFERNO  
**Identity:** Fire-themed, intense and aggressive

---

### 🌲 VERDANT (Forest Green)
**Theme:** Forest Green  
**Brand:** VERDANT  
**Identity:** Nature-themed, balanced and organic

---

### ⚡ ZENITH (Platinum Silver)
**Theme:** Platinum Silver  
**Brand:** ZENITH  
**Identity:** Peak/premium, futuristic and refined

---

## Animation Breakdown

### Timeline (0.8 seconds total)

```
Phase 1: Fade Out (0.35s)
├─ Opacity: 1 → 0
├─ Scale: 1 → 0.92
├─ Blur: 0px → 20px
└─ Easing: power2.in

Phase 2: Text Change (instant)
└─ Content: "SPAING" → "NOCTURNE"

Phase 3: Fade In (0.45s)
├─ Opacity: 0 → 1
├─ Scale: 1.08 → 1
├─ Blur: 20px → 0px
└─ Easing: power2.out
```

### Visual Effect

```
SPAING                    [blur]                    NOCTURNE
  ▓▓▓▓▓▓                   ░░░░                      ▓▓▓▓▓▓▓▓
  ▓▓▓▓▓▓  ──────────────>  ░░░░  ──────────────>    ▓▓▓▓▓▓▓▓
  ▓▓▓▓▓▓                   ░░░░                      ▓▓▓▓▓▓▓▓
  
  Fade Out                 Invisible                 Fade In
  + Shrink                 Text Change               + Grow
  + Blur                                             + Unblur
```

### Easing Curves

**Phase 1 (Fade Out):**
```
power2.in
1.0 │─────╮
    │      ╲
    │       ╲
0.5 │        ╲
    │         ╲
    │          ╲
0.0 │           ╰────
    └─────────────────
    0.0s         0.35s
```

**Phase 3 (Fade In):**
```
power2.out
1.0 │           ╭────
    │          ╱
    │         ╱
0.5 │        ╱
    │       ╱
    │      ╱
0.0 │─────╯
    └─────────────────
    0.0s         0.45s
```

---

## Technical Implementation

### Component: `AnimatedBrandText.jsx`

**Key Features:**
- Automatic text change detection
- Smooth GSAP timeline animation
- Blur effect for depth
- Scale transformation for emphasis
- Color transition synced with theme

**Code Structure:**
```javascript
useEffect(() => {
  // Detect theme change
  const newText = themeContext.theme.brandText;
  
  // Skip if same text
  if (textElement.textContent === newText) return;
  
  // Create animation timeline
  const tl = gsap.timeline();
  
  // Phase 1: Fade out
  tl.to(textElement, {
    opacity: 0,
    scale: 0.92,
    filter: 'blur(20px)',
    duration: 0.35,
    ease: 'power2.in',
  })
  
  // Phase 2: Change text
  .call(() => {
    textElement.textContent = newText;
  })
  
  // Phase 3: Fade in
  .fromTo(textElement, 
    { opacity: 0, scale: 1.08, filter: 'blur(20px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' }
  );
}, [themeContext?.activeTheme]);
```

---

## Synchronization with Other Elements

### Complete Transition Flow

```
User clicks theme arrow
        │
        ├─────────────────────────────────────────────────┐
        │                                                   │
        ▼                                                   ▼
┌──────────────────┐                            ┌──────────────────┐
│  Brand Text      │                            │  Basketball      │
│  Animation       │                            │  Color Change    │
├──────────────────┤                            ├──────────────────┤
│ 0.0s - 0.35s     │                            │ 0.0s - 0.8s      │
│ Fade out + blur  │                            │ Shader tween     │
│                  │                            │                  │
│ 0.35s - 0.45s    │                            │ Simultaneous     │
│ Fade in + unblur │                            │ with text        │
└──────────────────┘                            └──────────────────┘
        │                                                   │
        └─────────────────────┬─────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  UI Elements     │
                    ├──────────────────┤
                    │ • Price color    │
                    │ • Borders        │
                    │ • Labels         │
                    │ • Rim light      │
                    │                  │
                    │ All: 0.8s        │
                    └──────────────────┘
```

### Timing Coordination

| Element | Start | Duration | End |
|---------|-------|----------|-----|
| Text Fade Out | 0.0s | 0.35s | 0.35s |
| Text Change | 0.35s | instant | 0.35s |
| Text Fade In | 0.35s | 0.45s | 0.8s |
| Ball Color | 0.0s | 0.8s | 0.8s |
| UI Elements | 0.0s | 0.8s | 0.8s |

**Result:** Text completes its transition at the same time as all other elements (0.8s).

---

## CSS Properties

### willChange Optimization

```css
willChange: 'transform, opacity, filter'
```

**Benefits:**
- Hints browser to optimize these properties
- Creates separate compositor layer
- Enables hardware acceleration
- Smoother animations

### Transition for Color

```css
transition: 'color 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
```

**Purpose:**
- Text color transitions smoothly with theme
- Syncs with ball color change
- Uses same easing as other elements

---

## Performance Considerations

### GPU Acceleration

**Animated Properties:**
- ✅ `opacity` - GPU accelerated
- ✅ `transform: scale()` - GPU accelerated
- ✅ `filter: blur()` - GPU accelerated (modern browsers)

**Result:** Smooth 60 FPS animation

### Memory Management

```javascript
return () => {
  tl.kill(); // Cleanup GSAP timeline
};
```

**Benefits:**
- Prevents memory leaks
- Stops animations on unmount
- Cleans up event listeners

---

## User Experience

### Before (Static Text)

```
┌─────────────────────────────────┐
│                                 │
│         SPAING                  │
│         (never changes)         │
│                                 │
└─────────────────────────────────┘
```

### After (Animated Text)

```
┌─────────────────────────────────┐
│  Click arrow                    │
│         ↓                       │
│  SPAING → [blur] → NOCTURNE     │
│  (smooth animation)             │
│                                 │
└─────────────────────────────────┘
```

**Improvements:**
- ✨ Dynamic brand identity per theme
- ✨ Smooth, professional transitions
- ✨ Enhanced visual feedback
- ✨ More engaging experience
- ✨ Video game-like polish

---

## Accessibility

### Screen Reader Support

```html
<h1 className="visually-hidden">
  {COPY.productName}
</h1>
<div aria-hidden="true">
  <span>{brandText}</span>
</div>
```

**Features:**
- Semantic H1 for SEO
- Visual text hidden from screen readers
- No confusion from animated text

### Reduced Motion

**Future Enhancement:**
```css
@media (prefers-reduced-motion: reduce) {
  .hero-brand-text span {
    transition: none !important;
  }
}
```

---

## Testing the Feature

### Manual Test Steps

1. **Start dev server:**
   ```bash
   cd slam-dunk-basketball
   npm run dev
   ```

2. **Test text animation:**
   - Click right arrow in color picker
   - Observe "SPAING" fade out with blur
   - Watch text change to "NOCTURNE"
   - See "NOCTURNE" fade in with unblur
   - Verify timing matches ball color change

3. **Test all themes:**
   - Gold → "SPAING"
   - Midnight → "NOCTURNE"
   - Crimson → "INFERNO"
   - Forest → "VERDANT"
   - Platinum → "ZENITH"

4. **Verify synchronization:**
   - Text animation completes at 0.8s
   - Ball color completes at 0.8s
   - UI elements complete at 0.8s
   - All transitions feel unified

---

## Brand Name Rationale

### SPAING (Gold)
- Original brand name
- Championship heritage
- Premium positioning

### NOCTURNE (Midnight)
- French for "night piece"
- Elegant and mysterious
- Matches blue/night theme

### INFERNO (Crimson)
- Italian for "hell/fire"
- Intense and powerful
- Matches red/fire theme

### VERDANT (Forest)
- Means "green with vegetation"
- Natural and organic
- Matches green/nature theme

### ZENITH (Platinum)
- Means "highest point"
- Premium and aspirational
- Matches silver/peak theme

---

## Future Enhancements

### Potential Additions

1. **Letter-by-letter animation:**
   ```javascript
   // Animate each letter individually
   SplitText animation with stagger
   ```

2. **Particle effects:**
   ```javascript
   // Add particles during transition
   Canvas-based particle system
   ```

3. **Sound effects:**
   ```javascript
   // Play sound on text change
   playTextChangeSound();
   ```

4. **Custom fonts per theme:**
   ```javascript
   // Different font for each brand
   fontFamily: theme.brandFont
   ```

---

## Conclusion

The animated brand text feature creates a **dynamic, polished experience** where:

✨ **Each theme has unique identity**  
✨ **Smooth GSAP-powered transitions**  
✨ **Perfect synchronization with ball and UI**  
✨ **Professional blur and scale effects**  
✨ **Video game-like polish**

The text transforms in **perfect harmony** with the basketball color, creating a unified, cohesive design system.
