// ─── useDebounce ──────────────────────────────────────────────────────────────
// Returns a debounced version of the given value.
// The debounced value only updates after `delay` ms have elapsed
// since the last change. Clears the timeout on cleanup.
//
// Used for: shop search (300ms), promo code (300ms), quantity input (200ms)

import { useState, useEffect } from 'react';

/**
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if value changes before delay elapses
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
