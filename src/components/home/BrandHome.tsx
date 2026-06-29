import Image from "next/image";
import logoMark from "../../../assets/logo-mark.jpg";

const domains = [
  {
    name: "Apps",
    text: "人の生活やスポーツを支える、体験と機能の設計。",
  },
  {
    name: "AI",
    text: "可能性を解き放つための知性と自動化。",
  },
  {
    name: "Business",
    text: "仕組みとシステムで、事業の速度を上げる。",
  },
  {
    name: "Apparel",
    text: "未来を纏う、ミニマルで強いブランド表現。",
  },
  {
    name: "Accessory",
    text: "透明感と存在感を宿すプロダクトライン。",
  },
  {
    name: "Investment",
    text: "新しい可能性に、長い視点で光を当てる。",
  },
];

const projects = ["ServeEye", "Zless AI", "Zless Brand", "Future Projects"];

export function BrandHome() {
  return (
    <div className="brand-home">
      <header className="site-header" aria-label="Zless">
        <a className="site-logo" href="#top" aria-label="Zless top">
          <span className="site-logo-mark">
            <Image src={logoMark} alt="" fill sizes="44px" priority />
          </span>
          <span>Zless</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#domains">Domains</a>
          <a href="#thought">Vision</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="top" className="home-hero">
          <div className="space-backdrop" aria-hidden="true">
            <span className="home-orbit home-orbit-a" />
            <span className="home-orbit home-orbit-b" />
            <span className="home-horizon" />
            <span className="home-sunrise" />
          </div>
          <div className="home-hero-copy">
            <p className="home-eyebrow">THE STORY STARTS AT ZERO.</p>
            <h1>すべては、ゼロから始まる。</h1>
            <p className="home-lead">
              Zlessは、テクノロジーとアイデアで、
              <br />
              人々の可能性を解き放ち、
              <br />
              新しい価値を創るブランドです。
            </p>
          </div>
          <div className="home-hero-symbol" aria-hidden="true">
            <div className="symbol-aura" />
            <div className="symbol-frame">
              <Image src={logoMark} alt="" fill sizes="360px" priority />
            </div>
            <span className="symbol-line" />
          </div>
        </section>

        <section id="domains" className="home-section domains-section">
          <div className="section-heading">
            <p>OUR DOMAINS</p>
            <h2>未来を形にする、6つの領域。</h2>
          </div>
          <div className="domain-grid">
            {domains.map((domain) => (
              <article className="domain-card" key={domain.name}>
                <span className="domain-light" aria-hidden="true" />
                <p>{domain.name}</p>
                <span>{domain.text}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="thought" className="home-section thought-section">
          <div>
            <p className="home-eyebrow">VISION</p>
            <h2>すべての挑戦は、ゼロから始まる。</h2>
          </div>
          <p>
            常識にとらわれず、課題の本質を見極め、ゼロベースで考える。
            そして、限られた場所から未来を形にする。
            それが、Zlessの挑戦です。
          </p>
        </section>

        <section id="projects" className="home-section projects-section">
          <div className="section-heading">
            <p>PROJECTS</p>
            <h2>静かに、次の価値をつくる。</h2>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <article className="project-row" key={project}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{project}</p>
                <i aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="home-section contact-section">
          <p className="home-eyebrow">CONTACT</p>
          <h2>Zlessの世界を、次へ。</h2>
          <div className="contact-actions">
            <a href="#domains">Zlessの世界を見る</a>
            <a href="mailto:info@zless.jp">お問い合わせ</a>
          </div>
        </section>
      </main>
    </div>
  );
}
