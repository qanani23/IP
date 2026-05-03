# Character-by-Character Staggered Text Animation

## Overview

The brand text now uses a **sophisticated staggered reveal animation** where each letter appears sequentially, floating into place one by one. This creates a smooth, cinematic effect powered by GSAP's stagger functionality.

## Animation Technique

### Staggered Reveal (Sequential Entrance)

Instead of the entire word appearing at once, each character animates individually with a slight delay between them, creating a "wave" effect.

```
S → P → A → I → N → G
│   │   │   │   │   │
▼   ▼   ▼   ▼   ▼   ▼
Appears sequentially with 0.03s delay between each letter
```

## Visual Timeline

### Phase 1: Fade Out (Existing Text)

```
S P A I N G
▓ ▓ ▓ ▓ ▓ ▓  ──→  ░ ░ ░ ░ ░ ░
│ │ │ │ │ │
└─┴─┴─┴─┴─┴─ Each letter fades out sequentially
             0.02s stagger, 0.4s duration
             Moves up 30px with rotationX -90°
```

### Phase 2: Text Change (Instant)

```
S P A I N G  →  N O C T U R N E
(invisible)     (invisible, positioned 50px below)
```

### Phase 3: Staggered Reveal (New Text)

```
N O C T U R N E
│ │ │ │ │ │ │ │
└─┴─┴─┴─┴─┴─┴─┴─ Each letter floats up sequentially
                 0.03s stagger, 0.6s duration
                 Moves from 50px below to final position

Timeline:
0.00s: N appears
0.03s: O appears
0.06s: C appears
0.09s: T appears
0.12s: U appears
0.15s: R appears
0.18s: N appears
0.21s: E appears
0.81s: Animation complete
```

## Technical Implementation

### Character Splitting

```javascript
const splitTextIntoLetters = (text) => {
  return text.split('').map((char, index) => (
    <span
      key={`${char}-${index}`}
      ref={el => lettersRef.current[index] = el}
      style={{
        display: 'inline-block',
        opacity: 0,
        transform: 'translateY(50px)',
        willChange: 'transform, opacity',
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
};
```

**Key Points:**
- Each character becomes a separate `<span>` element
- `display: inline-block` allows transforms
- Initial state: invisible and 50px below
- Spaces use non-breaking space (`\u00A0`)

### GSAP Stagger Animation

```javascript
const tl = gsap.timeline();

// Phase 1: Fade out with stagger
tl.to(letters, {
  opacity: 0,
  y: -30,
  rotationX: -90,
  duration: 0.4,
  stagger: {
    each: 0.02,      // 20ms between each letter
    from: 'start',   // Start from first letter
  },
  ease: 'power2.in',
})

// Phase 2: Reset position
.set(letters, {
  y: 50,
  rotationX: 0,
})

// Phase 3: Staggered reveal
.to(letters, {
  opacity: 1,
  y: 0,
  duration: 0.6,
  stagger: {
    each: 0.03,      // 30ms between each letter
    from: 'start',   // Start from first letter
  },
  ease: 'power2.out',
});
```

## Stagger Configuration

### What is Stagger?

**Stagger** is a GSAP feature that applies the same animation to multiple elements, but starts each one at a different time.

```javascript
stagger: {
  each: 0.03,      // Delay between each element (30ms)
  from: 'start',   // Start from first element
}
```

**Options:**
- `each`: Time delay between each element
- `from`: Where to start ('start', 'end', 'center', 'edges', 'random')
- `amount`: Total time to distribute across all elements
- `grid`: For 2D grid layouts

### Stagger Patterns

```
from: 'start'
S → P → A → I → N → G
│   │   │   │   │   │
0   30  60  90  120 150ms

from: 'end'
S ← P ← A ← I ← N ← G
│   │   │   │   │   │
150 120 90  60  30  0ms

from: 'center'
S ← P ← A → I → N → G
│   │   │   │   │   │
90  60  30  0   30  60ms
```

## Animation Properties

### Fade Out Phase

| Property | Start | End | Purpose |
|----------|-------|-----|---------|
| `opacity` | 1 | 0 | Fade out |
| `y` | 0 | -30px | Move up |
| `rotationX` | 0° | -90° | 3D flip effect |
| `duration` | - | 0.4s | Animation time |
| `stagger.each` | - | 0.02s | 20ms between letters |
| `ease` | - | power2.in | Accelerate |

### Fade In Phase

| Property | Start | End | Purpose |
|----------|-------|-----|---------|
| `opacity` | 0 | 1 | Fade in |
| `y` | 50px | 0 | Float up |
| `rotationX` | 0° | 0° | No rotation |
| `duration` | - | 0.6s | Animation time |
| `stagger.each` | - | 0.03s | 30ms between letters |
| `ease` | - | power2.out | Decelerate |

## Easing Curves

### power2.in (Fade Out)
```
Acceleration curve - starts slow, ends fast

1.0 │─────╮
    │      ╲
    │       ╲
0.5 │        ╲
    │         ╲
    │          ╲
0.0 │           ╰────
    └─────────────────
    0.0s         0.4s
```

### power2.out (Fade In)
```
Deceleration curve - starts fast, ends slow

1.0 │           ╭────
    │          ╱
    │         ╱
0.5 │        ╱
    │       ╱
    │      ╱
0.0 │─────╯
    └─────────────────
    0.0s         0.6s
```

## Complete Animation Sequence

### Example: "SPAING" → "NOCTURNE"

```
Time    Event
────────────────────────────────────────────────────────
0.00s   S fades out, moves up, rotates
0.02s   P fades out, moves up, rotates
0.04s   A fades out, moves up, rotates
0.06s   I fades out, moves up, rotates
0.08s   N fades out, moves up, rotates
0.10s   G fades out, moves up, rotates
0.40s   All letters invisible
0.40s   Text changes to "NOCTURNE" (instant)
0.40s   N starts fading in, floating up
0.43s   O starts fading in, floating up
0.46s   C starts fading in, floating up
0.49s   T starts fading in, floating up
0.52s   U starts fading in, floating up
0.55s   R starts fading in, floating up
0.58s   N starts fading in, floating up
0.61s   E starts fading in, floating up
1.01s   Animation complete
```

## Performance Optimizations

### willChange Property

```css
willChange: 'transform, opacity'
```

**Benefits:**
- Hints browser to optimize these properties
- Creates separate compositor layer
- Enables hardware acceleration
- Smoother animations at 60 FPS

### GPU-Accelerated Properties

✅ **Used (GPU-accelerated):**
- `opacity`
- `transform: translateY()`
- `transform: rotateX()`

❌ **Avoided (CPU-bound):**
- `top`, `left`, `margin`
- `width`, `height`
- `filter` (can be slow on many elements)

### Perspective for 3D

```css
perspective: '1000px'
```

**Purpose:**
- Enables 3D transforms (rotationX)
- Creates depth perception
- Makes rotation effect more dramatic

## Synchronization with Other Elements

### Complete System Timeline

```
0.0s ────────────────────────────────────────────────── 1.0s
│                                                         │
├─ Text Fade Out (staggered) ──────┐                     │
│  (0.0s → 0.4s)                   │                     │
│                                  ▼                     │
│                        Text Change (0.4s)              │
│                                  │                     │
│                                  ▼                     │
│                  Text Fade In (staggered) ────────────┤
│                  (0.4s → 1.0s)                         │
│                                                        │
├─ Basketball Color: Shader interpolation ──────────────┤
│  (0.0s → 0.8s)                                         │
│                                                        │
├─ Price Display: Color transition ─────────────────────┤
│  (0.0s → 0.8s)                                         │
│                                                        │
├─ UI Borders: Background color ────────────────────────┤
│  (0.0s → 0.8s)                                         │
│                                                        │
└─ Scene Lighting: Rim light color ─────────────────────┤
   (0.0s → 0.8s)                                         │
```

**Note:** Text animation takes slightly longer (1.0s) than other elements (0.8s) to allow for the staggered reveal effect.

## Visual Effect Comparison

### Before (Simple Fade)

```
SPAING          [blur]          NOCTURNE
  ▓▓▓▓▓▓         ░░░░            ▓▓▓▓▓▓▓▓
  
All letters fade together (boring)
```

### After (Staggered Reveal)

```
SPAING                          NOCTURNE
S▓P▓A▓I▓N▓G▓  →  ░░░░░░  →  N▓O▓C▓T▓U▓R▓N▓E▓
│ │ │ │ │ │                  │ │ │ │ │ │ │ │
└─┴─┴─┴─┴─┴─ Sequential      └─┴─┴─┴─┴─┴─┴─┴─ Sequential
             fade out                          fade in

Each letter animates individually (cinematic!)
```

## Code Architecture

### Component Structure

```javascript
AnimatedBrandText
├── containerRef (outer wrapper)
├── lettersRef[] (array of letter refs)
├── splitTextIntoLetters() (text → spans)
└── useEffect() (GSAP animation)
    ├── Phase 1: Fade out stagger
    ├── Phase 2: Reset position
    └── Phase 3: Fade in stagger
```

### React Refs Management

```javascript
const lettersRef = useRef([]);

// Assign refs during render
ref={el => lettersRef.current[index] = el}

// Use refs in animation
const letters = lettersRef.current.filter(el => el !== null);
gsap.to(letters, { ... });
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| GSAP Stagger | ✅ | ✅ | ✅ | ✅ |
| 3D Transforms | ✅ | ✅ | ✅ | ✅ |
| willChange | ✅ | ✅ | ✅ | ✅ |
| Perspective | ✅ | ✅ | ✅ | ✅ |

## Testing the Animation

### Manual Test Steps

1. **Start dev server:**
   ```bash
   cd slam-dunk-basketball
   npm run dev
   ```

2. **Test staggered animation:**
   - Click right arrow in color picker
   - Watch "SPAING" letters fade out one by one
   - Observe text change to "NOCTURNE"
   - See "NOCTURNE" letters float up sequentially
   - Verify smooth, wave-like effect

3. **Verify all themes:**
   - Gold → "SPAING" (6 letters)
   - Midnight → "NOCTURNE" (8 letters)
   - Crimson → "INFERNO" (7 letters)
   - Forest → "VERDANT" (7 letters)
   - Platinum → "ZENITH" (6 letters)

4. **Check performance:**
   - Animation maintains 60 FPS
   - No stuttering or lag
   - Smooth on mobile devices

## Advanced Stagger Techniques

### Different Stagger Patterns

```javascript
// From center outward
stagger: {
  each: 0.03,
  from: 'center',
}

// Random order
stagger: {
  each: 0.03,
  from: 'random',
}

// From edges inward
stagger: {
  each: 0.03,
  from: 'edges',
}

// Total time distribution
stagger: {
  amount: 0.5,  // Total 0.5s for all letters
  from: 'start',
}
```

### Custom Stagger Function

```javascript
stagger: (index, target, list) => {
  // Custom delay calculation
  return index * 0.03;
}
```

## Future Enhancements

### Potential Additions

1. **Scroll-triggered animation:**
   ```javascript
   ScrollTrigger.create({
     trigger: '.hero-brand-text',
     start: 'top center',
     onEnter: () => animateLetters(),
   });
   ```

2. **Color wave effect:**
   ```javascript
   stagger: {
     each: 0.03,
     onStart: function() {
       gsap.to(this.targets(), {
         color: theme.accent,
         duration: 0.2,
       });
     },
   }
   ```

3. **Elastic bounce:**
   ```javascript
   ease: 'elastic.out(1, 0.5)'
   ```

4. **Particle trails:**
   ```javascript
   // Add particle effect behind each letter
   ```

## Conclusion

The **character-by-character staggered reveal** creates a:

✨ **Cinematic, professional effect**  
✨ **Smooth, wave-like animation**  
✨ **Sequential entrance (one by one)**  
✨ **Perfect synchronization with ball color**  
✨ **Video game-like polish**  
✨ **60 FPS performance**

Each letter floats into place with **professional easing**, creating the exact "smooth animation" effect from the reference site where text appears **one by one** and glides into position.
