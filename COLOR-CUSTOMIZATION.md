# Real-Time Color Customization System

## Overview

The Slam Dunk Basketball site features a **cinematic, real-time color customization system** where clicking arrows changes the basketball's color and the entire environment reacts smoothly. This creates a game-like, immersive experience where the 3D scene and 2D UI remain perfectly synchronized.

## Architecture

### 1. Global Theme State (`ThemeContext.jsx`)

**Purpose**: Centralized state management for active color theme

**Features**:
- Manages 5 color palettes (Gold, Midnight Blue, Crimson, Forest Green, Platinum)
- Provides `nextTheme()`, `prevTheme()`, and `setTheme()` functions
- Prevents rapid theme switching with transition lock
- Each theme defines:
  - `primary`: Basketball base color
  - `accent`: Highlight/rim light color
  - `secondary`: Seam/detail color
  - `background`: Scene background color
  - `uiAccent`: 2D HTML accent color
  - `fog`: Scene fog color

**Usage**:
```jsx
const { theme, nextTheme, isTransitioning } = useTheme();
```

### 2. Color Picker UI (`ColorPicker.jsx`)

**Purpose**: Bottom-right control for cycling through themes

**Features**:
- Up/Down arrows to cycle themes
- Visual indicator dots showing current theme
- Smooth hover animations
- Audio feedback on click
- Disabled state during transitions
- Responsive positioning

**Location**: Fixed bottom-right corner (adjusts on mobile)

### 3. Basketball Shader Integration (`Basketball.jsx`)

**Purpose**: Real-time color updates via shader uniforms

**How it works**:
1. Basketball uses procedural shader (not image textures)
2. Shader accepts `uBaseColor` and `uAccentColor` uniforms
3. When theme changes, GSAP tweens these uniforms over 0.8s
4. Shader math generates leather texture with dynamic colors

**Key Code**:
```jsx
// Animate color changes with GSAP
useEffect(() => {
  const targetBase = new THREE.Color(theme.primary);
  const targetAccent = new THREE.Color(theme.accent);

  gsap.to(matRef.current.uBaseColor, {
    r: targetBase.r, g: targetBase.g, b: targetBase.b,
    duration: 0.8, ease: 'power2.inOut',
  });
}, [theme]);
```

### 4. Shader Color Logic (`pebble.frag.glsl`)

**Purpose**: Apply dynamic colors to procedural leather texture

**Changes**:
- Replaced hardcoded orange with `uniform vec3 uBaseColor`
- Replaced hardcoded gold rim with `uniform vec3 uAccentColor`
- Leather variations calculated from base color:
  - `leatherDark = uBaseColor * 0.7`
  - `leatherLight = uBaseColor * 1.15`
- Rim light uses `uAccentColor` for dynamic glow

### 5. Environment Synchronization (`SceneCanvas.jsx`)

**Purpose**: Sync 3D scene environment with theme

**Components**:

#### `EnvironmentSync`
- Updates `scene.background` color
- Updates `scene.fog` color
- GSAP tweens for smooth transitions

#### `SceneLights`
- Rim light color syncs with `theme.accent`
- Creates cohesive lighting that matches ball color

**Key Code**:
```jsx
function EnvironmentSync() {
  const { scene } = useThree();
  const { theme } = useTheme();

  useEffect(() => {
    const targetBg = new THREE.Color(theme.background);
    gsap.to(scene.background, {
      r: targetBg.r, g: targetBg.g, b: targetBg.b,
      duration: 0.8, ease: 'power2.inOut',
    });
  }, [scene, theme]);
}
```

### 6. UI Accent Synchronization

**Purpose**: 2D HTML elements match 3D scene colors

**Implementation**:
- ColorPicker label uses `theme.uiAccent`
- Border colors transition with theme
- All UI accents update via CSS `transition: color 0.8s ease`

## Color Palettes

### Champion Gold (Default)
```js
{
  primary: '#c9a84c',    // Warm gold
  accent: '#ffd700',     // Bright gold
  background: '#1a1510', // Warm dark brown
  fog: '#0a0a08',        // Deep warm black
}
```

### Midnight Blue
```js
{
  primary: '#1e3a5f',    // Deep navy
  accent: '#4a90e2',     // Bright blue
  background: '#0a0f1a', // Dark blue-black
  fog: '#050810',        // Deep blue-black
}
```

### Crimson Fire
```js
{
  primary: '#8b0000',    // Dark red
  accent: '#ff4444',     // Bright red
  background: '#1a0505', // Dark red-black
  fog: '#0a0202',        // Deep red-black
}
```

### Forest Green
```js
{
  primary: '#2d5016',    // Deep green
  accent: '#6b8e23',     // Olive green
  background: '#0f1a08', // Dark green-black
  fog: '#080a05',        // Deep green-black
}
```

### Platinum Silver
```js
{
  primary: '#c0c0c0',    // Silver
  accent: '#e8e8e8',     // Bright silver
  background: '#1a1a1a', // Neutral dark gray
  fog: '#0a0a0a',        // Deep gray
}
```

## Transition Timeline

When user clicks arrow:

1. **T+0ms**: Click detected
   - Audio feedback plays
   - `isTransitioning` set to `true`
   - Theme state updates

2. **T+0-800ms**: GSAP Tweens (simultaneous)
   - Basketball `uBaseColor` → new primary
   - Basketball `uAccentColor` → new accent
   - Scene background → new background
   - Scene fog → new fog color
   - Rim light → new accent color
   - UI accents → new uiAccent color

3. **T+800ms**: Transition complete
   - `isTransitioning` set to `false`
   - User can trigger next color change

## Technical Details

### Why This Approach?

**Procedural Shaders**:
- Basketball is "pure math", not an image
- Allows instant color changes without loading assets
- Maintains pebble texture detail across all colors
- GPU-accelerated for smooth performance

**GSAP Tweening**:
- Prevents jarring color snaps
- Creates cinematic "glow" effect
- Synchronizes multiple elements perfectly
- Easing curves feel natural and premium

**Global State**:
- Single source of truth for active theme
- All components react to same state
- Prevents desync between 3D and 2D
- Easy to add new themes

### Performance Considerations

- **No Asset Loading**: All colors are math-based
- **GPU Shaders**: Color calculations happen on GPU
- **Transition Lock**: Prevents rapid clicking/thrashing
- **Efficient Tweens**: GSAP optimizes animation loops

## Adding New Themes

To add a new color theme:

1. Add to `COLOR_THEMES` in `ThemeContext.jsx`:
```js
newTheme: {
  id: 'newTheme',
  name: 'Display Name',
  primary: '#hexcolor',
  accent: '#hexcolor',
  secondary: '#hexcolor',
  background: '#hexcolor',
  uiAccent: '#hexcolor',
  fog: '#hexcolor',
}
```

2. Theme automatically appears in ColorPicker
3. All transitions work automatically

## User Experience

**Desktop**:
- Hover over arrows for visual feedback
- Click to cycle through themes
- Smooth 0.8s transitions
- Audio click feedback

**Mobile**:
- Touch arrows to cycle
- Same smooth transitions
- Responsive positioning

**Accessibility**:
- `aria-label` on buttons
- Disabled state during transitions
- Visual indicators (dots) show current theme
- Keyboard accessible

## Integration Points

The theme system integrates with:
- ✅ Basketball 3D model (shader uniforms)
- ✅ Scene background and fog
- ✅ Directional rim lighting
- ✅ ColorPicker UI component
- ✅ Audio feedback system
- ⚠️ Section text accents (future enhancement)
- ⚠️ Button hover states (future enhancement)

## Future Enhancements

1. **Section-Specific Accents**: Update hero text, price tags, and CTAs with `theme.uiAccent`
2. **Persistence**: Save user's theme choice to localStorage
3. **URL Themes**: Allow `?theme=midnight` URL parameter
4. **Custom Themes**: Let users create custom color combinations
5. **Theme Presets**: Seasonal or event-specific themes

## Debugging

**Check if theme is updating**:
```js
console.log('Active theme:', theme.id);
console.log('Primary color:', theme.primary);
```

**Check shader uniforms**:
```js
console.log('Base color:', matRef.current.uBaseColor);
console.log('Accent color:', matRef.current.uAccentColor);
```

**Check scene colors**:
```js
console.log('Background:', scene.background);
console.log('Fog:', scene.fog.color);
```

## Summary

This system creates a **game-like, cinematic experience** where:
- Basketball color changes are **instant and smooth**
- Environment **reacts in perfect sync**
- 2D UI **matches 3D scene** colors
- Transitions feel **premium and polished**
- Everything is **math-based** (no asset loading)
- User has **full control** over aesthetics

The result is an immersive, interactive product showcase that feels alive and responsive to user input.
