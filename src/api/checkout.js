// ─── Checkout API ─────────────────────────────────────────────────────────────
// Fake API layer for order submission. Simulates realistic processing time
// and a ~20% payment failure rate to test error handling.
// Replace the internals here when connecting to a real payment backend.

/**
 * Submits an order. Simulates 1.5–2s processing time.
 * Rejects with { code: 'PAYMENT_FAILED' } approximately 20% of the time.
 *
 * @param {object} orderData - { items, shipping, payment }
 * @returns {Promise<{ orderId: string }>}
 * @throws {{ code: 'PAYMENT_FAILED', message: string }}
 */
export async function submitOrder(orderData) { // eslint-disable-line no-unused-vars
  // Simulate realistic processing delay: 1500–2000ms
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 500)
  );

  // Simulate ~20% payment failure rate
  if (Math.random() < 0.2) {
    throw {
      code:    'PAYMENT_FAILED',
      message: 'Your payment could not be processed. Please check your card details and try again.',
    };
  }

  // Generate a unique order ID
  const orderId = `SD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return { orderId };
}
