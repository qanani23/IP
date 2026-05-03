// ─── PageContainer ────────────────────────────────────────────────────────────
// Shared layout wrapper used by every store page.
// Enforces consistent max-width, horizontal padding, and top offset for the
// fixed navigation bar. No page defines its own max-width or padding.

import { LAYOUT, BREAKPOINT } from '../config/tokens.js';
import { useSceneAlignment } from '../hooks/useSceneAlignment.js';

/**
 * @param {{ children: React.ReactNode, style?: object }} props
 */
export default function PageContainer({ children, style = {} }) {
  const { breakpoint } = useSceneAlignment();

  const padding = LAYOUT.pagePadding[breakpoint] ?? LAYOUT.pagePadding.desktop;

  return (
    <div
      style={{
        maxWidth:     LAYOUT.maxContentWidth,
        margin:       '0 auto',
        paddingTop:   LAYOUT.navHeight + 48,   // 64px nav + 48px spacing (accounts for 24px border + extra space)
        paddingLeft:  padding,
        paddingRight: padding,
        paddingBottom: LAYOUT.pagePadding.desktop,
        minHeight:    '100vh',
        boxSizing:    'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
