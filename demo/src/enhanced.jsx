import { useMemo } from "react";
import {
  EditorProvider,
  EditableZone,
  localStorageAdapter,
} from "../../src/index.js";
import { EditorUI } from "../../src/editor.jsx";
import LandingPage, {
  ClosingSection,
  FeatureSection,
  HeroActions,
  HeroArtwork,
  HeroCopy,
} from "./LandingPage.jsx";

const initialLayouts = {
  "studio-hero-copy": {
    version: 1,
    zoneId: "studio-hero-copy",
    blocks: [
      {
        id: "studio-hero",
        type: "hero",
        props: {
          title: "Build the web. Make it move.",
          subtitle:
            "Edit real React content in the browser, tune motion by feel, and add interactive 3D—without rewriting your source.",
          color: "#171717",
          background: "#f4f3f1",
          buttonText: "",
          animation: "slideUp",
        },
      },
    ],
  },
  "studio-hero-actions": {
    version: 1,
    zoneId: "studio-hero-actions",
    blocks: [
      {
        id: "studio-primary-action",
        type: "button",
        props: {
          label: "Explore the live canvas ↘",
          url: "#capabilities",
          color: "#ffffff",
          background: "#e64438",
          fontFamily: "Poppins",
          animation: "slideUp",
          hoverEffect: "lift",
          hoverIntensity: 1,
          hoverDuration: 0.25,
          hoverColor: "#ffffff",
          hoverBackground: "#171717",
        },
      },
      {
        id: "studio-secondary-action",
        type: "button",
        props: {
          label: "See the editor benefits ↓",
          url: "#editor-benefits",
          color: "#171717",
          background: "#f4f3f1",
          fontFamily: "Poppins",
          animation: "fadeIn",
          hoverEffect: "lift",
          hoverIntensity: 0.5,
          hoverDuration: 0.2,
          hoverColor: "#e64438",
          hoverBackground: "#f4f3f1",
        },
      },
    ],
  },
  "studio-hero-art": {
    version: 1,
    zoneId: "studio-hero-art",
    blocks: [
      {
        id: "studio-interactive-cubes",
        type: "interactive-cube-field",
        props: {
          color: "#e64438",
          secondaryColor: "#e7e4df",
          background: "#171717",
          count: 144,
          height: 390,
          animation: "fadeIn",
        },
      },
    ],
  },
  "studio-features": {
    version: 1,
    zoneId: "studio-features",
    blocks: [
      {
        id: "studio-feature-grid",
        type: "feature-grid",
        props: {
          title: "More than a visual layer.",
          subtitle: "A practical toolkit for shaping real React pages, right where your team works.",
          firstTitle: "Edit the page, not your source.",
          firstText: "Change content and colors in the browser while your React application stays yours.",
          secondTitle: "Tune motion as you design.",
          secondText: "Set entrance effects, hover behavior, timing, and color from the inspector.",
          thirdTitle: "Make 3D part of the story.",
          thirdText: "Add a responsive cube field visitors can push around with their pointer.",
          color: "#171717",
          background: "#f4f3f1",
          animation: "slideUp",
        },
      },
    ],
  },
  "studio-closing": {
    version: 1,
    zoneId: "studio-closing",
    blocks: [
      {
        id: "studio-callout",
        type: "callout",
        props: {
          title: "Keep the code. Give the page room to move.",
          text: "Your React app stays yours. Your team gets a faster way to shape it.",
          buttonText: "Start building ↗",
          url: "mailto:hello@web3fiber.dev",
          color: "#ffffff",
          background: "#e64438",
          animation: "zoomIn",
        },
      },
    ],
  },
  "studio-principle": {
    version: 1,
    zoneId: "studio-principle",
    blocks: [
      {
        id: "studio-principle-quote",
        type: "quote",
        props: {
          quote: "Your layout is data. Your application stays yours.",
          author: "WEB3FIBER PRINCIPLE",
          role: "Structured layouts · Registered React blocks",
          color: "#ffffff",
          background: "#242424",
          animation: "slideUp",
        },
      },
    ],
  },
};

function EditorBenefits() {
  return (
    <section className="editor-benefits" id="editor-benefits">
      <div className="editor-benefits-inner wrap">
        <div className="editor-benefits-copy">
          <p className="section-index"><span>02</span> / THE EDITOR IS YOURS</p>
          <h2>Design it.<br /><em>Change it live.</em></h2>
          <p className="editor-benefits-lede">
            A visual workflow that helps your team move faster without taking
            ownership away from your codebase.
          </p>
          <ol className="editor-benefit-list">
            <li>
              <span>01</span>
              <div>
                <h3>Choose a zone</h3>
                <p>Each editable section stays independent and easy to find.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Shape the details</h3>
                <p>Adjust copy, colors, fonts, motion, and 3D in the inspector.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Keep your source</h3>
                <p>Edits are saved as validated layout JSON, not generated code.</p>
              </div>
            </li>
          </ol>
        </div>
        <aside className="principle-card" aria-label="Editable layout principle">
          <div className="principle-card-top">
            <span className="principle-lights" aria-hidden="true"><i /><i /><i /></span>
            <span>CONTENT BLOCK / QUOTE</span>
            <span>ZONE 06</span>
          </div>
          <EditableZone
            id="studio-principle"
            className="principle-zone"
            fallback={
              <figure className="principle-fallback">
                <blockquote>Your layout is data. Your application stays yours.</blockquote>
                <figcaption>WEB3FIBER PRINCIPLE · Structured layouts</figcaption>
              </figure>
            }
          />
          <div className="principle-card-bottom">
            <span>LAYOUT V1</span>
            <span>SAFE BY SCHEMA</span>
            <span>✳</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function EnhancedLanding() {
  const storage = useMemo(() => {
    const adapter = localStorageAdapter();
    return {
      async load(zoneId) {
        const saved = await adapter.load(zoneId);
        return saved ?? initialLayouts[zoneId] ?? null;
      },
      save: adapter.save,
    };
  }, []);

  return (
    <div className="enhanced-app">
      <EditorProvider storage={storage} canEdit>
        <LandingPage
          enhanced
          heroEyebrow="LIVE EDITOR / SIX EDITABLE ZONES"
          artLabel="144 INTERACTIVE CUBES / MOVE TO COLLIDE"
          heroContent={
            <EditableZone
              id="studio-hero-copy"
              className="hero-copy-editor-zone"
              fallback={<HeroCopy />}
            />
          }
          heroActions={
            <EditableZone
              id="studio-hero-actions"
              className="hero-actions-editor-zone"
              fallback={<HeroActions />}
            />
          }
          heroArt={
            <EditableZone
              id="studio-hero-art"
              className="hero-art-editor-zone"
              fallback={<HeroArtwork />}
            />
          }
          featuresContent={
            <EditableZone
              id="studio-features"
              className="features-editor-zone wrap"
              fallback={<FeatureSection />}
            />
          }
          showcaseContent={<EditorBenefits />}
          closingContent={
            <EditableZone
              id="studio-closing"
              className="closing-editor-zone wrap"
              fallback={<ClosingSection />}
            />
          }
        />
        <EditorUI />
      </EditorProvider>
    </div>
  );
}

export default EnhancedLanding;
