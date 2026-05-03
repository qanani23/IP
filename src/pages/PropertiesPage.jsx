// ─── PropertiesPage ───────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HOUSES } from '../data/houseData.js';
import { COLOR, FONT_SIZE, SPACE, RADIUS, BREAKPOINT } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import PageContainer from '../components/PageContainer.jsx';
import InteractiveHouseViewer from '../components/InteractiveHouseViewer.jsx';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'sqft-desc',  label: 'Largest First' },
];

const BADGE_COLORS = {
  'Exclusive':     { bg: 'rgba(201,168,76,0.15)',  text: '#c9a84c' },
  'New Listing':   { bg: 'rgba(74,144,226,0.15)',  text: '#4a90e2' },
  'Price Reduced': { bg: 'rgba(107,142,35,0.15)',  text: '#6b8e23' },
  'Ultra Luxury':  { bg: 'rgba(232,80,10,0.15)',   text: '#e8500a' },
  'Just Listed':   { bg: 'rgba(192,192,192,0.15)', text: '#c0c0c0' },
};

function parsePrice(str) {
  return parseInt(str.replace(/[^0-9]/g, ''), 10);
}

export default function PropertiesPage() {
  const [sort, setSort] = useState('default');
  const [hovered, setHovered] = useState(null);

  const sorted = [...HOUSES].sort((a, b) => {
    if (sort === 'price-asc')  return parsePrice(a.price) - parsePrice(b.price);
    if (sort === 'price-desc') return parsePrice(b.price) - parsePrice(a.price);
    if (sort === 'sqft-desc')  return parseInt(b.sqft.replace(/,/g, '')) - parseInt(a.sqft.replace(/,/g, ''));
    return 0;
  });

  const featured = HOUSES[3]; // Luxury Villa as hero

  return (
    <>
      <Helmet>
        <title>Properties — {COPY.productName}</title>
      </Helmet>
      <Navigation />

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: '420px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0d0d0d 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '60px',
        paddingLeft: '64px',
        paddingRight: '64px',
      }}>
        {/* Decorative grid lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        {/* Accent glow */}
        <div style={{
          position: 'absolute', top: '-80px', right: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: `radial-gradient(circle, ${featured.accentColor}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Big watermark number */}
        <div style={{
          position: 'absolute', right: '48px', top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '220px', fontWeight: 900,
          color: 'rgba(255,255,255,0.03)',
          lineHeight: 1, userSelect: 'none',
          fontVariantNumeric: 'tabular-nums',
        }}>05</div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)', marginBottom: '12px',
          }}>
            Abby-Key Real Estate · Curated Collection
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 900,
            color: '#fff', lineHeight: 1.0, margin: 0,
            letterSpacing: '-0.03em',
          }}>
            Our Properties
          </h1>
          <p style={{
            marginTop: '16px', fontSize: '16px',
            color: 'rgba(255,255,255,0.5)', maxWidth: '480px',
          }}>
            Five exceptional homes — from minimalist residences to ultra-luxury villas.
            Each one curated for those who demand more.
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '24px', right: '64px',
          display: 'flex', alignItems: 'center', gap: '8px',
          color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em',
        }}>
          <span>SCROLL</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <PageContainer>
        {/* ── Controls ──────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: SPACE[6], flexWrap: 'wrap', gap: SPACE[3],
        }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Showing <span style={{ color: '#fff', fontWeight: 600 }}>{HOUSES.length}</span> properties
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Sort by</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                background: COLOR.bgSurface,
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: RADIUS.md,
                color: COLOR.textPrimary,
                fontSize: '14px',
                padding: '8px 16px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Property Grid ─────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: SPACE[5],
          marginBottom: SPACE[9],
        }}>
          {sorted.map((house, i) => {
            const badge = BADGE_COLORS[house.badge] || { bg: 'rgba(255,255,255,0.1)', text: '#fff' };
            const isHovered = hovered === house.id;
            return (
              <article
                key={house.id}
                onMouseEnter={() => setHovered(house.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: COLOR.bgSurface,
                  borderRadius: RADIUS.lg,
                  overflow: 'hidden',
                  border: `1px solid ${isHovered ? house.accentColor + '55' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'border-color 300ms ease, transform 300ms ease, box-shadow 300ms ease',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${house.accentColor}22` : '0 4px 20px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* 3D interactive viewer */}
                <div style={{ position: 'relative' }}>
                  <InteractiveHouseViewer
                    house={house}
                    height={220}
                    borderRadius={0}
                  />
                  {/* Badge */}
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: badge.bg,
                    color: badge.text,
                    fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: RADIUS.pill,
                    border: `1px solid ${badge.text}33`,
                    pointerEvents: 'none',
                  }}>
                    {house.badge}
                  </div>
                  {/* 3D tag */}
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '10px', letterSpacing: '0.08em',
                    padding: '4px 8px', borderRadius: RADIUS.sm,
                    display: 'flex', alignItems: 'center', gap: '4px',
                    pointerEvents: 'none',
                  }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><polygon points="1,1 7,4 1,7"/></svg>
                    3D
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: `${SPACE[4]}px`, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <h2 style={{
                      fontSize: '20px', fontWeight: 700,
                      color: COLOR.textPrimary, margin: 0,
                      letterSpacing: '-0.01em',
                    }}>
                      {house.name}
                    </h2>
                    <p style={{
                      fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                      marginTop: '6px', lineHeight: 1.5,
                    }}>
                      {house.description}
                    </p>
                  </div>

                  {/* Specs row */}
                  <div style={{
                    display: 'flex', gap: '16px',
                    padding: '12px 0',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {[
                      { icon: '🛏', val: house.beds, label: 'Beds' },
                      { icon: '🚿', val: house.baths, label: 'Baths' },
                      { icon: '📐', val: house.sqft, label: 'sq ft' },
                    ].map(s => (
                      <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{s.val}</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Asking Price</div>
                      <div style={{
                        fontSize: '22px', fontWeight: 800,
                        color: house.accentColor,
                        fontFamily: '"IBM Plex Mono", monospace',
                        letterSpacing: '-0.02em',
                      }}>
                        {house.price}
                      </div>
                    </div>
                    <Link
                      to="/"
                      style={{
                        background: isHovered ? house.accentColor : 'rgba(255,255,255,0.08)',
                        color: isHovered ? '#000' : '#fff',
                        border: `1px solid ${isHovered ? house.accentColor : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: RADIUS.md,
                        padding: '10px 20px',
                        fontSize: '13px', fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 250ms ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      View Tour →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Bottom CTA ────────────────────────────────────────────────── */}
        <div style={{
          textAlign: 'center',
          padding: `${SPACE[8]}px ${SPACE[6]}px`,
          background: COLOR.bgSurface,
          borderRadius: RADIUS.lg,
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: SPACE[8],
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
            Can't find what you're looking for?
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Let us find your perfect home.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Our agents have access to off-market listings and new developments not yet listed here.
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-block',
              background: '#c9a84c',
              color: '#000',
              padding: '14px 36px',
              borderRadius: RADIUS.md,
              fontSize: '14px', fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 200ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Talk to an Agent
          </Link>
        </div>
      </PageContainer>

      <Footer />

      <style>{`
        @media (max-width: ${BREAKPOINT.mobile - 1}px) {
          .props-hero { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
    </>
  );
}

