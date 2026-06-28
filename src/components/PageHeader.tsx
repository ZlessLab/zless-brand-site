"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";

const NAV_ITEMS = [
  { label: "Vision",   href: "/#vision" },
  { label: "Products", href: "/#products" },
  { label: "About",    href: "/#about" },
  { label: "Contact",  href: "/#contact" },
];

export default function PageHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#010407]/90 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">

          {/* Logo */}
          <Link href="/" aria-label="Zless トップへ">
            <Logo size={26} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link key={label} href={href} className="nav-link">{label}</Link>
            ))}
          </nav>

          {/* Desktop: back button */}
          <Link
            href="/"
            className="hidden md:block text-[0.62rem] font-light tracking-[0.20em] border border-[rgba(60,135,255,0.18)] px-5 py-2 transition-colors"
            style={{ color: "rgba(148,202,255,0.75)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(85,160,255,0.50)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(148,202,255,0.75)"; e.currentTarget.style.borderColor = "rgba(60,135,255,0.18)"; }}>
            トップへ戻る
          </Link>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px]"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}>
            <span className={`block w-5 h-px bg-white/60 origin-center transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block w-5 h-px bg-white/60 transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-px bg-white/60 origin-center transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#010407] flex flex-col items-center justify-center gap-9"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {NAV_ITEMS.map(({ label, href }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}>
                <Link
                  href={href}
                  className="text-[1.15rem] font-light tracking-[0.42em] text-white/55 hover:text-white/90 transition-colors uppercase"
                  onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              className="mt-4 pt-7 border-t border-white/[0.06]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
              <Link
                href="/"
                className="text-[0.62rem] tracking-[0.30em] text-[rgba(85,155,255,0.55)] hover:text-[rgba(115,185,255,0.80)] transition-colors uppercase"
                onClick={() => setMenuOpen(false)}>
                ← トップへ戻る
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
