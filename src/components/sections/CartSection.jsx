import { COPY } from '../../utils/copy.js';
import { COLOR, Z } from '../../config/tokens.js';
import TextReveal from '../TextReveal.jsx';
import CartButton from '../CartButton.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { HOUSES } from '../../data/houseData.js';

// ─── CartSection ──────────────────────────────────────────────────────────────
// Section 06: Schedule a Visit — final CTA.

const THEME_ORDER = ['gold', 'colonial', 'garden', 'sky', 'farmhouse'];

export default function CartSection() {
  let themeContext;
  try { themeContext = useTheme(); } catch { themeContext = null; }

  const activeIndex = THEME_ORDER.indexOf(themeContext?.activeTheme ?? 'gold');
  const activeHouse = HOUSES[activeIndex] ?? HOUSES[0];
  const accentColor = themeContext?.theme?.uiAccent || '#c9a84c';

  return (
    <section
      className="section section-overlay cart-section"
      aria-label="Schedule a Visit"
      style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: Z.content,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
      }}
    >
      <div className="cart-content" style={{ textAlign: 'center', maxWidth: '640px' }}>
        <TextReveal>
          <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>
            Your Next Step
          </span>

          <h2 style={{
            color: COLOR.textPrimary,
            fontSize: '80px',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginBottom: '20px',
          }}>
            SCHEDULE
            <br />
            <span style={{ color: accentColor, transition: 'color 0.8s ease' }}>A VISIT</span>
          </h2>

          {/* Property summary */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 24px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.02)',
            marginBottom: '40px',
          }}>
            <span style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '18px',
              fontWeight: 500,
              color: accentColor,
              transition: 'color 0.8s ease',
            }}>
              {activeHouse.price}
            </span>
            <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}>
              {activeHouse.name}
            </span>
          </div>

          <div style={{ pointerEvents: 'auto', marginBottom: '32px' }}>
            <CartButton pulse />
          </div>

          {/* Trust signals */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}>
            {['Private Showing', 'No Commitment', 'Expert Agent'].map((item) => (
              <div key={item} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
              }}>
                <span style={{ color: accentColor, transition: 'color 0.8s ease' }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </TextReveal>
      </div>

      <style>{`
        @media (max-width: 1199px) {
          .cart-section { padding: 80px 40px !important; }
          .cart-section h2 { font-size: 60px !important; }
        }
        @media (max-width: 767px) {
          .cart-section { padding: 100px 20px 60px !important; }
          .cart-content { max-width: 100% !important; }
          .cart-section h2 { font-size: 44px !important; }
        }
      `}</style>
    </section>
  );
}
