// ─── Products API ─────────────────────────────────────────────────────────────
// Fake API layer for product data. Simulates network latency.
// Replace the internals here when connecting to a real backend —
// all pages import from this module, never from productData.js directly.

import { PRODUCTS, getProductById } from '../data/productData.js';

/** Simulates a network delay between min and max ms */
function delay(min = 200, max = 400) {
  return new Promise((resolve) =>
    setTimeout(resolve, min + Math.random() * (max - min))
  );
}

/**
 * Fetches all products.
 * @returns {Promise<Array>} Shallow copy of the PRODUCTS array
 */
export async function fetchProducts() {
  await delay(200, 400);
  return PRODUCTS.map((p) => ({ ...p }));
}

/**
 * Fetches a single product by id.
 * @param {string} id
 * @returns {Promise<object>}
 * @throws {Error} if product not found
 */
export async function fetchProductById(id) {
  await delay(200, 400);
  const product = getProductById(id);
  if (!product) {
    throw new Error(`Product not found: ${id}`);
  }
  return { ...product };
}
