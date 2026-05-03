// ─── NeighborhoodsPage ────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { COLOR, FONT_SIZE, SPACE, RADIUS, BREAKPOINT } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import PageContainer from '../components/PageContainer.jsx';

const NEIGHBORHOODS = [
  {
    id: 'downtown-core',
    name: 'Downtown Core',
    tagline: 'Urban energy, walkable everything.',
    description: 'The heartbeat of the city. Steps from world-class dining, galleries, and transit. Perfect for professionals who want to live where the action is.',
    walkScore: 98,
    transitScore: 95,
    bikeScore: 88,
    avgPrice: '$1.4M',
    listings: 3,
    accent: '#4a90e2',
    tags: ['Walkable', 'Nightlife', 'Transit Hub', 'Arts District'],
    highlights: ['Michelin-starred restaurants', 'Museum row', 'Rooftop bars', 'Farmers market Sundays'],
  },
  {
    id: 'westside-hills',
    name: 'Westside Hills',
    tagline: 'Panoramic views, quiet prestige.',
    description: 'Elevated living in every sense. Winding roads, mature trees, and sweeping city views define this exclusive enclave favored by executives and creatives alike.',
    walkScore: 62,
    transitScore: 45,
    bikeScore: 55,
    avgPrice: '$2.8M',
    listings: 2,
    accent: '#6b8e23',
    tags: ['Luxury', 'Views', 'Private', 'Gated'],
    highlights: ['Private hiking trails', 'Tennis & pool clubs', 'Top-rated private schools', 'Celebrity neighbors'],
  },
  {
    id: 'harbor-district',
    name: 'Harbor District',
    tagline: 'Waterfront living, reimagined.',
    description: 'A revitalized waterfront neighborhood blending industrial heritage with modern luxury. Converted lofts, boutique hotels, and a thriving food scene.',
    walkScore: 85,
    transitScore: 78,
    bikeScore: 92,
    avgPrice: '$1.1M',
    listings: 4,
    accent: '#c9a84c',
    tags: ['Waterfront', 'Trendy', 'Lofts', 'Cycling'],
    highlights: ['Marina access', 'Weekend markets', 'Craft brewery row', 'Sunset promenade'],
  },
  {
    id: 'midtown-grove',
    name: 'Midtown Grove',
    tagline: 'Family-first, school-district gold.',
    description: 'Tree-lined streets, top-rated schools, and a genuine sense of community. The neighborhood families choose and never leave.',
    walkScore: 76,
    transitScore: 68,
    bikeScore: 80,
    avgPrice: '$980K',
    listings: 5,
    accent: '#d4a96a',
    tags: ['Family', 'Schools A+', 'Parks', 'Safe'],
    highlights: ['A+ school district', 'Community pool & rec center', 'Weekend soccer leagues', 'Annual block parties'],
  },
  {
    id: 'north-arts',
    name: 'North Arts Quarter',
    tagline: 'Creative souls, affordable luxury.',
    description: 'Where artists, architects, and entrepreneurs converge. Converted warehouses, independent coffee shops, and a gallery on every corner.',
    walkScore: 89,
    transitScore: 82,
    bikeScore: 94,
    avgPrice: '$750K',
    listings: 3,
    accent: '#e8500a',
    tags: ['Creative', 'Galleries', 'Coffee', 'Emerging'],
    highlights: ['Monthly art walks', 'Co-working spaces', 'Indie cinema', 'Street food scene'],
  },
];

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{value}</span>
      </div>
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${value}%`,
          background: color,
          borderRadius: '2px',
          transition: 'width 600ms ease',
        }} />
      </div>
    </div>
  );
}

export default function NeighborhoodsPage() {
  const [active, setActive] = useState(NEIGHBORHOODS[0].id);
  const current = NEIGHBORHOODS.find(n => n.id === active);

  return (
    <>
      <Helmet>
        <title>Neighborhoods — {COPY.productName}</title>
      </Helmet>
      <Navigation />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: '380px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a2e 60%, #0a0a0a 100%)',
        display: 'flex', alignItems: 'flex-end',
        padding: '0 64px 56px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{
          position: 'absolute', top: '-100px', left: '30%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,144,226,0.08) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>
            Abby-Key · Explore the City
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
            Neighborhoods
          </h1>
          <p style={{ marginTop: '16px', fontSize: '16px', color: 'rgba(255,255,255,0.45)', maxWidth: '520px' }}>
            Every neighborhood has a personality. Find the one that matches yours.
          </p>
        </div>
        {/* Map pin decoration */}
        <div style={{ position: 'absolute', right: '80px', top: '50%', transform: 'translateY(-50%)', opacity: 0.12 }}>
          <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
            <circle cx="60" cy="60" r="55" stroke="white" strokeWidth="2"/>
            <circle cx="60" cy="60" r="20" fill="white"/>
            <path d="M60 115 L60 155" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <PageContainer>
        {/* ── Tab selector ──────────────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap',
          marginBottom: SPACE[6],
          padding: '4px',
          background: COLOR.bgSurface,
          borderRadius: RADIUS.lg,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {NEIGHBORHOODS.map(n => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              style={{
                flex: '1 1 auto',
                padding: '10px 20px',
                borderRadius: RADIUS.md,
                border: 'none',
                background: active === n.id ? n.accent : 'transparent',
                color: active === n.id ? '#000' : 'rgba(255,255,255,0.5)',
                fontSize: '13px', fontWeight: active === n.id ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {n.name}
            </button>
          ))}
        </div>

        {/* ── Detail panel ──────────────────────────────────────────── */}
        {current && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: SPACE[5],
            marginBottom: SPACE[8],
          }}
          className="nbhd-grid"
          >
            {/* Left: main info */}
            <div style={{
              background: COLOR.bgSurface,
              borderRadius: RADIUS.lg,
              border: `1px solid ${current.accent}33`,
              padding: `${SPACE[6]}px`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Accent glow */}
              <div style={{
                position: 'absolute', top: '-60px', right: '-60px',
                width: '300px', height: '300px', borderRadius: '50%',
                background: `radial-gradient(circle, ${current.accent}18 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {current.tags.map(tag => (
                    <span key={tag} style={{
                      background: `${current.accent}18`,
                      color: current.accent,
                      fontSize: '10px', fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: RADIUS.pill,
                      border: `1px solid ${current.accent}33`,
                    }}>{tag}</span>
                  ))}
                </div>

                <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  {current.name}
                </h2>
                <p style={{ fontSize: '16px', color: current.accent, fontWeight: 500, margin: '0 0 20px' }}>
                  {current.tagline}
                </p>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '560px', margin: '0 0 32px' }}>
                  {current.description}
                </p>

                {/* Highlights */}
                <div>
                  <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
                    Neighborhood Highlights
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {current.highlights.map(h => (
                      <div key={h} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: RADIUS.md,
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: current.accent, flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    to="/properties"
                    style={{
                      background: current.accent,
                      color: '#000',
                      padding: '12px 28px',
                      borderRadius: RADIUS.md,
                      fontSize: '13px', fontWeight: 700,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    View {current.listings} Listing{current.listings !== 1 ? 's' : ''}
                  </Link>
                  <Link
                    to="/contact"
                    style={{
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.6)',
                      padding: '12px 28px',
                      borderRadius: RADIUS.md,
                      fontSize: '13px', fontWeight: 500,
                      border: '1px solid rgba(255,255,255,0.12)',
                      textDecoration: 'none',
                    }}
                  >
                    Ask an Agent
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: scores + stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACE[4] }}>
              {/* Scores card */}
              <div style={{
                background: COLOR.bgSurface,
                borderRadius: RADIUS.lg,
                border: '1px solid rgba(255,255,255,0.06)',
                padding: `${SPACE[4]}px`,
              }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                  Livability Scores
                </div>
                <ScoreBar label="Walk Score"    value={current.walkScore}    color={current.accent} />
                <ScoreBar label="Transit Score" value={current.transitScore} color={current.accent} />
                <ScoreBar label="Bike Score"    value={current.bikeScore}    color={current.accent} />
              </div>

              {/* Stats card */}
              <div style={{
                background: COLOR.bgSurface,
                borderRadius: RADIUS.lg,
                border: '1px solid rgba(255,255,255,0.06)',
                padding: `${SPACE[4]}px`,
              }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                  Market Snapshot
                </div>
                {[
                  { label: 'Avg. Listing Price', value: current.avgPrice },
                  { label: 'Active Listings',    value: current.listings },
                  { label: 'Avg. Days on Market', value: '18' },
                  { label: 'Price Trend',         value: '↑ 4.2% YoY' },
                ].map(s => (
                  <div key={s.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div style={{
                background: `linear-gradient(135deg, ${current.accent}12 0%, rgba(255,255,255,0.02) 100%)`,
                borderRadius: RADIUS.lg,
                border: `1px solid ${current.accent}22`,
                padding: `${SPACE[5]}px`,
                textAlign: 'center',
                flex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '12px',
              }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="18" r="14" stroke={current.accent} strokeWidth="1.5" opacity="0.5"/>
                  <circle cx="20" cy="18" r="5" fill={current.accent} opacity="0.7"/>
                  <path d="M20 32 L20 38" stroke={current.accent} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                </svg>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
                  Interactive map coming soon
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── All neighborhoods mini-grid ────────────────────────────── */}
        <div style={{ marginBottom: SPACE[8] }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '24px' }}>
            All Neighborhoods
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {NEIGHBORHOODS.map(n => (
              <button
                key={n.id}
                onClick={() => { setActive(n.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  background: active === n.id ? `${n.accent}18` : COLOR.bgSurface,
                  border: `1px solid ${active === n.id ? n.accent + '44' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: RADIUS.md,
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.accent, marginBottom: '10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{n.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{n.listings} listing{n.listings !== 1 ? 's' : ''} · {n.avgPrice} avg</div>
              </button>
            ))}
          </div>
        </div>
      </PageContainer>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .nbhd-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

