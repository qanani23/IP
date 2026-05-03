// ─── ProductImage ─────────────────────────────────────────────────────────────
// Product image with skeleton placeholder while loading and graceful fallback
// on error. Uses loading="lazy" for off-screen images.
// Wrapped in React.memo — only re-renders when src or alt changes.

import { useState, memo } from 'react';
import Skeleton from './Skeleton.jsx';
import { COLOR, RADIUS, FONT_SIZE, SPACE } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';

function ProductImageComponent({ src, alt = COPY.a11y.imageAlt, borderRadius = RADIUS.lg, style = {} }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);

  return (
    <div
      style={{
        position:     'relative',
        aspectRatio:  '1 / 1',
        borderRadius,
        overflow:     'hidden',
        background:   COLOR.bgSurface,
        ...style,
      }}
    >
      {/* Skeleton shown while loading */}
      {!loaded && !error && (
        <Skeleton
          width="100%"
          height="100%"
          borderRadius={0}
          style={{ position: 'absolute', inset: 0 }}
        />
      )}

      {/* Image */}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            display:    'block',
            opacity:    loaded ? 1 : 0,
            transition: 'opacity 300ms ease',
          }}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div
          style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            SPACE[2],
            color:          COLOR.textMuted,
            fontSize:       FONT_SIZE.caption.desktop,
            padding:        SPACE[3],
            textAlign:      'center',
          }}
        >
          {/* Basketball icon placeholder */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 0 20M2 12h20M12 2c-2.8 2.8-4 6-4 10s1.2 7.2 4 10" />
          </svg>
          <span>{alt}</span>
        </div>
      )}
    </div>
  );
}

const ProductImage = memo(ProductImageComponent);
export default ProductImage;
