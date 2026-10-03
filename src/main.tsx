import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import App from './App.tsx';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/space-grotesk';
import './portfolio/portfolio.css';
import './portfolio/responsive.css';
import './portfolio/gallery-design.css';
import RouteEffects from './portfolio/RouteEffects';
import ErrorBoundary from './portfolio/ErrorBoundary';

function LegacyGalleryRedirect() {
  const { pathname, search, hash } = useLocation();
  const destination = pathname.slice('/concepts/motion-gallery'.length) || '/';
  return <Navigate to={destination + search + hash} replace />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <span id="top" />
        <RouteEffects />
        <Routes>
          <Route path="/concepts/motion-gallery/*" element={<LegacyGalleryRedirect />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
