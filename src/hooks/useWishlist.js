// ─── useWishlist ──────────────────────────────────────────────────────────────
// Wishlist state backed by localStorage.
// Toggling the same id N times: wishlisted if N is odd, not wishlisted if N is even.
// Resilient to corrupted localStorage — initialises to [] on any error.

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'abby-key-wishlist';

function loadWishlist() {
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

function saveWishlist(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

/**
 * Hook for managing the product wishlist.
 * @returns {{
 *   wishlist: string[],
 *   toggle: (id: string) => void,
 *   isWishlisted: (id: string) => boolean,
 *   clear: () => void
 * }}
 */
export function useWishlist() {
  const [wishlist, setWishlist] = useState(loadWishlist);

  const toggle = useCallback((id) => {
    setWishlist((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveWishlist(next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (id) => wishlist.includes(id),
    [wishlist]
  );

  const clear = useCallback(() => {
    setWishlist([]);
    saveWishlist([]);
  }, []);

  return { wishlist, toggle, isWishlisted, clear };
}
