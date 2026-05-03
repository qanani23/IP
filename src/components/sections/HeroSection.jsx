import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { COPY } from '../../utils/copy.js';
import { COLOR, Z } from '../../config/tokens.js';
import CartButton from '../CartButton.jsx';
import AnimatedBrandText from '../AnimatedBrandText.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { HOUSES } from '../../data/houseData.js';
import { motionState } from '../../utils/motionState.js';

// ─── HeroSection ──────────────────────────────────────────────────────────────
// Faithful to the reference image:
//  • Giant house name fills the viewport as background watermark text
//  • 3D house model floats in front of the text
//  • Top-left: play button + "Virtual Tour / video"
//  • Right edge: vertical counter "01/05" rotated
//  • Bottom-left: large price + spec line
//  • Bottom-center: wide accent CTA button
//  • Bottom-right: two circular arrow buttons

const THEME_ORDER = ['gold', 'colonial', 'garden', 'sky', 'farmhouse'];

export default function HeroSection() {
  const sectionRef      = useRef(null);
  const scrollPromptRef = useRef(null);
  const priceRef        = useRef(null);
  const dragOverlayRef  = useRef(null);
  const [showDragHint, setShowDragHint] = useState(true);
  const dragState = useRef({ active: false, lastX: 0, lastY: 0, velX: 0, velY: 0, flickId: null });

  let themeContext;
  try { themeContext = useTheme(); } catch { themeContext = null; }

  const activeIndex    = THEME_ORDER.indexOf(themeContext?.activeTheme ?? 'gold');
  const activeHouse    = HOUSES[activeIndex] ?? HOUSES[0];
  const accentColor    = themeContext?.theme?.uiAccent || '#c9a84c';
  const isTransitioning = themeContext?.isTransitioning ?? false;

  const handlePrev = () => { if (!isTransitioning) themeContext?.prevTheme?.(); };
  const handleNext = () => { if (!isTransitioning) themeContext?.nextTheme?.(); };

  // Entrance animation on mount
  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-animate]');
    gsap.fromTo(els,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, delay: 0.5, ease: 'expo.out' }
    );
  }, []);

  // Animate price on house change
  useEffect(() => {
    if (!priceRef.current) return;
    gsap.fromTo(priceRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }
    );
  }, [activeHouse.id]);

  // Hide scroll prompt on first scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10 && scrollPromptRef.current) {
        gsap.to(scrollPromptRef.current, { opacity: 0, duration: 0.3 });
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Drag-to-rotate on the hero 3D model ────────────────────────────────────
  // A transparent overlay sits over the center of the hero. Dragging it
  // writes directly to motionState.rotation — same object useSceneMotion reads.
  // Flick physics: velocity decays after pointer-up for a natural feel.
  useEffect(() => {
    const overlay = dragOverlayRef.current;
    if (!overlay) return;
    const ds = dragState.current;

    const onDown = (e) => {
      ds.active = true;
      ds.lastX = e.clientX;
      ds.lastY = e.clientY;
      ds.velX = 0;
      ds.velY = 0;
      if (ds.flickId) cancelAnimationFrame(ds.flickId);
      overlay.style.cursor = 'grabbing';
      overlay.setPointerCapture(e.pointerId);
      setShowDragHint(false);
    };

    const onMove = (e) => {
      if (!ds.active) return;
      const dx = e.clientX - ds.lastX;
      const dy = e.clientY - ds.lastY;
      ds.lastX = e.clientX;
      ds.lastY = e.clientY;
      const s = 0.007;
      motionState.rotation.y += dx * s;
      motionState.rotation.x += dy * s * 0.4;
      motionState.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, motionState.rotation.x));
      ds.velX = dx * s;
      ds.velY = dy * s * 0.4;
    };

    const onUp = () => {
      if (!ds.active) return;
      ds.active = false;
      overlay.style.cursor = 'grab';
      const flick = () => {
        ds.velX *= 0.90;
        ds.velY *= 0.90;
        motionState.rotation.y += ds.velX;
        motionState.rotation.x += ds.velY;
        motionState.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, motionState.rotation.x));
        if (Math.abs(ds.velX) > 0.0003 || Math.abs(ds.velY) > 0.0003) {
          ds.flickId = requestAnimationFrame(flick);
        }
      };
      ds.flickId = requestAnimationFrame(flick);
    };

    overlay.addEventListener('pointerdown', onDown);
    overlay.addEventListener('pointermove', onMove);
    overlay.addEventListener('pointerup',   onUp);
    overlay.addEventListener('pointerleave', onUp);

    return () => {
      overlay.removeEventListener('pointerdown', onDown);
      overlay.removeEventListener('pointermove', onMove);
      overlay.removeEventListener('pointerup',   onUp);
      overlay.removeEventListener('pointerleave', onUp);
      if (ds.flickId) cancelAnimationFrame(ds.flickId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      aria-label="Hero"
      style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: Z.content,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <h1 className="visually-hidden">{activeHouse.name} — Abby-Key Real Estate</h1>

      {/* ── Giant house name watermark — fills viewport like "SPAING" ──────── */}
      {/* The 3D model floats in front of this text */}
      <AnimatedBrandText />

      {/* ── Drag overlay — transparent hit area over the 3D model ────────── */}
      {/* Sits in the center of the viewport where the house model lives.    */}
      {/* Pointer events are captured here; everything else stays clickable. */}
      <div
        ref={dragOverlayRef}
        aria-label="Drag to rotate the house model"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '55vmin',
          height: '55vmin',
          zIndex: 15,
          cursor: 'grab',
          pointerEvents: 'auto',
          borderRadius: '50%',   // circular hit area matching the model footprint
        }}
      />

      {/* ── Drag hint — fades in then out ────────────────────────────────── */}
      {showDragHint && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, calc(-50% + 120px))',
            zIndex: 16,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '6px 14px',
            animation: 'heroHintFade 4s ease forwards',
          }}
        >
          {/* Drag icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M4 4l3-3 3 3M4 10l3 3 3-3M4 4L1 7l3 3M10 4l3 3-3 3" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.07em',
            whiteSpace: 'nowrap',
          }}>
            Drag to rotate
          </span>
        </div>
      )}

      {/* ── Top-left: Virtual Tour button ────────────────────────────────── */}
      <a
        data-animate
        href="https://youtu.be/R_9-JElwV2A?si=6x-z1GuiM4gJrSyg"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch Virtual Tour video on YouTube"
        style={{
          position: 'absolute',
          top: '88px',
          left: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto',
          zIndex: 20,
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        {/* Play circle */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          backdropFilter: 'blur(8px)',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 1.5L10 6L2.5 10.5V1.5Z" fill="rgba(255,255,255,0.8)"/>
          </svg>
        </div>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 500, lineHeight: 1.2 }}>
            Virtual Tour
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', lineHeight: 1.2 }}>
            video
          </div>
        </div>
      </a>

      {/* ── Right edge: vertical counter ─────────────────────────────────── */}
      <div
        data-animate
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <span style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.35)',
          fontWeight: 500,
        }}>
          {String(activeIndex + 1).padStart(2, '0')}/{String(HOUSES.length).padStart(2, '0')}
        </span>
      </div>

      {/* ── Dot selector — right side, vertical ──────────────────────────── */}
      <div
        data-animate
        style={{
          position: 'absolute',
          right: '28px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'auto',
          zIndex: 20,
          marginTop: '32px',
        }}
      >
        {HOUSES.map((house, i) => (
          <button
            key={house.id}
            onClick={() => themeContext?.switchTheme?.(THEME_ORDER[i])}
            aria-label={`View ${house.name}`}
            title={house.name}
            style={{
              width: '3px',
              height: i === activeIndex ? 22 : 7,
              borderRadius: '2px',
              background: i === activeIndex ? accentColor : 'rgba(255,255,255,0.18)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        ))}
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 48px 44px',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        {/* ── Price + spec — bottom left ─────────────────────────────────── */}
        <div data-animate ref={priceRef} style={{ pointerEvents: 'none' }}>
          {/* Large price — matches "$34.99" in reference */}
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '52px',
            fontWeight: 500,
            color: accentColor,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '8px',
            transition: 'color 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {activeHouse.price}
          </div>
          {/* Spec line — matches "SIZE: 29.5" • OFFICIAL" */}
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
          }}>
            {activeHouse.beds} BED&nbsp;&nbsp;•&nbsp;&nbsp;{activeHouse.baths} BATH&nbsp;&nbsp;•&nbsp;&nbsp;{activeHouse.sqft} SQ FT
          </div>
        </div>

        {/* ── Wide CTA button — bottom center ───────────────────────────── */}
        {/* Matches the wide orange "ADD TO CART" button in reference */}
        <div
          data-animate
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '44px',
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
          }}
        >
          <CartButton hero />
        </div>

        {/* ── Circular arrow buttons — bottom right ─────────────────────── */}
        {/* Matches the two circular ‹ › buttons in reference */}
        <div
          data-animate
          style={{
            display: 'flex',
            gap: '10px',
            pointerEvents: 'auto',
          }}
        >
          {[
            { label: 'Previous property', icon: '‹', fn: handlePrev },
            { label: 'Next property',     icon: '›', fn: handleNext },
          ].map(({ label, icon, fn }) => (
            <button
              key={label}
              onClick={fn}
              aria-label={label}
              disabled={isTransitioning}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(8px)',
                color: 'rgba(255,255,255,0.8)',
                cursor: isTransitioning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                lineHeight: 1,
                opacity: isTransitioning ? 0.4 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isTransitioning) {
                  e.currentTarget.style.background = accentColor;
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.color = '#000';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scroll prompt ─────────────────────────────────────────────────── */}
      <div
        ref={scrollPromptRef}
        className="scroll-prompt-arrow"
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 2v10M3 8l4 4 4-4" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <style>{`
        @keyframes heroHintFade {
          0%   { opacity: 0; transform: translate(-50%, calc(-50% + 124px)); }
          15%  { opacity: 1; transform: translate(-50%, calc(-50% + 120px)); }
          75%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (max-width: 1199px) {
          .hero-section [style*="padding: 0 48px"] { padding: 0 32px 44px !important; }
          .hero-section [style*="left: 48px"] { left: 32px !important; }
        }
        @media (max-width: 767px) {
          .hero-section [style*="padding: 0 48px"] { padding: 0 20px 80px !important; }
          .hero-section [style*="left: 48px"] { left: 20px !important; }
          .hero-section [style*="right: 28px"] { display: none !important; }
          .hero-section [style*="right: 20px"] { display: none !important; }
        }
      `}</style>
    </section>
  );
}
