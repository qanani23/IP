import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { COPY } from '../utils/copy.js';
import { SHADOW, COLOR, RADIUS, DURATION, EASE_GSAP, Z } from '../config/tokens.js';
import { getBallScreenPosition, getCartIconPosition } from '../utils/projectionSystem.js';
import * as audioEngine from '../utils/audioEngine.js';
import { motionState } from '../utils/motionState.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { HOUSES } from '../data/houseData.js';

// ─── CartButton ───────────────────────────────────────────────────────────────
// Primary CTA button. Min 48×48px touch target.
// On click: saves the active property to cart + triggers animation + audio.

const THEME_ORDER = ['gold', 'colonial', 'garden', 'sky', 'farmhouse'];

/** Convert a HOUSES entry into the shape CartContext expects */
function houseToProduct(house) {
  return {
    id:     house.id,
    name:   house.name,
    // price as a number (strip "$" and commas)
    price:  parseInt(house.price.replace(/[^0-9]/g, ''), 10),
    images: [],
    stock:  99,  // no stock limit — properties are always available
    sku:    `AK-${house.id.toUpperCase()}`,
  };
}

export default function CartButton({ pulse = false, hero = false, house = null }) {
  const buttonRef = useRef(null);
  const audioInitialized = useRef(false);

  const { addItem } = useCart();
  const { showToast } = useToast();

  // Resolve which house to save — explicit prop wins, else use active theme
  let themeContext;
  try { themeContext = useTheme(); } catch { themeContext = null; }
  const activeIndex   = THEME_ORDER.indexOf(themeContext?.activeTheme ?? 'gold');
  const resolvedHouse = house ?? HOUSES[activeIndex] ?? HOUSES[0];

  // Pulse animation for CartSection
  useEffect(() => {
    if (!pulse || !buttonRef.current) return;

    const tween = gsap.to(buttonRef.current, {
      boxShadow: '0 0 48px color-mix(in srgb, var(--ui-accent) 50%, transparent)',
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => tween.kill();
  }, [pulse]);

  const handleClick = () => {
    // ── 1. Save to cart ───────────────────────────────────────────────────────
    const product = houseToProduct(resolvedHouse);
    addItem(product, 1);
    showToast({
      message: `${resolvedHouse.name} saved!`,
      type: 'success',
      action: { label: COPY.toast.viewCart, href: '/cart' },
      dedupeKey: `add-${resolvedHouse.id}`,
    });

    // ── 2. Audio ──────────────────────────────────────────────────────────────
    if (!audioInitialized.current) {
      audioEngine.init();
      audioInitialized.current = true;
    }
    audioEngine.playCartSound();

    // ── 3. Visual animation ───────────────────────────────────────────────────
    runCartAnimation();
  };

  const runCartAnimation = () => {
    // ── Spec: "Add to Cart" physics sequence ─────────────────────────────────
    // 1. Launch: ball jumps up and right
    // 2. Arc: flies to top-right corner (x:6, y:8, z:-10)
    // 3. Morph: shrinks to 5% (scale:0.05) while spinning at double speed
    // 4. Impact: vanishes off-screen (audio plays via playCartSound above)
    // 5. Reset: teleport to y:-5, then spring back up with back.out(1.5)

    // Save current scroll-driven state so we can restore it
    const savedPos   = { ...motionState.position };
    const savedScale = motionState.scale;
    const savedRot   = { ...motionState.rotation };

    // Kill any in-progress cart tweens
    gsap.killTweensOf(motionState.position);
    gsap.killTweensOf(motionState.rotation);
    gsap.killTweensOf(motionState);

    // ── Step 1: Launch — jump up and right ───────────────────────────────────
    const launchTl = gsap.timeline({
      onComplete: () => {
        // ── Step 5: Reset — teleport below floor, spring back up ─────────────
        motionState.position.x = savedPos.x;
        motionState.position.y = -5;
        motionState.position.z = savedPos.z;
        motionState.scale = savedScale;
        motionState.rotation.x = savedRot.x;
        motionState.rotation.y = savedRot.y;
        motionState.rotation.z = savedRot.z;

        gsap.to(motionState.position, {
          y: savedPos.y,
          duration: 0.7,
          ease: 'back.out(1.5)',
        });
        gsap.to(motionState, {
          scale: savedScale,
          duration: 0.7,
          ease: 'back.out(1.5)',
        });
      },
    });

    // Launch: jump up-right first (brief)
    launchTl
      .to(motionState.position, {
        x: savedPos.x + 1.0,
        y: savedPos.y + 0.8,
        duration: 0.12,
        ease: 'power2.out',
      })
      // Arc: fly to top-right corner (x:6, y:8, z:-10) while shrinking to 5%
      .to(motionState.position, {
        x: 6,
        y: 8,
        z: -10,
        duration: 0.55,
        ease: 'power2.in',
      })
      .to(motionState, {
        scale: 0.05,
        duration: 0.55,
        ease: 'power2.in',
      }, '<')
      // Double-speed spin during arc
      .to(motionState.rotation, {
        y: savedRot.y + Math.PI * 8,
        duration: 0.55,
        ease: 'none',
      }, '<');

    // ── Proxy div arc + motion trail ─────────────────────────────────────────
    const canvas = document.querySelector('.scene-canvas-wrapper canvas');
    let startPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    if (canvas) {
      startPos = getBallScreenPosition(motionState, canvas);
    }

    const cartIconEl = document.querySelector('[data-cart-icon]');
    let endPos = { x: window.innerWidth - 60, y: 32 };
    if (cartIconEl) {
      endPos = getCartIconPosition({ current: cartIconEl });
    }

    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const arcHeight = Math.min(Math.abs(dy) * 0.5 + 80, 200);

    const PROXY_SIZE = 44;
    const TRAIL_COUNT = 10; // number of ghost trail orbs
    const duration = DURATION.cartAnimation / 1000;
    const midX = startPos.x + dx * 0.5;
    const midY = startPos.y + dy * 0.5 - arcHeight;

    // ── Trail orbs — staggered ghosts that follow the proxy path ─────────────
    // Each orb is a smaller, fading copy launched with a slight delay.
    const trailOrbs = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const delay = (i / TRAIL_COUNT) * duration * 0.35; // spread over first 35%
      const size  = PROXY_SIZE * (1 - i / TRAIL_COUNT) * 0.65; // shrink with index
      const alpha = (1 - i / TRAIL_COUNT) * 0.45;              // fade with index

      const orb = document.createElement('div');
      orb.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #ff9a5d, #e8500a);
        opacity: ${alpha};
        z-index: ${Z.cartProxy - 1};
        pointer-events: none;
        left: ${startPos.x - size / 2}px;
        top: ${startPos.y - size / 2}px;
        transform-origin: center center;
        will-change: transform, opacity, left, top;
      `;
      document.body.appendChild(orb);
      trailOrbs.push(orb);

      // Each orb follows the same bezier path but starts slightly later
      gsap.to(orb, {
        delay,
        duration: duration * 0.8,
        ease: 'power2.in',
        keyframes: [
          {
            left: midX - size / 2,
            top:  midY - size / 2,
            scale: 0.6,
            opacity: alpha * 0.7,
            duration: duration * 0.4,
            ease: 'power2.out',
          },
          {
            left: endPos.x - size / 2,
            top:  endPos.y - size / 2,
            scale: 0.05,
            opacity: 0,
            duration: duration * 0.4,
            ease: 'power2.in',
          },
        ],
        onComplete: () => orb.remove(),
      });
    }

    // ── Main proxy ball ───────────────────────────────────────────────────────
    const proxy = document.createElement('div');
    proxy.style.cssText = `
      position: fixed;
      width: ${PROXY_SIZE}px;
      height: ${PROXY_SIZE}px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #ff7a3d, #e8500a, #c04000);
      box-shadow: 0 4px 20px rgba(232,80,10,0.6);
      z-index: ${Z.cartProxy};
      pointer-events: none;
      left: ${startPos.x - PROXY_SIZE / 2}px;
      top: ${startPos.y - PROXY_SIZE / 2}px;
      transform-origin: center center;
      will-change: transform, opacity, left, top;
    `;
    document.body.appendChild(proxy);

    gsap.to(proxy, {
      duration,
      ease: EASE_GSAP.outExpo,
      keyframes: [
        {
          left: midX - PROXY_SIZE / 2,
          top:  midY - PROXY_SIZE / 2,
          scale: 0.7,
          duration: duration * 0.45,
          ease: 'power2.out',
        },
        {
          left: endPos.x - PROXY_SIZE / 2,
          top:  endPos.y - PROXY_SIZE / 2,
          scale: 0.08,
          duration: duration * 0.55,
          ease: 'power2.in',
        },
      ],
      onComplete: () => {
        proxy.remove();
        triggerCartIconPulse(endPos);
      },
    });
  };

  const triggerCartIconPulse = (endPos) => {
    const cartIconEl = document.querySelector('[data-cart-icon]');

    // ── Icon scale bounce ─────────────────────────────────────────────────────
    if (cartIconEl) {
      gsap.fromTo(
        cartIconEl,
        { scale: 1 },
        {
          scale: 1.3,
          duration: DURATION.cartIconPulse / 2000,
          yoyo: true,
          repeat: 1,
          ease: EASE_GSAP.spring,
        }
      );
    }

    // ── Impact ripple rings — 3 concentric rings expanding outward ────────────
    const ripplePos = endPos || { x: window.innerWidth - 60, y: 32 };
    const RING_COUNT = 3;

    for (let i = 0; i < RING_COUNT; i++) {
      const ring = document.createElement('div');
      const baseSize = 20;
      ring.style.cssText = `
        position: fixed;
        width: ${baseSize}px;
        height: ${baseSize}px;
        border-radius: 50%;
        border: 2px solid rgba(232, 80, 10, ${0.8 - i * 0.2});
        z-index: ${Z.cartProxy};
        pointer-events: none;
        left: ${ripplePos.x - baseSize / 2}px;
        top: ${ripplePos.y - baseSize / 2}px;
        transform-origin: center center;
        will-change: transform, opacity;
      `;
      document.body.appendChild(ring);

      gsap.fromTo(
        ring,
        { scale: 0.5, opacity: 0.8 - i * 0.2 },
        {
          scale: 3 + i * 0.8,
          opacity: 0,
          duration: 0.55 + i * 0.1,
          delay: i * 0.08,
          ease: 'power2.out',
          onComplete: () => ring.remove(),
        }
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      className="btn-primary cart-btn"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        minWidth: hero ? '320px' : '48px',
        minHeight: '52px',
        padding: hero ? '0 56px' : '14px 32px',
        height: hero ? '52px' : 'auto',
        background: 'var(--ui-accent, #c9a84c)',
        color: '#000000',
        border: 'none',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 150ms ease, background 0.8s ease',
        willChange: 'transform',
        whiteSpace: 'nowrap',
      }}
    >
      {COPY.cta}
    </button>
  );
}
