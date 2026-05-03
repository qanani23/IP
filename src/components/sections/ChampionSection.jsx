import { COPY } from '../../utils/copy.js';
import { COLOR, Z } from '../../config/tokens.js';
import TextReveal from '../TextReveal.jsx';
import CartButton from '../CartButton.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { HOUSES } from '../../data/houseData.js';

// ─── ChampionSection ──────────────────────────────────────────────────────────
// Section 05: Featured Property — exclusive listing with full details.
// Shows active house info synced with the selector.

const THEME_ORDER = ['gold', 'colonial', 'garden', 'sky', 'farmhouse'];

export default function ChampionSection({ textColumnWidth = '45%' }) {
  let themeContext;
  try { themeContext = useTheme(); } catch { themeContext = null; }

  const activeIndex = THEME_ORDER.indexOf(themeContext?.activeTheme ?? 'gold');
  const activeHouse = HOUSES[activeIndex] ?? HOUSES[0];
  const accentColor = themeContext?.theme?.uiAccent || '#c9a84c';
  const priceColor  = themeContext?.theme?.priceColor || accentColor;

  return (
    <section
      className="section section-overlay champion-section"
      aria-label="Featured Property"
      style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: Z.content,
        display: 'flex',
        alignItems: 'center',
        padding: '80px',
      }}
    >
      <div className="text-col champion-text-col" style={{ maxWidth: textColumnWidth }}>
        <TextReveal>
          <span className="section-label">{COPY.champion.edition}</span>

          {/* Listing number */}
          <div className="champion-rank-display">
            {String(activeIndex + 1).padStart(2, '0')}
          </div>

          {/* Tier */}
          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: '16px',
            transition: 'color 0.8s ease',
          }}>
            {activeHouse.badge} · {COPY.champion.tier}
          </p>

          {/* Property name */}
          <h2 style={{
            color: COLOR.textPrimary,
            fontSize: '56px',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            {activeHouse.name.toUpperCase()}
          </h2>

          {/* Description */}
          <p style={{
            color: COLOR.textSecondary,
            fontSize: '15px',
            lineHeight: 1.75,
            maxWidth: '360px',
            marginBottom: '28px',
          }}>
            {activeHouse.description}
          </p>

          {/* Feature tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[`${activeHouse.beds} Bed`, `${activeHouse.baths} Bath`, `${activeHouse.sqft} sqft`, 'A+ Schools'].map((tag) => (
              <span key={tag} style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                padding: '5px 10px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.02)',
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Verified badge */}
          <div className="certified-badge">
            <span className="certified-label">✦ Verified Listing</span>
            <span className="certified-label" style={{ color: `${accentColor}80`, transition: 'color 0.8s ease' }}>
              Abby-Key Exclusive
            </span>
          </div>

          {/* Price */}
          <div className="price-display" style={{ marginBottom: '32px', color: priceColor }}>
            {activeHouse.price}
          </div>

          {/* CTA */}
          <div style={{ pointerEvents: 'auto' }}>
            <CartButton />
          </div>
        </TextReveal>
      </div>

      <style>{`
        @media (max-width: 1199px) {
          .champion-section { padding: 80px 40px !important; }
          .champion-text-col { max-width: 55% !important; }
          .champion-section h2 { font-size: 44px !important; }
        }
        @media (max-width: 767px) {
          .champion-section { padding: 100px 20px 60px !important; align-items: flex-start !important; }
          .champion-text-col { max-width: 100% !important; }
          .champion-section h2 { font-size: 36px !important; }
        }
      `}</style>
    </section>
  );
}
