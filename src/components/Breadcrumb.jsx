import { Link } from 'react-router-dom';
import { COPY } from '../utils/copy.js';
import { COLOR, FONT_SIZE, SPACE } from '../config/tokens.js';

/**
 * Breadcrumb navigation component
 * Two-level breadcrumb: Home → Current Page
 * 
 * @param {Object} props
 * @param {string} props.currentPage - Label for the current page
 */
export default function Breadcrumb({ currentPage }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        style={{
          display: 'flex',
          gap: `${SPACE[2]}px`,
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: `${FONT_SIZE.caption.desktop}px`,
          color: COLOR.textMuted,
        }}
      >
        <li>
          <Link
            to="/"
            style={{
              color: COLOR.textMuted,
              textDecoration: 'none',
            }}
          >
            {COPY.productName}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li
          aria-current="page"
          style={{
            color: COLOR.textSecondary,
          }}
        >
          {currentPage}
        </li>
      </ol>
    </nav>
  );
}
