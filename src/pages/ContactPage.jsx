// ─── ContactPage ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { COLOR, FONT_SIZE, SPACE, RADIUS, BREAKPOINT } from '../config/tokens.js';
import { COPY } from '../utils/copy.js';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import PageContainer from '../components/PageContainer.jsx';

const AGENTS = [
  {
    name: 'Abby Keyes',
    title: 'Founder & Lead Agent',
    specialty: 'Luxury & Ultra-Luxury',
    phone: '+1 (555) 010-0001',
    email: 'abby@abby-key.com',
    accent: '#c9a84c',
    initials: 'AK',
  },
  {
    name: 'Marcus Rivera',
    title: 'Senior Property Advisor',
    specialty: 'Waterfront & Urban',
    phone: '+1 (555) 010-0002',
    email: 'marcus@abby-key.com',
    accent: '#4a90e2',
    initials: 'MR',
  },
  {
    name: 'Sofia Chen',
    title: 'Neighborhood Specialist',
    specialty: 'Family Homes & Schools',
    phone: '+1 (555) 010-0003',
    email: 'sofia@abby-key.com',
    accent: '#6b8e23',
    initials: 'SC',
  },
];

const INQUIRY_TYPES = ['General Inquiry', 'Schedule a Tour', 'Sell My Property', 'Investment Advice', 'Off-Market Listings'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: INQUIRY_TYPES[0], message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = (name) => ({
    width: '100%',
    padding: '14px 16px',
    background: focused === name ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === name ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: RADIUS.md,
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 200ms ease',
    boxSizing: 'border-box',
  });

  return (
    <>
      <Helmet>
        <title>Contact — {COPY.productName}</title>
      </Helmet>
      <Navigation />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: '360px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0d00 60%, #0a0a0a 100%)',
        display: 'flex', alignItems: 'flex-end',
        padding: '0 64px 56px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', right: '15%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }} />
        {/* Big decorative text */}
        <div style={{
          position: 'absolute', right: '48px', top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '180px', fontWeight: 900,
          color: 'rgba(255,255,255,0.025)',
          lineHeight: 1, userSelect: 'none',
          letterSpacing: '-0.05em',
        }}>HI</div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>
            Abby-Key · We're Here to Help
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
            Get in Touch
          </h1>
          <p style={{ marginTop: '16px', fontSize: '16px', color: 'rgba(255,255,255,0.45)', maxWidth: '480px' }}>
            Whether you're buying, selling, or just exploring — our agents are ready to help you find your perfect home.
          </p>
        </div>
      </div>

      <PageContainer>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: SPACE[6], marginBottom: SPACE[8] }} className="contact-grid">

          {/* ── Left: Form ──────────────────────────────────────────── */}
          <div style={{
            background: COLOR.bgSurface,
            borderRadius: RADIUS.lg,
            border: '1px solid rgba(255,255,255,0.06)',
            padding: `${SPACE[6]}px`,
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: `${SPACE[8]}px 0` }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'rgba(201,168,76,0.15)',
                  border: '1.5px solid rgba(201,168,76,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M6 16l8 8 12-14" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Message Sent!</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6 }}>
                  Thanks for reaching out. One of our agents will be in touch within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', type: INQUIRY_TYPES[0], message: '' }); }}
                  style={{
                    marginTop: '28px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.6)',
                    padding: '10px 24px',
                    borderRadius: RADIUS.md,
                    fontSize: '13px', cursor: 'pointer',
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Send us a message</h2>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: '0 0 32px' }}>
                  We typically respond within a few hours during business hours.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                        Full Name *
                      </label>
                      <input
                        name="name" value={form.name} onChange={handleChange}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                        required placeholder="keneni"
                        style={inputStyle('name')}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                        Email *
                      </label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                        required placeholder="keneni@example.com"
                        style={inputStyle('email')}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                        Phone
                      </label>
                      <input
                        name="phone" value={form.phone} onChange={handleChange}
                        onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                        placeholder="+251 923513031"
                        style={inputStyle('phone')}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                        Inquiry Type
                      </label>
                      <select
                        name="type" value={form.type} onChange={handleChange}
                        onFocus={() => setFocused('type')} onBlur={() => setFocused(null)}
                        style={{ ...inputStyle('type'), cursor: 'pointer' }}
                      >
                        {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                      Message *
                    </label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                      required rows={5}
                      placeholder="Tell us what you're looking for..."
                      style={{ ...inputStyle('message'), resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: '#c9a84c',
                      color: '#000',
                      border: 'none',
                      borderRadius: RADIUS.md,
                      padding: '14px 32px',
                      fontSize: '14px', fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'opacity 200ms ease',
                      alignSelf: 'flex-start',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Send Message →
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ── Right: Info ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACE[4] }}>
            {/* Office info */}
            <div style={{
              background: COLOR.bgSurface,
              borderRadius: RADIUS.lg,
              border: '1px solid rgba(255,255,255,0.06)',
              padding: `${SPACE[4]}px`,
            }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                Our Office
              </div>
              {[
                { icon: '📍', label: 'Address',  value: '1200 Luxury Lane,piassa bajaj tera, 03' },
                { icon: '📞', label: 'Phone',    value: '+251 923513031' },
                { icon: '✉️', label: 'Email',    value: 'hello@abby-key.com' },
                { icon: '🕐', label: 'Hours',    value: 'Mon–Fri 9am–7pm\nSat 10am–5pm' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Agents */}
            <div style={{
              background: COLOR.bgSurface,
              borderRadius: RADIUS.lg,
              border: '1px solid rgba(255,255,255,0.06)',
              padding: `${SPACE[4]}px`,
            }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                Meet the Team
              </div>
              {AGENTS.map(agent => (
                <div key={agent.name} style={{
                  display: 'flex', gap: '14px', alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: `${agent.accent}22`,
                    border: `1.5px solid ${agent.accent}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, color: agent.accent,
                  }}>
                    {agent.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{agent.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{agent.title}</div>
                    <div style={{ fontSize: '11px', color: agent.accent, marginTop: '2px' }}>{agent.specialty}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              borderRadius: RADIUS.lg,
              border: '1px solid rgba(201,168,76,0.15)',
              padding: `${SPACE[4]}px`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Follow us for new listings</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                {[
                  { label: 'Instagram', icon: '📸' },
                  { label: 'Twitter',   icon: '🐦' },
                  { label: 'LinkedIn',  icon: '💼' },
                ].map(s => (
                  <a key={s.label} href="#" onClick={e => e.preventDefault()} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: RADIUS.md,
                    textDecoration: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '11px',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                  >
                    <span style={{ fontSize: '20px' }}>{s.icon}</span>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

