import { Link, useLocation } from 'react-router-dom';
import { COPY } from '../utils/copy.js';
import { COLOR, SPACE, FONT_SIZE, LINE_HEIGHT, LETTER_SPACING, BREAKPOINT } from '../config/tokens.js';

export default function Footer() {
  const location = useLocation();

  // Don't render on homepage
  if (location.pathname === '/') {
    return null;
  }

  const styles = {
    footer: {
      backgroundColor: COLOR.bgSurface,
      paddingTop: SPACE[8],
      paddingBottom: SPACE[8],
      paddingLeft: SPACE[5],
      paddingRight: SPACE[5],
    },
    container: {
      maxWidth: 1440,
      margin: '0 auto',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: SPACE[6],
      marginBottom: SPACE[7],
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACE[3],
    },
    heading: {
      fontSize: FONT_SIZE.caption.desktop,
      letterSpacing: LETTER_SPACING.caption,
      textTransform: 'uppercase',
      color: COLOR.textPrimary,
      fontWeight: 600,
      marginBottom: SPACE[1],
    },
    link: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textSecondary,
      textDecoration: 'none',
      lineHeight: LINE_HEIGHT.body,
      transition: 'color 0.2s ease',
    },
    brandColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACE[4],
    },
    logo: {
      fontSize: FONT_SIZE.h3.desktop,
      fontWeight: 700,
      color: COLOR.textPrimary,
      letterSpacing: LETTER_SPACING.h2,
    },
    tagline: {
      fontSize: FONT_SIZE.body.desktop,
      color: COLOR.textSecondary,
      lineHeight: LINE_HEIGHT.body,
    },
    socialLinks: {
      display: 'flex',
      gap: SPACE[3],
      marginTop: SPACE[2],
    },
    legalRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: SPACE[4],
      paddingTop: SPACE[6],
      borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
    },
    legalText: {
      fontSize: FONT_SIZE.caption.desktop,
      color: COLOR.textMuted,
      lineHeight: LINE_HEIGHT.caption,
    },
    legalLinks: {
      display: 'flex',
      gap: SPACE[4],
      flexWrap: 'wrap',
    },
    legalLink: {
      fontSize: FONT_SIZE.caption.desktop,
      color: COLOR.textMuted,
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    },
  };

  // Media query styles
  const mediaStyles = `
    @media (max-width: ${BREAKPOINT.tablet - 1}px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: ${BREAKPOINT.mobile - 1}px) {
      .footer-grid {
        grid-template-columns: 1fr !important;
      }
      .footer-legal-row {
        flex-direction: column !important;
        align-items: flex-start !important;
      }
    }
    .footer-link:hover {
      color: ${COLOR.textPrimary};
    }
    .footer-legal-link:hover {
      color: ${COLOR.textSecondary};
    }
  `;

  return (
    <>
      <style>{mediaStyles}</style>
      <footer style={styles.footer}>
        <div style={styles.container}>
          {/* 4-column grid */}
          <div style={styles.grid} className="footer-grid">
            {/* Brand + Social column */}
            <div style={styles.brandColumn}>
              <div style={styles.logo}>{COPY.logoText}</div>
              <p style={styles.tagline}>{COPY.footer.tagline}</p>
              <div style={styles.socialLinks}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                  className="footer-link"
                  aria-label={COPY.footer.social.instagram}
                >
                  {COPY.footer.social.instagram}
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                  className="footer-link"
                  aria-label={COPY.footer.social.twitter}
                >
                  {COPY.footer.social.twitter}
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                  className="footer-link"
                  aria-label={COPY.footer.social.youtube}
                >
                  {COPY.footer.social.youtube}
                </a>
              </div>
            </div>

            {/* Store column */}
            <div style={styles.column}>
              <h3 style={styles.heading}>{COPY.footer.columns.store.heading}</h3>
              {COPY.footer.columns.store.links.map((link, index) => (
                <Link
                  key={index}
                  to="#"
                  style={styles.link}
                  className="footer-link"
                >
                  {link}
                </Link>
              ))}
            </div>

            {/* Support column */}
            <div style={styles.column}>
              <h3 style={styles.heading}>{COPY.footer.columns.support.heading}</h3>
              {COPY.footer.columns.support.links.map((link, index) => (
                <Link
                  key={index}
                  to="#"
                  style={styles.link}
                  className="footer-link"
                >
                  {link}
                </Link>
              ))}
            </div>

            {/* Company column */}
            <div style={styles.column}>
              <h3 style={styles.heading}>{COPY.footer.columns.company.heading}</h3>
              {COPY.footer.columns.company.links.map((link, index) => (
                <Link
                  key={index}
                  to="#"
                  style={styles.link}
                  className="footer-link"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal row */}
          <div style={styles.legalRow} className="footer-legal-row">
            <p style={styles.legalText}>{COPY.footer.legal}</p>
            <div style={styles.legalLinks}>
              <Link
                to="#"
                style={styles.legalLink}
                className="footer-legal-link"
              >
                {COPY.footer.privacy}
              </Link>
              <Link
                to="#"
                style={styles.legalLink}
                className="footer-legal-link"
              >
                {COPY.footer.terms}
              </Link>
              <Link
                to="#"
                style={styles.legalLink}
                className="footer-legal-link"
              >
                {COPY.footer.cookies}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
