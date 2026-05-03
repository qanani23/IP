// ─── Phase 4 Checkpoint Tests ─────────────────────────────────────────────────
// Verification tests for Cart Page implementation.
// Tests empty state, cart operations, stock limits, promo codes, and unavailable items.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.jsx';
import CartPage from './CartPage.jsx';
import CartItem from '../components/CartItem.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import { PRODUCTS } from '../data/productData.js';

// Mock analytics
vi.mock('../utils/analytics.js', () => ({
  track: vi.fn(),
}));

// Helper to render with providers
function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <CartProvider>{ui}</CartProvider>
    </BrowserRouter>
  );
}

describe('Phase 4 Checkpoint — Cart Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('4.4.1 — Empty cart state', () => {
    it('renders empty state correctly when cart is empty', async () => {
      renderWithProviders(<CartPage />);

      // Wait for initialization
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Check empty state messages
      expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
      expect(screen.getByText(/haven't added anything yet/i)).toBeInTheDocument();

      // Check continue shopping link
      const link = screen.getByRole('link', { name: /continue shopping/i });
      expect(link).toHaveAttribute('href', '/shop');
    });
  });

  describe('4.4.2 — Cart operations and localStorage persistence', () => {
    it('updates CartContext and persists to localStorage when adding/removing/updating', async () => {
      const user = userEvent.setup();
      
      // Start with a product in cart
      const product = PRODUCTS[0];
      localStorage.setItem(
        'slam-dunk-cart',
        JSON.stringify([
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 2,
            image: product.images[0],
            stock: product.stock,
            sku: product.sku,
          },
        ])
      );

      renderWithProviders(<CartPage />);

      // Wait for cart to load
      await waitFor(() => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });

      // Verify initial quantity
      expect(screen.getByText('2')).toBeInTheDocument();

      // Test increase quantity
      const increaseBtn = screen.getByLabelText(/increase quantity/i);
      await user.click(increaseBtn);

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
      });

      // Verify localStorage was updated
      const stored = JSON.parse(localStorage.getItem('slam-dunk-cart'));
      expect(stored[0].quantity).toBe(3);

      // Test decrease quantity
      const decreaseBtn = screen.getByLabelText(/decrease quantity/i);
      await user.click(decreaseBtn);

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });

      // Test remove item
      const removeBtn = screen.getByLabelText(new RegExp(`remove ${product.name}`, 'i'));
      await user.click(removeBtn);

      // Should show empty state
      await waitFor(() => {
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
      });

      // Verify localStorage was cleared
      const finalStored = JSON.parse(localStorage.getItem('slam-dunk-cart'));
      expect(finalStored).toEqual([]);
    });
  });

  describe('4.4.3 — Stock limit enforcement', () => {
    it('disables + button when quantity reaches stock limit', async () => {
      const product = PRODUCTS[0];
      
      // Set quantity to stock limit
      localStorage.setItem(
        'slam-dunk-cart',
        JSON.stringify([
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.stock,
            image: product.images[0],
            stock: product.stock,
            sku: product.sku,
          },
        ])
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });

      // Verify + button is disabled
      const increaseBtn = screen.getByLabelText(/increase quantity/i);
      expect(increaseBtn).toBeDisabled();
    });

    it('disables − button when quantity is 1', async () => {
      const product = PRODUCTS[0];
      
      localStorage.setItem(
        'slam-dunk-cart',
        JSON.stringify([
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0],
            stock: product.stock,
            sku: product.sku,
          },
        ])
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });

      // Verify − button is disabled
      const decreaseBtn = screen.getByLabelText(/decrease quantity/i);
      expect(decreaseBtn).toBeDisabled();
    });
  });

  describe('4.4.4 — Promo code validation', () => {
    it('applies valid promo code SLAM10 with $3.50 discount', async () => {
      const user = userEvent.setup();
      const product = PRODUCTS[0];
      
      localStorage.setItem(
        'slam-dunk-cart',
        JSON.stringify([
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0],
            stock: product.stock,
            sku: product.sku,
          },
        ])
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });

      // Find promo input
      const promoInput = screen.getByPlaceholderText(/promo code/i);
      const applyBtn = screen.getByRole('button', { name: /apply/i });

      // Enter valid promo code
      await user.type(promoInput, 'SLAM10');
      
      // Wait for debounce (300ms)
      await waitFor(
        () => {
          expect(screen.getByText(/promo code applied/i)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // Verify discount is shown
      expect(screen.getByText(/promo \(SLAM10\)/i)).toBeInTheDocument();
      expect(screen.getByText(/−\$3\.50/)).toBeInTheDocument();
    });

    it('shows error for invalid promo code', async () => {
      const user = userEvent.setup();
      const product = PRODUCTS[0];
      
      localStorage.setItem(
        'slam-dunk-cart',
        JSON.stringify([
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0],
            stock: product.stock,
            sku: product.sku,
          },
        ])
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });

      // Find promo input
      const promoInput = screen.getByPlaceholderText(/promo code/i);

      // Enter invalid promo code
      await user.type(promoInput, 'INVALID');
      
      // Wait for debounce and error message
      await waitFor(
        () => {
          expect(screen.getByText(/invalid promo code/i)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it('debounces promo input with 300ms delay', async () => {
      const user = userEvent.setup();
      const product = PRODUCTS[0];
      
      localStorage.setItem(
        'slam-dunk-cart',
        JSON.stringify([
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0],
            stock: product.stock,
            sku: product.sku,
          },
        ])
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });

      const promoInput = screen.getByPlaceholderText(/promo code/i);

      // Type quickly
      await user.type(promoInput, 'SL');
      
      // Should not show message immediately
      expect(screen.queryByText(/invalid promo code/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/promo code applied/i)).not.toBeInTheDocument();

      // Continue typing
      await user.type(promoInput, 'AM10');

      // Wait for debounce
      await waitFor(
        () => {
          expect(screen.getByText(/promo code applied/i)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe('4.4.5 — Unavailable item notice', () => {
    it('shows warning when product id not in PRODUCTS', async () => {
      // Add an item with a non-existent product id
      localStorage.setItem(
        'slam-dunk-cart',
        JSON.stringify([
          {
            id: 'non-existent-id',
            name: 'Unavailable Product',
            price: 99.99,
            quantity: 1,
            image: '/fallback.jpg',
            stock: 10,
            sku: 'UNAVAIL-001',
          },
        ])
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText(/unavailable product/i)).toBeInTheDocument();
      });

      // Check for unavailable notice
      expect(screen.getByText(/currently unavailable/i)).toBeInTheDocument();

      // Verify remove button is present for unavailable item
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      expect(removeButtons.length).toBeGreaterThan(0);
    });

    it('allows removing unavailable items', async () => {
      const user = userEvent.setup();
      
      localStorage.setItem(
        'slam-dunk-cart',
        JSON.stringify([
          {
            id: 'non-existent-id',
            name: 'Unavailable Product',
            price: 99.99,
            quantity: 1,
            image: '/fallback.jpg',
            stock: 10,
            sku: 'UNAVAIL-001',
          },
        ])
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText(/unavailable product/i)).toBeInTheDocument();
      });

      // Click remove button in the warning section
      const removeBtn = screen.getAllByRole('button', { name: /remove/i })[0];
      await user.click(removeBtn);

      // Should show empty state
      await waitFor(() => {
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
      });
    });
  });
});
