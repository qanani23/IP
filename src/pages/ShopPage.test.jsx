// ─── ShopPage Recently Viewed Tests ──────────────────────────────────────────
// Verifies recently viewed functionality on ShopPage

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import ShopPage from './ShopPage.jsx';

// Mock API calls
vi.mock('../api/products.js', () => ({
  fetchProducts: vi.fn(() =>
    Promise.resolve([
      {
        id: 'sd-ce-001',
        name: 'SLAM DUNK — Champion Edition',
        price: 34.99,
        images: ['/basketball-fallback.jpg'],
        stock: 3,
      },
    ])
  ),
  fetchProductById: vi.fn((id) => {
    const products = {
      'sd-ce-001': {
        id: 'sd-ce-001',
        name: 'SLAM DUNK — Champion Edition',
        price: 34.99,
        images: ['/basketball-fallback.jpg'],
        stock: 3,
      },
      'sd-ce-002': {
        id: 'sd-ce-002',
        name: 'SLAM DUNK — Pro Edition',
        price: 29.99,
        images: ['/basketball-fallback.jpg'],
        stock: 5,
      },
    };
    return Promise.resolve(products[id]);
  }),
}));

// Mock analytics
vi.mock('../utils/analytics.js', () => ({
  track: vi.fn(),
}));

// Mock recently viewed with actual implementation
const mockRecentlyViewed = ['sd-ce-002', 'sd-ce-001'];
vi.mock('../utils/recentlyViewed.js', () => ({
  getRecentlyViewed: vi.fn(() => mockRecentlyViewed),
  addRecentlyViewed: vi.fn(),
}));

function TestWrapper({ children }) {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>{children}</ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

describe('ShopPage — Recently Viewed', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('displays recently viewed section when products exist', async () => {
    render(
      <TestWrapper>
        <ShopPage />
      </TestWrapper>
    );

    // Wait for main products to load
    await waitFor(() => {
      const products = screen.getAllByText('SLAM DUNK — Champion Edition');
      expect(products.length).toBeGreaterThan(0);
    });

    // Wait for recently viewed section to appear
    await waitFor(
      () => {
        expect(screen.getByText('Recently Viewed')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Verify recently viewed products are displayed
    await waitFor(() => {
      expect(screen.getByText('SLAM DUNK — Pro Edition')).toBeInTheDocument();
    });
  });

  it('fetches recently viewed products using fetchProductById', async () => {
    const { fetchProductById } = await import('../api/products.js');

    render(
      <TestWrapper>
        <ShopPage />
      </TestWrapper>
    );

    // Wait for main products to load first
    await waitFor(() => {
      const products = screen.getAllByText('SLAM DUNK — Champion Edition');
      expect(products.length).toBeGreaterThan(0);
    });

    // Wait a bit more for recently viewed to load
    await waitFor(
      () => {
        expect(screen.getByText('Recently Viewed')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Verify fetchProductById was called for each recently viewed product
    expect(fetchProductById).toHaveBeenCalledWith('sd-ce-002');
    expect(fetchProductById).toHaveBeenCalledWith('sd-ce-001');
  });
});
