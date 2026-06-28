"use client";
import { motion } from "framer-motion";

const CARDS = [
  { id: "apps",       title: "Apps",       desc: "Products that redefine daily life",  symbol: "▣" },
  { id: "ai",         title: "AI",         desc: "Intelligence at the core",            symbol: "◈" },
  { id: "business",   title: "Business",   desc: "Strategy. Scale. Growth.",            symbol: "◉" },
  { id: "investment", title: "Investment", desc: "Where value is created",              symbol: "◇" },
  { id: "founder",    title: "Founder",    desc: "The origin of everything",            symbol: "✦" },
  { id: "contact",    title: "Contact",    desc: "Let's build the future",              symbol: "◎" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function NavCards() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="section-label mb-14"
      >
        EXPLORE ZLESS
      </motion.p>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl"
      >
        {CARDS.map((card) => (
          <motion.div
            key={card.id}
            variants={item}
            whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
            className="nav-card group cursor-pointer"
          >
            <span className="nav-card-symbol">{card.symbol}</span>
            <h3 className="nav-card-title">{card.title}</h3>
            <p className="nav-card-desc">{card.desc}</p>
            <div className="nav-card-line" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
