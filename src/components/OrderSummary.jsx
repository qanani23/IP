// ─── OrderSummary ─────────────────────────────────────────────────────────────
// Reusable order summary component showing subtotal, shipping, tax, promo, total.
// Optional promo code input with 300ms debounce.
// Used on both Cart and Checkout pages.

import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import { COLOR, SPACE, RADIUS, FONT_SIZE, LAYOUT } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';

export default function OrderSummary({
  subtotal,
  shipping = 0,
  tax = null,
  promoCode = null,
  promoDiscount = 0,
  showPromoInput = false,
  onApplyPromo = null,
}) {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);
  const [promoMessageType, setPromoMessageType] = useState(null);

  const debouncedPromoInput = useDebounce(promoInput, 300);

  const handleApplyPromo = () => {
    if (!debouncedPromoInput.trim()) {
      setPromoMessage(null);
      setPromoMessageType(null);
      return;
    }

    // Simple promo validation: "SLAM10" gives $3.50 discount
    if (debouncedPromoInput.toUpperCase() === 'SLAM10') {
      const discount = 3.50;
      if (onApplyPromo) {
        onApplyPromo(debouncedPromoInput.toUpperCase(), discount);
      }
      setPromoMessage(COPY.cart.promoApplied);
      setPromoMessageType('success');
    } else {
      setPromoMessage(COPY.cart.promoInvalid);
      setPromoMessageType('error');
    }
  };

  const total = Math.max(0, subtotal + shipping + (tax ?? 0) - promoDiscount);

  return (
    <div
      style={{
        background:   COLOR.bgSurface,
        borderRadius: RADIUS.lg,
        padding:      SPACE[5],
      }}
    >
      <h2
        style={{
          fontSize:     FONT_SIZE.h3.desktop,
          fontWeight:   600,
          color:        COLOR.textPrimary,
          margin:       0,
          marginBottom: SPACE[4],
        }}
      >
        {COPY.checkout.orderSummary}
      </h2>

      {/* Line Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACE[3] }}>
        {/* Subtotal */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textSecondary }}>
            {COPY.cart.subtotal}
          </span>
          <span style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textPrimary, fontWeight: 600 }}>
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {/* Shipping */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textSecondary }}>
            {COPY.cart.shipping}
          </span>
          <span style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textPrimary, fontWeight: 600 }}>
            {shipping === 0 ? COPY.cart.shippingFree : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {/* Tax */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textSecondary }}>
            {COPY.cart.tax}
          </span>
          <span style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textPrimary, fontWeight: 600 }}>
            {tax === null ? COPY.cart.taxCalc : `$${tax.toFixed(2)}`}
          </span>
        </div>

        {/* Promo Discount (only when applied) */}
        {promoCode && promoDiscount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.accentGold }}>
              {`Promo (${promoCode})`}
            </span>
            <span style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.accentGold, fontWeight: 600 }}>
              −${promoDiscount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: `${SPACE[2]}px 0` }} />

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: FONT_SIZE.h3.desktop, color: COLOR.textPrimary, fontWeight: 600 }}>
            {COPY.cart.total}
          </span>
          <span style={{ fontSize: FONT_SIZE.h3.desktop, color: COLOR.textPrimary, fontWeight: 600 }}>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Promo Code Input */}
      {showPromoInput && (
        <div style={{ marginTop: SPACE[5] }}>
          <div style={{ display: 'flex', gap: SPACE[2] }}>
            <input
              type="text"
              placeholder={COPY.cart.promoPlaceholder}
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyPromo();
                }
              }}
              style={{
                flex:          1,
                minHeight:     LAYOUT.minTouchTarget,
                background:    COLOR.bgElevated,
                border:        `1px solid rgba(255,255,255,0.1)`,
                borderRadius:  RADIUS.md,
                color:         COLOR.textPrimary,
                fontSize:      FONT_SIZE.body.desktop,
                padding:       `0 ${SPACE[3]}px`,
                outline:       'none',
              }}
            />
            <button
              onClick={handleApplyPromo}
              style={{
                minWidth:       LAYOUT.minTouchTarget,
                minHeight:      LAYOUT.minTouchTarget,
                background:     COLOR.accentOrange,
                border:         'none',
                borderRadius:   RADIUS.md,
                color:          COLOR.textPrimary,
                fontSize:       FONT_SIZE.body.desktop,
                fontWeight:     600,
                cursor:         'pointer',
                padding:        `0 ${SPACE[4]}px`,
                transition:     'opacity 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {COPY.cart.promoApply}
            </button>
          </div>

          {/* Promo Message */}
          {promoMessage && (
            <p
              style={{
                fontSize:   FONT_SIZE.caption.desktop,
                color:      promoMessageType === 'success' ? COLOR.accentGold : COLOR.accentOrange,
                margin:     `${SPACE[2]}px 0 0 0`,
              }}
            >
              {promoMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
