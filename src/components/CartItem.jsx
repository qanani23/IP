// ─── CartItem ─────────────────────────────────────────────────────────────────
// Single cart item row with image, details, quantity controls, and remove button.
// Horizontal layout: 80×80 image | name + SKU + price | qty controls | remove
// All buttons meet 48×48px minimum touch target.
// Wrapped in React.memo — only re-renders when item props change.

import { memo } from 'react';
import ProductImage from './ProductImage.jsx';
import { COLOR, SPACE, RADIUS, FONT_SIZE, LAYOUT } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';

function CartItemComponent({ item, onUpdateQuantity, onRemove }) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const decreaseDisabled = item.quantity === 1;
  const increaseDisabled = item.quantity >= item.stock;

  return (
    <div
      style={{
        display:       'flex',
        gap:           SPACE[4],
        alignItems:    'center',
        padding:       `${SPACE[4]}px 0`,
        borderBottom:  `1px solid rgba(255, 255, 255, 0.1)`,
      }}
    >
      {/* Product Image */}
      <div style={{ flexShrink: 0 }}>
        <ProductImage
          src={item.image}
          alt={item.name}
          borderRadius={RADIUS.md}
          style={{ width: 80, height: 80 }}
        />
      </div>

      {/* Product Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            fontSize:     FONT_SIZE.body.desktop,
            fontWeight:   600,
            color:        COLOR.textPrimary,
            margin:       0,
            marginBottom: SPACE[1],
          }}
        >
          {item.name}
        </h3>
        <p
          style={{
            fontSize: FONT_SIZE.caption.desktop,
            color:    COLOR.textSecondary,
            margin:   0,
          }}
        >
          {item.sku && `${item.sku} · `}${`$${item.price.toFixed(2)}`}
        </p>
      </div>

      {/* Quantity Controls */}
      <div
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        SPACE[2],
        }}
      >
        <button
          onClick={handleDecrease}
          disabled={decreaseDisabled}
          aria-label={COPY.a11y.decreaseQty}
          style={{
            minWidth:       LAYOUT.minTouchTarget,
            minHeight:      LAYOUT.minTouchTarget,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     decreaseDisabled ? COLOR.bgSurface : COLOR.bgElevated,
            border:         `1px solid ${decreaseDisabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius:   RADIUS.md,
            color:          decreaseDisabled ? COLOR.textMuted : COLOR.textPrimary,
            cursor:         decreaseDisabled ? 'not-allowed' : 'pointer',
            fontSize:       FONT_SIZE.body.desktop,
            fontWeight:     600,
            padding:        0,
            transition:     'all 200ms ease',
          }}
        >
          −
        </button>

        <span
          style={{
            fontSize:   FONT_SIZE.body.desktop,
            color:      COLOR.textPrimary,
            fontWeight: 600,
            minWidth:   32,
            textAlign:  'center',
          }}
        >
          {item.quantity}
        </span>

        <button
          onClick={handleIncrease}
          disabled={increaseDisabled}
          aria-label={COPY.a11y.increaseQty}
          style={{
            minWidth:       LAYOUT.minTouchTarget,
            minHeight:      LAYOUT.minTouchTarget,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     increaseDisabled ? COLOR.bgSurface : COLOR.bgElevated,
            border:         `1px solid ${increaseDisabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius:   RADIUS.md,
            color:          increaseDisabled ? COLOR.textMuted : COLOR.textPrimary,
            cursor:         increaseDisabled ? 'not-allowed' : 'pointer',
            fontSize:       FONT_SIZE.body.desktop,
            fontWeight:     600,
            padding:        0,
            transition:     'all 200ms ease',
          }}
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        aria-label={COPY.a11y.removeItem(item.name)}
        style={{
          minWidth:       LAYOUT.minTouchTarget,
          minHeight:      LAYOUT.minTouchTarget,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'transparent',
          border:         `1px solid rgba(255,255,255,0.1)`,
          borderRadius:   RADIUS.md,
          color:          COLOR.textSecondary,
          cursor:         'pointer',
          fontSize:       FONT_SIZE.caption.desktop,
          padding:        0,
          transition:     'all 200ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = COLOR.accentOrange;
          e.currentTarget.style.color = COLOR.accentOrange;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.color = COLOR.textSecondary;
        }}
      >
        {COPY.cart.remove}
      </button>
    </div>
  );
}

const CartItem = memo(CartItemComponent);
export default CartItem;
