# Web3Fiber decisions

- Product name: Web3Fiber (replaces the guide's working name Drop&Glow).
- v1 targets client-rendered React 18 and 19 projects.
- React and React DOM are peer dependencies and are never bundled.
- Default persistence is localStorage; custom adapters are supported. Adapter objects should remain stable between renders.
- `canEdit` is supplied by the host application's own authentication. It gates the editor UI but is not server-side authorization.
- Editor and runtime remain separate entry points. dnd-kit is imported only by `web3fiber/editor`.
- The 3D stack is optional to avoid forcing WebGL dependencies on sites that do not use 3D blocks. React 18 uses Fiber 8 / Drei 9; React 19 uses Fiber 9 / Drei 10.
- Motion replaces the older `framer-motion` package name; the component API used here is imported from `motion/react`.
- Built-in blocks expose Motion-based animation presets and text font stacks without loading external fonts or adding GSAP.
- Poppins is self-hosted from Fontsource with its OFL license included; only the required Latin weights are bundled and no third-party font request is made.
- Text and button hover/tap feedback uses Motion presets with editor-controlled effect, intensity, duration, and colors.
- The editor palette adds blocks by click for predictable initial usability; layer ordering uses dnd-kit sortable controls and keyboard sensors.
- 3D block code is a lazy import, pauses its render loop when off-screen, and respects reduced-motion preferences. A block-level error boundary isolates rendering failures.
- Interactive Cube Field uses a lightweight equal-mass collision simulation within the existing optional 3D stack, avoiding a mandatory physics-engine dependency.
- Editable-zone backgrounds are optional hex colors stored in the existing layout envelope; legacy layouts remain transparent by default.
- Persisted layouts are schema-filtered. Unknown future layout versions are read-only to avoid overwriting data that this version cannot understand.
- localStorage is per-browser/device. Use a custom backend adapter for shared layouts.
- This remains an MVP: palette drag-to-canvas, cross-zone drag/drop, full migration tooling, Playwright coverage, and a fresh GitHub-install integration test remain follow-up work.
