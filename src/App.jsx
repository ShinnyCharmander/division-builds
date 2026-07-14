import Hero from './components/Hero';
import Navbar from './components/Navbar';
import RaidHeader from './components/RaidHeader';
import RaidCarousel from './components/RaidCarousel';
import Particles from './components/Particles';
import { buildsData } from './data/builds';
import { motion } from 'framer-motion';

const raids = [
  { id: 'ho', ...buildsData.horasOscuras },
  { id: 'cdh', ...buildsData.caballoDeHierro },
  { id: 'pp', ...buildsData.paradisoPerdido },
];

export default function App() {
  return (
    <div className="relative min-h-screen" style={{ background: '#0a0e17' }}>
      <Particles />
      <Navbar raids={raids} />
      <Hero />

      {raids.map((raid, i) => (
        <section
          key={raid.id}
          id={raid.id}
          className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pb-16 pt-8"
        >
          <RaidHeader raid={raid} index={i} />
          <RaidCarousel raid={raid} />

          {i < raids.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-16 h-px mx-auto max-w-md"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)',
              }}
            />
          )}
        </section>
      ))}

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 border-t border-white/5">
        <p className="text-gray-500 text-sm">
          Builds Raids e Incursion - The Division 2
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Haz clic en una build para expandir y descargar PDF
        </p>
      </footer>
    </div>
  );
}
