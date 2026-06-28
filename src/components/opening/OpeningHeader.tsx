import { OpeningLogo } from "./OpeningLogo";

const navItems = ["VISION", "PROJECTS", "BRANDS", "ABOUT", "NEWS", "CONTACT"];

export function OpeningHeader() {
  return (
    <header className="opening-header">
      <div className="opening-brand">
        <OpeningLogo className="opening-brand-mark" />
        <div>
          <p className="opening-brand-name">Zless</p>
          <p className="opening-brand-tag">Zero Limits. Endless Success.</p>
        </div>
      </div>
      <nav className="opening-nav" aria-label="Zless navigation">
        {navItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </nav>
      <button className="opening-cta" type="button">
        Zlessの世界を見る
        <span aria-hidden="true">→</span>
      </button>
    </header>
  );
}
