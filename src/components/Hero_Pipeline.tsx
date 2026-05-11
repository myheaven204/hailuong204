import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useReducedMotion, useSpring, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { springs, easings } from '../hooks/useAnimationSystem';

const ROLES = ['VFX Artist', 'Compositor', 'Motion Designer', 'Visual Effects'];

// ─── NODE TYPES ───────────────────────────────────────────────────────────────
type NodeType = 'input' | 'process' | 'merge' | 'output' | 'text';

interface PipelineNode {
  id: string;
  label: string;
  sublabel?: string;
  type: NodeType;
  color: { bg: string; border: string; text: string; glow: string };
}

interface Connection {
  from: string;
  to: string;
  toSocket?: string;
}

// ─── NODE COLORS (Nuke-inspired) ──────────────────────────────────────────────
const NODE_COLORS = {
  input: { bg: 'rgba(0, 200, 83, 0.12)', border: 'rgba(0, 200, 83, 0.6)', text: '#00c853', glow: 'rgba(0, 200, 83, 0.3)' },
  process: { bg: 'rgba(232, 164, 0, 0.1)', border: 'rgba(232, 164, 0, 0.5)', text: '#f5a623', glow: 'rgba(232, 164, 0, 0.25)' },
  merge: { bg: 'rgba(124, 77, 255, 0.1)', border: 'rgba(124, 77, 255, 0.5)', text: '#a78bfa', glow: 'rgba(124, 77, 255, 0.25)' },
  output: { bg: 'rgba(232, 164, 0, 0.15)', border: 'rgba(232, 164, 0, 0.6)', text: '#f5a623', glow: 'rgba(232, 164, 0, 0.3)' },
  text: { bg: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.3)', text: '#ffffff', glow: 'rgba(255, 255, 255, 0.2)' },
};

// ─── PIPELINE NODES DATA ──────────────────────────────────────────────────────
const PIPELINE_NODES: PipelineNode[] = [
  { id: 'read1', label: 'Read', sublabel: 'SOURCE_01', type: 'input', color: NODE_COLORS.input },
  { id: 'read2', label: 'Read', sublabel: 'SOURCE_02', type: 'input', color: NODE_COLORS.input },
  { id: 'read3', label: 'Read', sublabel: 'SOURCE_03', type: 'input', color: NODE_COLORS.input },
  { id: 'color1', label: 'ColorCorrect', sublabel: 'PRIMARY', type: 'process', color: NODE_COLORS.process },
  { id: 'merge1', label: 'Merge', sublabel: 'COMPOSITE', type: 'merge', color: NODE_COLORS.merge },
  { id: 'blur1', label: 'Blur', sublabel: 'ATMOSPHERE', type: 'process', color: NODE_COLORS.process },
  { id: 'merge2', label: 'Merge', sublabel: 'FINAL', type: 'merge', color: NODE_COLORS.merge },
  { id: 'grade1', label: 'Grade', sublabel: 'LUT_APPLY', type: 'process', color: NODE_COLORS.process },
  { id: 'write1', label: 'Write', sublabel: 'OUTPUT', type: 'output', color: NODE_COLORS.output },
];

const PIPELINE_CONNECTIONS: Connection[] = [
  { from: 'read1', to: 'color1' },
  { from: 'color1', to: 'merge1', toSocket: 'A' },
  { from: 'read2', to: 'merge1', toSocket: 'B' },
  { from: 'read3', to: 'blur1' },
  { from: 'blur1', to: 'grade1' },
  { from: 'grade1', to: 'merge2', toSocket: 'A' },
  { from: 'merge1', to: 'merge2', toSocket: 'B' },
  { from: 'merge2', to: 'write1' },
];

// ─── TEXT NODES (Main Title) ───────────────────────────────────────────────────
const TEXT_NODES: PipelineNode[] = [
  { id: 'h', label: 'H', type: 'text', color: NODE_COLORS.text },
  { id: 'a', label: 'A', type: 'text', color: NODE_COLORS.text },
  { id: 'i', label: 'I', type: 'text', color: NODE_COLORS.text },
  { id: 'l', label: 'L', type: 'text', color: NODE_COLORS.text },
  { id: 'u', label: 'U', type: 'text', color: NODE_COLORS.text },
  { id: 'o', label: 'O', type: 'text', color: NODE_COLORS.text },
  { id: 'n', label: 'N', type: 'text', color: NODE_COLORS.text },
  { id: 'g', label: 'G', type: 'text', color: NODE_COLORS.text },
  { id: 'vfx', label: 'VFX', type: 'output', color: NODE_COLORS.output },
];

// ─── MARQUEE STRIP ────────────────────────────────────────────────────────────
const MarqueeStrip = memo(function MarqueeStrip({ reversed, top }: { reversed?: boolean; top?: boolean }) {
  const items = [
    'VFX COMPOSITING', '·', 'MOTION DESIGN', '·', 'MATCHMOVING',
    '·', 'VISUAL EFFECTS', '·', '3D ANIMATION', '·', 'COLOR GRADING',
    '·', 'ROTO & PAINT', '·', 'LIGHTING', '·', 'VFX COMPOSITING',
    '·', 'MOTION DESIGN', '·', 'MATCHMOVING', '·', 'VISUAL EFFECTS',
    '·', '3D ANIMATION', '·', 'COLOR GRADING', '·', 'ROTO & PAINT',
    '·', 'LIGHTING', '·',
  ];

  return (
    <motion.div
      className="absolute left-0 right-0 z-20 overflow-hidden pointer-events-none select-none"
      style={top ? { top: 0 } : { bottom: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <div
        className="flex items-center py-3"
        style={{
          background: top
            ? 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)'
            : 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}
      >
        <motion.div
          className="flex items-center gap-6 whitespace-nowrap"
          animate={{ x: reversed ? ['0%', '50%'] : ['-50%', '0%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="text-[10px] uppercase tracking-[0.3em] font-semibold"
              style={{ color: item === '·' ? 'rgba(232,164,0,0.4)' : 'rgba(255,255,255,0.35)' }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
});

// ─── NODE COMPONENT ────────────────────────────────────────────────────────────
const PipelineNodeComponent = memo(function PipelineNodeComponent({
  node,
  index,
  isActive,
  isHovered,
  onHover,
  size = 'normal',
}: {
  node: PipelineNode;
  index: number;
  isActive?: boolean;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
  size?: 'small' | 'normal' | 'large';
}) {
  const colors = node.color;
  const delay = index * 0.12;
  const isMergeNode = node.type === 'merge';

  const sizeClasses = {
    small: 'px-2 py-1 min-w-[64px]',
    normal: 'px-3 py-2 min-w-[120px]',
    large: 'px-5 py-3 min-w-[160px]',
  };

  const iconSizes = {
    small: 'w-5 h-5 text-[10px]',
    normal: 'w-7 h-7 text-xs',
    large: 'w-9 h-9 text-sm',
  };

  const getIcon = () => {
    switch (node.type) {
      case 'input': return 'R';
      case 'process': return 'P';
      case 'merge': return 'M';
      case 'output': return 'W';
      default: return node.label.charAt(0);
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: easings.backOut }}
      onMouseEnter={() => onHover?.(node.id)}
      onMouseLeave={() => onHover?.(null)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onHover?.(isHovered ? null : node.id); } }}
      tabIndex={0}
    >
      <motion.div
        className={`relative flex flex-col items-center gap-1 rounded-lg ${sizeClasses[size]}`}
        style={{
          background: isHovered ? colors.bg : 'rgba(255,255,255,0.02)',
          border: `1px solid ${isHovered ? colors.text : colors.border}`,
          boxShadow: isHovered
            ? `0 0 25px ${colors.glow}, 0 0 50px ${colors.glow}, inset 0 0 20px ${colors.bg}`
            : `0 0 8px ${colors.glow}`,
          backdropFilter: 'blur(10px)',
        }}
        animate={isHovered ? {
          scale: [1, 1.03, 1],
          borderColor: [colors.border, colors.text, colors.border],
        } : {}}
        transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0 }}
      >
        {/* Icon badge */}
        <div
          className={`${iconSizes[size]} rounded flex items-center justify-center font-bold shrink-0`}
          style={{
            background: `linear-gradient(135deg, ${colors.border}, ${colors.bg})`,
            color: colors.text,
            fontFamily: 'monospace',
            boxShadow: `0 0 15px ${colors.glow}`,
          }}
        >
          {getIcon()}
        </div>

        {/* Labels */}
        <div className="flex flex-col items-center">
          <span
            className="text-[10px] font-semibold tracking-wider uppercase"
            style={{ color: colors.text, fontFamily: 'monospace' }}
          >
            {node.label}
          </span>
          {node.sublabel && (
            <span className="text-[8px] text-white/30" style={{ fontFamily: 'monospace' }}>
              {node.sublabel}
            </span>
          )}
        </div>

        {/* Output socket - right side */}
        <div
          className="absolute rounded-full socket-output"
          data-node-id={node.id}
          data-socket-type="output"
          style={{
            background: colors.text,
            boxShadow: `0 0 6px ${colors.glow}`,
            width: '5px',
            height: '5px',
            right: '-2.5px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        />

        {/* Input sockets - left side */}
        {isMergeNode ? (
          <>
            <div
              className="absolute left-0 socket-input socket-input-a"
              data-node-id={node.id}
              data-socket-type="inputA"
              style={{ top: '35%', transform: 'translateY(-50%)' }}
            >
              <span
                className="absolute left-0 text-[6px] font-mono opacity-50"
                style={{ color: colors.text, marginLeft: '-12px' }}
              >
                A
              </span>
              <div
                className="rounded-full"
                style={{
                  background: colors.text,
                  boxShadow: `0 0 5px ${colors.glow}`,
                  width: '5px',
                  height: '5px',
                  marginLeft: '-2.5px',
                  zIndex: 2,
                }}
              />
            </div>
            <div
              className="absolute left-0 socket-input socket-input-b"
              data-node-id={node.id}
              data-socket-type="inputB"
              style={{ top: '65%', transform: 'translateY(-50%)' }}
            >
              <span
                className="absolute left-0 text-[6px] font-mono opacity-50"
                style={{ color: colors.text, marginLeft: '-12px' }}
              >
                B
              </span>
              <div
                className="rounded-full"
                style={{
                  background: colors.text,
                  boxShadow: `0 0 5px ${colors.glow}`,
                  width: '5px',
                  height: '5px',
                  marginLeft: '-2.5px',
                  zIndex: 2,
                }}
              />
            </div>
          </>
        ) : (
          <div
            className="absolute rounded-full socket-input socket-input-single"
            data-node-id={node.id}
            data-socket-type="inputSingle"
            style={{
              background: colors.text,
              boxShadow: `0 0 6px ${colors.glow}`,
              width: '5px',
              height: '5px',
              left: '-2.5px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          />
        )}

        {/* Active pulse indicator */}
        {isActive && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              inset: '-4px',
              border: `1px solid ${colors.text}`,
              borderRadius: '10px',
              zIndex: -1,
            }}
            animate={{ opacity: [0.4, 0, 0.4], scale: [1, 1.02, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </motion.div>
  );
});

// ─── CONNECTION LINE ─────────────────────────────────────────────────────────
const ConnectionLine = memo(function ConnectionLine({
  fromNodeId,
  toNodeId,
  toSocketType,
  isActive,
  delay,
  color,
  containerRef,
}: {
  fromNodeId: string;
  toNodeId: string;
  toSocketType: 'inputSingle' | 'inputA' | 'inputB';
  isActive: boolean;
  delay: number;
  color: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [path, setPath] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const updatePath = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const outputSocket = container.querySelector(
      `[data-node-id="${fromNodeId}"][data-socket-type="output"]`
    ) as HTMLElement | null;

    let inputSocket: HTMLElement | null = null;
    if (toSocketType === 'inputSingle') {
      inputSocket = container.querySelector(
        `[data-node-id="${toNodeId}"][data-socket-type="inputSingle"]`
      ) as HTMLElement | null;
    } else {
      inputSocket = container.querySelector(
        `[data-node-id="${toNodeId}"][data-socket-type="${toSocketType}"]`
      ) as HTMLElement | null;
    }

    if (!outputSocket || !inputSocket) return;

    const outputRect = outputSocket.getBoundingClientRect();
    const inputRect = inputSocket.getBoundingClientRect();

    const startX = outputRect.left + outputRect.width / 2 - containerRect.left;
    const startY = outputRect.top + outputRect.height / 2 - containerRect.top;
    const endX = inputRect.left + inputRect.width / 2 - containerRect.left;
    const endY = inputRect.top + inputRect.height / 2 - containerRect.top;

    const dx = endX - startX;
    const controlOffset = Math.max(Math.abs(dx) * 0.5, 30);

    const cp1x = startX + controlOffset;
    const cp1y = startY;
    const cp2x = endX - controlOffset;
    const cp2y = endY;

    const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

    setPath(pathD);
    setIsVisible(true);
  }, [fromNodeId, toNodeId, toSocketType, containerRef]);

  useEffect(() => {
    updatePath();

    const handleResize = () => updatePath();
    window.addEventListener('resize', handleResize);

    const interval = setInterval(updatePath, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [updatePath]);

  if (!isVisible) return null;

  return (
    <motion.svg
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 0.9 : 0.55 }}
      transition={{ duration: 0.4, delay: 0.15 + delay * 0.08 }}
    >
      <defs>
        <filter id={`glow-${fromNodeId}-${toNodeId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={isActive ? 2.5 : 2}
        strokeOpacity={isActive ? 0.4 : 0.2}
        strokeLinecap="round"
        filter={`url(#glow-${fromNodeId}-${toNodeId})`}
      />

      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={isActive ? 2 : 1.5}
        strokeOpacity={isActive ? 1 : 0.7}
        strokeLinecap="round"
      />

      {isActive && (
        <circle r={3} fill={color} filter={`url(#glow-${fromNodeId}-${toNodeId})`}>
          <animateMotion dur="2s" repeatCount="indefinite" path={path} />
        </circle>
      )}
    </motion.svg>
  );
});

// ─── TEXT NODE COMPONENT ─────────────────────────────────────────────────────
const TextNodeComponent = memo(function TextNodeComponent({
  node,
  index,
  isHovered,
  onHover,
}: {
  node: PipelineNode;
  index: number;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
}) {
  const colors = node.color;
  const delay = index * 0.08;

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 60, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: easings.backOut }}
      onMouseEnter={() => onHover?.(node.id)}
      onMouseLeave={() => onHover?.(null)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onHover?.(isHovered ? null : node.id); } }}
      tabIndex={0}
    >
      <motion.div
        className="relative px-2 sm:px-3 py-2 sm:py-3 rounded-xl"
        style={{
          background: isHovered ? 'rgba(232,164,0,0.15)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isHovered ? 'rgba(232,164,0,0.8)' : 'rgba(255,255,255,0.15)'}`,
          boxShadow: isHovered ? '0 0 30px rgba(232,164,0,0.4)' : 'none',
        }}
        animate={isHovered ? {
          y: [0, -3, 0],
        } : {}}
        transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
      >
        <span
          className={`font-bold tracking-wide ${
            node.type === 'output'
              ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'
              : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
          }`}
          style={{
            color: isHovered ? '#f5a623' : colors.text,
            textShadow: isHovered
              ? '0 0 30px rgba(232,164,0,0.8), 0 0 60px rgba(232,164,0,0.4)'
              : 'none',
          }}
        >
          {node.label}
        </span>

        {node.type !== 'output' && (
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider whitespace-nowrap hidden md:block"
            style={{
              background: 'rgba(0,0,0,0.8)',
              border: `1px solid ${colors.border}`,
              color: colors.text,
            }}
          >
            CHAR_{index.toString().padStart(2, '0')}
          </div>
        )}

        {node.type === 'output' && (
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider whitespace-nowrap"
            style={{
              background: 'rgba(232, 164, 0, 0.2)',
              border: '1px solid rgba(232, 164, 0, 0.5)',
              color: '#f5a623',
            }}
          >
            FINAL OUTPUT
          </div>
        )}

        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(232,164,0,0.3) 0%, transparent 70%)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
    </motion.div>
  );
});

// ─── DATA FLOW PARTICLES ─────────────────────────────────────────────────────
const DataFlowParticles = memo(function DataFlowParticles() {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    startX: 5 + Math.random() * 10,
    startY: 10 + Math.random() * 80,
    endX: 75 + Math.random() * 15,
    endY: 10 + Math.random() * 40,
    delay: i * 0.5,
    duration: 3 + Math.random() * 2,
    size: 2 + Math.random() * 2,
    color: ['#00c853', '#f5a623', '#a78bfa', '#f5a623'][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: p.color,
            boxShadow: `0 0 8px ${p.color}, 0 0 15px ${p.color}`,
            left: `${p.startX}%`,
            top: `${p.startY}%`,
          }}
          animate={{
            left: [`${p.startX}%`, `${p.endX}%`],
            top: [`${p.startY}%`, `${p.endY}%`],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
});

// ─── MAIN HERO COMPONENT ────────────────────────────────────────────────────
function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  const opacity = shouldReduceMotion
    ? useTransform(scrollYProgress, [0, 1], [1, 1])
    : useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const contentScale = shouldReduceMotion
    ? useTransform(scrollYProgress, [0, 1], [1, 1])
    : useTransform(scrollYProgress, [0, 0.2], [1, 0.92]);

  // GSAP entrance animation for character-by-character reveal
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const ctx = gsap.context(() => {
      // Create a timeline for orchestrated entrance
      const tl = gsap.timeline({ delay: 0.2 });
      
      // 1. First, set all text nodes to initial state
      tl.set('.hero-char', { opacity: 0, y: 60 }, 0);
      
      // 2. Animate characters in with staggered reveal
      tl.to('.hero-char', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
      }, 0.3);
      
      // 3. Add a subtle scale bounce
      tl.from('.hero-char', {
        scale: 0.8,
        duration: 0.6,
        stagger: 0.04,
        ease: 'back.out(1.7)',
      }, 0.3);
      
    }, sectionRef);
    
    return () => ctx.revert();
  }, [shouldReduceMotion]);

  // Role cycling
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <section id="home" ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ overflowX: 'hidden' }} aria-labelledby="hero-heading">
      <h2 id="hero-heading" className="sr-only">VFX Artist Portfolio — Hai Luong</h2>

      {/* ── MARQUEE TOP ── */}
      <MarqueeStrip top />

      {/* Main Content Area */}
      <motion.div
        ref={heroContentRef}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center"
        style={{ opacity, scale: contentScale }}
      >
        {/* Role badge */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.4,
            ease: easings.backOut,
          }}
        >
          <div
            className="relative px-6 py-2.5 rounded-full"
            style={{
              background: 'rgba(232, 164, 0, 0.08)',
              border: '1px solid rgba(232, 164, 0, 0.25)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              }}
              animate={shouldReduceMotion ? {} : { x: ['-100%', '200%'] }}
              transition={shouldReduceMotion ? {} : { duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Role text with crossfade */}
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                className="relative text-xs uppercase tracking-[0.4em] font-semibold text-amber-400 inline-block"
                initial={{ opacity: 0, y: 10, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -10, rotateX: -20 }}
                transition={{ duration: 0.3, ease: easings.easeOut }}
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Main Title - Node Graph Style */}
        <div className="mb-8 relative">
          {/* Decorative node graph background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(232,164,0,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 50%, rgba(232,164,0,0.3) 0%, transparent 50%)
              `,
            }}
          />

          {/* Text nodes - Row 1: HAI LUONG */}
          <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 flex-nowrap pt-6 sm:pt-8 overflow-x-auto">
            {TEXT_NODES.filter(n => n.id !== 'vfx').map((node, i) => (
              <div key={node.id} className="hero-char">
                <TextNodeComponent
                  node={node}
                  index={i}
                  isHovered={hoveredNode === node.id}
                  onHover={setHoveredNode}
                />
              </div>
            ))}
          </div>

          {/* VFX - Row 2 */}
          <div className="flex justify-center items-center mt-4">
            {TEXT_NODES.filter(n => n.id === 'vfx').map((node, i) => (
              <div key={node.id} className="hero-char">
                <TextNodeComponent
                  node={node}
                  index={i + TEXT_NODES.length}
                  isHovered={hoveredNode === node.id}
                  onHover={setHoveredNode}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <motion.p 
          className="text-base md:text-lg mb-4 max-w-xl text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: easings.easeOut }}
        >
          VFX Compositor based in <span className="text-amber-400 font-medium">Ho Chi Minh City</span>
        </motion.p>

        <motion.p
          className="text-sm max-w-md mb-8 text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6, ease: easings.easeOut }}
        >
          5 years of experience in compositing, matchmoving, and visual effects.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.7, ease: easings.backOut }}
        >
          <MagneticButton
            onClick={() => {
              const el = document.getElementById('showreel');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                el.setAttribute('tabindex', '-1');
                el.focus({ preventScroll: true });
              }
            }}
            aria-label="Watch showreel"
            className="group relative flex items-center gap-4 px-10 py-4 rounded-full overflow-hidden"
            strength={0.4}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'rgba(18, 18, 18, 0.9)',
                border: '2px solid rgba(232, 164, 0, 0.4)',
                backdropFilter: 'blur(20px)',
              }}
            />

            {/* Fill animation on hover */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              }}
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: easings.easeOut }}
            />

            {/* Play icon */}
            <motion.div
              className="relative w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                boxShadow: '0 0 30px rgba(232, 164, 0, 0.5)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                }}
              />
              <Play size={20} className="text-gray-900 ml-0.5" fill="currentColor" />
            </motion.div>

            <span className="relative text-white font-medium tracking-wide group-hover:text-black transition-colors duration-300">
              Watch Showreel
            </span>
          </MagneticButton>
        </motion.div>

        {/* Secondary CTA */}
        <motion.a
          href="mailto:hailuong.vfx@gmail.com"
          className="group mt-6 relative flex items-center justify-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <span>Have a project?</span>
          <motion.span
            className="relative underline decoration-amber-400/30 group-hover:decoration-amber-400/60 decoration-1 underline-offset-4"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            Let&apos;s talk
          </motion.span>
        </motion.a>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-5 mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.7, ease: easings.easeOut }}
        >
          {[
            { value: '50+', label: 'Projects' },
            { value: '5+', label: 'Years Exp' },
            { value: '10+', label: 'Awards' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="relative flex items-center gap-3 px-6 py-3 rounded-full"
              style={{
                background: 'rgba(12, 12, 15, 0.5)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(60px) saturate(180%)',
                WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}
              whileHover={{
                y: -4,
                borderColor: 'rgba(232,164,0,0.25)',
                background: 'rgba(20,20,26,0.7)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(232,164,0,0.1)',
              }}
              transition={springs.gentle}
            >
              <span
                className="text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </span>
              <span className="text-[11px] text-white/30 uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <motion.span 
          className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.span>
        
        {/* Animated scroll indicator */}
        <motion.div
          className="w-6 h-10 rounded-full flex justify-center pt-2"
          style={{
            background: 'rgba(18, 18, 18, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
          }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="w-1 h-2.5 rounded-full"
            animate={{ 
              y: [0, 14, 0],
              opacity: [1, 0.3, 1],
              scale: [1, 0.8, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'linear-gradient(180deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              boxShadow: '0 0 10px rgba(232, 164, 0, 0.6)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* ── MARQUEE BOTTOM ── */}
      <MarqueeStrip />
    </section>
  );
}

export default Hero;
