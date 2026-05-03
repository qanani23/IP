// ─── ShopPage ─────────────────────────────────────────────────────────────────
// Product listing page with search, sort, filter, and recently viewed section.
// Fetches products via fetchProducts(), shows skeleton grid while loading.
// All filtering/sorting happens client-side.

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchProducts, fetchProductById } from '../api/products.js';
import { getRecentlyViewed } from '../utils/recentlyViewed.js';
import { track } from '../utils/analytics.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import PageContainer from '../components/PageContainer.jsx';
import ProductImage from '../components/ProductImage.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import { COLOR, FONT_SIZE, SPACE, RADIUS, LAYOUT, BREAKPOINT } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('all');
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const { addItem } = useCart();
  const { showToast } = useToast();

  const debouncedSearch = useDebounce(search, 300);

  // Fetch products on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (mounted) {
          setProducts(data);
          track('view_shop', { productCount: data.length });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Load recently viewed products
  useEffect(() => {
    const ids = getRecentlyViewed();
    if (ids.length === 0) {
      setRecentlyViewed([]);
      return;
    }

    // Fetch recently viewed products asynchronously
    Promise.all(ids.map((id) => fetchProductById(id).catch(() => null)))
      .then((products) => {
        setRecentlyViewed(products.filter(Boolean));
      })
      .catch((err) => {
        console.error('Failed to fetch recently viewed products:', err);
        setRecentlyViewed([]);
      });
  }, []);

  // Client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (debouncedSearch) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Stock filter
    if (filter === 'in-stock') {
      result = result.filter((p) => p.stock > 0);
    } else if (filter === 'out-stock') {
      result = result.filter((p) => p.stock === 0);
    }

    // Sort
    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    // 'newest' is default order from API

    return result;
  }, [products, debouncedSearch, filter, sort]);

  const handleAddToCart = (product) => {
    if (product.stock === 0) return;
    addItem(product, 1);
    track('add_to_cart', {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      price: product.price,
    });
    showToast({
      message: `${product.name} saved to listings`,
      type: 'success',
      action: { label: COPY.toast.viewCart, href: '/cart' },
      dedupeKey: `add-${product.id}`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Properties — {COPY.productName}</title>
      </Helmet>
      <Navigation />
      <PageContainer>
        {/* Header */}
        <div style={{ marginBottom: SPACE[6] }}>
          <h1
            style={{
              fontSize: FONT_SIZE.h1.desktop,
              color: COLOR.textPrimary,
              marginBottom: SPACE[3],
            }}
            className="shop-title"
          >
            Properties
          </h1>
        </div>

        {/* Controls */}
        <div
          style={{
            display: 'flex',
            gap: SPACE[3],
            marginBottom: SPACE[6],
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1 1 300px',
              minHeight: LAYOUT.minTouchTarget,
              padding: `0 ${SPACE[3]}px`,
              background: COLOR.bgSurface,
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: RADIUS.md,
              color: COLOR.textPrimary,
              fontSize: FONT_SIZE.body.desktop,
            }}
          />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              minHeight: LAYOUT.minTouchTarget,
              padding: `0 ${SPACE[3]}px`,
              background: COLOR.bgSurface,
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: RADIUS.md,
              color: COLOR.textPrimary,
              fontSize: FONT_SIZE.body.desktop,
            }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              minHeight: LAYOUT.minTouchTarget,
              padding: `0 ${SPACE[3]}px`,
              background: COLOR.bgSurface,
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: RADIUS.md,
              color: COLOR.textPrimary,
              fontSize: FONT_SIZE.body.desktop,
            }}
          >
            <option value="all">All Properties</option>
            <option value="in-stock">Available</option>
            <option value="out-stock">Under Contract</option>
          </select>
        </div>

        {/* Loading skeleton grid */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: SPACE[4],
              marginBottom: SPACE[8],
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton width="100%" height={280} borderRadius={RADIUS.lg} />
                <Skeleton width="80%" height={20} style={{ marginTop: SPACE[3] }} />
                <Skeleton width="40%" height={20} style={{ marginTop: SPACE[2] }} />
              </div>
            ))}
          </div>
        )}

        {/* Product grid */}
        {!loading && filteredProducts.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: SPACE[4],
              marginBottom: SPACE[8],
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: `${SPACE[9]}px 0`,
              color: COLOR.textSecondary,
            }}
          >
            <p style={{ fontSize: FONT_SIZE.h3.desktop, marginBottom: SPACE[3] }}>
              No properties match your search.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
                setSort('newest');
              }}
              style={{
                padding: `${SPACE[3]}px ${SPACE[5]}px`,
                background: COLOR.accentOrange,
                color: COLOR.textPrimary,
                border: 'none',
                borderRadius: RADIUS.md,
                fontSize: FONT_SIZE.body.desktop,
                cursor: 'pointer',
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Recently Viewed */}
        {!loading && recentlyViewed.length > 0 && (
          <div style={{ marginTop: SPACE[8] }}>
            <h2
              style={{
                fontSize: FONT_SIZE.h2.desktop,
                color: COLOR.textPrimary,
                marginBottom: SPACE[4],
              }}
            >
              {COPY.shop.recentlyViewed}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: SPACE[4],
              }}
            >
              {recentlyViewed.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </PageContainer>
      <Footer />

      <style>{`
        @media (max-width: ${BREAKPOINT.mobile - 1}px) {
          .shop-title {
            font-size: ${FONT_SIZE.h2.mobile} !important;
          }
        }
      `}</style>
    </>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ product, onAddToCart }) {
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <article
      style={{
        background: COLOR.bgSurface,
        borderRadius: RADIUS.lg,
        padding: SPACE[4],
        display: 'flex',
        flexDirection: 'column',
        gap: SPACE[3],
      }}
    >
      <Link to="/product" style={{ textDecoration: 'none' }}>
        <ProductImage src={product.images[0]} alt={product.name} />
      </Link>

      <div style={{ flex: 1 }}>
        <Link
          to="/product"
          style={{
            textDecoration: 'none',
            color: COLOR.textPrimary,
          }}
        >
          <h2
            style={{
              fontSize: FONT_SIZE.h3.desktop,
              marginBottom: SPACE[2],
              color: COLOR.textPrimary,
            }}
          >
            {product.name}
          </h2>
        </Link>

        <p
          style={{
            fontSize: FONT_SIZE.body.desktop,
            color: COLOR.textSecondary,
            marginBottom: SPACE[2],
          }}
        >
          ${product.price.toFixed(2)}
        </p>

        {isLowStock && (
          <div
            style={{
              display: 'inline-block',
              padding: `${SPACE[1]}px ${SPACE[2]}px`,
              background: 'rgba(232, 80, 10, 0.2)',
              color: COLOR.accentOrange,
              borderRadius: RADIUS.sm,
              fontSize: FONT_SIZE.caption.desktop,
              marginBottom: SPACE[2],
            }}
          >
            Only {product.stock} available
          </div>
        )}
      </div>

      <button
        onClick={() => onAddToCart(product)}
        disabled={isOutOfStock}
        style={{
          width: '100%',
          minHeight: LAYOUT.minTouchTarget,
          padding: `${SPACE[3]}px ${SPACE[4]}px`,
          background: isOutOfStock ? COLOR.bgElevated : COLOR.accentOrange,
          color: isOutOfStock ? COLOR.textMuted : COLOR.textPrimary,
          border: 'none',
          borderRadius: RADIUS.md,
          fontSize: FONT_SIZE.body.desktop,
          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
          opacity: isOutOfStock ? 0.5 : 1,
        }}
      >
        {isOutOfStock ? COPY.product.outOfStock : COPY.cta}
      </button>
    </article>
  );
}
