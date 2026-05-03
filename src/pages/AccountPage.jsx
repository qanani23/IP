// ─── Account Page ─────────────────────────────────────────────────────────────
// User account management page.
// Allows saving name and email to localStorage.
// Displays order history from lastOrder if available.

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import PageContainer from '../components/PageContainer.jsx';
import { loadLastOrder } from '../utils/orderStorage.js';
import { useToast } from '../context/ToastContext.jsx';
import { COPY } from '../utils/copy.js';
import { COLOR, SPACE, RADIUS, FONT_SIZE, LINE_HEIGHT, LAYOUT, BREAKPOINT } from '../config/tokens.js';

const ACCOUNT_KEY = 'abby-key-account';

export default function AccountPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lastOrder, setLastOrder] = useState(null);
  const { showToast } = useToast();

  // Load account data and last order on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Load account data
    try {
      const raw = localStorage.getItem(ACCOUNT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
      }
    } catch {
      // Invalid JSON — ignore
    }

    // Load last order
    const order = loadLastOrder();
    if (order) {
      setLastOrder(order);
    }
  }, []);

  const handleSaveDetails = () => {
    try {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ name, email }));
      showToast({
        message: 'Account details saved successfully!',
        type: 'success',
      });
    } catch {
      showToast({
        message: 'Failed to save account details.',
        type: 'error',
      });
    }
  };

  const hasAccountData = name || email;

  const styles = {
    container: {
      maxWidth: 800,
      margin: '0 auto',
      paddingTop: SPACE[8],
      paddingBottom: SPACE[10],
    },
    pageTitle: {
      fontSize: FONT_SIZE.h1.desktop,
      fontWeight: 700,
      color: COLOR.textPrimary,
      margin: 0,
      marginBottom: SPACE[7],
    },
    section: {
      background: COLOR.bgSurface,
      borderRadius: RADIUS.lg,
      padding: SPACE[6],
      marginBottom: SPACE[6],
    },
    sectionHeading: {
      fontSize: FONT_SIZE.h3.desktop,
      fontWeight: 600,
      color: COLOR.textPrimary,
      margin: 0,
      marginBottom: SPACE[4],
    },
    formGroup: {
      marginBottom: SPACE[4],
    },
    label: {
      display: 'block',
      fontSize: FONT_SIZE.caption.desktop,
      color: COLOR.textSecondary,
      marginBottom: SPACE[2],
      fontWeight: 600,
    },
    input: {
      width: '100%',
      minHeight: LAYOUT.minTouchTarget,
      background: COLOR.bgElevated,
      border: `1px solid rgba(255,255,255,0.1)`,
      borderRadius: RADIUS.md,
      color: COLOR.textPrimary,
      fontSize: FONT_SIZE.body.desktop,
      padding: `0 ${SPACE[3]}px`,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 200ms ease',
    },
    button: {
      minHeight: LAYOUT.minTouchTarget,
      background: COLOR.accentOrange,
      border: 'none',
      borderRadius: RADIUS.md,
      color: COLOR.textPrimary,
      fontSize: FONT_SIZE.body.desktop,
      fontWeight: 600,
      cursor: 'pointer',
      padding: `0 ${SPACE[6]}px`,
      transition: 'opacity 200ms ease',
    },
    guestPrompt: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textSecondary,
      margin: 0,
      marginBottom: SPACE[5],
      lineHeight: LINE_HEIGHT.body,
    },
    orderCard: {
      background: COLOR.bgElevated,
      borderRadius: RADIUS.md,
      padding: SPACE[4],
      display: 'flex',
      flexDirection: 'column',
      gap: SPACE[2],
    },
    orderRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    orderLabel: {
      fontSize: FONT_SIZE.caption.desktop,
      color: COLOR.textMuted,
      margin: 0,
    },
    orderValue: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textPrimary,
      fontWeight: 600,
      margin: 0,
    },
    orderLink: {
      fontSize: FONT_SIZE.caption.desktop,
      color: COLOR.accentOrange,
      textDecoration: 'none',
      fontWeight: 600,
      transition: 'opacity 200ms ease',
    },
    emptyState: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textMuted,
      margin: 0,
      textAlign: 'center',
      padding: `${SPACE[5]}px 0`,
    },
  };

  const mediaStyles = `
    @media (max-width: ${BREAKPOINT.mobile - 1}px) {
      .account-title {
        font-size: ${FONT_SIZE.h2.mobile} !important;
      }
      .account-section-heading {
        font-size: ${FONT_SIZE.h3.mobile} !important;
      }
    }
    .account-input:focus {
      border-color: ${COLOR.accentOrange};
    }
    .account-button:hover {
      opacity: 0.9;
    }
    .order-link:hover {
      opacity: 0.8;
    }
  `;

  return (
    <>
      <Helmet>
        <title>My Account — {COPY.productName} Real Estate</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <style>{mediaStyles}</style>
      <Navigation />
      <PageContainer>
        <div style={styles.container}>
          <h1 style={styles.pageTitle} className="account-title">
            My Account
          </h1>

          {/* Account Details Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading} className="account-section-heading">
              Account Details
            </h2>

            {!hasAccountData && (
              <p style={styles.guestPrompt}>
                You're shopping as a guest. Save your details to keep track of your orders.
              </p>
            )}

            <div style={styles.formGroup}>
              <label htmlFor="account-name" style={styles.label}>
                Name
              </label>
              <input
                id="account-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={styles.input}
                className="account-input"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="account-email" style={styles.label}>
                Email Address
              </label>
              <input
                id="account-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={styles.input}
                className="account-input"
              />
            </div>

            <button
              onClick={handleSaveDetails}
              style={styles.button}
              className="account-button"
            >
              Save Details
            </button>
          </div>

          {/* Order History Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading} className="account-section-heading">
              Order History
            </h2>

            {lastOrder ? (
              <div style={styles.orderCard}>
                <div style={styles.orderRow}>
                  <p style={styles.orderLabel}>Order Number</p>
                  <p style={styles.orderValue}>{lastOrder.orderId}</p>
                </div>
                <div style={styles.orderRow}>
                  <p style={styles.orderLabel}>Total</p>
                  <p style={styles.orderValue}>${lastOrder.total?.toFixed(2) || '0.00'}</p>
                </div>
                <div style={styles.orderRow}>
                  <p style={styles.orderLabel}>Items</p>
                  <p style={styles.orderValue}>
                    {lastOrder.items?.length || 0} item{lastOrder.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div style={styles.orderRow}>
                  <p style={styles.orderLabel}>Date</p>
                  <p style={styles.orderValue}>
                    {lastOrder.placedAt
                      ? new Date(lastOrder.placedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div style={{ marginTop: SPACE[2] }}>
                  <Link
                    to={`/confirmation/${lastOrder.orderId}`}
                    style={styles.orderLink}
                    className="order-link"
                  >
                    View Order Details →
                  </Link>
                </div>
              </div>
            ) : (
              <p style={styles.emptyState}>No orders yet.</p>
            )}
          </div>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
}
