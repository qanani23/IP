// ─── Recently Viewed ─────────────────────────────────────────────────────────
// Tracks the last 5 product ids the user has viewed.
// Most recently viewed is always at index 0.
// Resilient to corrupted localStorage — returns [] on any error.

const STORAGE_KEY = 'abby-key-recently-viewed';
const MAX_ITEMS   = 5;

/**
 * Adds a product id to the recently viewed list.
 * Deduplicates and caps at MAX_ITEMS (most recent first).
 * @param {string} id
 */
export function addRecentlyViewed(id) {
  if (!id) return;
  try {
    const prev = getRecentlyViewed();
    // Remove existing occurrence, prepend new id, cap at MAX_ITEMS
    const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

/**
 * Returns the recently viewed product id list.
 * Returns [] if storage is empty or corrupted.
 * @returns {string[]}
 */
export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id) => typeof id === 'string');
  } catch {
    return [];
  }
}

/**
 * Clears the recently viewed list.
 */
export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently
  }
}
