import { COPY } from '../../utils/copy.js';
import { COLOR, Z } from '../../config/tokens.js';
import TextReveal from '../TextReveal.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { HOUSES } from '../../data/houseData.js';

// ─── PerformanceSection ───────────────────────────────────────────────────────
// Section 01: Prime Location — house on right, text on left.
// Stat ticker shows live property metrics.

const THEME_ORDER = ['gold', 'colonial', 'garden', 'sky', 'farmhouse'];

export default function PerformanceSection({ textColumnWidth = '45%' }) {
  let themeContext;
  try { themeContext = useTheme(); } catch { themeContext = null; }

  const activeIndex = THEME_ORDER.indexOf(themeContext?.activeTheme ?? 'gold');
  const activeHouse = HOUSES[activeIndex] ?? HOUSES[0];
  const accentColor = themeContext?.theme?.uiAccent || '#c9a84c';

  const stats = [
    { value: activeHouse.beds,  label: 'Bedrooms' },
    { value: activeHouse.baths, label: 'Bathrooms' },
    { value: activeHouse.sqft,  label: 'Sq Ft' },
    { value: '98',              label: 'Walk Score' },
  ];

  return (
    <section
      className="section section-overlay performance-section"
      aria-label="Location"
      style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: Z.content,
        display: 'flex',
        alignItems: 'center',
        padding: '80px',
      }}
    >
      <div className="text-col performance-text-col" style={{ maxWidth: textColumnWidth }}>
        <TextReveal>
          <span className="section-label">{COPY.sectionLabels.performance}</span>

          <h2 style={{
            color: COLOR.textPrimary,
            fontSize: '72px',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '4px',
          }}>
            PRIME
          </h2>
          <h2 style={{
            color: COLOR.textPrimary,
            fontSize: '72px',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '40px',
          }}>
            LOCATION
          </h2>

          {/* Stat ticker */}
          <div className="stat-ticker" style={{ marginBottom: '32px' }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-ticker-item">
                <div className="stat-ticker-value" style={{ color: i === 0 ? accentColor : '#fff', transition: 'color 0.8s ease' }}>
                  {s.value}
                </div>
                <div className="stat-ticker-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Spec rows */}
          <div style={{ marginBottom: '32px' }}>
            <div className="spec-row">
              <span className="spec-row-label">Bedrooms & Baths</span>
              <span className="spec-row-value">{COPY.specs.microfiber}</span>
            </div>
            <div className="spec-row">
              <span className="spec-row-label">Layout</span>
              <span className="spec-row-value">{COPY.specs.pebbleDepth}</span>
            </div>
          </div>

          <p style={{
            color: COLOR.textSecondary,
            fontSize: '15px',
            lineHeight: 1.75,
            maxWidth: '360px',
          }}>
            Steps from top-rated schools, boutique shops, and green parks. A neighborhood designed for the way you want to live.
          </p>
        </TextReveal>
      </div>

      <style>{`
        @media (max-width: 1199px) {
          .performance-section { padding: 80px 40px !important; }
          .performance-text-col { max-width: 55% !important; }
          .performance-section h2 { font-size: 56px !important; }
        }
        @media (max-width: 767px) {
          .performance-section { padding: 100px 20px 60px !important; align-items: flex-start !important; }
          .performance-text-col { max-width: 100% !important; }
          .performance-section h2 { font-size: 40px !important; }
        }
      `}</style>
    </section>
  );
}
