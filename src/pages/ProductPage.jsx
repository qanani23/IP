// ─── ProductPage ──────────────────────────────────────────────────────────────
// Product detail page with tabs, wishlist, breadcrumb, and add-to-cart.
// Fetches product via fetchProductById(), shows skeleton while loading.
// Adds to recently viewed on mount, injects JSON-LD structured data.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/products.js';
import { addRecentlyViewed } from '../utils/recentlyViewed.js';
import { track } from '../utils/analytics.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../hooks/useWishlist.js';
import PageContainer from '../components/PageContainer.jsx';
import ProductImage from '../components/ProductImage.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import { COLOR, FONT_SIZE, SPACE, RADIUS, LAYOUT } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  const { addItem } = useCart();
  const { showToast } = useToast();
  const { toggle, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  // Fetch product on mount (hardcoded to sd-ce-001 as per task spec)
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProductById('ak-se-001')
      .then((data) => {
        if (mounted) {
          setProduct(data);
          addRecentlyViewed(data.id);
          track('view_product', {
            productId: data.id,
            productName: data.name,
            price: data.price,
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Inject JSON-LD structured data
  useEffect(() => {
    if (!product) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images,
      description: product.overview?.body || '',
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability:
          product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
      },
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [product]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addItem(product, quantity);
    track('add_to_cart', {
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
    });
    showToast({
      message: `${quantity} × ${product.name} added to cart`,
      type: 'success',
      action: { label: COPY.toast.viewCart, href: '/cart' },
      dedupeKey: `add-${product.id}`,
    });
  };

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    addItem(product, quantity);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    const wasWishlisted = isWishlisted(product.id);
    toggle(product.id);
    if (!wasWishlisted) {
      showToast({
        message: COPY.toast.addedToWishlist,
        type: 'success',
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <Skeleton width="200px" height={20} style={{ marginBottom: SPACE[4] }} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: SPACE[6],
            }}
          >
            <Skeleton width="100%" height={500} borderRadius={RADIUS.lg} />
            <div>
              <Skeleton width="100%" height={40} style={{ marginBottom: SPACE[3] }} />
              <Skeleton width="80%" height={20} style={{ marginBottom: SPACE[3] }} />
              <Skeleton width="60%" height={30} style={{ marginBottom: SPACE[4] }} />
              <Skeleton width="100%" height={200} />
            </div>
          </div>
        </PageContainer>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <p style={{ color: COLOR.textSecondary }}>Product not found.</p>
        </PageContainer>
        <Footer />
      </>
    );
  }

  const isInStock = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <>
      <Navigation />
      <PageContainer>
        <title>
          {product.name} — {COPY.productName}
        </title>
        <meta name="description" content={product.overview?.body || ''} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.overview?.body || ''} />
        <meta property="og:image" content={product.images[0]} />

        {/* Breadcrumb */}
        <div style={{ marginBottom: SPACE[4] }}>
          <Breadcrumb currentPage={product.name} />
        </div>

        {/* Product layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
            gap: SPACE[6],
            marginBottom: SPACE[8],
          }}
        >
          {/* Left: Image */}
          <div style={{ position: 'sticky', top: LAYOUT.navHeight + SPACE[4] }}>
            <ProductImage src={product.images[0]} alt={product.name} />
          </div>

          {/* Right: Details */}
          <div>
            {/* Badge */}
            {product.badge && (
              <div
                style={{
                  display: 'inline-block',
                  padding: `${SPACE[1]}px ${SPACE[3]}px`,
                  background: COLOR.accentGold,
                  color: COLOR.bgPrimary,
                  borderRadius: RADIUS.pill,
                  fontSize: FONT_SIZE.caption.desktop,
                  fontWeight: 600,
                  marginBottom: SPACE[3],
                }}
              >
                {product.badge}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontSize: FONT_SIZE.h1.desktop,
                color: COLOR.textPrimary,
                marginBottom: SPACE[2],
              }}
            >
              {product.name}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: FONT_SIZE.body.desktop,
                color: COLOR.textSecondary,
                marginBottom: SPACE[4],
              }}
            >
              {COPY.product.subtitle}
            </p>

            {/* Price */}
            <div style={{ marginBottom: SPACE[4] }}>
              <span
                style={{
                  fontSize: FONT_SIZE.h2.desktop,
                  color: COLOR.textPrimary,
                  marginRight: SPACE[3],
                }}
              >
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontSize: FONT_SIZE.body.desktop,
                    color: COLOR.textMuted,
                    textDecoration: 'line-through',
                  }}
                >
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div style={{ marginBottom: SPACE[4] }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: SPACE[2],
                  fontSize: FONT_SIZE.body.desktop,
                  color: isInStock ? '#4ade80' : '#ef4444',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: isInStock ? '#4ade80' : '#ef4444',
                  }}
                />
                {isInStock ? COPY.product.inStock : COPY.product.outOfStock}
              </span>
            </div>

            {/* Low stock badge */}
            {isLowStock && (
              <div
                style={{
                  display: 'inline-block',
                  padding: `${SPACE[2]}px ${SPACE[3]}px`,
                  background: 'rgba(232, 80, 10, 0.2)',
                  color: COLOR.accentOrange,
                  borderRadius: RADIUS.sm,
                  fontSize: FONT_SIZE.caption.desktop,
                  marginBottom: SPACE[4],
                }}
              >
                Only {product.stock} left in stock
              </div>
            )}

            {/* Quantity selector */}
            <div style={{ marginBottom: SPACE[4] }}>
              <label
                htmlFor="quantity"
                style={{
                  display: 'block',
                  fontSize: FONT_SIZE.caption.desktop,
                  color: COLOR.textSecondary,
                  marginBottom: SPACE[2],
                }}
              >
                {COPY.product.quantityLabel}
              </label>
              <input
                id="quantity"
                type="number"
                inputMode="numeric"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={!isInStock}
                style={{
                  width: 100,
                  minHeight: LAYOUT.minTouchTarget,
                  padding: `0 ${SPACE[3]}px`,
                  background: COLOR.bgSurface,
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: RADIUS.md,
                  color: COLOR.textPrimary,
                  fontSize: FONT_SIZE.body.desktop,
                }}
              />
            </div>

            {/* Save Property button */}
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              style={{
                width: '100%',
                minHeight: LAYOUT.minTouchTarget,
                padding: `${SPACE[3]}px ${SPACE[4]}px`,
                background: isInStock ? COLOR.accentOrange : COLOR.bgElevated,
                color: isInStock ? COLOR.textPrimary : COLOR.textMuted,
                border: 'none',
                borderRadius: RADIUS.md,
                fontSize: FONT_SIZE.body.desktop,
                fontWeight: 600,
                cursor: isInStock ? 'pointer' : 'not-allowed',
                marginBottom: SPACE[3],
              }}
            >
              {COPY.product.addToCart}
            </button>

            {/* Schedule Visit button */}
            <button
              onClick={handleBuyNow}
              disabled={!isInStock}
              style={{
                width: '100%',
                minHeight: LAYOUT.minTouchTarget,
                padding: `${SPACE[3]}px ${SPACE[4]}px`,
                background: 'transparent',
                color: isInStock ? COLOR.textPrimary : COLOR.textMuted,
                border: `1px solid ${isInStock ? COLOR.textPrimary : COLOR.textMuted}`,
                borderRadius: RADIUS.md,
                fontSize: FONT_SIZE.body.desktop,
                fontWeight: 600,
                cursor: isInStock ? 'pointer' : 'not-allowed',
                marginBottom: SPACE[4],
              }}
            >
              {COPY.product.buyNow}
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={handleWishlistToggle}
              aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: SPACE[2],
                padding: `${SPACE[2]}px ${SPACE[3]}px`,
                background: 'transparent',
                color: COLOR.textSecondary,
                border: 'none',
                fontSize: FONT_SIZE.body.desktop,
                cursor: 'pointer',
                marginBottom: SPACE[4],
              }}
            >
              {isWishlisted(product.id) ? (
                // Filled heart
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              ) : (
                // Outline heart
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              )}
              {isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            </button>

            {/* Shipping estimator */}
            <p
              style={{
                fontSize: FONT_SIZE.caption.desktop,
                color: COLOR.textSecondary,
                marginBottom: SPACE[6],
              }}
            >
              Estimated delivery: 3–5 business days
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: SPACE[8] }}>
          <div
            style={{
              display: 'flex',
              gap: SPACE[4],
              borderBottom: `1px solid rgba(255,255,255,0.1)`,
              marginBottom: SPACE[4],
            }}
          >
            {['overview', 'specs', 'materials', 'care'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: `${SPACE[3]}px 0`,
                  background: 'transparent',
                  color: activeTab === tab ? COLOR.textPrimary : COLOR.textSecondary,
                  border: 'none',
                  borderBottom: `2px solid ${
                    activeTab === tab ? COLOR.accentOrange : 'transparent'
                  }`,
                  fontSize: FONT_SIZE.body.desktop,
                  cursor: 'pointer',
                }}
              >
                {COPY.product.tabs[tab]}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ opacity: 1, transition: 'opacity 300ms' }}>
            {activeTab === 'overview' && product.overview && (
              <div>
                <h2
                  style={{
                    fontSize: FONT_SIZE.h3.desktop,
                    color: COLOR.textPrimary,
                    marginBottom: SPACE[3],
                  }}
                >
                  {product.overview.heading}
                </h2>
                <p style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textSecondary }}>
                  {product.overview.body}
                </p>
              </div>
            )}

            {activeTab === 'specs' && product.specs && (
              <div>
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: `${SPACE[3]}px 0`,
                      borderBottom: `1px solid rgba(255,255,255,0.1)`,
                    }}
                  >
                    <span style={{ color: COLOR.textSecondary }}>{spec.label}</span>
                    <span style={{ color: COLOR.textPrimary }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'materials' && product.materials && (
              <div>
                <h2
                  style={{
                    fontSize: FONT_SIZE.h3.desktop,
                    color: COLOR.textPrimary,
                    marginBottom: SPACE[4],
                  }}
                >
                  {product.materials.heading}
                </h2>
                {product.materials.items.map((item, i) => (
                  <div key={i} style={{ marginBottom: SPACE[4] }}>
                    <h3
                      style={{
                        fontSize: FONT_SIZE.body.desktop,
                        color: COLOR.textPrimary,
                        marginBottom: SPACE[2],
                      }}
                    >
                      {item.name}
                    </h3>
                    <p style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textSecondary }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'care' && product.care && (
              <div>
                <h2
                  style={{
                    fontSize: FONT_SIZE.h3.desktop,
                    color: COLOR.textPrimary,
                    marginBottom: SPACE[4],
                  }}
                >
                  {product.care.heading}
                </h2>
                <ul style={{ listStyle: 'disc', paddingLeft: SPACE[5] }}>
                  {product.care.items.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: FONT_SIZE.body.desktop,
                        color: COLOR.textSecondary,
                        marginBottom: SPACE[2],
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
}
