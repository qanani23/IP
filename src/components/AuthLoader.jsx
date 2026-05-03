// ─── AuthLoader ───────────────────────────────────────────────────────────────
// Shown during two moments:
//   1. SSO callback — while Clerk processes the OAuth token from GitHub/Google
//   2. App boot — while Clerk resolves the user's auth state on first load
//
// Matches the app's existing LoadingScreen aesthetic: dark bg, house icon,
// brand name, animated progress bar, bouncing dots.

import { useEffect, useRef } from 'react';

export default function AuthLoader({ message = 'Signing you in…' }) {
  const barRef  = useRef(null);
  const dotsRef = useRef([]);

  // Animate the progress bar from 0 → 75% with a slow ease, suggesting work
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // Start at 0
    bar.style.transform = 'scaleX(0)';

    // Kick off the animation on next frame so the initial state is painted first
    const raf = requestAnimationFrame(() => {
      bar.style.transition = 'transform 2.8s cubic-bezier(0.16, 1, 0.3, 1)';
      bar.style.transform  = 'scaleX(0.75)';
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  // Staggered bouncing dots using CSS animation delays
  const dotDelays = [0, 160, 320];

  return (
    <div
      role="status"
      aria-label={message}
      style={{
        position:       'fixed',
        inset:          0,
        background:     '#080808',
        zIndex:         9999,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      {/* House icon — same as LoadingScreen */}
      <svg
        width="48" height="48" viewBox="0 0 48 48" fill="none"
        style={{ marginBottom: '24px', opacity: 0.85 }}
        aria-hidden="true"
      >
        <path
          d="M6 24L24 8L42 24"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="12" y="24" width="24" height="18"
          stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" rx="1"/>
        <rect x="20" y="30" width="8" height="12"
          stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="none" rx="1"/>
        <rect x="14" y="27" width="6" height="6"
          stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" rx="0.5"/>
        <rect x="28" y="27" width="6" height="6"
          stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" rx="0.5"/>
      </svg>

      {/* Brand */}
      <div style={{
        fontFamily:    '"Inter", system-ui, sans-serif',
        fontSize:      '26px',
        fontWeight:    800,
        letterSpacing: '-0.02em',
        color:         '#ffffff',
        marginBottom:  '5px',
      }}>
        ABBY-KEY
      </div>

      <div style={{
        fontFamily:    '"IBM Plex Mono", monospace',
        fontSize:      '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color:         'rgba(255,255,255,0.28)',
        marginBottom:  '36px',
      }}>
        Real Estate
      </div>

      {/* Progress bar */}
      <div style={{
        width:        '160px',
        height:       '1px',
        background:   'rgba(255,255,255,0.07)',
        borderRadius: '1px',
        overflow:     'hidden',
        marginBottom: '20px',
      }}>
        <div
          ref={barRef}
          style={{
            width:           '100%',
            height:          '100%',
            background:      '#e8500a',
            borderRadius:    '1px',
            transform:       'scaleX(0)',
            transformOrigin: 'left center',
            willChange:      'transform',
          }}
        />
      </div>

      {/* Bouncing dots */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '20px' }}>
        {dotDelays.map((delay, i) => (
          <div
            key={i}
            ref={el => { dotsRef.current[i] = el; }}
            style={{
              width:            '4px',
              height:           '4px',
              borderRadius:     '50%',
              background:       'rgba(255,255,255,0.25)',
              animation:        `authDotBounce 1.1s ease-in-out ${delay}ms infinite`,
            }}
          />
        ))}
      </div>

      {/* Status message */}
      <div style={{
        fontFamily:    '"IBM Plex Mono", monospace',
        fontSize:      '11px',
        letterSpacing: '0.1em',
        color:         'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
      }}>
        {message}
      </div>

      {/* Keyframes injected inline — no CSS file dependency */}
      <style>{`
        @keyframes authDotBounce {
          0%, 80%, 100% { transform: translateY(0);   opacity: 0.25; }
          40%            { transform: translateY(-5px); opacity: 0.7;  }
        }
      `}</style>
    </div>
  );
}
