// ─── Color Picker ─────────────────────────────────────────────────────────────
// Bottom-right UI control for cycling through basketball color themes.
// Triggers smooth GSAP transitions across 3D scene and 2D UI.
// Includes visual indicators.

import { useTheme } from '../context/ThemeContext.jsx';
import { init as initAudio, playCartSound } from '../utils/audioEngine.js';
import { COLOR, SPACE, RADIUS, Z, FONT_SIZE } from '../config/tokens.js';

export default function ColorPicker() {
  // Try to get theme context, return null if not available
  let themeContext;
  try {
    themeContext = useTheme();
  } catch {
    // ThemeProvider not available, don't render
    return null;
  }

  const { theme, themes, nextTheme, prevTheme, activeTheme, isTransitioning } = themeContext;

  const handleNext = () => {
    if (isTransitioning) return;
    nextTheme();
    // Initialize audio on first interaction, then play sound
    initAudio();
    playCartSound();
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    prevTheme();
    initAudio();
    playCartSound();
  };

  const themeArray = Object.values(themes);
  const currentIndex = themeArray.findIndex(t => t.id === activeTheme);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: SPACE[6],
        right: SPACE[6],
        zIndex: Z.content,
        display: 'flex',
        alignItems: 'center',
        gap: SPACE[3],
        pointerEvents: 'auto',
      }}
    >
      {/* Left arrow - Previous theme */}
      <button
        onClick={handlePrev}
        disabled={isTransitioning}
        aria-label="Previous property"
        style={{
          width: 48,
          height: 48,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.uiAccent}40`,
          borderRadius: RADIUS.md,
          color: theme.uiAccent,
          fontSize: 24,
          cursor: isTransitioning ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          opacity: isTransitioning ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isTransitioning) {
            e.currentTarget.style.background = `${theme.uiAccent}20`;
            e.currentTarget.style.transform = 'translateX(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        ←
      </button>

      {/* Color indicator dots */}
      <div
        style={{
          display: 'flex',
          gap: SPACE[2],
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: `${SPACE[2]}px ${SPACE[3]}px`,
          borderRadius: RADIUS.md,
          border: `1px solid ${theme.uiAccent}40`,
          transition: 'border-color 0.8s ease',
        }}
      >
        {themeArray.map((t, index) => (
          <div
            key={t.id}
            style={{
              width: index === currentIndex ? 8 : 6,
              height: index === currentIndex ? 8 : 6,
              borderRadius: '50%',
              background: index === currentIndex ? theme.uiAccent : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Right arrow - Next theme */}
      <button
        onClick={handleNext}
        disabled={isTransitioning}
        aria-label="Next property"
        style={{
          width: 48,
          height: 48,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.uiAccent}40`,
          borderRadius: RADIUS.md,
          color: theme.uiAccent,
          fontSize: 24,
          cursor: isTransitioning ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          opacity: isTransitioning ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isTransitioning) {
            e.currentTarget.style.background = `${theme.uiAccent}20`;
            e.currentTarget.style.transform = 'translateX(2px)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        →
      </button>

      {/* Theme name label (above controls) */}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: SPACE[2],
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: `${SPACE[2]}px ${SPACE[3]}px`,
          borderRadius: RADIUS.md,
          fontSize: FONT_SIZE.caption.desktop,
          color: theme.uiAccent,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'color 0.8s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {theme.name}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .color-picker-container {
            bottom: ${SPACE[4]}px !important;
            right: ${SPACE[4]}px !important;
          }
        }
      `}</style>
    </div>
  );
}
