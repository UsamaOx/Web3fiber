import React from "react";
import { registerBlock } from "../core/registry.js";
import {
  ButtonBlock,
  CalloutBlock,
  FeatureGridBlock,
  HeroBlock,
  ImageBlock,
  QuoteBlock,
  TextBlock,
} from "./basic.jsx";

const ThreeBlock = React.lazy(() => import("./three.jsx"));
const CubeFieldBlock = React.lazy(() => import("./cube-field.jsx"));

const animationOptions = [
  "none",
  "fadeIn",
  "slideUp",
  "slideLeft",
  "slideRight",
  "zoomIn",
  "bounce",
  "pulse",
  "flipIn",
  "rotateIn",
  "float",
];
const hoverAnimationOptions = ["none", "lift", "scale", "tilt", "glow", "bounce"];
const fontOptions = [
  "system-ui",
  "Poppins",
  "Arial",
  "Georgia",
  "Trebuchet MS",
  "Courier New",
];
const animationField = () => ({
  type: "select",
  label: "Entrance animation",
  options: animationOptions,
});
const hoverAnimationField = () => ({
  type: "select",
  label: "Hover animation",
  options: hoverAnimationOptions,
});
const hoverIntensityField = {
  type: "range",
  label: "Hover intensity",
  min: 0.2,
  max: 2,
  step: 0.1,
};
const hoverDurationField = {
  type: "range",
  label: "Hover duration",
  min: 0.1,
  max: 0.8,
  step: 0.05,
};

registerBlock({
  type: "text",
  label: "Text",
  category: "Content",
  component: TextBlock,
  defaultProps: {
    text: "Your text goes here",
    color: "#1b2340",
    size: 18,
    align: "left",
    fontFamily: "system-ui",
    animation: "fadeIn",
    hoverEffect: "lift",
    hoverIntensity: 0.8,
    hoverDuration: 0.25,
    hoverColor: "#4169e1",
  },
  schema: {
    text: { type: "textarea", label: "Text" },
    color: { type: "color", label: "Text color" },
    size: { type: "range", label: "Font size", min: 12, max: 48, step: 1 },
    align: {
      type: "select",
      label: "Alignment",
      options: ["left", "center", "right"],
    },
    fontFamily: {
      type: "select",
      label: "Font family",
      options: fontOptions,
    },
    animation: animationField(),
    hoverEffect: hoverAnimationField(),
    hoverIntensity: { ...hoverIntensityField },
    hoverDuration: { ...hoverDurationField },
    hoverColor: { type: "color", label: "Hover text color" },
  },
});

registerBlock({
  type: "hero",
  label: "Hero section",
  category: "Sections",
  component: HeroBlock,
  defaultProps: {
    title: "Build something remarkable.",
    subtitle: "A flexible hero section for your website.",
    color: "#111827",
    background: "#eef2ff",
    buttonText: "Get started",
    animation: "slideUp",
  },
  schema: {
    title: { type: "text", label: "Title" },
    subtitle: { type: "textarea", label: "Subtitle" },
    color: { type: "color", label: "Text color" },
    background: { type: "color", label: "Background" },
    buttonText: { type: "text", label: "Button label" },
    animation: animationField(),
  },
});

registerBlock({
  type: "button",
  label: "Button",
  category: "Content",
  component: ButtonBlock,
  defaultProps: {
    label: "Explore more",
    url: "#",
    color: "#ffffff",
    background: "#4169e1",
    animation: "zoomIn",
    hoverEffect: "lift",
    hoverIntensity: 1,
    hoverDuration: 0.25,
    hoverColor: "#ffffff",
    hoverBackground: "#2848b8",
    fontFamily: "system-ui",
  },
  schema: {
    label: { type: "text", label: "Label" },
    url: { type: "url", label: "Link URL" },
    color: { type: "color", label: "Text color" },
    background: { type: "color", label: "Button color" },
    fontFamily: {
      type: "select",
      label: "Font family",
      options: fontOptions,
    },
    animation: animationField(),
    hoverEffect: hoverAnimationField(),
    hoverIntensity: { ...hoverIntensityField },
    hoverDuration: { ...hoverDurationField },
    hoverColor: { type: "color", label: "Hover text color" },
    hoverBackground: { type: "color", label: "Hover button color" },
  },
});

registerBlock({
  type: "image",
  label: "Image",
  category: "Media",
  component: ImageBlock,
  defaultProps: {
    src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200",
    alt: "Decorative image",
    radius: 16,
    animation: "fadeIn",
  },
  schema: {
    src: { type: "url", label: "Image URL" },
    alt: { type: "text", label: "Alt text" },
    radius: {
      type: "range",
      label: "Corner radius",
      min: 0,
      max: 40,
      step: 1,
    },
    animation: animationField(),
  },
});

registerBlock({
  type: "feature-grid",
  label: "Feature grid",
  category: "Sections",
  component: FeatureGridBlock,
  defaultProps: {
    title: "Everything you need to get started",
    subtitle: "A few highlights to help tell your story.",
    firstTitle: "Thoughtful design",
    firstText: "A clear, polished experience on every screen.",
    secondTitle: "Made for teams",
    secondText: "Keep your workflow simple and collaborative.",
    thirdTitle: "Ready to grow",
    thirdText: "Flexible building blocks that scale with you.",
    color: "#172033",
    background: "#f4f6fb",
    animation: "slideUp",
  },
  schema: {
    title: { type: "text", label: "Heading" },
    subtitle: { type: "textarea", label: "Subheading" },
    firstTitle: { type: "text", label: "Card 1 title" },
    firstText: { type: "textarea", label: "Card 1 text" },
    secondTitle: { type: "text", label: "Card 2 title" },
    secondText: { type: "textarea", label: "Card 2 text" },
    thirdTitle: { type: "text", label: "Card 3 title" },
    thirdText: { type: "textarea", label: "Card 3 text" },
    color: { type: "color", label: "Text color" },
    background: { type: "color", label: "Background" },
    animation: animationField(),
  },
});

registerBlock({
  type: "callout",
  label: "Call to action",
  category: "Sections",
  component: CalloutBlock,
  defaultProps: {
    title: "Have a project in mind?",
    text: "Let’s make something great together.",
    buttonText: "Get in touch",
    url: "mailto:hello@example.com",
    color: "#ffffff",
    background: "#243b80",
    animation: "zoomIn",
  },
  schema: {
    title: { type: "text", label: "Heading" },
    text: { type: "textarea", label: "Text" },
    buttonText: { type: "text", label: "Button label" },
    url: { type: "url", label: "Link URL" },
    color: { type: "color", label: "Text color" },
    background: { type: "color", label: "Background" },
    animation: animationField(),
  },
});

registerBlock({
  type: "quote",
  label: "Quote",
  category: "Content",
  component: QuoteBlock,
  defaultProps: {
    quote: "Great things are done by a series of small things brought together.",
    author: "Vincent van Gogh",
    role: "Artist",
    color: "#24304a",
    background: "#f3f5fa",
    animation: "fadeIn",
  },
  schema: {
    quote: { type: "textarea", label: "Quote" },
    author: { type: "text", label: "Author" },
    role: { type: "text", label: "Role or attribution" },
    color: { type: "color", label: "Text color" },
    background: { type: "color", label: "Background" },
    animation: animationField(),
  },
});

for (const [type, label, kind] of [
  ["shape-cube", "3D Cube", "cube"],
  ["shape-knot", "3D Torus Knot", "knot"],
  ["shape-crystal", "3D Crystal", "crystal"],
]) {
  registerBlock({
    type,
    label,
    category: "3D",
    component: ThreeBlock,
    defaultProps: { kind, color: "#6d8cff", speed: 0.7, height: 300, animation: "zoomIn" },
    schema: {
      color: { type: "color", label: "Color" },
      speed: { type: "range", label: "Rotation speed", min: 0, max: 3, step: 0.1 },
      height: { type: "range", label: "Height", min: 160, max: 520, step: 10 },
      animation: animationField(),
    },
  });
}

registerBlock({
  type: "interactive-cube-field",
  label: "Interactive cube field",
  category: "3D",
  component: CubeFieldBlock,
  defaultProps: {
    color: "#6d8cff",
    secondaryColor: "#f4a261",
    background: "#10182d",
    count: 144,
    height: 340,
    animation: "fadeIn",
  },
  schema: {
    color: { type: "color", label: "Cube color 1" },
    secondaryColor: { type: "color", label: "Cube color 2" },
    background: { type: "color", label: "Field background" },
    count: { type: "range", label: "Number of cubes", min: 96, max: 240, step: 8 },
    height: { type: "range", label: "Height", min: 220, max: 520, step: 10 },
    animation: animationField(),
  },
});
