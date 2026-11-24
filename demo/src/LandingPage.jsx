function HeroCopy() {
  return (
    <>
      <h1>
        Good ideas deserve
        <br />
        <span>better web.</span>
      </h1>
      <p className="hero-lede">
        Web3Fiber gives your team a visual way to shape expressive React
        experiences — with thoughtful content, motion, and interactive 3D.
      </p>
    </>
  );
}

function HeroActions() {
  return (
    <div className="hero-actions">
      <a className="button button-red" href="#capabilities">
        Explore the system <span aria-hidden="true">↗</span>
      </a>
      <a className="text-link" href="#how-it-works">
        How it works <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}

function HeroArtwork() {
  return (
    <div className="poster-art" aria-hidden="true">
      <div className="poster-grid" />
      <span className="poster-index">W3F / 001</span>
      <div className="poster-orbit poster-orbit-one" />
      <div className="poster-orbit poster-orbit-two" />
      <div className="poster-cube">
        <span className="cube-face cube-top" />
        <span className="cube-face cube-left" />
        <span className="cube-face cube-right" />
      </div>
      <span className="poster-cross">+</span>
      <span className="poster-caption">A new dimension<br />for the everyday web.</span>
      <span className="poster-foot">DESIGN / MOTION / REACT</span>
    </div>
  );
}

function FeatureSection() {
  return (
    <section className="features-shell wrap" id="capabilities">
      <div className="section-heading">
        <div>
          <p className="section-index"><span>01</span> / CAPABILITIES</p>
          <h2>Make the useful<br />feel unforgettable.</h2>
        </div>
        <p className="section-intro">
          The best digital experiences are easy to use and impossible to
          mistake for anyone else’s.
        </p>
      </div>
      <div className="feature-cards">
        <article className="feature-card">
          <span className="feature-number">01</span>
          <div className="feature-icon icon-layout" aria-hidden="true">
            <i /><i /><i />
          </div>
          <h3>Content with a point of view.</h3>
          <p>Compose a clear story from flexible, structured building blocks.</p>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </article>
        <article className="feature-card">
          <span className="feature-number">02</span>
          <div className="feature-icon icon-motion" aria-hidden="true">
            <i /><i /><i />
          </div>
          <h3>Motion that means something.</h3>
          <p>Give every interaction a little rhythm, without slowing things down.</p>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </article>
        <article className="feature-card">
          <span className="feature-number">03</span>
          <div className="feature-icon icon-dimension" aria-hidden="true">
            <i />
          </div>
          <h3>A new dimension to explore.</h3>
          <p>Bring lightweight, interactive 3D into the places it belongs.</p>
          <span className="card-arrow" aria-hidden="true">↗</span>
        </article>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="closing-section wrap">
      <div>
        <p className="section-index"><span>03</span> / YOUR NEXT MOVE</p>
        <h2>Make room for<br />a better kind of web.</h2>
      </div>
      <a className="button button-light" href="mailto:hello@web3fiber.dev">
        Start a conversation <span aria-hidden="true">↗</span>
      </a>
      <span className="closing-mark" aria-hidden="true">W3F</span>
    </section>
  );
}

function ProcessSection({ enhanced }) {
  return (
    <section className="process-section wrap" id="how-it-works">
      <p className="section-index"><span>{enhanced ? "03" : "02"}</span> / A BETTER WORKFLOW</p>
      <div className="process-content">
        <h2>Developers set the stage.<br /><span>Everyone gets to create.</span></h2>
        <p>
          Keep the structure in your code and the creative decisions in a
          friendly visual editor. Every change stays in validated layout data,
          ready to preview and refine.
        </p>
      </div>
      <div className="process-bottom">
        <span>BUILT FOR REACT</span>
        <span>SAFE BY DESIGN</span>
        <span>READY TO MOVE</span>
      </div>
    </section>
  );
}

export default function LandingPage({
  enhanced = false,
  heroEyebrow,
  heroContent,
  heroActions,
  heroArt,
  artLabel,
  featuresContent,
  showcaseContent,
  closingContent,
}) {
  const companionPath = enhanced ? "/" : "/enhanced";

  return (
    <div className={`site-page ${enhanced ? "enhanced-page" : "original-page"}`}>
      <header className="topbar wrap">
        <a className="brand" href={enhanced ? "/enhanced" : "/"} aria-label="Web3Fiber home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>web3fiber</span>
          <span className="brand-edition">{enhanced ? "STUDIO" : "FIELDNOTES"}</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#capabilities">Capabilities</a>
          <a href="#how-it-works">Approach</a>
          {enhanced && <a href="#editor-benefits">Editor benefits</a>}
          <a className="nav-cta" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
          <a className="version-link" href={companionPath}>
            {enhanced ? "View original" : "See it in the editor"}
          </a>
        </nav>
      </header>

      <main>
        <section className="hero-section wrap" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" />
              {heroEyebrow || "VISUAL WEB SYSTEMS"}
              <span className="eyebrow-divider">/</span>
              2026
            </p>
            {heroContent || <HeroCopy />}
            {heroActions || <HeroActions />}
            <div className="hero-footnote">
              <span>BUILT FOR REACT</span>
              <span>MADE TO MOVE</span>
            </div>
          </div>
          <div className={`hero-art ${enhanced ? "hero-art-enhanced" : ""}`}>
            <span className="sr-only">Abstract red and black geometric artwork.</span>
            {heroArt || <HeroArtwork />}
            <span className="art-label">
              {artLabel || "FIG. 01 — IDEAS IN MOTION"}
            </span>
          </div>
        </section>

        <div
          className={`ticker ${enhanced ? "ticker-enhanced" : ""}`}
          aria-label={
            enhanced
              ? "Editable content, motion controls, interactive 3D, structured layouts"
              : "Design, build, and make the web move"
          }
        >
          <div className="ticker-track" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index}>
                {enhanced ? "EDIT EVERY ZONE" : "DESIGN"} <b>✳</b>{" "}
                {enhanced ? "TUNE THE MOTION" : "BUILD"} <b>✳</b>{" "}
                {enhanced ? "INTERACT IN 3D" : "MAKE IT MOVE"} <b>✳</b>{" "}
                {enhanced ? "KEEP YOUR SOURCE" : ""}
              </span>
            ))}
          </div>
        </div>

        {featuresContent ? (
          <div id="capabilities">{featuresContent}</div>
        ) : (
          <FeatureSection />
        )}

        {showcaseContent}

        <ProcessSection enhanced={enhanced} />

        <div className="closing-holder" id="contact">
          {closingContent || <ClosingSection />}
        </div>
      </main>

      <footer className="site-footer wrap">
        <a className="brand footer-brand" href={enhanced ? "/enhanced" : "/"}>
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>web3fiber</span>
        </a>
        <span>Thoughtful tools for a more expressive web.</span>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </div>
  );
}

export { ClosingSection, FeatureSection, HeroActions, HeroArtwork, HeroCopy };
