// ─── Phase 3 Checkpoint Tests ─────────────────────────────────────────────────
// Verifies all Phase 3 gate requirements:
// - Shop page loads products, search filters correctly, sort works, filter works
// - Product page shows all content, tabs switch correctly
// - Add to cart shows contextual toast with product name and quantity
// - Low stock badge appears when stock ≤ 5
// - JSON-LD script tag present in document head on product page
// - Wishlist heart toggle persists to localStorage

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { ToastRegion } from '../components/Toast.jsx';
import ShopPage from './ShopPage.jsx';
import ProductPage from './ProductPage.jsx';

// Mock API calls
vi.mock('../api/products.js', () => ({
  fetchProducts: vi.fn(() =>
    Promise.resolve([
      {
        id: 'sd-ce-001',
        name: 'SLAM DUNK — Champion Edition',
        price: 34.99,
        originalPrice: 49.99,
        images: ['/basketball-fallback.jpg'],
        stock: 3,
        badge: 'Limited Edition',
        sku: 'SD-CE-001',
      },
      {
        id: 'sd-ce-002',
        name: 'SLAM DUNK — Pro Edition',
        price: 29.99,
        originalPrice: 39.99,
        images: ['/basketball-fallback.jpg'],
        stock: 0,
        badge: 'Pro',
        sku: 'SD-CE-002',
      },
    ])
  ),
  fetchProductById: vi.fn((id) =>
    Promise.resolve({
      id: 'sd-ce-001',
      name: 'SLAM DUNK — Champion Edition',
      price: 34.99,
      originalPrice: 49.99,
      images: ['/basketball-fallback.jpg'],
      stock: 3,
      badge: 'Limited Edition',
      sku: 'SD-CE-001',
      overview: {
        heading: 'Built for Champions',
        body: 'The SLAM DUNK Champion Edition is engineered from the ground up for elite performance.',
      },
      specs: [
        { label: 'Circumference', value: '29.5" (Official)' },
        { label: 'Weight', value: '22 oz (623g)' },
      ],
      materials: {
        heading: 'Premium Materials',
        items: [
          {
            name: '100% Microfiber Composite',
            desc: 'Exclusive coating material.',
          },
        ],
      },
      care: {
        heading: 'Care Instructions',
        items: ['Wipe clean with a damp cloth after each use.'],
      },
    })
  ),
}));

// Mock analytics
vi.mock('../utils/analytics.js', () => ({
  track: vi.fn(),
}));

// Mock recently viewed
vi.mock('../utils/recentlyViewed.js', () => ({
  getRecentlyViewed: vi.fn(() => []),
  addRecentlyViewed: vi.fn(),
}));

function TestWrapper({ children }) {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          {children}
          <ToastRegion />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

describe('Phase 3 Checkpoint — Shop and Product Pages', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('ShopPage', () => {
    it('loads products and displays them in a grid', async () => {
      render(
        <TestWrapper>
          <ShopPage />
        </TestWrapper>
      );

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('SLAM DUNK — Champion Edition')).toBeInTheDocument();
      });

      expect(screen.getByText('SLAM DUNK — Pro Edition')).toBeInTheDocument();
    });

    it('filters products by search term', async () => {
      render(
        <TestWrapper>
          <ShopPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('SLAM DUNK — Champion Edition')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search products...');
      fireEvent.change(searchInput, { target: { value: 'Champion' } });

      // Wait for debounce (300ms)
      await waitFor(
        () => {
          expect(screen.getByText('SLAM DUNK — Champion Edition')).toBeInTheDocument();
          expect(screen.queryByText('SLAM DUNK — Pro Edition')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('sorts products by price', async () => {
      render(
        <TestWrapper>
          <ShopPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('SLAM DUNK — Champion Edition')).toBeInTheDocument();
      });

      const sortSelect = screen.getByDisplayValue('Newest');
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

      // Verify sort applied (Pro Edition $29.99 should come before Champion $34.99)
      const products = screen.getAllByRole('article');
      expect(products[0]).toHaveTextContent('Pro Edition');
    });

    it('filters products by stock status', async () => {
      render(
        <TestWrapper>
          <ShopPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('SLAM DUNK — Champion Edition')).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue('All Products');
      fireEvent.change(filterSelect, { target: { value: 'out-stock' } });

      await waitFor(() => {
        expect(screen.queryByText('SLAM DUNK — Champion Edition')).not.toBeInTheDocument();
        expect(screen.getByText('SLAM DUNK — Pro Edition')).toBeInTheDocument();
      });
    });

    it('shows low stock badge when stock ≤ 5', async () => {
      render(
        <TestWrapper>
          <ShopPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Only 3 left')).toBeInTheDocument();
      });
    });

    it('shows contextual toast with product name and quantity on add to cart', async () => {
      render(
        <TestWrapper>
          <ShopPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('SLAM DUNK — Champion Edition')).toBeInTheDocument();
      });

      const addToCartButtons = screen.getAllByText('Add to Cart');
      fireEvent.click(addToCartButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/1 × SLAM DUNK — Champion Edition added to cart/)).toBeInTheDocument();
      });
    });
  });

  describe('ProductPage', () => {
    it('shows all product content including tabs', async () => {
      render(
        <TestWrapper>
          <ProductPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'SLAM DUNK — Champion Edition' })).toBeInTheDocument();
      });

      // Check all tabs are present
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Specifications')).toBeInTheDocument();
      expect(screen.getByText('Materials')).toBeInTheDocument();
      expect(screen.getByText('Care Guide')).toBeInTheDocument();

      // Check default tab content (Overview)
      expect(screen.getByText('Built for Champions')).toBeInTheDocument();
    });

    it('switches tabs correctly', async () => {
      render(
        <TestWrapper>
          <ProductPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'SLAM DUNK — Champion Edition' })).toBeInTheDocument();
      });

      // Click Specifications tab
      fireEvent.click(screen.getByText('Specifications'));
      await waitFor(() => {
        expect(screen.getByText('Circumference')).toBeInTheDocument();
        expect(screen.getByText('29.5" (Official)')).toBeInTheDocument();
      });

      // Click Materials tab
      fireEvent.click(screen.getByText('Materials'));
      await waitFor(() => {
        expect(screen.getByText('Premium Materials')).toBeInTheDocument();
        expect(screen.getByText('100% Microfiber Composite')).toBeInTheDocument();
      });

      // Click Care Guide tab
      fireEvent.click(screen.getByText('Care Guide'));
      await waitFor(() => {
        expect(screen.getByText('Care Instructions')).toBeInTheDocument();
        expect(screen.getByText('Wipe clean with a damp cloth after each use.')).toBeInTheDocument();
      });
    });

    it('shows low stock badge when stock ≤ 5', async () => {
      render(
        <TestWrapper>
          <ProductPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Only 3 left in stock')).toBeInTheDocument();
      });
    });

    it('shows contextual toast with product name and quantity on add to cart', async () => {
      render(
        <TestWrapper>
          <ProductPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'SLAM DUNK — Champion Edition' })).toBeInTheDocument();
      });

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(screen.getByText(/1 × SLAM DUNK — Champion Edition added to cart/)).toBeInTheDocument();
      });
    });

    it('injects JSON-LD script tag in document head', async () => {
      render(
        <TestWrapper>
          <ProductPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'SLAM DUNK — Champion Edition' })).toBeInTheDocument();
      });

      // Check for JSON-LD script tag
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBeGreaterThan(0);

      const jsonLd = JSON.parse(scripts[0].textContent);
      expect(jsonLd['@type']).toBe('Product');
      expect(jsonLd.name).toBe('SLAM DUNK — Champion Edition');
    });

    it('wishlist heart toggle persists to localStorage', async () => {
      render(
        <TestWrapper>
          <ProductPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'SLAM DUNK — Champion Edition' })).toBeInTheDocument();
      });

      // Click wishlist button
      const wishlistButton = screen.getByText('Add to wishlist');
      fireEvent.click(wishlistButton);

      await waitFor(() => {
        expect(screen.getByText('Remove from wishlist')).toBeInTheDocument();
      });

      // Check localStorage
      const wishlist = JSON.parse(localStorage.getItem('slam-dunk-wishlist') || '[]');
      expect(wishlist).toContain('sd-ce-001');
    });
  });
});
