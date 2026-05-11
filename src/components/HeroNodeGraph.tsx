import { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from 'framer-motion';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type NodeType = 'input' | 'merge' | 'main' | 'process' | 'output';

interface NodeDef {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  type: NodeType;
  x: number; y: number; w: number; h: number;
}

interface ConnDef {
  id: string;
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
  particleColor: string;
}

// ─── COLORS ───────────────────────────────────────────────────────────────────
const COLORS: Record<NodeType, { bg: string; border: string; text: string; glow: string; header: string }> = {
  input:   { bg: 'rgba(0,200,83,0.10)',   border: 'rgba(0,200,83,0.55)',   text: '#00c853', glow: 'rgba(0,200,83,0.25)',   header: '#00c853' },
  merge:   { bg: 'rgba(124,77,255,0.10)', border: 'rgba(124,77,255,0.50)', text: '#a78bfa', glow: 'rgba(124,77,255,0.25)', header: '#7c4dff' },
  main:    { bg: 'rgba(232,164,0,0.12)',  border: 'rgba(232,164,0,0.70)',  text: '#f5a623', glow: 'rgba(232,164,0,0.40)',  header: '#e8a400' },
  process: { bg: 'rgba(33,150,243,0.10)', border: 'rgba(33,150,243,0.50)', text: '#64b5f6', glow: 'rgba(33,150,243,0.25)', header: '#2196f3' },
  output:  { bg: 'rgba(232,164,0,0.12)',  border: 'rgba(232,164,0,0.60)',  text: '#f5a623', glow: 'rgba(232,164,0,0.30)',  header: '#e8a400' },
};

// ─── NODE DATA (viewBox 1000×400) ─────────────────────────────────────────────
const NODES: NodeDef[] = [
  { id: 'read_001', label: 'FOOTAGE',     sublabel: 'Read',         icon: 'R', type: 'input',   x: 20,  y: 30,  w: 145, h: 58 },
  { id: 'read_002', label: 'CG PLATES',   sublabel: 'Read',         icon: 'R', type: 'input',   x: 20,  y: 171, w: 145, h: 58 },
  { id: 'read_003', label: 'MATTE PAINT', sublabel: 'Read',         icon: 'R', type: 'input',   x: 20,  y: 312, w: 145, h: 58 },
  { id: 'merge_001',label: 'COMPOSITE',   sublabel: 'Merge2',       icon: 'M', type: 'merge',   x: 255, y: 141, w: 155, h: 68 },
  { id: 'main',     label: 'HAI LUONG',   sublabel: 'Grade',        icon: 'G', type: 'main',    x: 500, y: 100, w: 225, h: 115 },
  { id: 'cc_001',   label: 'COLOR GRADE', sublabel: 'ColorCorrect', icon: 'C', type: 'process', x: 770, y: 48,  w: 155, h: 58 },
  { id: 'write_001',label: 'DELIVERY',    sublabel: 'Write',        icon: 'W', type: 'output',  x: 770, y: 238, w: 155, h: 58 },
];

// ─── CONNECTIONS ──────────────────────────────────────────────────────────────
// Socket positions: output = right-center, input = left-center
const CONNS: ConnDef[] = [
  { id: 'c1', x1: 165, y1: 59,    x2: 255, y2: 175,  color: 'rgba(0,200,83,0.5)',   particleColor: '#00c853' },
  { id: 'c2', x1: 165, y1: 200,   x2: 255, y2: 175,  color: 'rgba(0,200,83,0.5)',   particleColor: '#00c853' },
  { id: 'c3', x1: 165, y1: 341,   x2: 255, y2: 175,  color: 'rgba(0,200,83,0.5)',   particleColor: '#00c853' },
  { id: 'c4', x1: 410, y1: 175,   x2: 500, y2: 157,  color: 'rgba(124,77,255,0.5)', particleColor: '#a78bfa' },
  { id: 'c5', x1: 725, y1: 157,   x2: 770, y2: 77,   color: 'rgba(232,164,0,0.5)',  particleColor: '#f5a623' },
  { id: 'c6', x1: 725, y1: 157,   x2: 770, y2: 267,  color: 'rgba(232,164,0,0.5)',  particleColor: '#f5a623' },
];

function bezierD(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2;
  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
}

// ─── NODE BOX ─────────────────────────────────────────────────────────────────
function NodeBox({ node }: { node: NodeDef }) {
  const c = COLORS[node.type];
  const isMain = node.type === 'main';

  return (
    <div
      className={`node-box node-${node.type} absolute rounded-[4px] overflow-hidden`}
      style={{
        left: `${(node.x / 1000) * 100}%`,
        top: `${(node.y / 400) * 100}%`,
        width: `${(node.w / 1000) * 100}%`,
        height: `${(node.h / 400) * 100}%`,
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 12px ${c.glow}`,
        opacity: 0,
      }}
    >
      {/* Header strip */}
      <div className="h-[3px] w-full" style={{ background: c.header }} />

      {/* Body */}
      <div className={`flex items-center gap-2 px-2 h-[calc(100%-3px)] ${isMain ? 'px-3' : ''}`}>
        {/* Icon badge */}
        <div
          className="shrink-0 flex items-center justify-center rounded-[3px] font-bold"
          style={{
            width: isMain ? 28 : 22,
            height: isMain ? 28 : 22,
            background: `${c.header}33`,
            border: `1px solid ${c.header}88`,
            color: c.text,
            fontFamily: 'monospace',
            fontSize: isMain ? 11 : 9,
          }}
        >
          {node.icon}
        </div>

        {/* Labels */}
        <div className="flex flex-col min-w-0">
          <span
            className="leading-none truncate"
            style={{
              fontFamily: 'monospace',
              fontSize: isMain ? 9 : 8,
              color: c.text,
              letterSpacing: '0.08em',
              opacity: 0.7,
            }}
          >
            {node.sublabel}
          </span>
          <span
            className="leading-tight truncate font-bold"
            style={{
              fontFamily: isMain ? 'inherit' : 'monospace',
              fontSize: isMain ? 16 : 10,
              color: isMain ? '#ffffff' : c.text,
              letterSpacing: isMain ? '0.12em' : '0.06em',
              marginTop: 2,
            }}
          >
            {node.label}
          </span>
        </div>
      </div>

      {/* Input socket dot */}
      {node.type !== 'input' && (
        <div
          className="absolute top-1/2 -translate-y-1/2 -left-[4px] w-[7px] h-[7px] rounded-full border"
          style={{ background: c.header, borderColor: '#0a0a0a' }}
        />
      )}
      {/* Output socket dot */}
      {node.type !== 'output' && (
        <div
          className="absolute top-1/2 -translate-y-1/2 -right-[4px] w-[7px] h-[7px] rounded-full border"
          style={{ background: c.header, borderColor: '#0a0a0a' }}
        />
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const HeroNodeGraph = memo(function HeroNodeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (shouldReduceMotion) {
      gsap.set('.node-box', { opacity: 1 });
      gsap.set('.conn-path', { strokeDashoffset: 0 });
      gsap.set('.particle-group', { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Init paths
      const paths = container.querySelectorAll<SVGPathElement>('.conn-path');
      paths.forEach(p => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      });
      gsap.set('.particle-group', { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.3 });

      // Input nodes
      tl.to('.node-input', {
        opacity: 1, x: 0,
        duration: 0.5, stagger: 0.12, ease: 'power3.out',
      })
      // Draw input→merge connections
      .to([paths[0], paths[1], paths[2]], {
        strokeDashoffset: 0,
        duration: 0.6, stagger: 0.08, ease: 'power2.inOut',
      }, '-=0.2')
      // Merge node
      .to('.node-merge', {
        opacity: 1,
        duration: 0.45, ease: 'back.out(1.4)',
      }, '-=0.2')
      // Draw merge→main connection
      .to(paths[3], {
        strokeDashoffset: 0,
        duration: 0.5, ease: 'power2.inOut',
      }, '-=0.1')
      // Main node (scale in)
      .fromTo('.node-main', {
        opacity: 0, scale: 0.85,
        transformOrigin: '50% 50%',
      }, {
        opacity: 1, scale: 1,
        duration: 0.6, ease: 'back.out(1.6)',
      }, '-=0.1')
      // Draw main→output connections
      .to([paths[4], paths[5]], {
        strokeDashoffset: 0,
        duration: 0.5, stagger: 0.08, ease: 'power2.inOut',
      }, '-=0.1')
      // Output nodes
      .to('.node-process, .node-output', {
        opacity: 1,
        duration: 0.4, stagger: 0.1, ease: 'power3.out',
      }, '-=0.2')
      // Particles
      .to('.particle-group', {
        opacity: 1, duration: 0.3,
      }, '-=0.1');
    }, container);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 hidden md:block pointer-events-none"
      aria-hidden="true"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,164,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,164,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* SVG: connections + particles */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {CONNS.map(c => (
            <path key={`def-${c.id}`} id={`path-${c.id}`} d={bezierD(c.x1, c.y1, c.x2, c.y2)} />
          ))}
        </defs>

        {/* Connection lines */}
        {CONNS.map(c => (
          <path
            key={c.id}
            className="conn-path"
            d={bezierD(c.x1, c.y1, c.x2, c.y2)}
            fill="none"
            stroke={c.color}
            strokeWidth="1.5"
          />
        ))}

        {/* Data flow particles */}
        {CONNS.map((c, i) => (
          <g key={`p-${c.id}`} className="particle-group">
            <circle r="3" fill={c.particleColor} opacity="0.9">
              <animateMotion
                dur={`${1.8 + i * 0.3}s`}
                repeatCount="indefinite"
                begin={`${i * 0.4}s`}
              >
                <mpath href={`#path-${c.id}`} />
              </animateMotion>
            </circle>
            <circle r="2" fill={c.particleColor} opacity="0.5">
              <animateMotion
                dur={`${1.8 + i * 0.3}s`}
                repeatCount="indefinite"
                begin={`${i * 0.4 + 0.9}s`}
              >
                <mpath href={`#path-${c.id}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>

      {/* Node boxes */}
      {NODES.map(node => (
        <NodeBox key={node.id} node={node} />
      ))}
    </div>
  );
});

export default HeroNodeGraph;
