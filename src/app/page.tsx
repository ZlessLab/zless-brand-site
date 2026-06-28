"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";
import StarField from "@/components/StarField";

const NAV_ITEMS = [
  { label: "Vision",   href: "#vision" },
  { label: "Products", href: "#products" },
  { label: "About",    href: "#about" },
  { label: "Contact",  href: "#contact" },
];

export default function Home() {
  const [ready, setReady]       = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="bg-[#010407] text-white">

      {/* ══════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 md:py-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#010407]/85 to-transparent pointer-events-none" />

        {/* Logo */}
        <motion.div className="relative z-10"
          initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.9 }}>
          <Link href="/" aria-label="Zless トップ"><Logo size={28} /></Link>
        </motion.div>

        {/* Desktop links */}
        <motion.ul
          className="relative z-10 hidden md:flex items-center gap-8 list-none m-0 p-0"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -8 }}
          transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className="nav-link">{label}</a>
            </li>
          ))}
        </motion.ul>

        {/* Desktop CTA */}
        <motion.button
          className="relative z-10 nav-cta hidden md:block"
          initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.9, delay: 0.30 }}>
          Zlessの世界を見る
        </motion.button>

        {/* Mobile: hamburger */}
        <motion.button
          className="relative z-10 md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px]"
          initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.9 }}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}>
          <span className={`block w-5 h-px bg-white/60 origin-center transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block w-5 h-px bg-white/60 transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-px bg-white/60 origin-center transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </motion.button>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE MENU OVERLAY
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#010407] flex flex-col items-center justify-center gap-9"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {NAV_ITEMS.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                className="text-[1.15rem] font-light tracking-[0.42em] text-white/55 hover:text-white/90 transition-colors uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                onClick={() => setMenuOpen(false)}>
                {label}
              </motion.a>
            ))}
            <motion.div
              className="mt-4 pt-7 border-t border-white/[0.06] text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
              <p className="text-[0.54rem] tracking-[0.45em] text-white/18">ZLESS</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          HERO — FIRST VIEW
      ══════════════════════════════════════════ */}
      <section id="vision" className="relative min-h-[100svh] overflow-hidden">

        {/* ── Background (starfield + lights) ── */}
        <div className="absolute inset-0 z-0">
          <StarField />
          <div className="absolute inset-0 z-[5] pointer-events-none">
            <div className="light-radial" />
            <div className="light-beam" />
            <div className="light-ray" />
            <div className="light-horizon" />
          </div>
        </div>

        {/* Desktop: solid left-panel overlay + edge blend */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-[44%] z-[6] bg-[#010407]" />
        <div className="hidden md:block absolute inset-y-0 z-[7] w-28 pointer-events-none"
          style={{ left: "44%", background: "linear-gradient(to right,#010407,transparent)" }} />

        {/* Mobile: bottom gradient for text readability */}
        <div className="md:hidden absolute inset-x-0 bottom-0 h-[65%] z-[6] pointer-events-none"
          style={{ background: "linear-gradient(to top,#010407 28%,rgba(1,4,7,.82) 58%,transparent)" }} />

        {/* ── Content layout ── */}
        <div className="relative z-10 flex flex-col md:flex-row min-h-[100svh]">

          {/* Mobile: logo area (top 46vh) */}
          <div className="md:hidden flex items-center justify-center h-[46vh]">
            <motion.div className="relative"
              initial={{ opacity: 0, scale: 0.84 }}
              animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.84 }}
              transition={{ duration: 2.0, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}>
              <div className="logo-halo" />
              <Logo size={120} />
            </motion.div>
          </div>

          {/* Text panel — flex-1 on mobile (fills rest), fixed width on desktop */}
          <div className="flex flex-col justify-center flex-1 md:flex-none md:w-[44%] px-6 md:pl-[7vw] md:pr-14 pb-14 md:pb-0">

            <motion.p className="hero-eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.95, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}>
              THE STORY STARTS AT ZERO.
            </motion.p>

            <motion.div className="hero-main-copy mt-5 md:mt-7"
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 1.05, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}>
              <p className="whitespace-nowrap">すべては、</p>
              <p className="whitespace-nowrap">ゼロから始まる。</p>
            </motion.div>

            <motion.div className="hero-desc mt-6 md:mt-9"
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 1.0, delay: 0.84, ease: [0.22, 1, 0.36, 1] }}>
              <p>Zlessは、</p>
              <p>テクノロジーとアイデアで、</p>
              <p>人の可能性を解き放ち、</p>
              <p>新しい価値を創るブランドです。</p>
            </motion.div>
          </div>

          {/* Desktop: right panel logo */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <motion.div className="relative"
              initial={{ opacity: 0, scale: 0.84 }}
              animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.84 }}
              transition={{ duration: 2.0, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}>
              <div className="logo-halo" />
              <Logo size={260} />
            </motion.div>
          </div>
        </div>

        {/* Desktop: scroll indicator */}
        <motion.div
          className="hidden md:flex absolute bottom-11 left-[7vw] z-10 items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 0.55 : 0 }}
          transition={{ duration: 1.4, delay: 1.5 }}>
          <span className="scroll-label">Scroll</span>
          <motion.div className="scroll-bar"
            animate={{ scaleY: [1, 0.32, 1], opacity: [0.55, 0.90, 0.55] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }} />
        </motion.div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-32 z-20 bg-gradient-to-t from-[#010407] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════
          PRODUCTS — ServeEye
      ══════════════════════════════════════════ */}
      <section id="products" className="relative py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">

          <motion.p className="section-label text-center mb-14 md:mb-20"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 1 }}>
            PRODUCTS
          </motion.p>

          <motion.div className="product-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>

            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">

              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,rgba(30,80,220,0.22),rgba(10,40,140,0.10))",
                    border: "1px solid rgba(60,120,255,0.18)",
                  }}>
                  <span style={{ color: "rgba(100,165,255,0.65)", fontSize: "1.25rem" }}>▣</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[0.58rem] font-light tracking-[0.40em] text-[rgba(70,140,220,0.55)] uppercase mb-2">
                  iOS · PWA
                </p>
                <h2 className="text-xl md:text-2xl font-light tracking-[0.08em] text-white/90 mb-1">
                  ServeEye
                </h2>
                <p className="text-[0.70rem] font-light tracking-[0.06em] text-white/30 mb-5">
                  4人制ソフトバレーボール 得点管理アプリ
                </p>
                <p className="text-[0.82rem] font-light leading-[1.95] tracking-[0.04em] text-white/45 mb-7 max-w-lg">
                  試合のスコア・ローテーション・試合履歴をシンプルに管理。
                  大会の現場でそのまま使えるオフライン対応のPWAアプリです。
                </p>

                <div className="flex flex-wrap gap-3">
                  {/* App Store (coming soon) */}
                  <span className="product-btn-primary">
                    <span className="text-xs">⬇</span>
                    App Store
                    <span className="product-btn-badge">近日公開</span>
                  </span>

                  {/* Web版リンク — URLはVercelデプロイ後に更新してください */}
                  <a
                    href="https://serveeye-softvolleyball.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-btn-secondary">
                    Web版を試す →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT + CONTACT
      ══════════════════════════════════════════ */}
      <section id="about" className="relative py-20 md:py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-14 md:gap-24">

          <div className="flex-1">
            <p className="section-label mb-7">ABOUT</p>
            <p className="text-[0.82rem] font-light leading-[2.05] tracking-[0.04em] text-white/38">
              Zlessは「Zero Limits. Endless Success.」を理念に、<br className="hidden md:block" />
              テクノロジーとアイデアで新しい価値を創るブランドです。<br className="hidden md:block" />
              アプリ開発・AIソリューション・ブランド事業を展開しています。
            </p>
          </div>

          <div id="contact" className="flex-1">
            <p className="section-label mb-7">CONTACT</p>
            <a
              href="mailto:info@zless.jp"
              className="text-[0.82rem] font-light tracking-[0.08em] transition-colors"
              style={{ color: "rgba(85,155,255,0.60)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(115,185,255,0.88)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(85,155,255,0.60)")}>
              info@zless.jp
            </a>
            <p className="mt-4 text-[0.72rem] font-light tracking-[0.06em] text-white/22 leading-[1.9]">
              合同会社Zless<br />
              〒 — 高知県
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <Logo size={20} />
          <p className="footer-line">© {new Date().getFullYear()} Zless. All rights reserved.</p>
          <nav className="flex items-center gap-5">
            <Link href="/privacy" className="footer-nav-link">プライバシーポリシー</Link>
            <span className="text-white/10 text-xs select-none">|</span>
            <Link href="/terms" className="footer-nav-link">利用規約</Link>
          </nav>
        </div>
      </footer>

    </div>
  );
}
