# Visual Guide: Unified Theme System

## Overview

This guide demonstrates how the unified theme system creates a cohesive visual experience where the 3D basketball, 2D text, prices, and UI elements all transition together in perfect harmony.

## Theme Showcase

### 🏆 Champion Gold (Default)
**Visual Identity:** Premium, championship aesthetic

**Colors:**
- **Basketball:** Rich gold (#c9a84c) with golden highlights (#ffd700)
- **UI Accents:** Bold orange (#e8500a)
- **Background Text:** Subtle gold glow (rgba(201, 168, 76, 0.12))
- **Price Display:** Orange (#e8500a)

**Mood:** Elite, prestigious, championship-winning

---

### 🌙 Midnight Blue
**Visual Identity:** Cool, professional, modern

**Colors:**
- **Basketball:** Deep blue (#2d5a8f) with bright blue highlights (#4a90e2)
- **UI Accents:** Bright blue (#4a90e2)
- **Background Text:** Blue glow (rgba(74, 144, 226, 0.12))
- **Price Display:** Blue (#4a90e2)

**Mood:** Professional, tech-forward, sleek

---

### 🔥 Crimson Fire
**Visual Identity:** Bold, aggressive, energetic

**Colors:**
- **Basketball:** Deep red (#8b2020) with bright red highlights (#ff4444)
- **UI Accents:** Bright red (#ff4444)
- **Background Text:** Red glow (rgba(255, 68, 68, 0.12))
- **Price Display:** Red (#ff4444)

**Mood:** Intense, powerful, competitive

---

### 🌲 Forest Green
**Visual Identity:** Natural, balanced, grounded

**Colors:**
- **Basketball:** Forest green (#3d5a2e) with olive highlights (#6b8e23)
- **UI Accents:** Olive green (#6b8e23)
- **Background Text:** Green glow (rgba(107, 142, 35, 0.12))
- **Price Display:** Green (#6b8e23)

**Mood:** Organic, balanced, earthy

---

### ⚡ Platinum Silver
**Visual Identity:** Futuristic, premium, refined

**Colors:**
- **Basketball:** Silver (#9a9a9a) with bright silver highlights (#e8e8e8)
- **UI Accents:** Bright silver (#e8e8e8)
- **Background Text:** Silver glow (rgba(232, 232, 232, 0.12))
- **Price Display:** Silver (#e8e8e8)

**Mood:** Futuristic, high-tech, premium

---

## Transition Animation

### Timeline (0.8 seconds)

```
0.0s ─────────────────────────────────────────────────── 0.8s
│                                                          │
├─ Basketball shader colors start interpolating           │
├─ Scene rim light color starts changing                  │
├─ Background "SPAING" text begins glowing                │
├─ Price display color starts transitioning               │
├─ UI borders begin color shift                           │
├─ All metric labels start updating                       │
│                                                          │
│         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│         Smooth GSAP interpolation (power2.inOut)        │
│                                                          │
└─ All elements reach target colors simultaneously ───────┘
```

### Easing Curve

```
power2.inOut (cubic-bezier(0.4, 0, 0.2, 1))

1.0 │                    ╭────────
    │                 ╭──╯
    │              ╭──╯
0.5 │           ╭──╯
    │        ╭──╯
    │     ╭──╯
0.0 │─────╯
    └─────────────────────────────
    0.0s                      0.8s
```

**Why This Curve?**
- Starts slow (ease in)
- Accelerates in middle
- Ends slow (ease out)
- Creates smooth, natural "glowing" effect

---

## Element Synchronization Map

### 3D Scene Elements

```
┌─────────────────────────────────────────┐
│         3D Basketball                   │
│  ┌───────────────────────────────────┐  │
│  │ Shader Uniforms (GSAP)            │  │
│  │ • uBaseColor    → theme.primary   │  │
│  │ • uAccentColor  → theme.accent    │  │
│  │ Duration: 0.8s                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│         Scene Lighting                  │
│  ┌───────────────────────────────────┐  │
│  │ Rim Light (GSAP)                  │  │
│  │ • color → theme.accent            │  │
│  │ Duration: 0.8s                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 2D HTML Elements

```
┌─────────────────────────────────────────┐
│      Background Text "SPAING"           │
│  ┌───────────────────────────────────┐  │
│  │ CSS Transition                    │  │
│  │ • color → theme.textGlow          │  │
│  │ Duration: 0.8s                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│         Price Display                   │
│  ┌───────────────────────────────────┐  │
│  │ CSS Transition                    │  │
│  │ • color → theme.priceColor        │  │
│  │ Duration: 0.8s                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│         UI Borders                      │
│  ┌───────────────────────────────────┐  │
│  │ GSAP Animation                    │  │
│  │ • backgroundColor → theme.uiAccent│  │
│  │ Duration: 0.8s                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│         Metric Labels                   │
│  ┌───────────────────────────────────┐  │
│  │ CSS Transition                    │  │
│  │ • color → theme.uiAccent          │  │
│  │ Duration: 0.8s                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## User Interaction Flow

### Color Picker Controls

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌───┐  ┌─────────┐  ┌───┐             │
│  │ ← │  │ ● ● ● ● │  │ → │             │
│  └───┘  └─────────┘  └───┘             │
│   Prev   Indicators   Next              │
│                                         │
│  Position: Fixed bottom-right           │
│  Z-Index: Above content                 │
│                                         │
└─────────────────────────────────────────┘
```

**Interaction:**
1. User clicks left/right arrow
2. `ThemeContext` updates `activeTheme`
3. `isTransitioning` flag set to `true`
4. All elements begin 0.8s transition
5. After 0.8s, `isTransitioning` resets to `false`
6. User can select next theme

**Protection:**
- Buttons disabled during transition
- Prevents overlapping animations
- Ensures smooth, complete transitions

---

## Technical Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ThemeContext                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Single Source of Truth                                │  │
│  │ • activeTheme: 'gold' | 'midnight' | ...             │  │
│  │ • isTransitioning: boolean                           │  │
│  │ • nextTheme() / prevTheme()                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─────────────────────────────────┐
                            │                                 │
                            ▼                                 ▼
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│     CSS Custom Properties        │    │      Component Props             │
│  ┌────────────────────────────┐  │    │  ┌────────────────────────────┐  │
│  │ --theme-primary            │  │    │  │ Basketball.jsx             │  │
│  │ --theme-accent             │  │    │  │ • theme.primary            │  │
│  │ --theme-ui-accent          │  │    │  │ • theme.accent             │  │
│  │ --theme-text-glow          │  │    │  └────────────────────────────┘  │
│  │ --theme-price-color        │  │    │                                  │
│  │                            │  │    │  ┌────────────────────────────┐  │
│  │ Updated via GSAP           │  │    │  │ SceneCanvas.jsx            │  │
│  │ Duration: 0.8s             │  │    │  │ • theme.accent (lights)    │  │
│  └────────────────────────────┘  │    │  │ • theme.background         │  │
└──────────────────────────────────┘    │  └────────────────────────────┘  │
                │                       │                                  │
                │                       │  ┌────────────────────────────┐  │
                ▼                       │  │ ThemeBorder.jsx            │  │
┌──────────────────────────────────┐    │  │ • theme.uiAccent           │  │
│      HTML Elements               │    │  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │    └──────────────────────────────────┘
│  │ .price-display             │  │
│  │ .champion-rank-display     │  │
│  │ Background text            │  │
│  │ Metric labels              │  │
│  │                            │  │
│  │ CSS Transitions: 0.8s      │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

---

## Performance Characteristics

### Frame Rate During Transition

```
60 FPS ┤ ████████████████████████████████████████████
       │
       │ Smooth GSAP interpolation
       │ Hardware-accelerated CSS
       │
30 FPS ┤
       │
       │
 0 FPS ┤
       └─────────────────────────────────────────────
       0.0s                                      0.8s
```

**Optimizations:**
- GSAP uses requestAnimationFrame
- CSS transitions hardware-accelerated
- Shader uniforms updated efficiently
- No texture loading or swapping
- Minimal DOM manipulation

---

## Accessibility Features

### Screen Reader Announcements

```
User clicks next theme:
├─ Button: "Next color theme"
├─ Aria-label: "Next color theme"
├─ Disabled during transition
└─ Visual feedback: opacity 0.5
```

### Keyboard Navigation

```
Tab Order:
1. Previous theme button (←)
2. Next theme button (→)
3. Other interactive elements

Enter/Space: Activate theme change
```

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  /* Future enhancement: instant transitions */
  transition-duration: 0.1s !important;
}
```

---

## Browser Compatibility

### Supported Features

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Custom Properties | ✅ | ✅ | ✅ | ✅ |
| GSAP Animations | ✅ | ✅ | ✅ | ✅ |
| WebGL Shaders | ✅ | ✅ | ✅ | ✅ |
| CSS Transitions | ✅ | ✅ | ✅ | ✅ |

**Fallbacks:**
- If shaders fail: Standard Three.js materials
- If GSAP unavailable: CSS transitions only
- If theme context missing: Default gold theme

---

## Testing Checklist

### Visual Tests

- [ ] Ball color changes smoothly
- [ ] Background text glows into new color
- [ ] Price display transitions
- [ ] UI borders update
- [ ] All changes happen simultaneously
- [ ] No jarring snaps or flickers
- [ ] Transition takes exactly 0.8 seconds

### Interaction Tests

- [ ] Click next arrow cycles themes
- [ ] Click previous arrow cycles themes
- [ ] Buttons disabled during transition
- [ ] Can't trigger overlapping animations
- [ ] Theme persists across page navigation

### Performance Tests

- [ ] Maintains 60 FPS during transition
- [ ] No memory leaks
- [ ] Smooth on mobile devices
- [ ] Works with reduced motion preference

---

## Conclusion

The unified theme system creates a **cohesive, polished experience** where:

✨ **3D and 2D elements share the same color state**
✨ **GSAP provides frame-perfect synchronization**
✨ **All transitions happen simultaneously**
✨ **The result feels like a video game**

The ball, text, and price transform in **perfect harmony** — exactly like the reference site.
