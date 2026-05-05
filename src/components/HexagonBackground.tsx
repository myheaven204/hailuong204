import { useEffect, useRef } from 'react';

interface Hex {
  col: number;
  row: number;
  cx: number;
  cy: number;
  glow: number;
  targetGlow: number;
}

const HEX_SIZE = 22;
const HEX_GAP = 2;
const MOUSE_RADIUS = 200;
const SPREAD_SPEED = 0.08;
const DECAY_SPEED = 0.06;

function hexCorner(cx: number, cy: number, size: number, i: number): [number, number] {
  const angle = (Math.PI / 180) * (60 * i - 30);
  return [cx + size * Math.cos(angle), cy + size * Math.sin(angle)];
}

function drawHex(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  glow: number
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const [x, y] = hexCorner(cx, cy, size, i);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  if (glow > 0.01) {
    const alpha = glow * 0.5;
    ctx.fillStyle = `rgba(232, 164, 0, ${alpha * 0.5})`;
    ctx.fill();

    ctx.strokeStyle = `rgba(232, 164, 0, ${alpha})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    if (glow > 0.3) {
      ctx.shadowColor = 'rgba(232, 164, 0, 0.8)';
      ctx.shadowBlur = glow * 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }
}

export default function HexagonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hexesRef = useRef<Hex[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const buildGrid = (w: number, h: number) => {
      const hexes: Hex[] = [];
      const effectiveSize = HEX_SIZE + HEX_GAP / 2;
      const colStep = effectiveSize * Math.sqrt(3);
      const rowStep = effectiveSize * 1.5;
      const cols = Math.ceil(w / colStep) + 2;
      const rows = Math.ceil(h / rowStep) + 2;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * colStep + (row % 2) * (colStep / 2);
          const cy = row * rowStep;
          hexes.push({ col, row, cx, cy, glow: 0, targetGlow: 0 });
        }
      }
      return hexes;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      sizeRef.current = { w: canvas.width, h: canvas.height };
      hexesRef.current = buildGrid(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hexes = hexesRef.current;

      // First pass: calculate target glow based on mouse distance
      for (let i = 0; i < hexes.length; i++) {
        const h = hexes[i];
        const dx = mx - h.cx;
        const dy = my - h.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const intensity = 1 - dist / MOUSE_RADIUS;
          h.targetGlow = Math.max(h.targetGlow, intensity * intensity);
        }
      }

      // Second pass: spread glow to neighbors
      const colStep = (HEX_SIZE + HEX_GAP / 2) * Math.sqrt(3);
      const rowStep = (HEX_SIZE + HEX_GAP / 2) * 1.5;
      const neighborDist = colStep * 1.2;

      for (let i = 0; i < hexes.length; i++) {
        const h = hexes[i];
        if (h.glow > 0.05) {
          for (let j = 0; j < hexes.length; j++) {
            if (i === j) continue;
            const other = hexes[j];
            const dx = h.cx - other.cx;
            const dy = h.cy - other.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < neighborDist) {
              const spread = h.glow * SPREAD_SPEED * (1 - dist / neighborDist);
              other.targetGlow = Math.max(other.targetGlow, spread);
            }
          }
        }
      }

      // Third pass: lerp glow and draw
      for (let i = 0; i < hexes.length; i++) {
        const h = hexes[i];

        // Lerp toward target
        h.glow += (h.targetGlow - h.glow) * 0.15;

        // Decay target
        h.targetGlow *= (1 - DECAY_SPEED);

        // Clamp
        if (h.glow < 0.005) h.glow = 0;
        if (h.glow > 1) h.glow = 1;

        drawHex(ctx, h.cx, h.cy, HEX_SIZE, h.glow);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 1 }}
      />
    );
}
