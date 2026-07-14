import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedNumber({ value, duration = 1500 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCurrent(value);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{current}</span>;
}

export default function RaidHeader({ raid, index }) {
  const buildCount = raid.builds.length;
  const roles = [...new Set(raid.builds.map((b) => b.role))];
  const avgDPS = Math.round(
    raid.builds.reduce((sum, b) => sum + b.stats.damage, 0) / buildCount,
  );
  const avgSurvival = Math.round(
    raid.builds.reduce((sum, b) => sum + b.stats.survivability, 0) / buildCount,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center mb-8"
    >
      <motion.h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider mb-4 gradient-text">
        {raid.icon} {raid.name}
      </motion.h2>

      {/* Quick stats */}
      <div className="flex justify-center gap-6 md:gap-10 mt-6 flex-wrap">
        {[
          { label: "Builds", value: buildCount, color: "text-purple-400" },
          { label: "DPS Prom.", value: `${avgDPS}%`, color: "text-red-400" },
          {
            label: "Supervivencia",
            value: `${avgSurvival}%`,
            color: "text-green-400",
          },
          { label: "Roles", value: roles.length, color: "text-blue-400" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className={`text-xl md:text-2xl font-bold ${stat.color}`}>
              {typeof stat.value === "number" ? (
                <AnimatedNumber value={stat.value} />
              ) : (
                stat.value
              )}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Role badges */}
      <div className="flex justify-center gap-2 mt-4">
        {roles.map((role) => (
          <span
            key={role}
            className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 text-gray-400 bg-white/[0.02]"
          >
            {role}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
