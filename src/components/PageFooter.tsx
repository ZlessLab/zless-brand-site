import Link from "next/link";

export default function PageFooter() {
  return (
    <footer className="border-t border-white/[0.06] mt-24">
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[0.68rem] font-light tracking-[0.28em] text-white/20">
          © {new Date().getFullYear()} Zless. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-[0.64rem] font-light tracking-[0.18em] text-white/30 hover:text-white/70 transition-colors"
          >
            プライバシーポリシー
          </Link>
          <span className="text-white/10 text-xs">|</span>
          <Link
            href="/terms"
            className="text-[0.64rem] font-light tracking-[0.18em] text-white/30 hover:text-white/70 transition-colors"
          >
            利用規約
          </Link>
        </nav>
      </div>
    </footer>
  );
}
