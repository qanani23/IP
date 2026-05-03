// ─── CartContext ──────────────────────────────────────────────────────────────
// Global cart state via useReducer. Persisted to localStorage.
// Resilient to corrupted storage — never crashes on bad data.

import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';

const STORAGE_KEY = 'abby-key-saved-listings';

// ─── localStorage helpers ─────────────────────────────────────────────────────

/**
 * Safely loads cart items from localStorage.
 * Returns [] for any failure: invalid JSON, non-array, or malformed entries.
 */
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Discard entries missing required fields
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    // Invalid JSON — silent reset
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota exceeded or private browsing — fail silently
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState = {
  items:         loadCart(),
  promoCode:     null,
  promoDiscount: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existing = state.items.find((i) => i.id === product.id);

      if (existing) {
        // Increment quantity, capped at stock
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: newQty } : i
          ),
        };
      }

      // New item — cap initial quantity at stock
      const cappedQty = Math.min(quantity, product.stock);
      if (cappedQty <= 0) return state;

      return {
        ...state,
        items: [
          ...state.items,
          {
            id:       product.id,
            name:     product.name,
            price:    product.price,
            image:    product.images?.[0] ?? '',
            stock:    product.stock,
            sku:      product.sku ?? '',
            quantity: cappedQty,
          },
        ],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove item when quantity reaches 0
        return {
          ...state,
          items: state.items.filter((i) => i.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) => {
          if (i.id !== id) return i;
          // Cap at stock
          return { ...i, quantity: Math.min(quantity, i.stock) };
        }),
      };
    }

    case 'APPLY_PROMO': {
      return {
        ...state,
        promoCode:     action.payload.code,
        promoDiscount: action.payload.discount,
      };
    }

    case 'CLEAR_PROMO': {
      return { ...state, promoCode: null, promoDiscount: 0 };
    }

    case 'CLEAR_CART': {
      return { ...initialState, items: [] };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist to localStorage on every state change
  useEffect(() => {
    saveCart(state.items);
  }, [state.items]);

  // ── Computed values (derived, never stored) ──────────────────────────────
  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const total = useMemo(
    () => Math.max(0, subtotal - state.promoDiscount),
    [subtotal, state.promoDiscount]
  );

  // ── Action creators ──────────────────────────────────────────────────────
  const addItem = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const applyPromo = useCallback((code, discount) => {
    dispatch({ type: 'APPLY_PROMO', payload: { code, discount } });
  }, []);

  const clearPromo = useCallback(() => {
    dispatch({ type: 'CLEAR_PROMO' });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const value = useMemo(
    () => ({
      items:         state.items,
      promoCode:     state.promoCode,
      promoDiscount: state.promoDiscount,
      itemCount,
      subtotal,
      total,
      addItem,
      removeItem,
      updateQuantity,
      applyPromo,
      clearPromo,
      clearCart,
    }),
    [
      state.items,
      state.promoCode,
      state.promoDiscount,
      itemCount,
      subtotal,
      total,
      addItem,
      removeItem,
      updateQuantity,
      applyPromo,
      clearPromo,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to access cart state and actions.
 * Must be used inside <CartProvider>.
 */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
