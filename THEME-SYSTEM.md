# Unified Theme System - Technical Documentation

## Overview

The SLAM DUNK basketball site implements a **unified design system** where the 3D basketball, 2D HTML elements, background text, prices, and UI accents all transition together in perfect harmony. This creates a cohesive, video game-like experience where color changes feel like a single, orchestrated animation rather than disconnected updates.

## Inspiration

This system is inspired by the reference site at https://slamdunk-five.vercel.app/, which demonstrates:
- Smooth GSAP-powered color transitions (0.8s duration)
- Real-time synchronization between 3D shaders and 2D HTML
- Background text that "glows" into new colors
- Price displays that transition with the theme
- A unified color palette that affects every element simultaneously

## Architecture

### 1. Theme Context (`ThemeContext.jsx`)

The `ThemeContext` is the **single source of truth** for all color state:

```javascript
export const COLOR_THEMES = {
  gold: {
    id: 'gold',
    name: 'Champion Gold',
    primary: '#c9a84c',      // Basketball base color
    accent: '#ffd700',       // Rim light & highlights
    uiAccent: '#e8500a',     // UI borders & accents
    textGlow: 'rgba(201, 168, 76, 0.12)',  // Background text glow
    priceColor: '#e8500a',   // Price display color
    // ... more properties
  },
  // ... more themes
};
```

**Key Features:**
- Each theme defines a complete color palette
- `isTransitioning` state prevents rapid theme switching during animations
- CSS custom properties are updated via GSAP for smooth transitions
- 0.8s transition duration matches all animations

### 2. CSS Custom Properties

The theme system uses CSS custom properties for unified transitions:

```css
:root {
  --theme-primary: #c9a84c;
  --theme-accent: #ffd700;
  --theme-ui-accent: #e8500a;
  --theme-text-glow: rgba(201, 168, 76, 0.12);
  --theme-price-color: #e8500a;
}
```

These are updated by the `ThemeProvider` using GSAP:

```javascript
gsap.to(root, {
  '--theme-primary': theme.primary,
  '--theme-accent': theme.accent,
  '--theme-ui-accent': theme.uiAccent,
  '--theme-text-glow': theme.textGlow,
  '--theme-price-color': theme.priceColor,
  duration: 0.8,
  ease: 'power2.inOut',
});
```

### 3. 3D Basketball Shader (`Basketball.jsx`)

The basketball uses **procedural shaders** with dynamic uniforms:

```javascript
const PebbleShaderMaterial = shaderMaterial(
  {
    uBaseColor: new THREE.Color('#c9a84c'),   // Dynamic base color
    uAccentColor: new THREE.Color('#ffd700'), // Dynamic accent color
    // ... other uniforms
  },
  vertexShader,
  fragmentShader
);
```

**Color Transition:**
```javascript
useEffect(() => {
  if (!matRef.current || !shaderOk.current || !activeTheme) return;

  const targetBase = new THREE.Color(activeTheme.primary);
  const targetAccent = new THREE.Color(activeTheme.accent);

  // Smooth GSAP tween for color transition (0.8s)
  gsap.to(matRef.current.uBaseColor, {
    r: targetBase.r,
    g: targetBase.g,
    b: targetBase.b,
    duration: 0.8,
    ease: 'power2.inOut',
  });

  gsap.to(matRef.current.uAccentColor, {
    r: targetAccent.r,
    g: targetAccent.g,
    b: targetAccent.b,
    duration: 0.8,
    ease: 'power2.inOut',
  });
}, [activeTheme]);
```

**Why This Works:**
- Instead of loading new textures, we change mathematical color values
- GSAP interpolates RGB values smoothly over 0.8 seconds
- The shader renders in real-time, creating a "glowing" transition effect

### 4. Scene Lighting (`SceneCanvas.jsx`)

The 3D scene lighting also syncs with the theme:

```javascript
function SceneLights({ accentColor = '#c9a84c' }) {
  const rimLightRef = useRef();

  useEffect(() => {
    if (!rimLightRef.current) return;

    const targetColor = new THREE.Color(accentColor);
    gsap.to(rimLightRef.current.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }, [accentColor]);

  return (
    <>
      <directionalLight position={[3, 5, 3]} intensity={2.5} />
      <ambientLight intensity={0.4} />
      <directionalLight 
        ref={rimLightRef}
        position={[-4, 2, -3]} 
        intensity={0.8} 
        color={accentColor} 
      />
    </>
  );
}
```

### 5. 2D HTML Elements

All HTML elements use the theme context or CSS custom properties:

**Background Text (HeroSection):**
```javascript
<span
  style={{
    color: themeContext?.theme?.textGlow || 'rgba(255,255,255,0.12)',
    transition: 'color 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  }}
>
  SPAING
</span>
```

**Price Display:**
```javascript
<div
  style={{
    color: themeContext?.theme?.priceColor || COLOR.accentOrange,
    transition: 'color 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  }}
>
  {COPY.champion.price}
</div>
```

**CSS Classes:**
```css
.price-display {
  color: var(--theme-price-color, #ffffff);
  transition: color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.champion-rank-display {
  color: var(--theme-price-color, #e8500a);
  transition: color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 6. Theme Border (`ThemeBorder.jsx`)

The border frame animates with GSAP:

```javascript
useEffect(() => {
  const refs = [topRef, bottomRef, leftRef, rightRef];
  
  refs.forEach(ref => {
    if (!ref.current) return;
    
    gsap.to(ref.current, {
      backgroundColor: theme.uiAccent,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  });
}, [theme]);
```

## Transition Flow

When a user clicks the color picker arrows:

1. **ThemeContext** updates `activeTheme` state
2. **CSS custom properties** are tweened by GSAP (0.8s)
3. **Basketball shader uniforms** are tweened by GSAP (0.8s)
4. **Scene rim light** color is tweened by GSAP (0.8s)
5. **HTML elements** transition via CSS (0.8s)
6. **Theme border** animates via GSAP (0.8s)

All transitions happen **simultaneously** with the same duration and easing, creating perfect synchronization.

## Key Technical Decisions

### Why GSAP Instead of CSS Transitions?

1. **Shader Uniforms:** WebGL shader uniforms cannot be animated with CSS. GSAP can tween JavaScript objects directly.
2. **Precise Control:** GSAP provides frame-by-frame control over complex animations.
3. **Unified Timing:** GSAP ensures all transitions use identical easing curves.

### Why 0.8 Seconds?

- Fast enough to feel responsive
- Slow enough to see the "glow" effect
- Matches the reference site's timing
- Prevents jarring color snaps

### Why CSS Custom Properties?

- Allow CSS transitions for HTML elements
- Can be animated by GSAP for smooth interpolation
- Provide fallback values for robustness
- Enable theme-aware styling without prop drilling

## Color Palette Design

Each theme follows a consistent structure:

- **primary:** Main basketball color (changes per theme)
- **accent:** Highlight/rim light (changes per theme)
- **uiAccent:** UI borders and accents (changes per theme)
- **textGlow:** Background text opacity color (changes per theme)
- **priceColor:** Price and metric displays (changes per theme)
- **background:** Always `#0a0a0a` (dark/black)
- **fog:** Always `#0a0a0a` (maintains dark atmosphere)

This ensures the ball, text, and UI all transform together while maintaining the dark, premium aesthetic.

## Performance Considerations

1. **Shader Compilation:** Shaders are compiled once and reused
2. **GSAP Tweens:** Efficient RAF-based animation loop
3. **CSS Transitions:** Hardware-accelerated when possible
4. **Transition Lock:** `isTransitioning` prevents overlapping animations
5. **Fallback Materials:** If shaders fail, fallback to standard materials

## Adding New Themes

To add a new theme:

1. Add entry to `COLOR_THEMES` in `ThemeContext.jsx`:
```javascript
newTheme: {
  id: 'newTheme',
  name: 'New Theme Name',
  primary: '#hexcolor',      // Ball base
  accent: '#hexcolor',       // Ball highlights
  uiAccent: '#hexcolor',     // UI accents
  textGlow: 'rgba(...)',     // Background text
  priceColor: '#hexcolor',   // Prices
  background: '#0a0a0a',
  fog: '#0a0a0a',
  secondary: '#hexcolor',
}
```

2. The system automatically:
   - Adds it to the color picker
   - Enables cycling through it
   - Applies all transitions

## Testing

To verify the unified system:

1. Click color picker arrows
2. Observe:
   - Basketball color changes smoothly
   - Background "SPAING" text glows into new color
   - Price displays transition
   - UI borders update
   - All changes happen simultaneously
   - No jarring snaps or delays

## Conclusion

This unified theme system demonstrates **context engineering** at its finest:
- 3D and 2D share the same state
- GSAP provides frame-perfect synchronization
- CSS custom properties bridge shader and HTML worlds
- The result feels like a cohesive, interactive experience

The ball, text, and price transform in **perfect harmony** — exactly like the reference site.
