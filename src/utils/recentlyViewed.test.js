// ─── Recently Viewed Property Tests ──────────────────────────────────────────
// Property-based tests for recentlyViewed utility correctness properties.
//
// P-S13: List never exceeds 5 entries, most recent always at index 0

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { addRecentlyViewed, getRecentlyViewed } from './recentlyViewed.js';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'slam-dunk-recently-viewed';

// ─── Setup/Teardown ───────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

// ─── P-S13: List Size Cap and Ordering ────────────────────────────────────────

describe('P-S13: List never exceeds 5 entries, most recent at index 0', () => {
  it('maintains list size ≤ 5 after adding 1 item', () => {
    addRecentlyViewed('product-1');
    const list = getRecentlyViewed();
    
    expect(list.length).toBeLessThanOrEqual(5);
    expect(list.length).toBe(1);
  });

  it('maintains list size ≤ 5 after adding 5 items', () => {
    addRecentlyViewed('product-1');
    addRecentlyViewed('product-2');
    addRecentlyViewed('product-3');
    addRecentlyViewed('product-4');
    addRecentlyViewed('product-5');
    
    const list = getRecentlyViewed();
    expect(list.length).toBeLessThanOrEqual(5);
    expect(list.length).toBe(5);
  });

  it('maintains list size ≤ 5 after adding 6 items', () => {
    addRecentlyViewed('product-1');
    addRecentlyViewed('product-2');
    addRecentlyViewed('product-3');
    addRecentlyViewed('product-4');
    addRecentlyViewed('product-5');
    addRecentlyViewed('product-6');
    
    const list = getRecentlyViewed();
    expect(list.length).toBeLessThanOrEqual(5);
    expect(list.length).toBe(5);
  });

  it('maintains list size ≤ 5 after adding 10 items', () => {
    for (let i = 1; i <= 10; i++) {
      addRecentlyViewed(`product-${i}`);
    }
    
    const list = getRecentlyViewed();
    expect(list.length).toBeLessThanOrEqual(5);
    expect(list.length).toBe(5);
  });

  it('maintains list size ≤ 5 after adding 100 items', () => {
    for (let i = 1; i <= 100; i++) {
      addRecentlyViewed(`product-${i}`);
    }
    
    const list = getRecentlyViewed();
    expect(list.length).toBeLessThanOrEqual(5);
    expect(list.length).toBe(5);
  });

  it('places most recent item at index 0', () => {
    addRecentlyViewed('product-1');
    addRecentlyViewed('product-2');
    addRecentlyViewed('product-3');
    
    const list = getRecentlyViewed();
    expect(list[0]).toBe('product-3');
  });

  it('maintains most recent at index 0 after multiple additions', () => {
    addRecentlyViewed('product-a');
    expect(getRecentlyViewed()[0]).toBe('product-a');
    
    addRecentlyViewed('product-b');
    expect(getRecentlyViewed()[0]).toBe('product-b');
    
    addRecentlyViewed('product-c');
    expect(getRecentlyViewed()[0]).toBe('product-c');
    
    addRecentlyViewed('product-d');
    expect(getRecentlyViewed()[0]).toBe('product-d');
  });

  it('maintains correct order: most recent to least recent', () => {
    addRecentlyViewed('product-1');
    addRecentlyViewed('product-2');
    addRecentlyViewed('product-3');
    addRecentlyViewed('product-4');
    addRecentlyViewed('product-5');
    
    const list = getRecentlyViewed();
    expect(list).toEqual(['product-5', 'product-4', 'product-3', 'product-2', 'product-1']);
  });

  it('drops oldest item when adding 6th item', () => {
    addRecentlyViewed('product-1'); // Will be dropped
    addRecentlyViewed('product-2');
    addRecentlyViewed('product-3');
    addRecentlyViewed('product-4');
    addRecentlyViewed('product-5');
    addRecentlyViewed('product-6');
    
    const list = getRecentlyViewed();
    expect(list).toEqual(['product-6', 'product-5', 'product-4', 'product-3', 'product-2']);
    expect(list).not.toContain('product-1');
  });

  it('maintains cap and order after arbitrary sequence', () => {
    const sequence = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    sequence.forEach(id => addRecentlyViewed(id));
    
    const list = getRecentlyViewed();
    expect(list.length).toBe(5);
    expect(list[0]).toBe('j'); // Most recent
    expect(list).toEqual(['j', 'i', 'h', 'g', 'f']);
  });

  it('deduplicates and moves to front when viewing same item again', () => {
    addRecentlyViewed('product-1');
    addRecentlyViewed('product-2');
    addRecentlyViewed('product-3');
    addRecentlyViewed('product-1'); // View product-1 again
    
    const list = getRecentlyViewed();
    expect(list.length).toBe(3);
    expect(list[0]).toBe('product-1');
    expect(list).toEqual(['product-1', 'product-3', 'product-2']);
  });

  it('maintains cap when re-viewing items', () => {
    addRecentlyViewed('product-1');
    addRecentlyViewed('product-2');
    addRecentlyViewed('product-3');
    addRecentlyViewed('product-4');
    addRecentlyViewed('product-5');
    addRecentlyViewed('product-2'); // Re-view product-2
    
    const list = getRecentlyViewed();
    expect(list.length).toBe(5);
    expect(list[0]).toBe('product-2');
    expect(list).toEqual(['product-2', 'product-5', 'product-4', 'product-3', 'product-1']);
  });

  it('handles rapid additions of same item', () => {
    for (let i = 0; i < 10; i++) {
      addRecentlyViewed('product-same');
    }
    
    const list = getRecentlyViewed();
    expect(list.length).toBe(1);
    expect(list[0]).toBe('product-same');
  });

  it('maintains invariants across mixed operations', () => {
    addRecentlyViewed('p1');
    addRecentlyViewed('p2');
    addRecentlyViewed('p3');
    addRecentlyViewed('p1'); // Dedupe
    addRecentlyViewed('p4');
    addRecentlyViewed('p5');
    addRecentlyViewed('p6'); // Should drop p2
    addRecentlyViewed('p3'); // Dedupe and move to front
    
    const list = getRecentlyViewed();
    expect(list.length).toBeLessThanOrEqual(5);
    expect(list[0]).toBe('p3');
    expect(list).not.toContain('p2'); // Oldest, should be dropped
  });
});

// ─── localStorage Resilience ──────────────────────────────────────────────────

describe('localStorage resilience', () => {
  it('returns empty array when localStorage is empty', () => {
    const list = getRecentlyViewed();
    expect(list).toEqual([]);
  });

  it('returns empty array for invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid json}');
    const list = getRecentlyViewed();
    expect(list).toEqual([]);
  });

  it('returns empty array for non-array JSON', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: [] }));
    const list = getRecentlyViewed();
    expect(list).toEqual([]);
  });

  it('persists to localStorage after additions', () => {
    addRecentlyViewed('product-1');
    addRecentlyViewed('product-2');
    
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toEqual(['product-2', 'product-1']);
  });

  it('restores from localStorage correctly', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['p1', 'p2', 'p3']));
    
    const list = getRecentlyViewed();
    expect(list).toEqual(['p1', 'p2', 'p3']);
  });

  it('maintains valid JSON array in localStorage after all operations', () => {
    addRecentlyViewed('p1');
    addRecentlyViewed('p2');
    addRecentlyViewed('p3');
    addRecentlyViewed('p1');
    
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(() => JSON.parse(stored)).not.toThrow();
    expect(Array.isArray(JSON.parse(stored))).toBe(true);
  });

  it('handles corrupted localStorage without throwing', () => {
    localStorage.setItem(STORAGE_KEY, 'not json');
    
    expect(() => getRecentlyViewed()).not.toThrow();
    expect(() => addRecentlyViewed('product-1')).not.toThrow();
  });
});

// ─── Edge Cases ───────────────────────────────────────────────────────────────

describe('Edge cases', () => {
  it('handles empty string id by not adding it', () => {
    addRecentlyViewed('');
    const list = getRecentlyViewed();
    expect(list).toEqual([]);
  });

  it('handles special characters in id', () => {
    const specialId = 'product-!@#$%^&*()';
    addRecentlyViewed(specialId);
    const list = getRecentlyViewed();
    expect(list[0]).toBe(specialId);
  });

  it('handles very long id strings', () => {
    const longId = 'p'.repeat(1000);
    addRecentlyViewed(longId);
    const list = getRecentlyViewed();
    expect(list[0]).toBe(longId);
  });

  it('maintains cap with alternating pattern', () => {
    for (let i = 0; i < 20; i++) {
      addRecentlyViewed(i % 2 === 0 ? 'even' : 'odd');
    }
    
    const list = getRecentlyViewed();
    expect(list.length).toBeLessThanOrEqual(5);
  });

  it('never contains duplicate ids', () => {
    addRecentlyViewed('p1');
    addRecentlyViewed('p2');
    addRecentlyViewed('p3');
    addRecentlyViewed('p1');
    addRecentlyViewed('p2');
    
    const list = getRecentlyViewed();
    const uniqueIds = [...new Set(list)];
    expect(list.length).toBe(uniqueIds.length);
  });
});
