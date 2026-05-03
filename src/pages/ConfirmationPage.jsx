// ─── Order Confirmation Page ──────────────────────────────────────────────────
// Displays order confirmation after successful checkout.
// Shows order snapshot from localStorage if available, otherwise fallback message.

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import PageContainer from '../components/PageContainer.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import { loadLastOrder } from '../utils/orderStorage.js';
import { COPY } from '../utils/copy.js';
import { COLOR, SPACE, RADIUS, FONT_SIZE, LINE_HEIGHT, BREAKPOINT } from '../config/tokens.js';

export default function ConfirmationPage() {
  const { orderId } = useParams();
  const lastOrder = loadLastOrder();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const styles = {
    container: {
      maxWidth: 600,
      margin: '0 auto',
      paddingTop: SPACE[8],
      paddingBottom: SPACE[10],
    },
    checkmark: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: COLOR.accentGold,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      marginBottom: SPACE[5],
      fontSize: FONT_SIZE.h1.desktop,
      color: COLOR.bgPrimary,
    },
    title: {
      fontSize: FONT_SIZE.h1.desktop,
      fontWeight: 700,
      color: COLOR.textPrimary,
      textAlign: 'center',
      margin: 0,
      marginBottom: SPACE[2],
    },
    subtitle: {
      fontSize: FONT_SIZE.h3.desktop,
      color: COLOR.textSecondary,
      textAlign: 'center',
      margin: 0,
      marginBottom: SPACE[6],
      lineHeight: LINE_HEIGHT.h3,
    },
    orderNumber: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textMuted,
      textAlign: 'center',
      margin: 0,
      marginBottom: SPACE[7],
    },
    orderNumberValue: {
      color: COLOR.textPrimary,
      fontWeight: 600,
    },
    section: {
      marginBottom: SPACE[7],
    },
    sectionHeading: {
      fontSize: FONT_SIZE.h3.desktop,
      fontWeight: 600,
      color: COLOR.textPrimary,
      margin: 0,
      marginBottom: SPACE[4],
    },
    itemsList: {
      background: COLOR.bgSurface,
      borderRadius: RADIUS.lg,
      padding: SPACE[5],
      marginBottom: SPACE[5],
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: SPACE[3],
      marginBottom: SPACE[3],
      borderBottom: `1px solid rgba(255,255,255,0.1)`,
    },
    itemLastChild: {
      borderBottom: 'none',
      marginBottom: 0,
      paddingBottom: 0,
    },
    itemDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACE[1],
    },
    itemName: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textPrimary,
      fontWeight: 600,
      margin: 0,
    },
    itemMeta: {
      fontSize: FONT_SIZE.caption.desktop,
      color: COLOR.textMuted,
      margin: 0,
    },
    itemPrice: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textPrimary,
      fontWeight: 600,
    },
    deliveryInfo: {
      background: COLOR.bgSurface,
      borderRadius: RADIUS.lg,
      padding: SPACE[5],
      marginBottom: SPACE[7],
    },
    deliveryLabel: {
      fontSize: FONT_SIZE.caption.desktop,
      color: COLOR.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      margin: 0,
      marginBottom: SPACE[2],
    },
    deliveryValue: {
      fontSize: FONT_SIZE.h3.desktop,
      color: COLOR.textPrimary,
      fontWeight: 600,
      margin: 0,
    },
    timeline: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACE[5],
    },
    timelineStep: {
      display: 'flex',
      gap: SPACE[4],
    },
    timelineIcon: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: COLOR.bgSurface,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textSecondary,
      fontWeight: 600,
    },
    timelineContent: {
      flex: 1,
      paddingTop: SPACE[1],
    },
    timelineTitle: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textPrimary,
      fontWeight: 600,
      margin: 0,
      marginBottom: SPACE[1],
    },
    timelineDesc: {
      fontSize: FONT_SIZE.caption.desktop,
      color: COLOR.textSecondary,
      margin: 0,
      lineHeight: LINE_HEIGHT.caption,
    },
    ctaButton: {
      display: 'inline-block',
      width: '100%',
      minHeight: 48,
      background: COLOR.accentOrange,
      border: 'none',
      borderRadius: RADIUS.md,
      color: COLOR.textPrimary,
      fontSize: FONT_SIZE.body.desktop,
      fontWeight: 600,
      textAlign: 'center',
      textDecoration: 'none',
      cursor: 'pointer',
      padding: `${SPACE[3]}px ${SPACE[5]}px`,
      transition: 'opacity 200ms ease',
      lineHeight: '48px',
      marginTop: SPACE[7],
    },
    fallbackContainer: {
      textAlign: 'center',
      padding: `${SPACE[9]}px 0`,
    },
    fallbackText: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textSecondary,
      margin: 0,
      marginBottom: SPACE[5],
      lineHeight: LINE_HEIGHT.body,
    },
  };

  const mediaStyles = `
    @media (max-width: ${BREAKPOINT.mobile - 1}px) {
      .confirmation-title {
        font-size: ${FONT_SIZE.h2.mobile} !important;
      }
      .confirmation-subtitle {
        font-size: ${FONT_SIZE.body.mobile} !important;
      }
    }
    .cta-button:hover {
      opacity: 0.9;
    }
  `;

  // Fallback when no order data at all
  if (!lastOrder && !orderId) {
    return (
      <>
        <Helmet>
          <title>Order Confirmation — {COPY.productName}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <style>{mediaStyles}</style>
        <Navigation />
        <PageContainer>
          <div style={styles.container}>
            <div style={styles.fallbackContainer}>
              <p style={styles.fallbackText}>
                We couldn't find your order. Please check your email for confirmation details.
              </p>
              <Link
                to="/shop"
                style={styles.ctaButton}
                className="cta-button"
              >
                {COPY.confirmation.continueShopping}
              </Link>
            </div>
          </div>
        </PageContainer>
        <Footer />
      </>
    );
  }

  // If we have orderId but no lastOrder, show minimal confirmation
  if (!lastOrder && orderId) {
    return (
      <>
        <Helmet>
          <title>Order Confirmed — {COPY.productName}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <style>{mediaStyles}</style>
        <Navigation />
        <PageContainer>
          <div style={styles.container}>
            <div style={styles.fallbackContainer}>
              <p style={styles.fallbackText}>
                We couldn't find your order. Please check your email for confirmation details.
              </p>
              <Link
                to="/shop"
                style={styles.ctaButton}
                className="cta-button"
              >
                {COPY.confirmation.continueShopping}
              </Link>
            </div>
          </div>
        </PageContainer>
        <Footer />
      </>
    );
  }

  // Display order confirmation with snapshot
  const displayOrderId = lastOrder?.orderId || orderId;

  return (
    <>
      <Helmet>
        <title>Order Confirmed — {COPY.productName}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <style>{mediaStyles}</style>
      <Navigation />
      <PageContainer>
        <div style={styles.container}>
          {/* Checkmark icon */}
          <div style={styles.checkmark}>✓</div>

          {/* Title and subtitle */}
          <h1 style={styles.title} className="confirmation-title">
            {COPY.confirmation.title}
          </h1>
          <p style={styles.subtitle} className="confirmation-subtitle">
            {COPY.confirmation.subtitle}
          </p>

          {/* Order number */}
          <p style={styles.orderNumber}>
            {COPY.confirmation.orderNumber}:{' '}
            <span style={styles.orderNumberValue}>{displayOrderId}</span>
          </p>

          {/* Order items (if lastOrder exists) */}
          {lastOrder && lastOrder.items && lastOrder.items.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionHeading}>Your Order</h2>
              <div style={styles.itemsList}>
                {lastOrder.items.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      ...styles.item,
                      ...(index === lastOrder.items.length - 1 ? styles.itemLastChild : {}),
                    }}
                  >
                    <div style={styles.itemDetails}>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemMeta}>
                        Qty: {item.quantity} · ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <OrderSummary
                subtotal={lastOrder.subtotal || 0}
                shipping={0}
                tax={null}
                promoCode={lastOrder.promoCode}
                promoDiscount={lastOrder.promoDiscount || 0}
                showPromoInput={false}
              />
            </div>
          )}

          {/* Estimated delivery */}
          <div style={styles.deliveryInfo}>
            <p style={styles.deliveryLabel}>{COPY.confirmation.estimatedDelivery}</p>
            <p style={styles.deliveryValue}>{COPY.confirmation.deliveryWindow}</p>
          </div>

          {/* What happens next timeline */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>{COPY.confirmation.whatNext}</h2>
            <div style={styles.timeline}>
              {COPY.confirmation.steps.map((step, index) => (
                <div key={index} style={styles.timelineStep}>
                  <div style={styles.timelineIcon}>{index + 1}</div>
                  <div style={styles.timelineContent}>
                    <h3 style={styles.timelineTitle}>{step.title}</h3>
                    <p style={styles.timelineDesc}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping CTA */}
          <Link
            to="/shop"
            style={styles.ctaButton}
            className="cta-button"
          >
            {COPY.confirmation.continueShopping}
          </Link>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
}
