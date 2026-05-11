import { memo, useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface NodeData {
  id: string;
  label: string;
  type: 'input' | 'process' | 'output' | 'merge';
  x: number;
  y: number;
  connections: string[];
  color: string;
  icon: string;
}

const NODE_COLORS = {
  input: { bg: 'rgba(0, 200, 83, 0.15)', border: 'rgba(0, 200, 83, 0.6)', text: '#00c853', glow: 'rgba(0, 200, 83, 0.3)' },
  process: { bg: 'rgba(232, 164, 0, 0.12)', border: 'rgba(232, 164, 0, 0.5)', text: '#f5a623', glow: 'rgba(232, 164, 0, 0.25)' },
  merge: { bg: 'rgba(124, 77, 255, 0.12)', border: 'rgba(124, 77, 255, 0.5)', text: '#a78bfa', glow: 'rgba(124, 77, 255, 0.25)' },
  output: { bg: 'rgba(232, 164, 0, 0.15)', border: 'rgba(232, 164, 0, 0.6)', text: '#f5a623', glow: 'rgba(232, 164, 0, 0.3)' },
};

const INITIAL_NODES: NodeData[] = [
  { id: 'read1', label: 'Read', type: 'input', x: 5, y: 20, connections: ['color1'], color: 'rgba(0, 200, 83, 0.5)', icon: 'R' },
  { id: 'read2', label: 'Read', type: 'input', x: 5, y: 45, connections: ['color1'], color: 'rgba(0, 200, 83, 0.5)', icon: 'R' },
  { id: 'read3', label: 'Read', type: 'input', x: 5, y: 70, connections: ['merge1'], color: 'rgba(0, 200, 83, 0.5)', icon: 'R' },
  { id: 'color1', label: 'ColorCorrect', type: 'process', x: 25, y: 32, connections: ['merge1'], color: 'rgba(232, 164, 0, 0.5)', icon: 'C' },
  { id: 'merge1', label: 'Merge', type: 'merge', x: 45, y: 50, connections: ['blur1'], color: 'rgba(124, 77, 255, 0.5)', icon: 'M' },
  { id: 'blur1', label: 'Blur', type: 'process', x: 63, y: 50, connections: ['grade1'], color: 'rgba(232, 164, 0, 0.5)', icon: 'B' },
  { id: 'grade1', label: 'Grade', type: 'process', x: 78, y: 50, connections: ['write1'], color: 'rgba(232, 164, 0, 0.5)', icon: 'G' },
  { id: 'write1', label: 'Write', type: 'output', x: 92, y: 50, connections: [], color: 'rgba(232, 164, 0, 0.5)', icon: 'W' },
];

function NukeNode({ node, index, isActive, onHover }: {
  node: NodeData;
  index: number;
  isActive: boolean;
  onHover: (id: string | null) => void;
}) {
  const colors = NODE_COLORS[node.type];
  const delay = index * 0.15;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: 'backOut' }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          boxShadow: isActive ? `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}` : `0 0 8px ${colors.glow}`,
          minWidth: '120px',
        }}
        animate={isActive ? {
          scale: [1, 1.06, 1],
          borderColor: [colors.border, colors.text, colors.border],
        } : {}}
        transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
      >
        <motion.div
          className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            background: colors.border,
            color: colors.text,
            fontFamily: 'monospace',
          }}
        >
          {node.icon}
        </motion.div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: colors.text, fontFamily: 'monospace' }}>
            {node.label}
          </span>
          <span className="text-[9px] text-white/20" style={{ fontFamily: 'monospace' }}>
            {node.id.toUpperCase()}
          </span>
        </div>
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full"
          style={{ background: colors.text, boxShadow: `0 0 8px ${colors.glow}` }}
        />
      </motion.div>
    </motion.div>
  );
}

function ConnectionLine({ from, to, isActive }: {
  from: NodeData;
  to: NodeData;
  isActive: boolean;
}) {
  const colors = NODE_COLORS[to.type];

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 0.9 : 0.35 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      style={{
        left: `${from.x}%`,
        top: `${from.y}%`,
        width: `${to.x - from.x}%`,
        height: '2px',
        transformOrigin: 'left center',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${colors.text}, ${colors.text})`,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-0 w-2 h-2 rounded-full -translate-y-1/2"
        style={{ background: colors.text, boxShadow: `0 0 6px ${colors.glow}` }}
        animate={isActive ? { opacity: [1, 0.3, 1] } : { opacity: 0.6 }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </motion.div>
  );
}

const NukeNodeTree = memo(function NukeNodeTree({ className = '' }: { className?: string }) {
  const [activeNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dataStream, setDataStream] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataStream(d => (d + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeConnections = useCallback((nodeId: string) => {
    const node = INITIAL_NODES.find(n => n.id === nodeId);
    if (!node) return [];
    return node.connections;
  }, []);

  const isNodeActive = useCallback((_nodeId: string) => {
    return true;
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ minHeight: '400px' }}>
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232, 164, 0, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232, 164, 0, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Data stream indicators - disabled */}
      {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="absolute h-[1px] opacity-40"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              width: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(232, 164, 0, 0.6), transparent)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear',
            }}
          />
        ))}
      </div> */}

      {/* Connection lines */}
      {INITIAL_NODES.map(node =>
        node.connections.map(connId => {
          const target = INITIAL_NODES.find(n => n.id === connId);
          if (!target) return null;
          return (
            <ConnectionLine
              key={`${node.id}-${connId}`}
              from={node}
              to={target}
              isActive={hoveredNode === node.id || hoveredNode === connId}
            />
          );
        })
      )}

      {/* Nodes */}
      {INITIAL_NODES.map((node, i) => (
        <NukeNode
          key={node.id}
          node={node}
          index={i}
          isActive={hoveredNode === node.id}
          onHover={setHoveredNode}
        />
      ))}

      {/* Floating data badges */}
      <motion.div
        className="absolute top-4 right-4 px-3 py-1.5 rounded text-[10px] font-mono font-semibold tracking-wider"
        style={{
          background: 'rgba(232, 164, 0, 0.1)',
          border: '1px solid rgba(232, 164, 0, 0.3)',
          color: '#f5a623',
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        FRAME: {String(1001 + dataStream * 24).padStart(4, '0')}
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-4 px-3 py-1.5 rounded text-[10px] font-mono font-semibold tracking-wider"
        style={{
          background: 'rgba(0, 200, 83, 0.08)',
          border: '1px solid rgba(0, 200, 83, 0.3)',
          color: '#00c853',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ▶ PLAYING — {String(24 + dataStream).padStart(2, '0')} fps
      </motion.div>

      {/* Corner decoration */}
      <div className="absolute bottom-4 right-4 text-[9px] font-mono text-white/20 tracking-widest">
        NUKE VFX PIPELINE
      </div>
    </div>
  );
});

export default NukeNodeTree;
