import { motion } from 'framer-motion';
import { Shield, Swords, Target } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', top: '-10%', left: '-10%' }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)', bottom: '-5%', right: '-5%' }}
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs uppercase tracking-[3px] font-semibold text-purple-300"
          style={{
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.25)',
          }}
        >
          <Shield size={14} />
          The Division 2
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold uppercase tracking-wider mb-6 gradient-text leading-tight"
        >
          Builds para Raids & Incursion
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-gray-400 text-lg leading-relaxed mb-10"
        >
          Builds optimizadas para{' '}
          <span className="text-purple-400 font-semibold">Horas Oscuras</span>,{' '}
          <span className="text-blue-400 font-semibold">Caballo de Hierro</span> y{' '}
          <span className="text-emerald-400 font-semibold">Paraiso Perdido</span>.
          Metricas, equipo y descarga en PDF.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex justify-center gap-8 md:gap-12"
        >
          {[
            { icon: Swords, value: '22', label: 'Builds' },
            { icon: Target, value: '3', label: 'Raids' },
            { icon: Shield, value: '4', label: 'Roles' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -3 }}
              className="flex flex-col items-center gap-1"
            >
              <s.icon size={20} className="text-purple-400 mb-1" />
              <span className="text-2xl font-bold text-white">{s.value}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
