import { motion } from 'framer-motion';
import { PROJECTS } from '../data/projects';

const CLIENTS = [
  { name: 'Tiger Balm', logo: 'TIGER BALM' },
  { name: 'KGC Jung Kwan Jang', logo: 'KGC JUNG KWAN JANG' },
  { name: 'Vim', logo: 'VIM' },
  { name: 'MBBank', logo: 'MBBANK' },
  { name: 'Rihair', logo: 'RIHAIR' },
  { name: 'NUVI', logo: 'NUVI' },
  { name: 'Takeda', logo: 'TAKEDA' },
  { name: 'Clear', logo: 'CLEAR' },
  { name: 'Lavie', logo: 'LAVIE' },
  { name: 'Wanda Study', logo: 'WANDA STUDY' },
  { name: 'Surf', logo: 'SURF' },
  { name: 'Close Up', logo: 'CLOSE UP' },
  { name: 'Boncha', logo: 'BONCHA' },
  { name: 'Kiri', logo: 'KIRI' },
  { name: 'KitKat', logo: 'KITKAT' },
  { name: 'VinaCapital', logo: 'VINACAPITAL' },
  { name: 'Shinhan', logo: 'SHINHAN' },
  { name: 'Sunlight', logo: 'SUNLIGHT' },
  { name: 'Tiki', logo: 'TIKI' },
  { name: 'Lay\'s', logo: 'LAY\'S' },
  { name: 'Grab', logo: 'GRAB' },
  { name: 'King Koil', logo: 'KING KOIL' },
  { name: 'Vietcombank', logo: 'VIETCOMBANK' },
  { name: 'Air Asia', logo: 'AIR ASIA' },
  { name: 'Maggi', logo: 'MAGGI' },
  { name: 'Visa', logo: 'VISA' },
  { name: 'Twister', logo: 'TWISTER' },
  { name: '7UP', logo: '7UP' },
  { name: 'Durex', logo: 'DUREX' },
  { name: 'Comfort', logo: 'COMFORT' },
  { name: 'Knorr', logo: 'KNORR' },
  { name: 'Rejoice', logo: 'REJOICE' },
  { name: 'OMO', logo: 'OMO' },
  { name: 'Heineken', logo: 'HEINEKEN' },
  { name: 'Momo', logo: 'MOMO' },
  { name: 'Sting', logo: 'STING' },
  { name: 'Milo', logo: 'MILO' },
  { name: 'Realme', logo: 'REALME' },
  { name: 'Lazada', logo: 'LAZADA' },
  { name: 'Baemin', logo: 'BAEMIN' },
  { name: 'ASUS', logo: 'ASUS' },
  { name: 'ZaloPay', logo: 'ZALOPAY' },
  { name: 'VSMART', logo: 'VSMART' },
  { name: 'Biti\'s', logo: 'BITI\'S' },
  { name: 'VNPT', logo: 'VNPT' },
  { name: '100Plus', logo: '100PLUS' },
];

export default function Clients() {
  return (
    <section className="py-20 overflow-hidden" aria-labelledby="clients-heading">
      <h2 id="clients-heading" className="sr-only">Clients & Partners</h2>
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[11px] tracking-[0.3em] text-amber-400/70 uppercase mb-4 block">
            Trusted By
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Clients & Partners
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Gradient overlays */}
        <div
          className="absolute left-0 top-0 bottom-0 w-48 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, hsl(0 0% 4%), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-48 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, hsl(0 0% 4%), transparent)' }}
        />

        {/* First row */}
        <div className="flex mb-5">
          <motion.div
            className="flex gap-4 items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: { repeat: Infinity, repeatType: 'loop', duration: 40, ease: 'linear' },
            }}
          >
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <div key={`${client.name}-${i}`} className="flex-shrink-0 group">
                <motion.div
                  className="px-12 py-5 rounded-2xl flex items-center justify-center min-w-[180px]"
                  style={{
                    background: 'rgba(12, 12, 15, 0.5)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(60px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                    transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                  whileHover={{
                    background: 'rgba(18, 18, 22, 0.7)',
                    borderColor: 'rgba(232,164,0,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 20px rgba(232,164,0,0.06)',
                  }}
                >
                  <span className="text-lg md:text-xl font-bold tracking-widest whitespace-nowrap text-white/20 group-hover:text-amber-400/70 transition-colors duration-500">
                    {client.logo}
                  </span>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second row */}
        <div className="flex">
          <motion.div
            className="flex gap-4 items-center"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              x: { repeat: Infinity, repeatType: 'loop', duration: 45, ease: 'linear' },
            }}
          >
            {[...CLIENTS.slice().reverse(), ...CLIENTS.slice().reverse()].map((client, i) => (
              <div key={`${client.name}-rev-${i}`} className="flex-shrink-0 group">
                <motion.div
                  className="px-12 py-5 rounded-2xl flex items-center justify-center min-w-[180px]"
                  style={{
                    background: 'rgba(12, 12, 15, 0.5)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(60px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                    transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                  whileHover={{
                    background: 'rgba(18, 18, 22, 0.7)',
                    borderColor: 'rgba(232,164,0,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 20px rgba(232,164,0,0.06)',
                  }}
                >
                  <span className="text-lg md:text-xl font-bold tracking-widest whitespace-nowrap text-white/20 group-hover:text-amber-400/70 transition-colors duration-500">
                    {client.logo}
                  </span>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        className="max-w-7xl mx-auto px-6 mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="flex flex-wrap justify-center gap-5 md:gap-8">
          {[
            { value: '20+', label: 'Happy Clients', color: '#fbbf24' },
            { value: `${PROJECTS.length}+`, label: 'Projects Delivered', color: '#f59e0b' },
            { value: '5', label: 'Years Experience', color: '#d97706' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="relative text-center p-6 rounded-3xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: 'rgba(12, 12, 15, 0.6)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(60px) saturate(180%)',
                WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
              whileHover={{
                y: -4,
                background: 'rgba(18, 18, 22, 0.72)',
                borderColor: `${stat.color}25`,
                boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 30px ${stat.color}0f`,
              }}
            >
              {/* Top rim */}
              <div
                className="absolute inset-x-0 top-0 h-px rounded-t-3xl"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color}35, transparent)`,
                }}
              />
              <span
                className="text-4xl md:text-5xl font-bold block"
                style={{
                  color: stat.color,
                  textShadow: `0 0 30px ${stat.color}30`,
                }}
              >
                {stat.value}
              </span>
              <p className="text-sm text-white/30 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
