import { motion, useReducedMotion } from "motion/react";
import { getInteractiveMotionProps } from "./interactive-motion.js";

export function TextBlock({
  text = "Your text goes here",
  color = "#1b2340",
  size = 18,
  align = "left",
  fontFamily = "system-ui",
  hoverEffect = "lift",
  hoverIntensity = 0.8,
  hoverDuration = 0.25,
  hoverColor = "#4169e1",
}) {
  const reducedMotion = useReducedMotion();
  const interactiveProps = reducedMotion
    ? {}
    : getInteractiveMotionProps({
        effect: hoverEffect,
        intensity: hoverIntensity,
        duration: hoverDuration,
        hoverColor,
      });

  return (
    <motion.p
      {...interactiveProps}
      style={{
        color,
        fontFamily,
        fontSize: `${size}px`,
        textAlign: align,
        lineHeight: 1.6,
        margin: "12px 0",
      }}
    >
      {text}
    </motion.p>
  );
}

export function HeroBlock({
  title = "Build something remarkable.",
  subtitle = "A flexible hero section for your website.",
  color = "#111827",
  background = "#eef2ff",
  buttonText = "Get started",
}) {
  return (
    <div
      style={{
        padding: "64px 28px",
        borderRadius: 18,
        textAlign: "center",
        color,
        background,
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          lineHeight: 1.08,
          margin: "0 0 16px",
          letterSpacing: "-.04em",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 18,
          opacity: 0.72,
          maxWidth: 620,
          margin: "0 auto 24px",
        }}
      >
        {subtitle}
      </p>
      <button
        style={{
          border: 0,
          borderRadius: 999,
          background: "#4169e1",
          color: "white",
          padding: "13px 24px",
          fontWeight: 700,
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export function ButtonBlock({
  label = "Explore more",
  url = "#",
  color = "#ffffff",
  background = "#4169e1",
  hoverEffect = "lift",
  hoverIntensity = 1,
  hoverDuration = 0.25,
  hoverColor = "#ffffff",
  hoverBackground = "#2848b8",
  fontFamily = "system-ui",
}) {
  const reducedMotion = useReducedMotion();
  const interactiveProps = reducedMotion
    ? {}
    : getInteractiveMotionProps({
        effect: hoverEffect,
        intensity: hoverIntensity,
        duration: hoverDuration,
        hoverColor,
        hoverBackgroundColor: hoverBackground,
      });

  return (
    <motion.a
      {...interactiveProps}
      href={url}
      style={{
        display: "inline-block",
        padding: "12px 22px",
        borderRadius: 999,
        color,
        background,
        textDecoration: "none",
        fontWeight: 700,
        fontFamily,
      }}
    >
      {label}
    </motion.a>
  );
}

export function ImageBlock({
  src = "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200",
  alt = "Decorative image",
  radius = 16,
}) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: "block",
        width: "100%",
        maxHeight: 440,
        objectFit: "cover",
        borderRadius: `${radius}px`,
      }}
    />
  );
}

export function FeatureGridBlock({
  title = "Everything you need to get started",
  subtitle = "A few highlights to help tell your story.",
  firstTitle = "Thoughtful design",
  firstText = "A clear, polished experience on every screen.",
  secondTitle = "Made for teams",
  secondText = "Keep your workflow simple and collaborative.",
  thirdTitle = "Ready to grow",
  thirdText = "Flexible building blocks that scale with you.",
  color = "#172033",
  background = "#f4f6fb",
}) {
  const features = [
    [firstTitle, firstText],
    [secondTitle, secondText],
    [thirdTitle, thirdText],
  ];

  return (
    <section
      style={{
        padding: "36px 24px",
        borderRadius: 18,
        color,
        background,
      }}
    >
      <header style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 8px" }}>{title}</h2>
        <p style={{ margin: 0, opacity: 0.72 }}>{subtitle}</p>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
        }}
      >
        {features.map(([heading, text], index) => (
          <article
            key={index}
            style={{
              padding: 18,
              borderRadius: 12,
              background: "rgba(255,255,255,.82)",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{heading}</h3>
            <p style={{ margin: 0, lineHeight: 1.55, opacity: 0.72 }}>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CalloutBlock({
  title = "Have a project in mind?",
  text = "Let’s make something great together.",
  buttonText = "Get in touch",
  url = "mailto:hello@example.com",
  color = "#ffffff",
  background = "#243b80",
}) {
  return (
    <section
      style={{
        padding: "32px 26px",
        borderRadius: 16,
        color,
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2 style={{ margin: "0 0 8px" }}>{title}</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>{text}</p>
      </div>
      <a
        href={url}
        style={{
          display: "inline-block",
          borderRadius: 999,
          padding: "12px 20px",
          color: "#172033",
          background: "#ffffff",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        {buttonText}
      </a>
    </section>
  );
}

export function QuoteBlock({
  quote = "Great things are done by a series of small things brought together.",
  author = "Vincent van Gogh",
  role = "Artist",
  color = "#24304a",
  background = "#f3f5fa",
}) {
  return (
    <figure
      style={{
        margin: 0,
        padding: "30px 28px",
        borderLeft: "4px solid #6d8cff",
        borderRadius: 12,
        color,
        background,
      }}
    >
      <blockquote style={{ margin: "0 0 18px", fontSize: 20, lineHeight: 1.5 }}>
        “{quote}”
      </blockquote>
      <figcaption style={{ fontSize: 13, opacity: 0.72 }}>
        <strong>{author}</strong>
        {role ? ` · ${role}` : ""}
      </figcaption>
    </figure>
  );
}
