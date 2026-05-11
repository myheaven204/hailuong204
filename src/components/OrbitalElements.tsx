import { motion } from 'framer-motion';
import { memo } from 'react';
import { Code2, Zap, Palette, Layers } from 'lucide-react';

const OrbitalElements = memo(function OrbitalElements() {
  const tools = [
    { icon: Code2, label: 'Nuke', angle: 0 },
    { icon: Zap, label: 'AE', angle: 90 },
    { icon: Palette, label: 'Blender', angle: 180 },
    { icon: Layers, label: 'Houdini', angle: 270 },
  ];

  const radius = 120;

  return (
    <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none">
      {/* Orbital ring */}
      <motion.div
        className="absolute w-64 h-64 border border-amber-500/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Orbital elements */}
      {tools.map((tool, i) => {
        const Icon = tool.icon;
        const angle = (tool.angle * Math.PI) / 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={tool.label}
            className="absolute w-12 h-12 flex items-center justify-center"
            animate={{
              x: [x, x * 1.1, x],
              y: [y, y * 1.1, y],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-24px',
              marginTop: '-24px',
            }}
          >
            <motion.div
              className="w-full h-full flex items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-colors"
              whileHover={{ scale: 1.2, boxShadow: '0 0 20px rgba(232, 164, 0, 0.4)' }}
            >
              <Icon size={20} className="text-amber-400" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
});

export default OrbitalElements;
