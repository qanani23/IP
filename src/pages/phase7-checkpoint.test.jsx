// ─── Phase 7 Checkpoint Tests ────────────────────────────────────────────────
// Comprehensive verification of Phase 7 requirements:
// - Wishlist persists across page refreshes
// - Heart toggle correctly adds/removes from wishlist
// - Recently viewed list capped at 5, most recent first
// - "Recently Viewed" section appears on Shop page after visiting a product

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductPage from './ProductPage.jsx';
import ShopPage from './ShopPage.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { ToastRegion } from '../components/Toast.jsx';
import { addRecentlyViewed, getRecentlyViewed, clearRecentlyViewed } from '../utils/recentlyViewed.js';
import { useWishlist } from '../hooks/useWishlist.js';

// Mock the API
vi.mock('../api/products.js', () => ({
  fetchProductById: vi.fn((id) => {
    const products = {
      'sd-ce-001': {
        id: 'sd-ce-001',
        name: 'SLAM DUNK — Champion Edition',
        price: 34.99,
        originalPrice: 49.99,
        stock: 10,
        images: ['/test-image.jpg'],
        badge: 'Limited Edition',
        sku: 'SD-CE-001',
        overview: {
          heading: 'Built for Champions',
          body: 'Test description',
        },
        specs: [],
        materials: { heading: 'Materials', items: [] },
        care: { heading: 'Care', items: [] },
      },
      'sd-ce-002': {
        id: 'sd-ce-002',
        name: 'SLAM DUNK — Pro Edition',
        price: 29.99,
        stock: 5,
        images: ['/test-image-2.jpg'],
        sku: 'SD-CE-002',
        overview: {
          heading: 'Pro Performance',
          body: 'Pro description',
        },
        specs: [],
        materials: { heading: 'Materials', items: [] },
        care: { heading: 'Care', items: [] },
      },
      'sd-ce-003': {
        id: 'sd-ce-003',
        name: 'SLAM DUNK — Elite Edition',
        price: 39.99,
        stock: 8,
        images: ['/test-image-3.jpg'],
        sku: 'SD-CE-003',
        overview: {
          heading: 'Elite Performance',
          body: 'Elite description',
        },
        specs: [],
        materials: { heading: 'Materials', items: [] },
        care: { heading: 'Care', items: [] },
      },
      'sd-ce-004': {
        id: 'sd-ce-004',
        name: 'SLAM DUNK — Rookie Edition',
        price: 24.99,
        stock: 12,
        images: ['/test-image-4.jpg'],
        sku: 'SD-CE-004',
        overview: {
          heading: 'Rookie Start',
          body: 'Rookie description',
        },
        specs: [],
        materials: { heading: 'Materials', items: [] },
        care: { heading: 'Care', items: [] },
      },
      'sd-ce-005': {
        id: 'sd-ce-005',
        name: 'SLAM DUNK — Legend Edition',
        price: 44.99,
        stock: 3,
        images: ['/test-image-5.jpg'],
        sku: 'SD-CE-005',
        overview: {
          heading: 'Legendary Performance',
          body: 'Legend description',
        },
        specs: [],
        materials: { heading: 'Materials', items: [] },
        care: { heading: 'Care', items: [] },
      },
      'sd-ce-006': {
        id: 'sd-ce-006',
        name: 'SLAM DUNK — Veteran Edition',
        price: 49.99,
        stock: 6,
        images: ['/test-image-6.jpg'],
        sku: 'SD-CE-006',
        overview: {
          heading: 'Veteran Quality',
          body: 'Veteran description',
        },
        specs: [],
        materials: { heading: 'Materials', items: [] },
        care: { heading: 'Care', items: [] },
      },
    };
    return Promise.resolve(products[id]);
  }),
  fetchProducts: vi.fn(() =>
    Promise.resolve([
      {
        id: 'sd-ce-001',
        name: 'SLAM DUNK — Champion Edition',
        price: 34.99,
        images: ['/test-image.jpg'],
        stock: 10,
      },
      {
        id: 'sd-ce-002',
        name: 'SLAM DUNK — Pro Edition',
        price: 29.99,
        images: ['/test-image-2.jpg'],
        stock: 5,
      },
    ])
  ),
}));

// Mock analytics
vi.mock('../utils/analytics.js', () => ({
  track: vi.fn(),
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

describe('Phase 7 Checkpoint — Wishlist Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('persists wishlist to localStorage when adding a product', async () => {
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

  it('persists wishlist across page refreshes (simulated re-render)', async () => {
    // First render: add to wishlist
    const { unmount } = render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add to wishlist'));

    await waitFor(() => {
      expect(screen.getByText('Remove from wishlist')).toBeInTheDocument();
    });

    // Unmount (simulate page close)
    unmount();

    // Second render: verify wishlist persisted
    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Remove from wishlist')).toBeInTheDocument();
    });

    // Verify localStorage still contains the product
    const wishlist = JSON.parse(localStorage.getItem('slam-dunk-wishlist') || '[]');
    expect(wishlist).toContain('sd-ce-001');
  });

  it('removes product from wishlist when toggling off', async () => {
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

    fireEvent.click(screen.getByText('Remove from wishlist'));

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    // Verify localStorage updated
    const wishlist = JSON.parse(localStorage.getItem('slam-dunk-wishlist') || '[]');
    expect(wishlist).not.toContain('sd-ce-001');
  });
});

describe('Phase 7 Checkpoint — Heart Toggle Functionality', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('displays outline heart when product is not wishlisted', async () => {
    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    const button = screen.getByText('Add to wishlist').closest('button');
    const svg = button.querySelector('svg');
    
    // Outline heart has stroke and no fill
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('fill', 'none');
  });

  it('displays filled heart when product is wishlisted', async () => {
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
    const svg = button.querySelector('svg');
    
    // Filled heart has fill and no stroke
    expect(svg).toHaveAttribute('fill', 'currentColor');
    expect(svg).toHaveAttribute('stroke', 'none');
  });

  it('toggles heart icon when clicked', async () => {
    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    // Click to add
    fireEvent.click(screen.getByText('Add to wishlist'));

    await waitFor(() => {
      expect(screen.getByText('Remove from wishlist')).toBeInTheDocument();
    });

    // Click to remove
    fireEvent.click(screen.getByText('Remove from wishlist'));

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });
  });

  it('shows toast notification when adding to wishlist', async () => {
    render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add to wishlist'));

    await waitFor(() => {
      expect(screen.getByText('Added to wishlist')).toBeInTheDocument();
    });
  });
});

describe('Phase 7 Checkpoint — Recently Viewed Capping', () => {
  beforeEach(() => {
    localStorage.clear();
    clearRecentlyViewed();
    vi.clearAllMocks();
  });

  it('caps recently viewed list at 5 items', () => {
    // Add 6 products
    addRecentlyViewed('sd-ce-001');
    addRecentlyViewed('sd-ce-002');
    addRecentlyViewed('sd-ce-003');
    addRecentlyViewed('sd-ce-004');
    addRecentlyViewed('sd-ce-005');
    addRecentlyViewed('sd-ce-006');

    const recentlyViewed = getRecentlyViewed();
    
    // Should only have 5 items
    expect(recentlyViewed).toHaveLength(5);
    
    // Should not contain the first item (sd-ce-001)
    expect(recentlyViewed).not.toContain('sd-ce-001');
    
    // Should contain the last 5 items
    expect(recentlyViewed).toContain('sd-ce-006');
    expect(recentlyViewed).toContain('sd-ce-005');
    expect(recentlyViewed).toContain('sd-ce-004');
    expect(recentlyViewed).toContain('sd-ce-003');
    expect(recentlyViewed).toContain('sd-ce-002');
  });

  it('maintains most recent first order', () => {
    addRecentlyViewed('sd-ce-001');
    addRecentlyViewed('sd-ce-002');
    addRecentlyViewed('sd-ce-003');

    const recentlyViewed = getRecentlyViewed();
    
    // Most recent should be first
    expect(recentlyViewed[0]).toBe('sd-ce-003');
    expect(recentlyViewed[1]).toBe('sd-ce-002');
    expect(recentlyViewed[2]).toBe('sd-ce-001');
  });

  it('deduplicates when viewing the same product twice', () => {
    addRecentlyViewed('sd-ce-001');
    addRecentlyViewed('sd-ce-002');
    addRecentlyViewed('sd-ce-001'); // View again

    const recentlyViewed = getRecentlyViewed();
    
    // Should only have 2 items
    expect(recentlyViewed).toHaveLength(2);
    
    // sd-ce-001 should be first (most recent)
    expect(recentlyViewed[0]).toBe('sd-ce-001');
    expect(recentlyViewed[1]).toBe('sd-ce-002');
  });

  it('persists recently viewed to localStorage', () => {
    addRecentlyViewed('sd-ce-001');
    addRecentlyViewed('sd-ce-002');

    const stored = JSON.parse(localStorage.getItem('slam-dunk-recently-viewed') || '[]');
    
    expect(stored).toHaveLength(2);
    expect(stored[0]).toBe('sd-ce-002');
    expect(stored[1]).toBe('sd-ce-001');
  });
});

describe('Phase 7 Checkpoint — Recently Viewed Section on Shop Page', () => {
  beforeEach(() => {
    localStorage.clear();
    clearRecentlyViewed();
    vi.clearAllMocks();
  });

  it('displays "Recently Viewed" section when products exist', async () => {
    // Pre-populate recently viewed
    addRecentlyViewed('sd-ce-002');
    addRecentlyViewed('sd-ce-001');

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

    // Wait for recently viewed section
    await waitFor(
      () => {
        expect(screen.getByText('Recently Viewed')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Verify recently viewed products are displayed (may appear multiple times)
    await waitFor(() => {
      const proEditions = screen.getAllByText('SLAM DUNK — Pro Edition');
      expect(proEditions.length).toBeGreaterThan(0);
    });
  });

  it('does not display "Recently Viewed" section when list is empty', async () => {
    // Ensure recently viewed is empty
    clearRecentlyViewed();

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

    // Wait a bit to ensure recently viewed section doesn't appear
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify recently viewed section is not present
    expect(screen.queryByText('Recently Viewed')).not.toBeInTheDocument();
  });

  it('fetches recently viewed products using fetchProductById', async () => {
    const { fetchProductById } = await import('../api/products.js');
    
    addRecentlyViewed('sd-ce-002');
    addRecentlyViewed('sd-ce-001');

    render(
      <TestWrapper>
        <ShopPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const products = screen.getAllByText('SLAM DUNK — Champion Edition');
      expect(products.length).toBeGreaterThan(0);
    });

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

describe('Phase 7 Checkpoint — Integration Test', () => {
  beforeEach(() => {
    localStorage.clear();
    clearRecentlyViewed();
    vi.clearAllMocks();
  });

  it('complete workflow: add to wishlist, view products, see recently viewed', async () => {
    // Step 1: View ProductPage and add to wishlist
    const { unmount: unmountProduct } = render(
      <TestWrapper>
        <ProductPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to wishlist')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add to wishlist'));

    await waitFor(() => {
      expect(screen.getByText('Added to wishlist')).toBeInTheDocument();
    });

    // Verify wishlist persisted
    let wishlist = JSON.parse(localStorage.getItem('slam-dunk-wishlist') || '[]');
    expect(wishlist).toContain('sd-ce-001');

    unmountProduct();

    // Step 2: Add more products to recently viewed
    addRecentlyViewed('sd-ce-002');
    addRecentlyViewed('sd-ce-003');

    // Step 3: Navigate to ShopPage
    render(
      <TestWrapper>
        <ShopPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const products = screen.getAllByText('SLAM DUNK — Champion Edition');
      expect(products.length).toBeGreaterThan(0);
    });

    // Verify recently viewed section appears
    await waitFor(
      () => {
        expect(screen.getByText('Recently Viewed')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Step 4: Verify wishlist still persisted
    wishlist = JSON.parse(localStorage.getItem('slam-dunk-wishlist') || '[]');
    expect(wishlist).toContain('sd-ce-001');

    // Step 5: Verify recently viewed order (most recent first)
    const recentlyViewed = getRecentlyViewed();
    expect(recentlyViewed[0]).toBe('sd-ce-003');
    expect(recentlyViewed[1]).toBe('sd-ce-002');
    expect(recentlyViewed[2]).toBe('sd-ce-001');
  });
});
