// ─── SignUpPage ───────────────────────────────────────────────────────────────
// Full-screen centered sign-up page styled to match the app's dark theme.
// Already-signed-in users are redirected to / immediately.

import { SignUp } from '@clerk/react';
import { useAuth } from '@clerk/react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate } from 'react-router-dom';
import { COPY } from '../utils/copy.js';
import { COLOR } from '../config/tokens.js';

const clerkAppearance = {
  variables: {
    colorPrimary:         '#e8500a',
    colorBackground:      '#161616',
    colorText:            '#ffffff',
    colorTextSecondary:   'rgba(255,255,255,0.55)',
    colorInputBackground: '#1f1f1f',
    colorInputText:       '#ffffff',
    colorNeutral:         '#ffffff',
    borderRadius:         '10px',
    fontFamily:           '"Inter", system-ui, sans-serif',
    fontSize:             '15px',
  },
  elements: {
    card: {
      background:   '#161616',
      border:       '1px solid rgba(255,255,255,0.08)',
      boxShadow:    '0 24px 64px rgba(0,0,0,0.6)',
      borderRadius: '16px',
      padding:      '40px 36px',
    },
    headerTitle: {
      color:      '#ffffff',
      fontSize:   '22px',
      fontWeight: 700,
    },
    headerSubtitle: {
      color: 'rgba(255,255,255,0.5)',
    },
    socialButtonsBlockButton: {
      background:   '#1f1f1f',
      border:       '1px solid rgba(255,255,255,0.1)',
      color:        '#ffffff',
      borderRadius: '8px',
    },
    socialButtonsBlockButtonText: {
      color: '#ffffff',
    },
    dividerLine: {
      background: 'rgba(255,255,255,0.1)',
    },
    dividerText: {
      color: 'rgba(255,255,255,0.35)',
    },
    formFieldLabel: {
      color:      'rgba(255,255,255,0.7)',
      fontSize:   '13px',
      fontWeight: 500,
    },
    formFieldInput: {
      background:   '#1f1f1f',
      border:       '1px solid rgba(255,255,255,0.12)',
      borderRadius: '8px',
      color:        '#ffffff',
      fontSize:     '15px',
    },
    formButtonPrimary: {
      background:   '#e8500a',
      borderRadius: '8px',
      fontWeight:   600,
      fontSize:     '15px',
    },
    footerActionLink: {
      color: '#e8500a',
    },
    footerActionText: {
      color: 'rgba(255,255,255,0.45)',
    },
    footer: {
      background: 'transparent',
    },
  },
};

export default function SignUpPage() {
  const { isLoaded, isSignedIn } = useAuth();

  // Already signed in — send to homepage
  if (isLoaded && isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Sign Up — {COPY.productName}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div
        style={{
          minHeight:     '100vh',
          background:    COLOR.bgPrimary,
          display:       'flex',
          flexDirection: 'column',
        }}
      >
        {/* Minimal top bar with logo */}
        <div
          style={{
            padding:        '24px 40px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            to="/"
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '10px',
              textDecoration: 'none',
            }}
          >
            <div style={{
              width:          '36px',
              height:         '36px',
              borderRadius:   '50%',
              border:         '1.5px solid rgba(255,255,255,0.25)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              background:     'rgba(255,255,255,0.04)',
            }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1.5 9L9 2.5L16.5 9" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="4" y="9" width="10" height="7" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="none" rx="0.5"/>
                <rect x="7" y="12" width="4" height="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" rx="0.5"/>
              </svg>
            </div>
            <div style={{ lineHeight: 1.05 }}>
              <div style={{ fontWeight: 800, fontSize: '12px', letterSpacing: '0.14em', color: '#ffffff', textTransform: 'uppercase' }}>
                ABBY-KEY
              </div>
              <div style={{ fontWeight: 400, fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                Real Estate
              </div>
            </div>
          </Link>

          <Link
            to="/"
            style={{
              fontSize:       '13px',
              color:          'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              letterSpacing:  '0.01em',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
          >
            ← Back to site
          </Link>
        </div>

        {/* Centered Clerk card */}
        <div
          style={{
            flex:           1,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '40px 20px 80px',
          }}
        >
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/"
            appearance={clerkAppearance}
          />
        </div>
      </div>
    </>
  );
}
