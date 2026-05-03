import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ClerkProvider, RedirectToSignIn, useAuth, AuthenticateWithRedirectCallback } from '@clerk/react';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ToastRegion } from './components/Toast.jsx';
import AuthLoader from './components/AuthLoader.jsx';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// Each page is a separate chunk. The homepage (App.jsx) contains the 3D/R3F
// bundle — it is isolated here so store pages never download Three.js.

const HomePage           = lazy(() => import('./App.jsx'));
const ShopPage           = lazy(() => import('./pages/ShopPage.jsx'));
const PropertiesPage     = lazy(() => import('./pages/PropertiesPage.jsx'));
const NeighborhoodsPage  = lazy(() => import('./pages/NeighborhoodsPage.jsx'));
const ContactPage        = lazy(() => import('./pages/ContactPage.jsx'));
const ProductPage        = lazy(() => import('./pages/ProductPage.jsx'));
const CartPage           = lazy(() => import('./pages/CartPage.jsx'));
const CheckoutPage       = lazy(() => import('./pages/CheckoutPage.jsx'));
const ConfirmationPage   = lazy(() => import('./pages/ConfirmationPage.jsx'));
const AccountPage        = lazy(() => import('./pages/AccountPage.jsx'));
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage.jsx'));
const SignInPage         = lazy(() => import('./pages/SignInPage.jsx'));
const SignUpPage         = lazy(() => import('./pages/SignUpPage.jsx'));

// ─── ErrorBoundary ────────────────────────────────────────────────────────────
// Imported lazily after it's created in Phase 2. For now we use a minimal
// inline version so the app boots without the component file existing yet.
// This will be replaced by the full ErrorBoundary in task 2.9.
import ErrorBoundary from './components/ErrorBoundary.jsx';

// ─── ScrollToTop ──────────────────────────────────────────────────────────────
// Scrolls to the top of the page on every route change.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ─── SSOCallback ─────────────────────────────────────────────────────────────
// Shows the branded loader while Clerk processes the OAuth token, then
// AuthenticateWithRedirectCallback handles the redirect automatically.
function SSOCallback() {
  return (
    <>
      <AuthLoader message="Completing sign-in…" />
      <AuthenticateWithRedirectCallback />
    </>
  );
}

// ─── ClerkGate ────────────────────────────────────────────────────────────────
// Holds the entire app behind the loader until Clerk has resolved auth state.
// Prevents the brief blank flash on every cold page load.
function ClerkGate({ children }) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <AuthLoader message="Loading…" />;
  return children;
}

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Redirects unauthenticated users to /sign-in.
// ClerkGate above guarantees isLoaded is always true here.
function ProtectedRoute({ children }) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <RedirectToSignIn signInFallbackRedirectUrl={window.location.pathname} />;
  }

  return children;
}

// ─── App Shell ────────────────────────────────────────────────────────────────
function AppShell() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/"                      element={<HomePage />} />
          <Route path="/shop"                  element={<ShopPage />} />
          <Route path="/properties"            element={<PropertiesPage />} />
          <Route path="/neighborhoods"         element={<NeighborhoodsPage />} />
          <Route path="/contact"               element={<ContactPage />} />
          <Route path="/product"               element={<ProductPage />} />
          <Route path="/sign-in"               element={<SignInPage />} />
          <Route path="/sign-up"               element={<SignUpPage />} />
          {/* SSO callback — shows branded loader while OAuth token is processed */}
          <Route path="/sso-callback"          element={<SSOCallback />} />
          <Route path="/sign-in/sso-callback"  element={<SSOCallback />} />
          <Route path="/sign-up/sso-callback"  element={<SSOCallback />} />
          <Route path="/cart"                  element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout"              element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/confirmation/:orderId" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
          <Route path="/account"               element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="*"                      element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ToastRegion />
    </ErrorBoundary>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ClerkProvider publishableKey={clerkKey}>
        <BrowserRouter>
          <CartProvider>
            <ToastProvider>
              <ClerkGate>
                <AppShell />
              </ClerkGate>
            </ToastProvider>
          </CartProvider>
        </BrowserRouter>
      </ClerkProvider>
    </HelmetProvider>
  </StrictMode>
);
