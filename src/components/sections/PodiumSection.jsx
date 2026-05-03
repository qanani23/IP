import { COPY } from '../../utils/copy.js';
import { COLOR, Z } from '../../config/tokens.js';
import TextReveal from '../TextReveal.jsx';

// ─── PodiumSection ────────────────────────────────────────────────────────────
// Section 04: The Standard — minimal copy, centered layout.
// House model sits on pedestal during this section.

export default function PodiumSection() {
  return (
    <section
      className="section section-overlay podium-section"
      aria-label="The Standard"
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
        className="podium-content"
        style={{
          textAlign: 'center',
          pointerEvents: 'none',
          maxWidth: '600px',
        }}
      >
        <TextReveal>
          <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>
            {COPY.sectionLabels.podium}
          </span>

          <h2
            style={{
              color: COLOR.textPrimary,
              fontSize: '80px',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              marginBottom: '24px',
            }}
          >
            THE STANDARD
          </h2>

          <div className="divider" style={{ margin: '24px auto', width: '40px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />

          <p
            style={{
              color: COLOR.textSecondary,
              fontSize: '18px',
              lineHeight: 1.7,
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            {COPY.podium.sub}
          </p>
        </TextReveal>
      </div>

      <style>{`
        @media (max-width: 1199px) {
          .podium-section { padding: 80px 40px !important; }
          .podium-section h2 { font-size: 60px !important; }
        }
        @media (max-width: 767px) {
          .podium-section {
            padding: 100px 20px 60px !important;
            align-items: flex-end !important;
          }
          .podium-content { max-width: 100% !important; }
          .podium-section h2 { font-size: 44px !important; }
        }
      `}</style>
    </section>
  );
}
