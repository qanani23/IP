import { COPY } from '../../utils/copy.js';
import { COLOR, Z } from '../../config/tokens.js';
import TextReveal from '../TextReveal.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

// ─── TechnicalSection ─────────────────────────────────────────────────────────
// Section 03: Property Specs — centered layout with key metrics.
// Living area sq ft and school district rating as the visual centerpiece.

export default function TechnicalSection() {
  let themeContext;
  try {
    themeContext = useTheme();
  } catch {
    themeContext = null;
  }

  const accentColor = themeContext?.theme?.uiAccent || COLOR.accentGold;

  return (
    <section
      className="section section-overlay technical-section"
      aria-label="Property Specifications"
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
      <div
        className="technical-content"
        style={{
          textAlign: 'center',
          pointerEvents: 'none',
          maxWidth: '700px',
          width: '100%',
        }}
      >
        <TextReveal>
          <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>
            {COPY.sectionLabels.technical}
          </span>

          <h2 className="visually-hidden">Property Specifications</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              marginBottom: '48px',
              marginTop: '24px',
            }}
          >
            {/* Living Area */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '80px',
                  fontWeight: 300,
                  lineHeight: 1,
                  color: COLOR.textPrimary,
                  letterSpacing: '-0.04em',
                  marginBottom: '8px',
                }}
              >
                {COPY.specs.weightBalance}
              </div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: accentColor,
                  marginBottom: '4px',
                  transition: 'color 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                SQ FT
              </div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: COLOR.textMuted,
                }}
              >
                {COPY.specs.weightLabel}
              </div>
            </div>

            {/* School District */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '80px',
                  fontWeight: 300,
                  lineHeight: 1,
                  color: COLOR.textPrimary,
                  letterSpacing: '-0.04em',
                  marginBottom: '8px',
                }}
              >
                {COPY.specs.uniformBounce}
              </div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: accentColor,
                  marginBottom: '4px',
                  transition: 'color 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                RATED
              </div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: COLOR.textMuted,
                }}
              >
                {COPY.specs.bounceLabel}
              </div>
            </div>
          </div>

          <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.12)', margin: '0 auto 32px' }} />

          <p
            style={{
              color: COLOR.textSecondary,
              fontSize: '15px',
              lineHeight: 1.7,
              maxWidth: '440px',
              margin: '0 auto',
            }}
          >
            Every square foot is designed to maximize natural light, flow, and livability — from the open-plan kitchen to the private primary suite.
          </p>
        </TextReveal>
      </div>

      <style>{`
        @media (max-width: 1199px) {
          .technical-section { padding: 80px 40px !important; }
        }
        @media (max-width: 767px) {
          .technical-section { padding: 100px 20px 60px !important; }
          .technical-content { max-width: 100% !important; }
          .technical-section .metric-big { font-size: 64px !important; }
        }
      `}</style>
    </section>
  );
}
