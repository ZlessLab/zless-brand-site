"use client";
import { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Stars — stored as fractions of canvas size for resize safety
    const stars = Array.from({ length: 170 }, () => ({
      bx: Math.random(),
      by: Math.random(),
      r:  0.3 + Math.random() * 1.8,
      maxOp: 0.10 + Math.random() * 0.82,
      tf: 0.18 + Math.random() * 1.30,
      tp: Math.random() * Math.PI * 2,
      dx: (Math.random() - 0.5) * 18,
      dy: (Math.random() - 0.5) * 11,
      df: 0.04 + Math.random() * 0.09,
      dp: Math.random() * Math.PI * 2,
    }));

    // Nebula clouds — slow drifting blue mist
    const nebulae = Array.from({ length: 14 }, () => ({
      bx: Math.random(),
      by: Math.random(),
      r:  0.05 + Math.random() * 0.14,
      maxOp: 0.020 + Math.random() * 0.048,
      f:  0.025 + Math.random() * 0.055,
      p:  Math.random() * Math.PI * 2,
      dx: (Math.random() - 0.5) * 0.07,
      dy: (Math.random() - 0.5) * 0.05,
    }));

    const draw = () => {
      t += 0.016;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep space gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0,    "#010407");
      bg.addColorStop(0.42, "#020c1a");
      bg.addColorStop(1,    "#010203");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Nebulae
      nebulae.forEach((n) => {
        const nx = (n.bx + n.dx * Math.sin(t * n.f + n.p)) * w;
        const ny = (n.by + n.dy * Math.cos(t * n.f * 0.68 + n.p)) * h;
        const r  = n.r * Math.min(w, h);
        const op = n.maxOp * (0.55 + 0.45 * Math.sin(t * n.f * 1.4 + n.p));
        const g  = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
        g.addColorStop(0,   `rgba(22, 60, 195, ${op})`);
        g.addColorStop(0.5, `rgba(14, 42, 155, ${op * 0.38})`);
        g.addColorStop(1,   "rgba(7, 22, 95, 0)");
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // Stars
      stars.forEach((s) => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.tf + s.tp);
        const op = s.maxOp * (0.32 + 0.68 * twinkle);
        const sx = s.bx * w + s.dx * Math.sin(t * s.df + s.dp);
        const sy = s.by * h + s.dy * Math.cos(t * s.df * 0.72 + s.dp);

        // Soft glow for brighter stars
        if (s.r > 1.05 && op > 0.30) {
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 5.5);
          g.addColorStop(0, `rgba(195, 220, 255, ${op * 0.28})`);
          g.addColorStop(1, "rgba(140, 185, 255, 0)");
          ctx.beginPath();
          ctx.arc(sx, sy, s.r * 5.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 230, 255, ${op})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
