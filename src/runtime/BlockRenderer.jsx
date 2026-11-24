import { Suspense } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { getBlock } from '../core/registry.js';
import { sanitizeBlockProps } from '../core/layout.js';
import BlockErrorBoundary from './ErrorBoundary.jsx';

function Animated({ preset, children }) {
  const reduced = useReducedMotion();
  if (!preset || preset === 'none' || reduced) return children;
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.7, ease: "easeOut" },
    },
    slideUp: {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
    slideLeft: {
      initial: { opacity: 0, x: 32 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
    slideRight: {
      initial: { opacity: 0, x: -32 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
    zoomIn: {
      initial: { opacity: 0, scale: 0.85 },
      animate: { opacity: 1, scale: 1 },
      transition: { type: "spring", stiffness: 180, damping: 20 },
    },
    bounce: {
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: [18, -6, 0] },
      transition: { type: "spring", stiffness: 320, damping: 14 },
    },
    pulse: {
      initial: { scale: 0.98 },
      animate: { scale: [0.98, 1.02, 1] },
      transition: { duration: 0.8, repeat: 1, ease: "easeInOut" },
    },
    flipIn: {
      initial: { opacity: 0, rotateX: -45 },
      animate: { opacity: 1, rotateX: 0 },
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
    rotateIn: {
      initial: { opacity: 0, rotate: -10, scale: 0.92 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      transition: { type: "spring", stiffness: 180, damping: 18 },
    },
    float: {
      initial: { y: 0 },
      animate: { y: [0, -8, 0] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };
  const variant = variants[preset];
  if (!variant) return children;
  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      transition={variant.transition}
      style={preset === "flipIn" ? { perspective: 900 } : undefined}
    >
      {children}
    </motion.div>
  );
}

export default function BlockRenderer({ block, zoneId }) {
  const definition = getBlock(block.type);
  if (!definition) {
    console.warn(`[Web3Fiber] Unknown block type "${block.type}" was skipped.`);
    return null;
  }

  const Component = definition.component;
  const safeProps = sanitizeBlockProps(block.props, definition);
  return (
    <BlockErrorBoundary zoneId={zoneId}>
      <div className="w3f-rendered-block">
        <Animated preset={safeProps.animation}>
          <Suspense fallback={<div className="w3f-loading" role="status">Loading block…</div>}>
            <Component {...safeProps} />
          </Suspense>
        </Animated>
      </div>
    </BlockErrorBoundary>
  );
}
