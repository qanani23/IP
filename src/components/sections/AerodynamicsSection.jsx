import { COPY } from '../../utils/copy.js';
import { COLOR, Z } from '../../config/tokens.js';
import TextReveal from '../TextReveal.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

// ─── AerodynamicsSection ──────────────────────────────────────────────────────
// Section 02: Architectural Detail — house model on left, text on right.
// Key metrics: Walk Score, Agent Rating, and design highlights.

export default function AerodynamicsSection({ textColumnWidth = '45%' }) {
  let themeContext;
  try {
    themeContext = useTheme();
  } catch {
    themeContext = null;
  }

  const accentColor = themeContext?.theme?.priceColor || COLOR.accentOrange;

  return (
    <section
      className="section section-overlay aerodynamics-section"
      aria-label="Architecture"
      style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: Z.content,
        display: 'flex',
        alignItems: 'center',
        padding: '80px',
      }}
    >
      <div className="text-col aerodynamics-text-col" style={{ maxWidth: textColumnWidth }}>
        <TextReveal>
          <span className="section-label">{COPY.sectionLabels.aerodynamics}</span>

          <h2
            style={{
              color: COLOR.textPrimary,
              fontSize: '72px',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: '4px',
            }}
          >
            CRAFTED
          </h2>
          <h2
            style={{
              color: COLOR.textPrimary,
              fontSize: '72px',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: '48px',
            }}
          >
            IN DETAIL
          </h2>

          {/* Key metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              marginBottom: '40px',
            }}
          >
            <div className="metric-block">
              <span className="metric-value">{COPY.specs.dragCoeff}</span>
              <span className="metric-label">{COPY.specs.dragLabel}</span>
            </div>
            <div className="metric-block">
              <span className="metric-value">{COPY.specs.rotStability}</span>
              <span className="metric-label">{COPY.specs.rotLabel}</span>
            </div>
          </div>

          {/* Detail tags */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '24px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: COLOR.textMuted,
                    marginBottom: '4px',
                  }}
                >
                  Year Built
                </div>
                <div
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '20px',
                    fontWeight: 400,
                    color: accentColor,
                    letterSpacing: '-0.01em',
                    transition: 'color 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  2022
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: COLOR.textMuted,
                    marginBottom: '4px',
                  }}
                >
                  Lot Size
                </div>
                <div
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '20px',
                    fontWeight: 400,
                    color: accentColor,
                    letterSpacing: '-0.01em',
                    transition: 'color 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  0.45 ac
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['Chef\'s Kitchen', 'Smart Home', 'Pool', 'Solar Panels'].map((tag) => (
                <div
                  key={tag}
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: COLOR.textSecondary,
                    padding: '6px 12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <p
            style={{
              color: COLOR.textSecondary,
              fontSize: '14px',
              lineHeight: 1.7,
              maxWidth: '360px',
            }}
          >
            Every finish, fixture, and floor plan decision was made with intention — creating spaces that feel as good as they look.
          </p>
        </TextReveal>
      </div>

      <style>{`
        @media (max-width: 1199px) {
          .aerodynamics-section { padding: 80px 40px !important; }
          .aerodynamics-text-col { max-width: 55% !important; }
          .aerodynamics-section h2 { font-size: 56px !important; }
        }
        @media (max-width: 767px) {
          .aerodynamics-section { padding: 100px 20px 60px !important; align-items: flex-start !important; }
          .aerodynamics-text-col { max-width: 100% !important; }
          .aerodynamics-section h2 { font-size: 40px !important; }
        }
      `}</style>
    </section>
  );
}
