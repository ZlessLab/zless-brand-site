import Link from "next/link";
import Logo from "@/components/Logo";

export default function PageHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-[#010407]/90 to-transparent pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <Link href="/" aria-label="Zless トップへ">
          <Logo size={28} />
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {["Vision", "Projects", "Brands", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="nav-link"
            >
              {item}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="text-[0.64rem] font-light tracking-[0.20em] text-[rgba(148,202,255,0.82)] border border-[rgba(60,135,255,0.20)] px-5 py-2 transition-colors hover:text-white hover:border-[rgba(85,160,255,0.52)]"
        >
          トップへ戻る
        </Link>
      </div>
    </header>
  );
}
