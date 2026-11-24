export function getInteractiveMotionProps({
  effect,
  intensity,
  duration,
  hoverColor,
  hoverBackgroundColor,
}) {
  if (!effect || effect === "none") return {};

  const amount = Math.min(2, Math.max(0.1, intensity));
  const targets = {
    lift: { y: -4 * amount, scale: 1 + 0.015 * amount },
    scale: { scale: 1 + 0.06 * amount },
    tilt: { rotate: 3 * amount, y: -2 * amount },
    glow: {
      filter: `drop-shadow(0 0 ${6 * amount}px ${hoverColor || "#6d8cff"})`,
    },
    bounce: { y: [0, -6 * amount, 0] },
  };
  const target = targets[effect];
  if (!target) return {};

  if (hoverColor) target.color = hoverColor;
  if (hoverBackgroundColor) target.backgroundColor = hoverBackgroundColor;

  return {
    whileHover: target,
    whileTap: { scale: 1 - 0.04 * amount },
    transition:
      effect === "bounce"
        ? { duration, repeat: Infinity, ease: "easeInOut" }
        : { duration, ease: [0.22, 1, 0.36, 1] },
  };
}
