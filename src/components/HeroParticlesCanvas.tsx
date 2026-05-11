import { useRef, memo } from 'react';
import { useHeroParticles } from '../hooks/useHeroParticles';

const HeroParticlesCanvas = memo(function HeroParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useHeroParticles(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ display: 'block' }}
    />
  );
});

export default HeroParticlesCanvas;
