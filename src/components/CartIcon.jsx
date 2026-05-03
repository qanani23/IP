import { forwardRef } from 'react';
import { COPY } from '../utils/copy.js';
import { COLOR, Z } from '../config/tokens.js';

// ─── CartIcon ─────────────────────────────────────────────────────────────────
// Nav cart icon button. Forwarded ref used as 2D landing target for CartAnimation.
// aria-label from COPY. z-index: nav layer.

const CartIcon = forwardRef(function CartIcon(props, ref) {
  return (
    <button
      ref={ref}
      data-cart-icon
      aria-label={COPY.cartAriaLabel}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '48px',
        minHeight: '48px',
        color: COLOR.textPrimary,
        zIndex: Z.nav,
        willChange: 'transform',
      }}
    >
      {/* SVG cart icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    </button>
  );
});

export default CartIcon;
