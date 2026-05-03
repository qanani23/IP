// ─── Skeleton ─────────────────────────────────────────────────────────────────
// Shimmer loading placeholder. Mirrors the shape of the content it replaces.
// aria-hidden so screen readers skip it entirely.

import { COLOR, RADIUS } from '../config/tokens.js';

// Inject the shimmer keyframe once into the document
const SHIMMER_STYLE_ID = 'slam-dunk-skeleton-shimmer';
if (typeof document !== 'undefined' && !document.getElementById(SHIMMER_STYLE_ID)) {
  const style = document.createElement('style');
  style.id = SHIMMER_STYLE_ID;
  style.textContent = `
    @keyframes skeletonShimmer {
      from { background-position: -200% 0; }
      to   { background-position:  200% 0; }
    }
  `;
  document.head.appendChild(style);
}

/**
 * @param {{
 *   width?: string | number,
 *   height?: string | number,
 *   borderRadius?: string | number,
 *   style?: object,
 * }} props
 */
export default function Skeleton({
  width        = '100%',
  height       = 20,
  borderRadius = RADIUS.md,
  style        = {},
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(
          90deg,
          ${COLOR.bgSurface}  0%,
          ${COLOR.bgElevated} 50%,
          ${COLOR.bgSurface}  100%
        )`,
        backgroundSize: '200% 100%',
        animation:      'skeletonShimmer 1.5s infinite linear',
        flexShrink:     0,
        ...style,
      }}
    />
  );
}
