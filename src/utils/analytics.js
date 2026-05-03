// ─── Analytics Utility ───────────────────────────────────────────────────────
// Lightweight event tracking for the purchase funnel.
// In DEV_MODE: logs to console.
// In production: no-op (wire to gtag / Segment / etc. here when ready).
//
// Event contracts:
//   track('view_shop',          { productCount })
//   track('view_product',       { productId, productName, price })
//   track('view_cart',          { cartTotal, itemCount })
//   track('add_to_cart',        { productId, productName, quantity, price })
//   track('checkout_start',     { cartTotal, itemCount })
//   track('checkout_step',      { step })          — step: 2 or 3
//   track('purchase_complete',  { orderId, total, itemCount })

import { DEV_MODE } from '../config/debug.js';

const VALID_EVENTS = new Set([
  'view_shop',
  'view_product',
  'view_cart',
  'add_to_cart',
  'checkout_start',
  'checkout_step',
  'purchase_complete',
]);

/**
 * Fires an analytics event.
 * @param {string} eventName
 * @param {object} payload
 */
export function track(eventName, payload = {}) {
  if (!VALID_EVENTS.has(eventName)) {
    if (DEV_MODE) {
      console.warn(`[analytics] Unknown event: "${eventName}"`);
    }
    return;
  }

  if (DEV_MODE) {
    console.log('[analytics]', eventName, payload);
  }

  // Future: window.gtag?.('event', eventName, payload);
  // Future: analytics.track(eventName, payload);
}
