import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Crosshair } from 'lucide-react';

export default function Navbar({ raids }) {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    raids.forEach((raid) => {
      const el = document.getElementById(raid.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [raids]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
      style={{ height: '64px' }}
    >
      <div className="absolute left-4 md:left-8">
        <img src="/icono.ico" alt="logo" className="w-9 h-9 rounded-full" />
      </div>

      <nav className="flex gap-2">
        {raids.map((raid) => (
          <motion.button
            key={raid.id}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo(raid.id)}
            className={`relative px-4 py-2 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              active === raid.id
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {active === raid.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Crosshair size={12} />
              {raid.name}
            </span>
          </motion.button>
        ))}
      </nav>
    </motion.header>
  );
}
