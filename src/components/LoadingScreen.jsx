import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { DURATION, Z } from '../config/tokens.js';

// ─── LoadingScreen ────────────────────────────────────────────────────────────
// Full-viewport loading overlay with Abby-Key branding.
// Animated progress bar + house icon. Fades out when 3D scene is ready.

export default function LoadingScreen({ onReady }) {
  const wrapperRef  = useRef(null);
  const progressRef = useRef(null);
  const dotsRef     = useRef([]);

  // Animate progress bar to ~80% while loading
  useEffect(() => {
    if (!progressRef.current) return;
    const tween = gsap.to(progressRef.current, {
      scaleX: 0.8,
      duration: 2.2,
      ease: 'power2.out',
      transformOrigin: 'left center',
    });
    return () => tween.kill();
  }, []);

  // Animate dots
  useEffect(() => {
    const dots = dotsRef.current.filter(Boolean);
    if (!dots.length) return;
    const tween = gsap.to(dots, {
      opacity: 1,
      y: -4,
      duration: 0.5,
      stagger: { each: 0.15, repeat: -1, yoyo: true },
      ease: 'power2.inOut',
    });
    return () => tween.kill();
  }, []);

  // Called by parent when 3D scene is ready
  useEffect(() => {
    if (!onReady) return;
    const complete = () => {
      if (!wrapperRef.current || !progressRef.current) return;
      gsap.to(progressRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out',
        transformOrigin: 'left center',
        onComplete: () => {
          gsap.to(wrapperRef.current, {
            opacity: 0,
            duration: DURATION.loadingFade / 1000,
            ease: 'power2.out',
            onComplete: () => {
              if (wrapperRef.current) wrapperRef.current.style.display = 'none';
            },
          });
        },
      });
    };
    const timer = setTimeout(complete, 100);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#080808',
        zIndex: Z.loading,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0',
      }}
    >
      {/* House icon */}
      <svg
        width="48" height="48" viewBox="0 0 48 48" fill="none"
        style={{ marginBottom: '24px', opacity: 0.9 }}
        aria-hidden="true"
      >
        <path d="M6 24L24 8L42 24" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="12" y="24" width="24" height="18" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" rx="1"/>
        <rect x="20" y="30" width="8" height="12" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" rx="1"/>
        <rect x="14" y="27" width="6" height="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" rx="0.5"/>
        <rect x="28" y="27" width="6" height="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" rx="0.5"/>
      </svg>

      {/* Brand name */}
      <div style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: '28px',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: '#ffffff',
        marginBottom: '6px',
      }}>
        ABBY-KEY
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
        marginBottom: '40px',
      }}>
        Real Estate
      </div>

      {/* Progress bar track */}
      <div style={{
        width: '160px',
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '1px',
        overflow: 'hidden',
        marginBottom: '20px',
      }}>
        <div
          ref={progressRef}
          style={{
            width: '100%',
            height: '100%',
            background: 'var(--ui-accent, #c9a84c)',
            borderRadius: '1px',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={el => dotsRef.current[i] = el}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              opacity: 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
