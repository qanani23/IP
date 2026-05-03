// ─── ToastContext ─────────────────────────────────────────────────────────────
// Global toast notification queue.
// Toasts auto-dismiss after 4000ms.
// Deduplication: same dedupeKey within 1000ms updates existing toast in place.

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';

const DEFAULT_DURATION = 4000;
const DEDUPE_WINDOW_MS = 1000;

// ─── Reducer ──────────────────────────────────────────────────────────────────

function toastReducer(state, action) {
  switch (action.type) {
    case 'SHOW': {
      const { toast } = action.payload;

      // Deduplication: if a toast with the same dedupeKey was shown within
      // DEDUPE_WINDOW_MS, update its message in place instead of stacking.
      if (toast.dedupeKey) {
        const now = Date.now();
        const existing = state.find(
          (t) =>
            t.dedupeKey === toast.dedupeKey &&
            now - t.createdAt < DEDUPE_WINDOW_MS
        );
        if (existing) {
          return state.map((t) =>
            t.id === existing.id
              ? { ...t, message: toast.message, createdAt: now }
              : t
          );
        }
      }

      return [...state, { ...toast, createdAt: Date.now() }];
    }

    case 'DISMISS': {
      return state.filter((t) => t.id !== action.payload.id);
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

let _idCounter = 0;
function generateId() {
  return `toast-${++_idCounter}-${Date.now()}`;
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  // Track auto-dismiss timers so we can clear them on unmount
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    dispatch({ type: 'DISMISS', payload: { id } });
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    ({ message, type = 'success', action = null, duration = DEFAULT_DURATION, dedupeKey = null }) => {
      const id = generateId();
      const toast = { id, message, type, action, duration, dedupeKey };
      dispatch({ type: 'SHOW', payload: { toast } });

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        dismissToast(id);
      }, duration);
      timers.current.set(id, timer);

      return id;
    },
    [dismissToast]
  );

  // Clean up all timers on unmount
  useEffect(() => {
    const currentTimers = timers.current;
    return () => {
      currentTimers.forEach((timer) => clearTimeout(timer));
      currentTimers.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

/**
 * Hook to access toast state and actions.
 * Must be used inside <ToastProvider>.
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
