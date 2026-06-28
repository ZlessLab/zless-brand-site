"use client";
import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";

interface Particle {
  id: number;
  startX: number; startY: number;
  midX: number;   midY: number;
  delay: number;
  size: number;
  duration: number;
  depth: number; // 0=far/small/slow  1=near/large/fast
}

const COUNT = 36;

export default function ParticleField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: COUNT }, (_, i) => {
      const side  = i % 4;
      const depth = 0.15 + Math.random() * 0.85; // simulated z-depth
      const dist  = 350 + (1 - depth) * 420;     // far particles start farther
      const pos   = (Math.floor(i / 4) / (COUNT / 4)) + (Math.random() - 0.5) * 0.3;

      let sx = 0, sy = 0;
      switch (side) {
        case 0: sx = (pos - 0.5) * dist * 1.6; sy = -dist * 0.9; break;
        case 1: sx = dist * 0.9;               sy = (pos - 0.5) * dist * 1.6; break;
        case 2: sx = (pos - 0.5) * dist * 1.6; sy =  dist * 0.9; break;
        default: sx = -dist * 0.9;             sy = (pos - 0.5) * dist * 1.6; break;
      }

      // Curved orbital midpoint — perpendicular offset for spiral feel
      const mag = Math.sqrt(sx ** 2 + sy ** 2);
      const nx  = sx / mag;
      const ny  = sy / mag;
      const orb = (Math.random() * 2 - 1) * (25 + depth * 55);

      return {
        id: i,
        startX: sx,   startY: sy,
        midX: sx * 0.28 + (-ny) * orb,
        midY: sy * 0.28 +   nx  * orb,
        delay:    Math.random() * 0.5,
        size:     0.8 + depth * 3.4,          // near = larger
        duration: 1.55 - depth * 0.48,        // near = faster
        depth,
      };
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      <div className="absolute top-1/2 left-1/2">
        {particles.map((p) => {
          const alpha = 0.3 + p.depth * 0.7;
          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width:      p.size,
                height:     p.size,
                marginLeft: -p.size / 2,
                marginTop:  -p.size / 2,
                background: `radial-gradient(circle,
                  rgba(235,248,255,${alpha}) 0%,
                  rgba(110,185,255,${alpha * 0.6}) 55%,
                  transparent 100%)`,
                boxShadow: `0 0 ${p.size * 6}px rgba(160,215,255,${alpha * 0.9})`,
                // Far particles are slightly blurred — depth-of-field effect
                filter: p.depth < 0.3 ? "blur(0.7px)" : "none",
              }}
              initial={{ x: p.startX, y: p.startY, scale: 0.8 + p.depth * 0.4, opacity: 0 }}
              animate={{
                x:       [p.startX, p.midX, 0],
                y:       [p.startY, p.midY, 0],
                scale:   [0.8 + p.depth * 0.4, 1.2, 0],
                opacity: [0, alpha, 0],
              }}
              transition={{
                duration: p.duration,
                delay:    p.delay,
                // slow arc → explosive final acceleration (sucked into logo)
                ease:  [0.45, 0, 0.97, 0.85],
                times: [0, 0.4, 1],
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
