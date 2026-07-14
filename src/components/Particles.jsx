import { useEffect, useState } from 'react';

function Particle({ style }) {
  return (
    <div
      className="fixed bottom-0 rounded-full pointer-events-none"
      style={{
        ...style,
        width: style.size,
        height: style.size,
        left: style.left,
        background: `radial-gradient(circle, ${style.color}, transparent)`,
        boxShadow: `0 0 ${style.size * 2}px ${style.color}40`,
        animation: `particle-rise ${style.duration}s linear forwards`,
        opacity: 0.7,
      }}
    />
  );
}

export default function Particles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const colors = ['#a855f7', '#6366f1', '#38bdf8', '#818cf8'];
      const p = {
        id: Date.now() + Math.random(),
        size: Math.random() * 12 + 4,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 4 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setParticles((prev) => [...prev.slice(-15), p]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        @keyframes particle-rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.7; }
          100% { transform: translateY(-110vh) scale(0.2); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <Particle key={p.id} style={p} />
      ))}
    </div>
  );
}
