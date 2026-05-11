import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { ScrollProvider, useScrollContext } from './hooks/ScrollProvider';
import { ProjectProvider, useProjectContext } from './hooks/ProjectContext';
import ProjectDetail from './pages/ProjectDetail';

// Lazy load heavy components
const Showreel = lazy(() => import('./components/Showreel'));
const Projects = lazy(() => import('./components/Projects'));
const Breakdown = lazy(() => import('./components/Breakdown'));
const Skills = lazy(() => import('./components/Skills'));
const Clients = lazy(() => import('./components/Clients'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

// Initialize UnicornStudio
function useUnicornStudio() {
  useEffect(() => {
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
      script.onload = () => {
        if (!window.UnicornStudio?.isInitialized) {
          window.UnicornStudio?.init?.();
          window.UnicornStudio!.isInitialized = true;
        }
      };
      document.head.appendChild(script);
    }
  }, []);
}

// Fallback component for lazy loaded sections
function SectionFallback() {
  return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}

// Content inside ScrollProvider + ProjectProvider — can access both contexts
function AppContent() {
  const location = useLocation();
  const { activeSection } = useScrollContext();
  const { selectedProject, selectProject } = useProjectContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectClosing, setIsProjectClosing] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [showBackgroundVideo] = useState(true);

  // Video background is always shown (controlled by showBackgroundVideo state)

  const isProjectDetail = location.pathname.startsWith('/project/');
  const shouldHideNavbar = selectedProject || isProjectDetail || isProjectsModalOpen;

  // Listen for projects modal open/close events
  useEffect(() => {
    const handleModalOpen = () => setIsProjectsModalOpen(true);
    const handleModalClose = () => setIsProjectsModalOpen(false);

    window.addEventListener('projectsModalOpen', handleModalOpen);
    window.addEventListener('projectsModalClose', handleModalClose);

    return () => {
      window.removeEventListener('projectsModalOpen', handleModalOpen);
      window.removeEventListener('projectsModalClose', handleModalClose);
    };
  }, []);

  // Hide body scroll when project detail page is open
  useEffect(() => {
    document.body.style.overflow = isProjectDetail ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isProjectDetail]);

  // Handle project close with animation
  const handleCloseProject = () => {
    setIsProjectClosing(true);
    setTimeout(() => {
      selectProject(null);
      setIsProjectClosing(false);
    }, 50);
  };

  return (
    <>
      {/* Layer 1: Video background */}
      <AnimatePresence>
        {!selectedProject && (
          <motion.div
            className="fixed inset-0 z-[-20]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute top-0 left-0 -z-10 w-full h-full"
              data-us-project="cqcLtDwfoHqqRPttBbQE"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!selectedProject && (
          <motion.div
            className="fixed inset-0 z-[-5] pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(232,164,0,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(232,164,0,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {!isLoading && (
        <>
          {/* Navbar - hidden when project modal or project detail page is open */}
          <AnimatePresence>
            {!shouldHideNavbar && (
              <motion.div
                key="navbar"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="fixed inset-x-0 top-0 z-50"
                style={{ pointerEvents: 'none' }}
              >
                <div style={{ pointerEvents: 'auto' }}>
                  <Navbar activeSection={activeSection} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-black focus:rounded-lg focus:font-medium"
          >
            Skip to main content
          </a>

          {/* Main content - always shown */}
          <motion.main
            key="main-content"
            id="main-content"
            className="relative z-10"
          >
            <Hero />
            <Suspense fallback={<SectionFallback />}>
              <Showreel />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Projects />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Breakdown />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Skills />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Clients />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <About />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Contact />
            </Suspense>
          </motion.main>
        </>
      )}

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key={selectedProject.id}
            className="fixed inset-0 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectDetail />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Page - rendered via React Router when on /project/:id route */}
      <AnimatePresence>
        {isProjectDetail && (
          <motion.div
            className="fixed inset-0 z-[9999] overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectDetail />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  useUnicornStudio();
  return (
    <ScrollProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </ScrollProvider>
  );
}

export default App;
