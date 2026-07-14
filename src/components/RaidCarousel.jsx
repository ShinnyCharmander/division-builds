import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Shield,
  Swords,
  Crosshair,
  Zap,
  Target,
  Heart,
  Wrench,
} from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const roleColors = {
  DPS: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    bar: "from-red-500 to-orange-500",
  },
  "DPS/Soporte": {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    bar: "from-orange-500 to-yellow-500",
  },
  Soporte: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
    bar: "from-green-500 to-emerald-500",
  },
  Tanque: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    bar: "from-blue-500 to-cyan-500",
  },
  CC: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
    bar: "from-purple-500 to-pink-500",
  },
};

const difficultyColors = {
  Facil: "text-green-400",
  Media: "text-yellow-400",
  Dificil: "text-red-400",
};

const statLabels = {
  damage: { label: "Daño", icon: Swords, color: "from-red-500 to-orange-500" },
  survivability: {
    label: "Supervivencia",
    icon: Heart,
    color: "from-green-500 to-emerald-500",
  },
  utility: {
    label: "Utilidad",
    icon: Wrench,
    color: "from-blue-500 to-cyan-500",
  },
  skillPower: {
    label: "Habilidades",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
  },
};

function StatBar({ statKey, value }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const info = statLabels[statKey];
  const Icon = info.icon;

  return (
    <div ref={ref} className="flex items-center gap-3">
      <Icon size={14} className="text-gray-400 shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {info.label}
          </span>
          <span className="text-xs font-bold text-white">{value}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${info.color}`}
            initial={{ width: 0 }}
            animate={{ width: animated ? `${value}%` : 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}

function BuildCard({ build, raidName, index }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const rc = roleColors[build.role] || roleColors.DPS;

  const downloadPDF = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!cardRef.current) {
      console.error("Card ref not found");
      alert("Error: No se pudo encontrar el elemento");
      return;
    }

    try {
      const element = cardRef.current;

      // Esperar un pequeño delay para que el DOM esté listo
      await new Promise((resolve) => setTimeout(resolve, 100));

      const imgData = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: "#0a0e17",
        cacheBust: true,
      });

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Crear PDF en orientación portrait
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calcular el tamaño de la imagen para que quepa en el PDF
      const imgHeight = (img.height * pdfWidth) / img.width;
      let finalHeight = imgHeight;
      let pages = 1;

      // Si la imagen es muy grande, dividir en varias páginas
      if (imgHeight > pdfHeight) {
        pages = Math.ceil(imgHeight / pdfHeight);
      }

      // Agregar la imagen al PDF
      let yPosition = 0;
      for (let i = 0; i < pages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, "PNG", 0, yPosition, pdfWidth, imgHeight);
        yPosition = -pdfHeight * (i + 1);
      }

      // Descargar el PDF
      const fileName = build.name.replace(/\s+/g, "_").toLowerCase();
      pdf.save(`${fileName}.pdf`);
    } catch (err) {
      console.error("Error detallado:", err);
      alert(`Error al descargar PDF: ${err.message || "Error desconocido"}`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="w-[320px] md:w-[360px] scroll-snap-start shrink-0"
    >
      <div
        ref={cardRef}
        onClick={() => setExpanded(!expanded)}
        className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 ${
          expanded ? "ring-2 ring-purple-500/50" : ""
        }`}
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(168,85,247,0.12)",
        }}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(168,85,247,0.1) 0%, transparent 60%)",
          }}
        />

        {/* Header with images */}
        <div className="flex gap-2 p-3">
          <div className="flex-1 rounded-xl overflow-hidden">
            <img
              src={build.image}
              alt={build.name}
              className="w-full h-[180px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
              style={{ background: "rgba(0,0,0,0.3)" }}
            />
          </div>
          <div className="flex-1 rounded-xl overflow-hidden">
            <img
              src={build.statsImage}
              alt="Stats"
              className="w-full h-[180px] object-contain rounded-xl"
              style={{ background: "rgba(0,0,0,0.3)" }}
            />
          </div>
        </div>

        {/* Name and badges */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              {build.name}
            </h3>
            <span
              className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${rc.bg} ${rc.text} ${rc.border} font-semibold`}
            >
              {build.role}
            </span>
            <span
              className={`text-[10px] uppercase tracking-widest font-semibold ${difficultyColors[build.difficulty]}`}
            >
              {build.difficulty}
            </span>
          </div>

          {/* Mini stat bars */}
          <div className="space-y-1.5 mb-3">
            {Object.entries(build.stats).map(([key, val]) => (
              <StatBar key={key} statKey={key} value={val} />
            ))}
          </div>

          {/* Info row */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Shield size={12} /> {build.specialization}
            </span>
            <span className="flex items-center gap-1">
              <Crosshair size={12} /> {build.weapons}
            </span>
          </div>
        </div>

        {/* Expandable details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-white/5">
                <p className="text-sm text-gray-300 mt-3 mb-3 italic">
                  {build.description}
                </p>

                <h4 className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-2">
                  Equipamiento
                </h4>
                <div className="space-y-1">
                  {build.pieces.map((piece, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2 text-xs py-1 px-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <Target size={10} className="text-purple-400 shrink-0" />
                      <span className="text-gray-400 w-20 shrink-0">
                        {piece.slot}:
                      </span>
                      <span className="text-white font-medium">
                        {piece.item}
                      </span>
                      <span className="text-gray-500 ml-auto">
                        {piece.brand}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* PDF Download button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadPDF}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 cursor-pointer pointer-events-auto"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                    border: "1px solid rgba(124,58,237,0.3)",
                  }}
                  type="button"
                >
                  <Download size={16} />
                  Descargar PDF
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand indicator */}
        <div className="flex justify-center pb-2">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500"
          >
            <ChevronLeft size={16} className="rotate-[-90deg]" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RaidCarousel({ raid }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const cardwidth = window.innerWidth >= 758 ? 364 : 324;
    const amount = 3 * cardwidth;
    scrollRef.current.scrollBy({
      left: dir === "prev" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Arrows */}
      <div className="flex gap-2 mb-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll("prev")}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(168,85,247,0.25)",
          }}
        >
          <ChevronLeft size={18} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll("next")}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(168,85,247,0.25)",
          }}
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="w-full max-w-[1090px] overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{
          scrollbarWidth: "auto",
          scrollbarColor: "#a855f7 transparent",
        }}
      >
        <div className="flex gap-1 px-4 w-max">
          {raid.builds.map((build, i) => (
            <BuildCard
              key={build.id}
              build={build}
              raidName={raid.name}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
