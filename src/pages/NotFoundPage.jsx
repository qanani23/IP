// ─── 404 Not Found Page ───────────────────────────────────────────────────────
// Displayed for any route that doesn't match defined routes.
// Includes Navigation and Footer for consistent site structure.

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import PageContainer from '../components/PageContainer.jsx';
import { COPY } from '../utils/copy.js';
import { COLOR, SPACE, FONT_SIZE, LINE_HEIGHT, BREAKPOINT } from '../config/tokens.js';

export default function NotFoundPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const styles = {
    container: {
      maxWidth: 600,
      margin: '0 auto',
      paddingTop: SPACE[10],
      paddingBottom: SPACE[10],
      textAlign: 'center',
    },
    errorCode: {
      fontSize: 120,
      fontWeight: 700,
      color: COLOR.accentOrange,
      margin: 0,
      marginBottom: SPACE[4],
      lineHeight: 1,
    },
    heading: {
      fontSize: FONT_SIZE.h1.desktop,
      fontWeight: 700,
      color: COLOR.textPrimary,
      margin: 0,
      marginBottom: SPACE[3],
    },
    subtitle: {
      fontSize: FONT_SIZE.h3.desktop,
      color: COLOR.textSecondary,
      margin: 0,
      marginBottom: SPACE[7],
      lineHeight: LINE_HEIGHT.h3,
    },
    link: {
      display: 'inline-block',
      minHeight: 48,
      background: COLOR.accentOrange,
      border: 'none',
      borderRadius: 8,
      color: COLOR.textPrimary,
      fontSize: FONT_SIZE.body.desktop,
      fontWeight: 600,
      textDecoration: 'none',
      cursor: 'pointer',
      padding: `${SPACE[3]}px ${SPACE[6]}px`,
      transition: 'opacity 200ms ease',
      lineHeight: '48px',
    },
  };

  const mediaStyles = `
    @media (max-width: ${BREAKPOINT.mobile - 1}px) {
      .error-code {
        font-size: 80px !important;
      }
      .error-heading {
        font-size: ${FONT_SIZE.h2.mobile} !important;
      }
      .error-subtitle {
        font-size: ${FONT_SIZE.body.mobile} !important;
      }
    }
    .error-link:hover {
      opacity: 0.9;
    }
  `;

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found — {COPY.productName}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <style>{mediaStyles}</style>
      <Navigation />
      <PageContainer>
        <div style={styles.container}>
          <div style={styles.errorCode} className="error-code">
            404
          </div>
          <h1 style={styles.heading} className="error-heading">
            {COPY.errors.notFound}
          </h1>
          <p style={styles.subtitle} className="error-subtitle">
            {COPY.errors.notFoundSub}
          </p>
          <Link
            to="/"
            style={styles.link}
            className="error-link"
          >
            {COPY.errors.backHome}
          </Link>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
}
