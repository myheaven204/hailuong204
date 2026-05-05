import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HexagonBackground from './components/HexagonBackground';
import ScrollCursorFollower from './components/ScrollCursorFollower';
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

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4';

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
      {/* Layer 1: Deep background (video + gradient) - hidden when project open */}
      <AnimatePresence>
        {!selectedProject && (
          <motion.div
            className="fixed inset-0 z-[-20]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <video
              src={VIDEO_URL}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full min-h-screen object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!selectedProject && (
          <motion.div
            className="fixed inset-0 z-[-15]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HexagonBackground />
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
                <ScrollCursorFollower />
              </motion.div>
            )}
          </AnimatePresence>
          
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
            <ProjectDetail
              project={selectedProject}
              onClose={handleCloseProject}
            />
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
  return (
    <ScrollProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </ScrollProvider>
  );
}

export default App;
