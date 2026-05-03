// ─── CartPage ─────────────────────────────────────────────────────────────────
// Cart page with items list, empty state, order summary, and promo code input.
// Unavailable item notice when product id not in PRODUCTS.
// Analytics tracking on mount.

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext.jsx';
import { PRODUCTS } from '../data/productData.js';
import { track } from '../utils/analytics.js';
import CartItem from '../components/CartItem.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import PageContainer from '../components/PageContainer.jsx';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { COLOR, SPACE, RADIUS, FONT_SIZE, LAYOUT, BREAKPOINT } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    promoCode,
    promoDiscount,
    updateQuantity,
    removeItem,
    applyPromo,
  } = useCart();

  const [isInitializing, setIsInitializing] = useState(true);

  // Set meta tags
  useEffect(() => {
    document.title = `${COPY.cart.title} — ${COPY.productName} Real Estate`;
    
    // Set or update robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = 'noindex';

    return () => {
      // Clean up robots meta on unmount
      if (robotsMeta && robotsMeta.parentNode) {
        robotsMeta.parentNode.removeChild(robotsMeta);
      }
    };
  }, []);

  useEffect(() => {
    // Simulate initialization delay
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      track('view_cart', { cartTotal: subtotal, itemCount });
    }
  }, [isInitializing, subtotal, itemCount]);

  const handleApplyPromo = (code, discount) => {
    applyPromo(code, discount);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  // No availability check — properties are always treated as available
  const unavailableItems = [];

  if (isInitializing) {
    return (
      <>
        <Helmet>
          <title>{COPY.cart.title} — {COPY.productName}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Navigation />
        <PageContainer>
        <div style={{ padding: `${SPACE[7]}px 0` }}>
          <Skeleton width={200} height={40} style={{ marginBottom: SPACE[5] }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: SPACE[5] }}>
            <div>
              <Skeleton width="100%" height={120} style={{ marginBottom: SPACE[4] }} />
              <Skeleton width="100%" height={120} style={{ marginBottom: SPACE[4] }} />
              <Skeleton width="100%" height={120} />
            </div>
          </div>
        </div>
        </PageContainer>
        <Footer />
      </>
    );
  }

  // Empty state
  if (itemCount === 0) {
    return (
      <>
        <Helmet>
          <title>{COPY.cart.title} — {COPY.productName}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Navigation />
        <PageContainer>
        <div
          style={{
            textAlign:  'center',
            padding:    `${SPACE[9]}px 0`,
            minHeight:  '60vh',
            display:    'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize:     FONT_SIZE.h2.desktop,
              fontWeight:   600,
              color:        COLOR.textPrimary,
              margin:       0,
              marginBottom: SPACE[3],
            }}
          >
            {COPY.cart.empty}
          </h1>
          <p
            style={{
              fontSize:     FONT_SIZE.body.desktop,
              color:        COLOR.textSecondary,
              margin:       0,
              marginBottom: SPACE[5],
            }}
          >
            {COPY.cart.emptySubtitle}
          </p>
          <Link
            to="/shop"
            style={{
              display:       'inline-block',
              minHeight:     LAYOUT.minTouchTarget,
              background:    COLOR.accentOrange,
              border:        'none',
              borderRadius:  RADIUS.md,
              color:         COLOR.textPrimary,
              fontSize:      FONT_SIZE.body.desktop,
              fontWeight:    600,
              textDecoration: 'none',
              padding:       `${SPACE[3]}px ${SPACE[5]}px`,
              cursor:        'pointer',
              transition:    'opacity 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {COPY.cart.continueShopping}
          </Link>
        </div>
        </PageContainer>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{COPY.cart.title} — {COPY.productName}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navigation />
      <PageContainer>
      <div style={{ padding: `${SPACE[7]}px 0` }}>
        {/* Page Title */}
        <h1
          style={{
            fontSize:     FONT_SIZE.h2.desktop,
            fontWeight:   600,
            color:        COLOR.textPrimary,
            margin:       0,
            marginBottom: SPACE[6],
          }}
        >
          {COPY.cart.title}
        </h1>

        {/* Layout: 65% items / 35% summary on desktop, stacked on mobile */}
        <div
          className="cart-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: SPACE[6],
          }}
        >
          {/* Items Section */}
          <div>
            {/* Unavailable Items Warning */}
            {unavailableItems.length > 0 && (
              <div
                role="alert"
                style={{
                  background:   COLOR.bgSurface,
                  border:       `1px solid ${COLOR.accentOrange}`,
                  borderRadius: RADIUS.md,
                  padding:      SPACE[4],
                  marginBottom: SPACE[5],
                }}
              >
                <p
                  style={{
                    fontSize:   FONT_SIZE.body.desktop,
                    color:      COLOR.accentOrange,
                    margin:     0,
                    marginBottom: SPACE[3],
                  }}
                >
                  {COPY.errors.productUnavailable}
                </p>
                {unavailableItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display:       'flex',
                      justifyContent: 'space-between',
                      alignItems:    'center',
                      marginBottom:  SPACE[2],
                    }}
                  >
                    <span style={{ fontSize: FONT_SIZE.caption.desktop, color: COLOR.textSecondary }}>
                      {item.name}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        minHeight:     LAYOUT.minTouchTarget,
                        background:    'transparent',
                        border:        `1px solid ${COLOR.accentOrange}`,
                        borderRadius:  RADIUS.md,
                        color:         COLOR.accentOrange,
                        fontSize:      FONT_SIZE.caption.desktop,
                        fontWeight:    600,
                        cursor:        'pointer',
                        padding:       `${SPACE[2]}px ${SPACE[3]}px`,
                      }}
                    >
                      {COPY.cart.remove}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Cart Items */}
            <div
              style={{
                background:   COLOR.bgSurface,
                borderRadius: RADIUS.lg,
                padding:      SPACE[5],
              }}
            >
              {items.map((item, index) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div>
            <OrderSummary
              subtotal={subtotal}
              shipping={0}
              tax={null}
              promoCode={promoCode}
              promoDiscount={promoDiscount}
              showPromoInput={true}
              onApplyPromo={handleApplyPromo}
            />

            {/* Proceed to Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              style={{
                width:         '100%',
                minHeight:     LAYOUT.minTouchTarget,
                background:    COLOR.accentOrange,
                border:        'none',
                borderRadius:  RADIUS.md,
                color:         COLOR.textPrimary,
                fontSize:      FONT_SIZE.body.desktop,
                fontWeight:    600,
                cursor:        'pointer',
                marginTop:     SPACE[4],
                padding:       `${SPACE[3]}px ${SPACE[5]}px`,
                transition:    'opacity 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {COPY.cart.checkout}
            </button>

            {/* Trust Badges */}
            <div
              style={{
                marginTop:     SPACE[5],
                padding:       SPACE[4],
                background:    COLOR.bgElevated,
                borderRadius:  RADIUS.md,
                display:       'flex',
                flexDirection: 'column',
                gap:           SPACE[2],
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: SPACE[2] }}>
                <span style={{ fontSize: FONT_SIZE.body.desktop }}>🔒</span>
                <span style={{ fontSize: FONT_SIZE.caption.desktop, color: COLOR.textSecondary }}>
                  {COPY.cart.secureCheckout}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: SPACE[2] }}>
                <span style={{ fontSize: FONT_SIZE.body.desktop }}>📦</span>
                <span style={{ fontSize: FONT_SIZE.caption.desktop, color: COLOR.textSecondary }}>
                  {COPY.cart.freeShipping}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: SPACE[2] }}>
                <span style={{ fontSize: FONT_SIZE.body.desktop }}>↩️</span>
                <span style={{ fontSize: FONT_SIZE.caption.desktop, color: COLOR.textSecondary }}>
                  {COPY.cart.returns}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </PageContainer>
      <Footer />

      <style>{`
        @media (max-width: ${BREAKPOINT.tablet - 1}px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
