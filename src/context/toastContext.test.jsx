// ─── Toast Property Tests ────────────────────────────────────────────────────
// Property-based tests for ToastContext correctness properties.
//
// P-S6: Calling showToast with same dedupeKey K times within 1000ms
//       → exactly one visible Toast

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext.jsx';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function renderToastHook() {
  return renderHook(() => useToast(), {
    wrapper: ({ children }) => <ToastProvider>{children}</ToastProvider>,
  });
}

// ─── Setup/Teardown ───────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── P-S6: Toast Deduplication ───────────────────────────────────────────────

describe('P-S6: Toast deduplication within 1000ms window', () => {
  it('shows exactly one toast when same dedupeKey used twice within 1000ms', () => {
    const { result } = renderToastHook();

    act(() => {
      result.current.showToast({
        message: 'First message',
        dedupeKey: 'test-key',
      });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].message).toBe('First message');

    // Show again with same dedupeKey within 1000ms
    act(() => {
      vi.advanceTimersByTime(500); // 500ms later
      result.current.showToast({
        message: 'Updated message',
        dedupeKey: 'test-key',
      });
    });

    // Should still be exactly one toast, with updated message
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].message).toBe('Updated message');
  });

  it('shows exactly one toast when same dedupeKey used 5 times within 1000ms', () => {
    const { result } = renderToastHook();

    act(() => {
      result.current.showToast({ message: 'Message 1', dedupeKey: 'rapid-key' });
      vi.advanceTimersByTime(100);
      result.current.showToast({ message: 'Message 2', dedupeKey: 'rapid-key' });
      vi.advanceTimersByTime(100);
      result.current.showToast({ message: 'Message 3', dedupeKey: 'rapid-key' });
      vi.advanceTimersByTime(100);
      result.current.showToast({ message: 'Message 4', dedupeKey: 'rapid-key' });
      vi.advanceTimersByTime(100);
      result.current.showToast({ message: 'Message 5', dedupeKey: 'rapid-key' });
    });

    // Should be exactly one toast with the last message
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].message).toBe('Message 5');
  });

  it('shows exactly one toast when same dedupeKey used 10 times within 1000ms', () => {
    const { result } = renderToastHook();

    act(() => {
      for (let i = 1; i <= 10; i++) {
        result.current.showToast({
          message: `Message ${i}`,
          dedupeKey: 'spam-key',
        });
        vi.advanceTimersByTime(50); // 50ms between each
      }
    });

    // Total time: 10 * 50 = 500ms (within 1000ms window)
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].message).toBe('Message 10');
  });

  it('shows two toasts when same dedupeKey used after 1000ms window', () => {
    const { result } = renderToastHook();

    act(() => {
      result.current.showToast({
        message: 'First message',
        dedupeKey: 'time-key',
      });
    });

    expect(result.current.toasts.length).toBe(1);

    // Wait 1001ms (outside deduplication window)
    act(() => {
      vi.advanceTimersByTime(1001);
      result.current.showToast({
        message: 'Second message',
        dedupeKey: 'time-key',
      });
    });

    // Should now have two toasts (first one still visible, second is new)
    expect(result.current.toasts.length).toBe(2);
    expect(result.current.toasts[0].message).toBe('First message');
    expect(result.current.toasts[1].message).toBe('Second message');
  });

  it('deduplicates only toasts with matching dedupeKey', () => {
    const { result } = renderToastHook();

    act(() => {
      result.current.showToast({ message: 'Toast A1', dedupeKey: 'key-a' });
      result.current.showToast({ message: 'Toast B1', dedupeKey: 'key-b' });
      vi.advanceTimersByTime(100);
      result.current.showToast({ message: 'Toast A2', dedupeKey: 'key-a' });
      vi.advanceTimersByTime(100);
      result.current.showToast({ message: 'Toast B2', dedupeKey: 'key-b' });
    });

    // Should have exactly 2 toasts (one for each key)
    expect(result.current.toasts.length).toBe(2);
    
    const toastA = result.current.toasts.find(t => t.dedupeKey === 'key-a');
    const toastB = result.current.toasts.find(t => t.dedupeKey === 'key-b');
    
    expect(toastA.message).toBe('Toast A2');
    expect(toastB.message).toBe('Toast B2');
  });

  it('does not deduplicate toasts without dedupeKey', () => {
    const { result } = renderToastHook();

    act(() => {
      result.current.showToast({ message: 'Toast 1' });
      result.current.showToast({ message: 'Toast 2' });
      result.current.showToast({ message: 'Toast 3' });
    });

    // Should have 3 separate toasts
    expect(result.current.toasts.length).toBe(3);
  });

  it('updates message in place when deduplicating', () => {
    const { result } = renderToastHook();

    act(() => {
      result.current.showToast({
        message: 'Original message',
        type: 'success',
        dedupeKey: 'update-key',
      });
    });

    const originalId = result.current.toasts[0].id;

    act(() => {
      vi.advanceTimersByTime(500);
      result.current.showToast({
        message: 'Updated message',
        type: 'error', // Different type
        dedupeKey: 'update-key',
      });
    });

    // Should still be the same toast (same ID)
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].id).toBe(originalId);
    expect(result.current.toasts[0].message).toBe('Updated message');
  });

  it('resets deduplication window on each update', () => {
    const { result } = renderToastHook();

    act(() => {
      result.current.showToast({ message: 'Message 1', dedupeKey: 'reset-key' });
      vi.advanceTimersByTime(900); // 900ms later
      result.current.showToast({ message: 'Message 2', dedupeKey: 'reset-key' });
      vi.advanceTimersByTime(900); // Another 900ms (1800ms total from first)
      result.current.showToast({ message: 'Message 3', dedupeKey: 'reset-key' });
    });

    // Should still be one toast because each update resets the window
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].message).toBe('Message 3');
  });

  it('handles rapid add-to-cart scenario correctly', () => {
    const { result } = renderToastHook();

    // Simulate user rapidly clicking "Add to Cart" 5 times
    act(() => {
      for (let i = 1; i <= 5; i++) {
        result.current.showToast({
          message: `${i} × Product added to cart`,
          type: 'success',
          dedupeKey: 'add-product-123',
        });
        vi.advanceTimersByTime(100); // 100ms between clicks
      }
    });

    // Should show exactly one toast with the final count
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].message).toBe('5 × Product added to cart');
  });

  it('auto-dismisses deduplicated toast after duration', async () => {
    const { result } = renderToastHook();

    act(() => {
      result.current.showToast({
        message: 'First',
        dedupeKey: 'dismiss-key',
        duration: 4000,
      });
      vi.advanceTimersByTime(500);
      result.current.showToast({
        message: 'Updated',
        dedupeKey: 'dismiss-key',
        duration: 4000,
      });
    });

    expect(result.current.toasts.length).toBe(1);

    // Advance past the duration
    act(() => {
      vi.advanceTimersByTime(4500);
    });

    // Toast should be dismissed
    expect(result.current.toasts.length).toBe(0);
  });

  it('maintains separate deduplication for different keys simultaneously', () => {
    const { result } = renderToastHook();

    act(() => {
      // Rapidly add toasts with different keys
      result.current.showToast({ message: 'Product A - 1', dedupeKey: 'product-a' });
      result.current.showToast({ message: 'Product B - 1', dedupeKey: 'product-b' });
      result.current.showToast({ message: 'Product C - 1', dedupeKey: 'product-c' });
      
      vi.advanceTimersByTime(200);
      
      result.current.showToast({ message: 'Product A - 2', dedupeKey: 'product-a' });
      result.current.showToast({ message: 'Product B - 2', dedupeKey: 'product-b' });
      result.current.showToast({ message: 'Product C - 2', dedupeKey: 'product-c' });
      
      vi.advanceTimersByTime(200);
      
      result.current.showToast({ message: 'Product A - 3', dedupeKey: 'product-a' });
      result.current.showToast({ message: 'Product B - 3', dedupeKey: 'product-b' });
      result.current.showToast({ message: 'Product C - 3', dedupeKey: 'product-c' });
    });

    // Should have exactly 3 toasts (one per key)
    expect(result.current.toasts.length).toBe(3);
    
    const messages = result.current.toasts.map(t => t.message).sort();
    expect(messages).toEqual(['Product A - 3', 'Product B - 3', 'Product C - 3']);
  });
});
