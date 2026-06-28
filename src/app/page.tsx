"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import StarField from "@/components/StarField";

const NAV_ITEMS = ["Vision", "Projects", "Brands", "About", "News", "Contact"];

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#010407] text-white">

      {/* ══════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6">
        {/* Top gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#010407]/85 to-transparent pointer-events-none" />

        {/* Logo mark */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.9 }}
        >
          <Logo size={32} />
        </motion.div>

        {/* Nav links */}
        <motion.ul
          className="relative z-10 flex items-center gap-8 list-none m-0 p-0"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -8 }}
          transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="nav-link">
                {item}
              </a>
            </li>
          ))}
        </motion.ul>

        {/* CTA */}
        <motion.button
          className="relative z-10 nav-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.9, delay: 0.30 }}
        >
          Zlessの世界を見る
        </motion.button>
      </nav>

      {/* ══════════════════════════════════════════
          HERO — FIRST VIEW
      ══════════════════════════════════════════ */}
      <section className="relative flex min-h-screen overflow-hidden">

        {/* ── Left panel ── */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen w-[44%] pl-[7vw] pr-14">

          {/* Eyebrow */}
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.95, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            THE STORY STARTS AT ZERO.
          </motion.p>

          {/* Main copy */}
          <motion.div
            className="hero-main-copy mt-7"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.05, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>すべては、</p>
            <p>ゼロから始まる。</p>
          </motion.div>

          {/* Description */}
          <motion.div
            className="hero-desc mt-9"
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 1.0, delay: 0.84, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>Zlessは、</p>
            <p>テクノロジーとアイデアで、</p>
            <p>人の可能性を解き放ち、</p>
            <p>新しい価値を創るブランドです。</p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-11 left-[7vw] flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 0.55 : 0 }}
            transition={{ duration: 1.4, delay: 1.5 }}
          >
            <span className="scroll-label">Scroll</span>
            <motion.div
              className="scroll-bar"
              animate={{ scaleY: [1, 0.32, 1], opacity: [0.55, 0.90, 0.55] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* ── Right panel — space + logo ── */}
        <div className="relative flex-1 min-h-screen overflow-hidden">

          {/* Space star field */}
          <StarField />

          {/* Left-edge blend */}
          <div className="absolute inset-y-0 left-0 w-28 z-10 bg-gradient-to-r from-[#010407] to-transparent pointer-events-none" />

          {/* Blue light effects — layered behind logo */}
          <div className="absolute inset-0 z-[6] pointer-events-none">
            <div className="light-radial" />
            <div className="light-beam" />
            <div className="light-ray" />
            <div className="light-horizon" />
          </div>

          {/* Logo — centered */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.84 }}
              animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.84 }}
              transition={{ duration: 2.0, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="logo-halo" />
              <Logo size={260} />
            </motion.div>
          </div>
        </div>

        {/* Bottom fade — smooth scroll transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-20 bg-gradient-to-t from-[#010407] to-transparent pointer-events-none" />
      </section>

    </div>
  );
}
