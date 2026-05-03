import { Component } from 'react';
import { Link } from 'react-router-dom';
import { COPY } from '../utils/copy.js';
import { COLOR, SPACE, FONT_SIZE, RADIUS } from '../config/tokens.js';
import { DEV_MODE } from '../config/debug.js';
import Navigation from './Navigation.jsx';

// ─── ErrorBoundary ────────────────────────────────────────────────────────────
// React Error Boundary that catches uncaught exceptions in the component tree.
// Renders a full-page fallback with Navigation + error message + back-to-home link.
// Logs error + stack to console when DEV_MODE is true.
//
// Requirements: 41.4–41.5, 44.1–44.5

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error and component stack to console when DEV_MODE is true
    if (DEV_MODE) {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    }

    // Store error details in state for potential display
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div style={{ minHeight: '100vh', background: COLOR.bgPrimary }}>
          {/* Render Navigation so user can navigate away */}
          <Navigation />

          {/* Error message container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: `${SPACE[8]}px ${SPACE[5]}px`,
              textAlign: 'center',
            }}
          >
            {/* Error icon */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: RADIUS.full,
                background: `rgba(255, 107, 53, 0.1)`,
                border: `2px solid ${COLOR.accentOrange}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: SPACE[6],
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLOR.accentOrange}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Error heading */}
            <h1
              style={{
                fontSize: FONT_SIZE.h1.desktop,
                fontWeight: 700,
                color: COLOR.textPrimary,
                marginBottom: SPACE[3],
                letterSpacing: '-0.02em',
              }}
            >
              {COPY.errors.networkError}
            </h1>

            {/* Error subtitle */}
            <p
              style={{
                fontSize: FONT_SIZE.body.desktop,
                color: COLOR.textSecondary,
                marginBottom: SPACE[7],
                maxWidth: '500px',
              }}
            >
              {COPY.errors.networkSub}
            </p>

            {/* Back to Home link */}
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: SPACE[2],
                padding: `${SPACE[3]}px ${SPACE[5]}px`,
                background: COLOR.accentOrange,
                color: COLOR.textPrimary,
                fontSize: FONT_SIZE.body.desktop,
                fontWeight: 600,
                textDecoration: 'none',
                borderRadius: RADIUS.md,
                transition: 'transform 200ms ease, opacity 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.opacity = '1';
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {COPY.errors.backHome}
            </Link>

            {/* Dev mode error details */}
            {DEV_MODE && this.state.error && (
              <details
                style={{
                  marginTop: SPACE[8],
                  padding: SPACE[4],
                  background: COLOR.bgSurface,
                  borderRadius: RADIUS.md,
                  border: `1px solid rgba(255,255,255,0.1)`,
                  maxWidth: '800px',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontSize: FONT_SIZE.caption.desktop,
                    color: COLOR.textSecondary,
                    fontWeight: 600,
                    marginBottom: SPACE[3],
                  }}
                >
                  Error Details (DEV_MODE only)
                </summary>
                <pre
                  style={{
                    fontSize: '12px',
                    color: COLOR.accentOrange,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>

          {/* Responsive styles */}
          <style>{`
            @media (max-width: 767px) {
              h1 {
                font-size: ${FONT_SIZE.h1.mobile} !important;
              }
            }
          `}</style>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
