import { Link, useLocation } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/react';
import { COPY } from '../utils/copy.js';
import { COLOR, Z, RADIUS, FONT_SIZE } from '../config/tokens.js';
import { useCart } from '../context/CartContext.jsx';
import CartIcon from './CartIcon.jsx';
import MobileMenu from './MobileMenu.jsx';
import { useState, useRef } from 'react';

// ─── Navigation ───────────────────────────────────────────────────────────────
// Matches reference: logo left · links center (active = accent color) · icons right
// Sits at the top of the rounded frame, transparent on home.

export default function Navigation() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { isSignedIn, isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);

  const isHome  = location.pathname === '/';
  const bgColor = isHome ? 'transparent' : 'rgba(13,13,13,0.95)';

  return (
    <nav
      className="nav"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: '28px',
        left: '28px',
        right: '28px',
        height: '68px',
        zIndex: Z.nav,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        pointerEvents: 'auto',
        background: bgColor,
        backdropFilter: isHome ? 'none' : 'blur(12px)',
        transition: 'background 300ms ease',
      }}
    >
      {/* ── Logo: circle icon + stacked brand name ────────────────────────── */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          textDecoration: 'none',
        }}
      >
        {/* Circle with house icon — matches reference circle logo */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.04)',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M1.5 9L9 2.5L16.5 9" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="4" y="9" width="10" height="7" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="none" rx="0.5"/>
            <rect x="7" y="12" width="4" height="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" rx="0.5"/>
          </svg>
        </div>

        {/* Stacked brand name — matches "SLAM / DUNK" in reference */}
        <div style={{ lineHeight: 1.05 }}>
          <div style={{
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '0.14em',
            color: '#ffffff',
            textTransform: 'uppercase',
          }}>
            ABBY-KEY
          </div>
          <div style={{
            fontWeight: 400,
            fontSize: '9px',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
          }}>
            Real Estate
          </div>
        </div>
      </Link>

      {/* ── Center nav links ───────────────────────────────────────────────── */}
      <div
        className="nav-links"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '36px',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {[
          { label: COPY.nav.products,  path: '/properties' },
          { label: COPY.nav.customize, path: '/neighborhoods' },
          { label: COPY.nav.contacts,  path: '/contact' },
        ].map(({ label, path }) => {
          const isActive = path && location.pathname === path;
          return path ? (
            <Link
              key={label}
              to={path}
              style={{
                color: isActive ? 'var(--ui-accent)' : 'rgba(255,255,255,0.65)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.01em',
                textDecoration: 'none',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
            >
              {label}
            </Link>
          ) : (
            <a
              key={label}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '14px',
                fontWeight: 400,
                letterSpacing: '0.01em',
                textDecoration: 'none',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
            >
              {label}
            </a>
          );
        })}
      </div>

      {/* ── Right: account icon + cart icon ───────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
        {/* Account — UserButton when signed in, profile icon link when signed out */}
        {isLoaded && isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: '32px', height: '32px' },
              },
            }}
          />
        ) : (
          <Link
            to="/sign-in"
            style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            aria-label="Sign in"
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </Link>
        )}

        {/* Saved listings */}
        <Link
          to="/cart"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(255,255,255,0.55)',
            textDecoration: 'none',
          }}
          aria-label={itemCount > 0 ? COPY.a11y.cartCount(itemCount) : COPY.cartAriaLabel}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
        >
          <CartIcon />
          {itemCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -4, right: -8,
              background: 'var(--ui-accent)',
              color: '#000',
              borderRadius: RADIUS.pill,
              minWidth: 17, height: 17,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 700,
              padding: '0 3px',
            }}>
              {itemCount}
            </span>
          )}
        </Link>

        {/* Hamburger (mobile only) */}
        <button
          ref={hamburgerRef}
          className="hamburger-button"
          aria-label={COPY.nav.openMenu}
          onClick={() => setMobileMenuOpen(true)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)',
            padding: '4px',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        triggerRef={hamburgerRef}
      />

      <style>{`
        @media (max-width: 1199px) { .nav { padding: 0 32px !important; } }
        @media (max-width: 767px) {
          .nav { padding: 0 20px !important; }
          .nav-links { display: none !important; }
          .hamburger-button { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
