// ─── Toast ────────────────────────────────────────────────────────────────────
// Individual toast notification. Rendered by ToastContext's toast region.
// Supports success / error / info types, optional action link, dismiss button.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import { COLOR, SPACE, RADIUS, FONT_SIZE, Z, DURATION } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';

// ─── Toast Region ─────────────────────────────────────────────────────────────
// Renders all active toasts in a fixed region at the bottom of the viewport.
// role="status" + aria-live="polite" so screen readers announce new messages.

export function ToastRegion() {
  const { toasts } = useToast();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      style={{
        position:      'fixed',
        bottom:        SPACE[5],
        right:         SPACE[5],
        zIndex:        Z.toast,
        display:       'flex',
        flexDirection: 'column',
        gap:           SPACE[3],
        pointerEvents: 'none',
        // Mobile: full-width centered
        maxWidth:      400,
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}

      <style>{`
        @media (max-width: 767px) {
          [data-toast-region] {
            right: ${SPACE[3]}px !important;
            left:  ${SPACE[3]}px !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Border colors per type ───────────────────────────────────────────────────
const TYPE_BORDER = {
  success: COLOR.accentOrange,
  error:   '#e84040',
  info:    COLOR.accentGold,
};

// ─── Individual Toast ─────────────────────────────────────────────────────────
function ToastItem({ toast }) {
  const { dismissToast } = useToast();
  const [visible, setVisible] = useState(false);

  // Slide-up entrance
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const borderColor = TYPE_BORDER[toast.type] ?? COLOR.accentOrange;

  return (
    <div
      style={{
        background:    COLOR.bgElevated,
        borderLeft:    `4px solid ${borderColor}`,
        borderRadius:  RADIUS.md,
        padding:       `${SPACE[3]}px ${SPACE[4]}px`,
        boxShadow:     '0 8px 32px rgba(0,0,0,0.5)',
        pointerEvents: 'auto',
        display:       'flex',
        alignItems:    'flex-start',
        gap:           SPACE[3],
        transform:     visible ? 'translateY(0)' : 'translateY(16px)',
        opacity:       visible ? 1 : 0,
        transition:    `transform ${DURATION.entrance}ms cubic-bezier(0.16,1,0.3,1),
                        opacity   ${DURATION.entrance}ms cubic-bezier(0.16,1,0.3,1)`,
        minWidth:      280,
      }}
    >
      {/* Message + action */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin:    0,
            color:     COLOR.textPrimary,
            fontSize:  FONT_SIZE.body.desktop,
            lineHeight: 1.4,
          }}
        >
          {toast.message}
        </p>

        {toast.action && (
          <Link
            to={toast.action.href}
            onClick={() => dismissToast(toast.id)}
            style={{
              display:        'inline-block',
              marginTop:      SPACE[2],
              color:          COLOR.accentOrange,
              fontSize:       FONT_SIZE.caption.desktop,
              textDecoration: 'underline',
              cursor:         'pointer',
            }}
          >
            {toast.action.label}
          </Link>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => dismissToast(toast.id)}
        aria-label={COPY.toast.dismiss}
        style={{
          background:  'none',
          border:      'none',
          cursor:      'pointer',
          color:       COLOR.textMuted,
          padding:     SPACE[1],
          flexShrink:  0,
          lineHeight:  1,
          fontSize:    18,
          transition:  'color 150ms ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.textPrimary)}
        onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.textMuted)}
      >
        ×
      </button>
    </div>
  );
}

export default ToastItem;
