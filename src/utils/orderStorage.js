// ─── Order Storage ────────────────────────────────────────────────────────────
// Persists the last placed order to localStorage so the Confirmation page
// can display order details even after a page refresh.
// The last order is overwritten on each new purchase.

const ORDER_KEY = 'abby-key-last-order';

/**
 * Persists the last order snapshot to localStorage.
 * @param {{
 *   orderId: string,
 *   items: Array,
 *   subtotal: number,
 *   total: number,
 *   shippingAddress: object,
 *   placedAt: string  // ISO timestamp
 * }} order
 */
export function persistLastOrder(order) {
  try {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

/**
 * Loads the last order from localStorage.
 * Returns null if no order exists or data is corrupted.
 * @returns {object|null}
 */
export function loadLastOrder() {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Basic shape validation
    if (!parsed || typeof parsed.orderId !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Removes the last order from localStorage.
 */
export function clearLastOrder() {
  try {
    localStorage.removeItem(ORDER_KEY);
  } catch {
    // Fail silently
  }
}
