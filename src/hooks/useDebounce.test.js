// ─── useDebounce Property Tests ──────────────────────────────────────────────
// Property-based tests for useDebounce hook correctness properties.
//
// P-S15: Debounced value does not update until delay ms elapsed;
//        rapid changes produce exactly one update

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce.js';

// ─── Setup/Teardown ───────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── P-S15: Debounce Delay and Single Update ─────────────────────────────────

describe('P-S15: Debounced value updates after delay, rapid changes produce one update', () => {
  it('does not update immediately when value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'changed', delay: 300 });

    // Should still be initial (no time has passed)
    expect(result.current).toBe('initial');
  });

  it('updates after delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'changed', delay: 300 });

    // Advance time by delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('changed');
  });

  it('does not update before delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'changed', delay: 500 });

    // Advance time by less than delay
    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe('initial');

    // Advance the final 1ms
    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('changed');
  });

  it('produces exactly one update after rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'v0', delay: 300 } }
    );

    // Rapid changes
    rerender({ value: 'v1', delay: 300 });
    act(() => vi.advanceTimersByTime(50));
    
    rerender({ value: 'v2', delay: 300 });
    act(() => vi.advanceTimersByTime(50));
    
    rerender({ value: 'v3', delay: 300 });
    act(() => vi.advanceTimersByTime(50));
    
    rerender({ value: 'v4', delay: 300 });
    act(() => vi.advanceTimersByTime(50));
    
    rerender({ value: 'v5', delay: 300 });

    // Still should be initial value
    expect(result.current).toBe('v0');

    // Advance past delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should update to the last value only
    expect(result.current).toBe('v5');
  });

  it('produces exactly one update after 10 rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // 10 rapid changes, 30ms apart
    for (let i = 1; i <= 10; i++) {
      rerender({ value: `value-${i}`, delay: 500 });
      act(() => vi.advanceTimersByTime(30));
    }

    // Total time: 10 * 30 = 300ms (less than delay)
    expect(result.current).toBe('initial');

    // Advance past delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should be the last value
    expect(result.current).toBe('value-10');
  });

  it('produces exactly one update after 100 rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'start', delay: 1000 } }
    );

    // 100 rapid changes, 5ms apart
    for (let i = 1; i <= 100; i++) {
      rerender({ value: `v${i}`, delay: 1000 });
      act(() => vi.advanceTimersByTime(5));
    }

    // Total time: 100 * 5 = 500ms (less than delay)
    expect(result.current).toBe('start');

    // Advance past delay
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe('v100');
  });

  it('resets timer on each change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'v0', delay: 300 } }
    );

    rerender({ value: 'v1', delay: 300 });
    act(() => vi.advanceTimersByTime(200)); // 200ms elapsed

    rerender({ value: 'v2', delay: 300 });
    act(() => vi.advanceTimersByTime(200)); // Another 200ms (400ms total)

    // Should still be initial because timer was reset
    expect(result.current).toBe('v0');

    // Advance final 100ms
    act(() => vi.advanceTimersByTime(100));

    expect(result.current).toBe('v2');
  });

  it('handles different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    rerender({ value: 'changed', delay: 100 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('changed');

    // Change delay
    rerender({ value: 'changed2', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should not update yet (new delay is 500ms)
    expect(result.current).toBe('changed');

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('changed2');
  });

  it('handles zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'changed', delay: 0 });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('changed');
  });

  it('clears timeout on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'changed', delay: 300 });

    // Unmount before delay elapses
    unmount();

    // Advance time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should not have updated (component unmounted)
    expect(result.current).toBe('initial');
  });

  it('handles search input scenario (300ms delay)', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: '', delay: 300 } }
    );

    // User types "basketball" rapidly
    const searchTerm = 'basketball';
    for (let i = 1; i <= searchTerm.length; i++) {
      rerender({ value: searchTerm.slice(0, i), delay: 300 });
      act(() => vi.advanceTimersByTime(50)); // 50ms between keystrokes
    }

    // Should still be empty (user still typing)
    expect(result.current).toBe('');

    // User stops typing, wait for delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should update to full search term
    expect(result.current).toBe('basketball');
  });

  it('handles promo code input scenario (300ms delay)', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: '', delay: 300 } }
    );

    // User types promo code
    rerender({ value: 'S', delay: 300 });
    act(() => vi.advanceTimersByTime(100));
    
    rerender({ value: 'SL', delay: 300 });
    act(() => vi.advanceTimersByTime(100));
    
    rerender({ value: 'SLA', delay: 300 });
    act(() => vi.advanceTimersByTime(100));
    
    rerender({ value: 'SLAM', delay: 300 });
    act(() => vi.advanceTimersByTime(100));
    
    rerender({ value: 'SLAM10', delay: 300 });

    // Should still be empty
    expect(result.current).toBe('');

    // Wait for delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('SLAM10');
  });

  it('produces single update even with alternating values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 200 } }
    );

    // Alternate between two values rapidly
    for (let i = 0; i < 20; i++) {
      rerender({ value: i % 2 === 0 ? 'even' : 'odd', delay: 200 });
      act(() => vi.advanceTimersByTime(10));
    }

    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should be the last value
    expect(result.current).toBe('odd');
  });

  it('handles numeric values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    );

    rerender({ value: 1, delay: 300 });
    rerender({ value: 2, delay: 300 });
    rerender({ value: 3, delay: 300 });

    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(3);
  });

  it('handles object values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: { count: 0 }, delay: 300 } }
    );

    rerender({ value: { count: 1 }, delay: 300 });
    rerender({ value: { count: 2 }, delay: 300 });

    expect(result.current).toEqual({ count: 0 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual({ count: 2 });
  });

  it('handles array values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: [], delay: 300 } }
    );

    rerender({ value: [1], delay: 300 });
    rerender({ value: [1, 2], delay: 300 });
    rerender({ value: [1, 2, 3], delay: 300 });

    expect(result.current).toEqual([]);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual([1, 2, 3]);
  });
});
