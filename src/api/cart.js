// ─── Cart API ─────────────────────────────────────────────────────────────────
// Fake API layer for cart sync. Simulates a backend cart endpoint.
// Replace the internals here when connecting to a real backend.

/**
 * Simulates syncing the cart to a backend.
 * @param {Array} items - Current cart items
 * @returns {Promise<{ ok: boolean }>}
 */
export async function saveCart(items) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // In production: POST /api/cart with items payload
  return { ok: true };
}
