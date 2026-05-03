// ─── Wishlist Property Tests ─────────────────────────────────────────────────
// Property-based tests for useWishlist hook correctness properties.
//
// P-S12: Toggling same id N times → wishlisted if N odd, not wishlisted if N even
// localStorage always valid JSON array after any toggle sequence

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWishlist } from './useWishlist.js';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'slam-dunk-wishlist';

function renderWishlistHook() {
  return renderHook(() => useWishlist());
}

// ─── Setup/Teardown ───────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

// ─── P-S12: Toggle Parity ─────────────────────────────────────────────────────

describe('P-S12: Toggle parity and localStorage validity', () => {
  it('wishlists item after 1 toggle (odd)', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-1');
    });

    expect(result.current.isWishlisted('product-1')).toBe(true);
    expect(result.current.wishlist).toContain('product-1');
  });

  it('removes item after 2 toggles (even)', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-1');
      result.current.toggle('product-1');
    });

    expect(result.current.isWishlisted('product-1')).toBe(false);
    expect(result.current.wishlist).not.toContain('product-1');
  });

  it('wishlists item after 3 toggles (odd)', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-1');
      result.current.toggle('product-1');
      result.current.toggle('product-1');
    });

    expect(result.current.isWishlisted('product-1')).toBe(true);
    expect(result.current.wishlist).toContain('product-1');
  });

  it('removes item after 4 toggles (even)', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-1');
      result.current.toggle('product-1');
      result.current.toggle('product-1');
      result.current.toggle('product-1');
    });

    expect(result.current.isWishlisted('product-1')).toBe(false);
    expect(result.current.wishlist).not.toContain('product-1');
  });

  it('wishlists item after 5 toggles (odd)', () => {
    const { result } = renderWishlistHook();

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.toggle('product-1');
      }
    });

    expect(result.current.isWishlisted('product-1')).toBe(true);
  });

  it('removes item after 10 toggles (even)', () => {
    const { result } = renderWishlistHook();

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.toggle('product-1');
      }
    });

    expect(result.current.isWishlisted('product-1')).toBe(false);
  });

  it('wishlists item after 99 toggles (odd)', () => {
    const { result } = renderWishlistHook();

    act(() => {
      for (let i = 0; i < 99; i++) {
        result.current.toggle('product-1');
      }
    });

    expect(result.current.isWishlisted('product-1')).toBe(true);
  });

  it('removes item after 100 toggles (even)', () => {
    const { result } = renderWishlistHook();

    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.toggle('product-1');
      }
    });

    expect(result.current.isWishlisted('product-1')).toBe(false);
  });

  it('maintains correct parity for multiple items independently', () => {
    const { result } = renderWishlistHook();

    act(() => {
      // Product A: 3 toggles (odd) → wishlisted
      result.current.toggle('product-a');
      result.current.toggle('product-a');
      result.current.toggle('product-a');

      // Product B: 4 toggles (even) → not wishlisted
      result.current.toggle('product-b');
      result.current.toggle('product-b');
      result.current.toggle('product-b');
      result.current.toggle('product-b');

      // Product C: 1 toggle (odd) → wishlisted
      result.current.toggle('product-c');
    });

    expect(result.current.isWishlisted('product-a')).toBe(true);
    expect(result.current.isWishlisted('product-b')).toBe(false);
    expect(result.current.isWishlisted('product-c')).toBe(true);
    expect(result.current.wishlist.length).toBe(2);
  });

  it('maintains parity across arbitrary toggle sequences', () => {
    const { result } = renderWishlistHook();

    const testCases = [
      { id: 'p1', toggles: 7, expected: true },   // odd
      { id: 'p2', toggles: 12, expected: false }, // even
      { id: 'p3', toggles: 1, expected: true },   // odd
      { id: 'p4', toggles: 20, expected: false }, // even
      { id: 'p5', toggles: 15, expected: true },  // odd
    ];

    act(() => {
      testCases.forEach(({ id, toggles }) => {
        for (let i = 0; i < toggles; i++) {
          result.current.toggle(id);
        }
      });
    });

    testCases.forEach(({ id, expected }) => {
      expect(result.current.isWishlisted(id)).toBe(expected);
    });
  });
});

// ─── localStorage Validity ───────────────────────────────────────────────────

describe('localStorage validity after toggle sequences', () => {
  it('maintains valid JSON array after single toggle', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-1');
    });

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(() => JSON.parse(stored)).not.toThrow();
    
    const parsed = JSON.parse(stored);
    expect(Array.isArray(parsed)).toBe(true);
  });

  it('maintains valid JSON array after multiple toggles', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-1');
      result.current.toggle('product-2');
      result.current.toggle('product-1');
      result.current.toggle('product-3');
    });

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(() => JSON.parse(stored)).not.toThrow();
    
    const parsed = JSON.parse(stored);
    expect(Array.isArray(parsed)).toBe(true);
  });

  it('maintains valid JSON array after 100 toggle operations', () => {
    const { result } = renderWishlistHook();

    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.toggle(`product-${i % 10}`);
      }
    });

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(() => JSON.parse(stored)).not.toThrow();
    
    const parsed = JSON.parse(stored);
    expect(Array.isArray(parsed)).toBe(true);
  });

  it('persists correct items to localStorage', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-a');
      result.current.toggle('product-b');
      result.current.toggle('product-c');
      result.current.toggle('product-b'); // Remove product-b
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toEqual(['product-a', 'product-c']);
  });

  it('restores wishlist from localStorage on mount', () => {
    // Pre-populate localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['product-1', 'product-2']));

    const { result } = renderWishlistHook();

    expect(result.current.wishlist).toEqual(['product-1', 'product-2']);
    expect(result.current.isWishlisted('product-1')).toBe(true);
    expect(result.current.isWishlisted('product-2')).toBe(true);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid json}');

    const { result } = renderWishlistHook();

    expect(result.current.wishlist).toEqual([]);
    expect(() => {
      act(() => {
        result.current.toggle('product-1');
      });
    }).not.toThrow();
  });

  it('handles non-array localStorage value gracefully', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: [] }));

    const { result } = renderWishlistHook();

    expect(result.current.wishlist).toEqual([]);
  });

  it('filters out non-string values from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['valid-1', 123, null, 'valid-2', undefined]));

    const { result } = renderWishlistHook();

    expect(result.current.wishlist).toEqual(['valid-1', 'valid-2']);
  });

  it('maintains localStorage validity after clear operation', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-1');
      result.current.toggle('product-2');
    });

    // Verify items are in wishlist
    expect(result.current.wishlist.length).toBe(2);

    act(() => {
      result.current.clear();
    });

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(() => JSON.parse(stored)).not.toThrow();
    
    const parsed = JSON.parse(stored);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toEqual([]);
    expect(result.current.wishlist).toEqual([]);
  });

  it('maintains valid state across mount/unmount cycles', () => {
    // First mount
    const { result: result1, unmount } = renderWishlistHook();

    act(() => {
      result1.current.toggle('product-1');
      result1.current.toggle('product-2');
      result1.current.toggle('product-3');
    });

    unmount();

    // Second mount
    const { result: result2 } = renderWishlistHook();

    expect(result2.current.wishlist).toEqual(['product-1', 'product-2', 'product-3']);
    
    // Verify localStorage is still valid
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(() => JSON.parse(stored)).not.toThrow();
    expect(Array.isArray(JSON.parse(stored))).toBe(true);
  });

  it('never stores duplicate ids', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-1');
      result.current.toggle('product-2');
      result.current.toggle('product-1'); // Remove
      result.current.toggle('product-1'); // Add again
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const uniqueIds = [...new Set(stored)];
    expect(stored.length).toBe(uniqueIds.length);
  });

  it('maintains order of wishlist items', () => {
    const { result } = renderWishlistHook();

    act(() => {
      result.current.toggle('product-a');
      result.current.toggle('product-b');
      result.current.toggle('product-c');
    });

    expect(result.current.wishlist).toEqual(['product-a', 'product-b', 'product-c']);
    
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toEqual(['product-a', 'product-b', 'product-c']);
  });
});
