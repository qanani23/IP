import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { COPY } from '../utils/copy.js';
import { COLOR, SPACE, RADIUS, Z, DURATION, EASE, FONT_SIZE, LINE_HEIGHT } from '../config/tokens.js';

export default function MobileMenu({ isOpen, onClose, triggerRef }) {
  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const { isSignedIn, isLoaded } = useUser();

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    // Get all focusable elements
    const focusableElements = drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    firstFocusableRef.current = focusableElements[0];
    lastFocusableRef.current = focusableElements[focusableElements.length - 1];

    // Focus first element when drawer opens
    firstFocusableRef.current?.focus();

    // Handle Tab and Shift+Tab to trap focus
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    }

    drawer.addEventListener('keydown', handleKeyDown);

    return () => {
      drawer.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Return focus to trigger button when drawer closes
  useEffect(() => {
    if (!isOpen && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  const navLinks = [
    { label: COPY.nav.products, href: '/properties' },
    { label: COPY.nav.customize, href: '/neighborhoods' },
    { label: COPY.nav.contacts, href: '/contact' },
    // Account link: go to /account if signed in, /sign-in if not
    { label: COPY.nav.account, href: isLoaded && isSignedIn ? '/account' : '/sign-in' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: Z.drawer,
          animation: `fadeIn ${DURATION.hoverIn}ms ${EASE.outExpo}`,
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={COPY.nav.openMenu}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 320,
          backgroundColor: COLOR.bgPrimary,
          zIndex: Z.drawer,
          display: 'flex',
          flexDirection: 'column',
          padding: SPACE[5],
          animation: `slideInRight ${DURATION.hoverIn}ms ${EASE.outExpo}`,
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label={COPY.mobileMenu.close}
          style={{
            alignSelf: 'flex-end',
            background: 'transparent',
            border: 'none',
            color: COLOR.textPrimary,
            fontSize: FONT_SIZE.h3.mobile,
            cursor: 'pointer',
            padding: SPACE[2],
            marginBottom: SPACE[6],
            minWidth: 48,
            minHeight: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Navigation links */}
        <nav style={{ flex: 1 }}>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: SPACE[1],
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={onClose}
                  style={{
                    display: 'block',
                    color: COLOR.textPrimary,
                    textDecoration: 'none',
                    fontSize: FONT_SIZE.h3.mobile,
                    lineHeight: LINE_HEIGHT.heading,
                    padding: `${SPACE[3]}px ${SPACE[2]}px`,
                    borderRadius: RADIUS.md,
                    transition: `background-color ${DURATION.hoverIn}ms ${EASE.outExpo}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLOR.bgElevated;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
