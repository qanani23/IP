import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { DURATION } from '../config/tokens.js';

// ─── TextReveal ───────────────────────────────────────────────────────────────
// Wraps children in a reveal animation triggered by IntersectionObserver.
// Animates opacity 0→1 and y 24→0 with stagger across direct children.
// Uses IntersectionObserver instead of ScrollTrigger to avoid conflicts
// with the scroll-driven ball animation timeline.

export default function TextReveal({ children, delay = 0, className = '' }) {
  const wrapperRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const elements = Array.from(wrapperRef.current.children);
    if (!elements.length) return;

    // Set initial state
    gsap.set(elements, { opacity: 0, y: 24 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          gsap.fromTo(
            elements,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.entrance / 1000,
              stagger: DURATION.stagger / 1000,
              delay: delay / 1000,
              ease: 'expo.out',
            }
          );
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  );
}
