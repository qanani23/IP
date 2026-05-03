// ─── ProductPage Tests ───────────────────────────────────────────────────────
// Unit tests for ProductPage wishlist functionality

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductPage from './ProductPage.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { ToastRegion } from '../components/Toast.jsx';

// Mock the API
vi.mock('../api/products.js', () => ({
  fetchProductById: vi.fn(() =>
    Promise.resolve({
      id: 'sd-ce-001',
      name: 'SLAM DUNK — Champion Edition',
      price: 34.99,
      originalPrice: 49.99,
      stock: 10,
      images: ['/test-image.jpg'],
      badge: 'Limited Edition',
      overview: {
        heading: 'Built for Champions',
        body: 'Test description',
      },
      specs: [],
      materials: { heading: 'Materials', items: [] },
      care: { heading: 'Care', items: [] },
    })
  ),
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <CartProvider>
      <ToastProvider>
        {children}
        <ToastRegion />
      </ToastProvider>
    </CartProvider>
  </BrowserRouter>
);

describe('ProductPage - Wishlist Heart Button', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('displays outline heart icon when product is not wishlisted', async () => {
    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    const button = screen.getByText('Add to wishlist').closest('button');
    expect(button).toBeInTheDocument();
    
    // Check for outline heart (has stroke attribute)
    const svg = button.querySelector('svg');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('fill', 'none');
  });

  it('displays filled heart icon when product is wishlisted', async () => {
    // Pre-populate wishlist
    localStorage.setItem('slam-dunk-wishlist', JSON.stringify(['sd-ce-001']));

    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Remove from wishlist')).toBeInTheDocument();
    });

    const button = screen.getByText('Remove from wishlist').closest('button');
    expect(button).toBeInTheDocument();
    
    // Check for filled heart (has fill attribute)
    const svg = button.querySelector('svg');
    expect(svg).toHaveAttribute('fill', 'currentColor');
    expect(svg).toHaveAttribute('stroke', 'none');
  });

  it('shows toast notification "Added to wishlist" when adding to wishlist', async () => {
    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    const wishlistButton = screen.getByText('Add to wishlist');
    fireEvent.click(wishlistButton);

    await waitFor(() => {
      expect(screen.getByText('Added to wishlist')).toBeInTheDocument();
    });
  });

  it('does not show toast when removing from wishlist', async () => {
    // Pre-populate wishlist
    localStorage.setItem('slam-dunk-wishlist', JSON.stringify(['sd-ce-001']));

    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Remove from wishlist')).toBeInTheDocument();
    });

    const wishlistButton = screen.getByText('Remove from wishlist');
    fireEvent.click(wishlistButton);

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    // Toast should not show "Added to wishlist" when removing
    expect(screen.queryByText('Added to wishlist')).not.toBeInTheDocument();
  });

  it('persists wishlist state to localStorage', async () => {
    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    const wishlistButton = screen.getByText('Add to wishlist');
    fireEvent.click(wishlistButton);

    await waitFor(() => {
      const wishlist = JSON.parse(localStorage.getItem('slam-dunk-wishlist') || '[]');
      expect(wishlist).toContain('sd-ce-001');
    });
  });

  it('has proper aria-label for accessibility', async () => {
    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    const button = screen.getByLabelText('Add to wishlist');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      const updatedButton = screen.getByLabelText('Remove from wishlist');
      expect(updatedButton).toBeInTheDocument();
    });
  });
});
