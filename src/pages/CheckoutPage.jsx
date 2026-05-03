import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { submitOrder } from '../api/checkout.js';
import { persistLastOrder } from '../utils/orderStorage.js';
import { track } from '../utils/analytics.js';
import { PRODUCTS } from '../data/productData.js';
import ShippingForm from '../components/forms/ShippingForm.jsx';
import PaymentForm from '../components/forms/PaymentForm.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import PageContainer from '../components/PageContainer.jsx';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { COLOR, FONT_SIZE, RADIUS, SPACE, BREAKPOINT } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';

const CHECKOUT_STATE_KEY = 'abby-key-checkout-state';

/**
 * CheckoutPage — Multi-step checkout flow
 * 
 * Three steps: Shipping → Payment → Review
 * - Cart guard: redirects to /cart if cart is empty (no UI flash)
 * - State persistence: step + shipping saved to localStorage (never card number)
 * - Processing state: spinner, disabled button, double-submit prevention
 * - Payment failure: inline error, re-enable button, preserve form data
 * - Stock warning: compare cart quantities against current product stock
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, total, promoCode, promoDiscount, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // ── Cart guard: redirect to /cart if empty ────────────────────────────────
  useEffect(() => {
    if (itemCount === 0) {
      navigate('/cart', { replace: true });
    }
  }, [itemCount, navigate]);

  // ── Restore checkout state from localStorage on mount ─────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKOUT_STATE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.step) setStep(saved.step);
        if (saved.shipping) setShipping(saved.shipping);
        // Never restore card number — only cardName if present
        if (saved.payment) {
          setPayment({ cardName: saved.payment.cardName || '' });
        }
      }
    } catch {
      // Invalid JSON — ignore
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // ── Persist step + shipping to localStorage on every step transition ──────
  useEffect(() => {
    if (isInitializing) return;
    
    try {
      const state = {
        step,
        shipping,
        payment: payment ? { cardName: payment.cardName } : null, // Never persist card number
      };
      localStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota exceeded — fail silently
    }
  }, [step, shipping, payment, isInitializing]);

  // ── Track checkout_start on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!isInitializing && itemCount > 0) {
      track('checkout_start', { cartTotal: total, itemCount });
    }
  }, [isInitializing]); // Only fire once on mount

  // ── Step 1: Shipping Form ─────────────────────────────────────────────────
  const handleShippingSubmit = (values) => {
    setShipping(values);
    setStep(2);
    track('checkout_step', { step: 2 });
  };

  // ── Step 2: Payment Form ──────────────────────────────────────────────────
  const handlePaymentSubmit = (values) => {
    setPayment(values);
    setStep(3);
    track('checkout_step', { step: 3 });
  };

  // ── Step 3: Place Order ───────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (isProcessing) return; // Double-submit prevention

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Call simulated order API
      const { orderId } = await submitOrder({
        items,
        shipping,
        payment,
        subtotal,
        total,
        promoCode,
        promoDiscount,
      });

      // Success: persist order, track, clear cart, navigate
      persistLastOrder({
        orderId,
        items: items.map(i => ({ ...i })), // Snapshot
        subtotal,
        total,
        shippingAddress: shipping,
        placedAt: new Date().toISOString(),
      });

      track('purchase_complete', { orderId, total, itemCount });
      clearCart();
      localStorage.removeItem(CHECKOUT_STATE_KEY);
      navigate(`/confirmation/${orderId}`);
    } catch (err) {
      // Payment failure: show error, re-enable button, preserve form data
      if (err.code === 'PAYMENT_FAILED') {
        setPaymentError(err.message || COPY.errors.networkError);
      } else {
        setPaymentError(COPY.errors.networkSub);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Stock-changed warning ─────────────────────────────────────────────────
  const getStockWarnings = () => {
    const warnings = [];
    items.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) {
        warnings.push(`${item.name} is no longer available.`);
      } else if (item.quantity > product.stock) {
        warnings.push(`${item.name} has limited availability (${product.stock} left).`);
      }
    });
    return warnings;
  };

  const stockWarnings = step === 3 ? getStockWarnings() : [];

  // ── Skeleton while initializing ───────────────────────────────────────────
  if (isInitializing) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACE[5], paddingTop: SPACE[8] }}>
            <Skeleton width="60%" height={40} />
            <Skeleton width="100%" height={300} />
          </div>
        </PageContainer>
        <Footer />
      </>
    );
  }

  // ── Step Indicator ────────────────────────────────────────────────────────
  const StepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: SPACE[4], marginBottom: SPACE[8] }}>
      {[1, 2, 3].map((s) => {
        const isActive = s === step;
        const isCompleted = s < step;
        const stepLabel = s === 1 ? COPY.checkout.steps.shipping : s === 2 ? COPY.checkout.steps.payment : COPY.checkout.steps.review;

        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: SPACE[2] }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isActive ? COLOR.accentOrange : isCompleted ? COLOR.accentGold : COLOR.bgSurface,
                color: COLOR.textPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: FONT_SIZE.body.desktop,
                fontWeight: 600,
              }}
            >
              {s}
            </div>
            <span
              style={{
                fontSize: FONT_SIZE.body.desktop,
                color: isActive ? COLOR.textPrimary : isCompleted ? COLOR.textSecondary : COLOR.textMuted,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {stepLabel}
            </span>
            {s < 3 && (
              <div
                style={{
                  width: 40,
                  height: 2,
                  background: isCompleted ? COLOR.accentGold : 'rgba(255,255,255,0.1)',
                  marginLeft: SPACE[2],
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── Summary Card (read-only) ──────────────────────────────────────────────
  const SummaryCard = ({ title, data, onEdit }) => (
    <div
      style={{
        background: COLOR.bgSurface,
        borderRadius: RADIUS.lg,
        padding: SPACE[5],
        marginBottom: SPACE[4],
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACE[3] }}>
        <h3 style={{ fontSize: FONT_SIZE.h4.desktop, color: COLOR.textPrimary, margin: 0 }}>
          {title}
        </h3>
        <button
          onClick={onEdit}
          style={{
            background: 'transparent',
            border: `1px solid ${COLOR.accentOrange}`,
            borderRadius: RADIUS.md,
            color: COLOR.accentOrange,
            fontSize: FONT_SIZE.caption.desktop,
            padding: `${SPACE[2]}px ${SPACE[3]}px`,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {COPY.checkout.review.editShipping}
        </button>
      </div>
      <div style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textSecondary, lineHeight: 1.6 }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>{value}</div>
        ))}
      </div>
    </div>
  );

  // Set meta tags
  useEffect(() => {
    document.title = `${COPY.checkout.title} — ${COPY.productName}`;
    
    // Add noindex meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'noindex';

    return () => {
      // Cleanup: remove noindex when leaving page
      const meta = document.querySelector('meta[name="robots"]');
      if (meta) meta.remove();
    };
  }, []);

  return (
    <>
      <Navigation />
      
      <PageContainer>
        <div style={{ paddingTop: SPACE[8], paddingBottom: SPACE[10] }}>
          <h1 style={{ fontSize: FONT_SIZE.h1.desktop, color: COLOR.textPrimary, marginBottom: SPACE[6] }}>
            {COPY.checkout.title}
          </h1>

          <StepIndicator />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: SPACE[8], alignItems: 'start' }} className="checkout-layout">
            {/* Left column: Forms */}
            <div>
              {step === 1 && (
                <ShippingForm
                  onSubmit={handleShippingSubmit}
                  initialValues={shipping || {}}
                />
              )}

              {step === 2 && (
                <>
                  {/* Shipping summary */}
                  <SummaryCard
                    title={COPY.checkout.steps.shipping}
                    data={{
                      Name: `${shipping.firstName} ${shipping.lastName}`,
                      Email: shipping.email,
                      Phone: shipping.phone,
                      Address: `${shipping.address}${shipping.address2 ? ', ' + shipping.address2 : ''}`,
                      City: `${shipping.city}, ${shipping.state} ${shipping.zip}`,
                      Country: shipping.country,
                    }}
                    onEdit={() => setStep(1)}
                  />

                  <PaymentForm
                    onSubmit={handlePaymentSubmit}
                    initialValues={payment || {}}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  {/* Shipping summary */}
                  <SummaryCard
                    title={COPY.checkout.steps.shipping}
                    data={{
                      Name: `${shipping.firstName} ${shipping.lastName}`,
                      Email: shipping.email,
                      Phone: shipping.phone,
                      Address: `${shipping.address}${shipping.address2 ? ', ' + shipping.address2 : ''}`,
                      City: `${shipping.city}, ${shipping.state} ${shipping.zip}`,
                      Country: shipping.country,
                    }}
                    onEdit={() => setStep(1)}
                  />

                  {/* Payment summary */}
                  <SummaryCard
                    title={COPY.checkout.steps.payment}
                    data={{
                      'Card': `•••• •••• •••• ${payment.cardNumber.replace(/\D/g, '').slice(-4)}`,
                      'Name': payment.cardName,
                      'Expiry': payment.expiry,
                    }}
                    onEdit={() => setStep(2)}
                  />

                  {/* Order items */}
                  <div
                    style={{
                      background: COLOR.bgSurface,
                      borderRadius: RADIUS.lg,
                      padding: SPACE[5],
                      marginBottom: SPACE[4],
                    }}
                  >
                    <h3 style={{ fontSize: FONT_SIZE.h4.desktop, color: COLOR.textPrimary, marginBottom: SPACE[4] }}>
                      Order Items
                    </h3>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: `${SPACE[3]}px 0`,
                          borderBottom: `1px solid rgba(255,255,255,0.1)`,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textPrimary }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: FONT_SIZE.caption.desktop, color: COLOR.textMuted }}>
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.textPrimary, fontWeight: 600 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stock warnings */}
                  {stockWarnings.length > 0 && (
                    <div
                      role="alert"
                      style={{
                        background: `${COLOR.accentOrange}22`,
                        border: `1px solid ${COLOR.accentOrange}`,
                        borderRadius: RADIUS.md,
                        padding: SPACE[4],
                        marginBottom: SPACE[4],
                      }}
                    >
                      <div style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.accentOrange, fontWeight: 600, marginBottom: SPACE[2] }}>
                        Stock Availability Notice
                      </div>
                      {stockWarnings.map((warning, i) => (
                        <div key={i} style={{ fontSize: FONT_SIZE.caption.desktop, color: COLOR.textSecondary }}>
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Payment error */}
                  {paymentError && (
                    <div
                      role="alert"
                      style={{
                        background: `${COLOR.accentOrange}22`,
                        border: `1px solid ${COLOR.accentOrange}`,
                        borderRadius: RADIUS.md,
                        padding: SPACE[4],
                        marginBottom: SPACE[4],
                      }}
                    >
                      <div style={{ fontSize: FONT_SIZE.body.desktop, color: COLOR.accentOrange, fontWeight: 600 }}>
                        {paymentError}
                      </div>
                    </div>
                  )}

                  {/* Place Order button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    style={{
                      width: '100%',
                      minHeight: 48,
                      background: isProcessing ? COLOR.bgElevated : COLOR.accentOrange,
                      color: COLOR.textPrimary,
                      fontSize: FONT_SIZE.body.desktop,
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: RADIUS.md,
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: SPACE[2],
                      transition: 'opacity 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isProcessing) e.target.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isProcessing) e.target.style.opacity = '1';
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            border: `2px solid ${COLOR.textPrimary}`,
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }}
                        />
                        Processing...
                      </>
                    ) : paymentError ? (
                      COPY.errors.retry
                    ) : (
                      COPY.checkout.review.placeOrder
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Right column: Order Summary (sticky) */}
            <div style={{ position: 'sticky', top: SPACE[8] }}>
              <OrderSummary
                subtotal={subtotal}
                shipping={0}
                tax={null}
                promoCode={promoCode}
                promoDiscount={promoDiscount}
                showPromoInput={false}
              />
            </div>
          </div>
        </div>
      </PageContainer>

      <Footer />

      {/* Inject spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: ${BREAKPOINT.tablet - 1}px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
