import { useEffect, useState, useRef } from 'react';
import './index.css';
import { COPY } from './utils/copy.js';
import { useSceneAlignment } from './hooks/useSceneAlignment.js';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import SceneCanvas from './components/SceneCanvas.jsx';
import Navigation from './components/Navigation.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ThemeBorder from './components/ThemeBorder.jsx';
import HeroSection from './components/sections/HeroSection.jsx';
import PerformanceSection from './components/sections/PerformanceSection.jsx';
import AerodynamicsSection from './components/sections/AerodynamicsSection.jsx';
import TechnicalSection from './components/sections/TechnicalSection.jsx';
import PodiumSection from './components/sections/PodiumSection.jsx';
import ChampionSection from './components/sections/ChampionSection.jsx';
import CartSection from './components/sections/CartSection.jsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionState } from './utils/motionState.js';
import { HOUSES } from './data/houseData.js';

gsap.registerPlugin(ScrollTrigger);

// ─── Scroll behaviour ─────────────────────────────────────────────────────────
// Page 1 (Hero):  house centered, idle rotation
// Page 2 onwards: house shifts to the RIGHT side of the screen and stays there.
//                 House rotates continuously as you scroll through pages 2-7.
//
// The shift is done by translating the canvas wrapper div with CSS transform.
// This is the only approach that works regardless of camera/world-space math.

export default function App() {
  const { breakpoint, textColumnWidth } = useSceneAlignment();
  const [sceneReady, setSceneReady]     = useState(false);
  const [pastHero, setPastHero]         = useState(false);
  const canvasRef                       = useRef(null);

  useEffect(() => {
    if (!sceneReady) return;

    ScrollTrigger.getAll().forEach(t => t.kill());

    const heroEl = document.querySelector('[data-section="0"]');
    if (heroEl && canvasRef.current) {
      ScrollTrigger.create({
        trigger: heroEl,
        start: 'bottom 80%',
        onEnter: () => {
          setPastHero(true);
          gsap.to(canvasRef.current, { x: '28%', duration: 1.2, ease: 'power3.inOut' });
        },
        onLeaveBack: () => {
          setPastHero(false);
          gsap.to(canvasRef.current, { x: '0%', duration: 1.0, ease: 'power3.inOut' });
        },
      });
    }

    const page2El = document.querySelector('[data-section="1"]');
    const page7El = document.querySelector('[data-section="6"]');
    if (page2El && page7El) {
      gsap.to(motionState.rotation, {
        y: Math.PI * 4,
        ease: 'none',
        scrollTrigger: {
          trigger: page2El, endTrigger: page7El,
          start: 'top bottom', end: 'bottom bottom',
          scrub: 1.5,
          onUpdate: (self) => {
            motionState.scrollProgress     = self.progress;
            motionState.activeSectionIndex = Math.min(1 + Math.floor(self.progress * 6), 6);
          },
        },
      });
    }

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [sceneReady, breakpoint]);

  return (
    <ThemeProvider>
      <AppContent
        sceneReady={sceneReady}
        setSceneReady={setSceneReady}
        textColumnWidth={textColumnWidth}
        canvasRef={canvasRef}
      />
    </ThemeProvider>
  );
}

const THEME_TO_HOUSE_INDEX = { gold: 0, colonial: 1, garden: 2, sky: 3, farmhouse: 4 };

function AppContent({ sceneReady, setSceneReady, textColumnWidth, canvasRef }) {
  const { theme, activeTheme } = useTheme();
  const houseIndex  = THEME_TO_HOUSE_INDEX[activeTheme] ?? 0;
  const activeHouse = HOUSES[houseIndex];

  return (
    <>
      <a href="#main-content" className="skip-link">{COPY.skipLink}</a>
      <ThemeBorder />
      <LoadingScreen onReady={sceneReady ? 'ready' : null} />

      {/* Fixed frame bars — always visible on all 4 sides regardless of scroll */}
      <div className="frame-bar frame-bar-top"    aria-hidden="true" />
      <div className="frame-bar frame-bar-bottom" aria-hidden="true" />
      <div className="frame-bar frame-bar-left"   aria-hidden="true" />
      <div className="frame-bar frame-bar-right"  aria-hidden="true" />
      <div className="frame-corner frame-corner-tl" aria-hidden="true" />
      <div className="frame-corner frame-corner-tr" aria-hidden="true" />
      <div className="frame-corner frame-corner-bl" aria-hidden="true" />
      <div className="frame-corner frame-corner-br" aria-hidden="true" />

      <div className="canvas-clip-frame">
        <SceneCanvas
          onReady={() => setSceneReady(true)}
          theme={theme}
          activeHouse={activeHouse}
          canvasRef={canvasRef}
        />
      </div>
      <Navigation />
      <main id="main-content">
        <div data-section="0"><HeroSection textColumnWidth={textColumnWidth} /></div>
        <div data-section="1"><PerformanceSection textColumnWidth={textColumnWidth} /></div>
        <div data-section="2"><AerodynamicsSection textColumnWidth={textColumnWidth} /></div>
        <div data-section="3"><TechnicalSection /></div>
        <div data-section="4"><PodiumSection /></div>
        <div data-section="5"><ChampionSection textColumnWidth={textColumnWidth} /></div>
        <div data-section="6"><CartSection /></div>
      </main>
    </>
  );
}
