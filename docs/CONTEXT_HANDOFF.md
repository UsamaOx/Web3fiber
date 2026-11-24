# Web3Fiber — AI handoff context

## Goal and deadline
The user needs a believable, working React library and demo by tomorrow morning (2026-11-24). They have limited time and explicitly requested a context file so another AI assistant can continue if context/usage limits run out.

## Source of truth
The user uploaded `Drop&Glow Build Guide React Site Editor for You and Your AI Agent.pdf` (12 pages). It defines a React 18+ JavaScript library with editable zones, JSON layouts, a block registry, separate runtime/editor entry points, dnd-kit, Zustand, Three.js / React Three Fiber, Framer Motion, storage adapters, and a Vite library build. Public API:
- `EditorProvider` wraps the app.
- `EditableZone id="home-hero" fallback={<OldHero />}` marks safe editable regions.
- `EditorUI` is imported from `web3fiber/editor`.
- `localStorageAdapter()` is the default storage adapter.
- `registerBlock({ type, label, category, component, defaultProps, schema })` adds custom blocks.
Guide explicitly excludes arbitrary source rewriting, Next.js server components, Vue/Svelte, collaboration, hosted cloud service, and free-form positioning.

## Branding
The user uploaded `Web3Fiber logo - combined@2x.png`. Product branding is Web3Fiber, tagline "INTERACTIVE 3D FOR THE WEB". The guide calls the product Drop&Glow as a working name; use Web3Fiber as final name.

## Starter project generated
A deadline-focused starter is in this folder:
- `package.json`, `vite.config.js`
- `src/core/{storage,layout,store,registry}.js`
- `src/runtime/{EditorProvider,EditableZone,BlockRenderer}.jsx`
- `src/blocks/{basic,three,index}.jsx/js`
- `src/index.js`, `src/editor.js`, `src/styles.css`
- `demo/` Vite React 19 demo (the React 18 compatibility matrix is documented separately)
- `README.md`, `AGENTS.md`, `LICENSE`
- `tests/layout.test.js`
- `docs/DECISIONS.md`

The ZIP archive is `web3fiber-starter.zip` in `/mnt/data` (if present). The logo is copied to `assets/web3fiber-logo.png`.

## Current implementation behavior
- Demo app has a dark navy/blue branded landing page.
- Click "Edit website" bottom-right to open editor panel.
- Palette adds Text, Hero, Button, Image, 3D Cube, 3D Torus Knot, and 3D Crystal blocks.
- Select a layer and edit schema-driven inspector fields.
- dnd-kit sortable layers; click-to-add palette (not palette drag-to-canvas).
- Undo/redo store history.
- localStorage persistence per zone.
- 3D component is lazy-loaded, pauses its render loop off-screen, and respects reduced-motion.
- Reduced-motion support for animation wrapper.
- unknown block types are skipped; saved props are schema-filtered; unsafe built-in URLs are rejected; future layout versions are read-only; no dangerouslySetInnerHTML.
- Demo uses two zones: `landing-hero` and `showcase-zone`.

## Important limitations to disclose, not hide
This is a deadline MVP, not fully hardened release. The original guide's full phase acceptance criteria are not all complete:
- Palette drag-to-zone is not implemented (click-to-add works).
- no comprehensive error boundary / schema validation / migration layer.
- no full Playwright browser test suite.
- no dedicated test of fresh GitHub installation.
- localStorage is per-browser and not shared between visitors/devices; a custom backend adapter is needed for shared public layouts.
- `canEdit` is a UI gate only; real authorization must be enforced by host app/backend.
- WebGL failure/mobile perf need testing.
- build and test commands must be run locally before claiming they pass.

## Next steps for assistant
1. Help user extract the ZIP into a folder and open in VS Code.
2. Confirm Node.js version (Node 20+ recommended).
3. Run `npm install`, `npm install --prefix demo`, then `npm run dev`.
4. Fix any dependency/build errors based on actual terminal output.
5. Test editing, reload persistence, undo/redo, and 3D blocks.
6. Run `npm run build` and `npm test`.
7. Help create GitHub repo, push, then test `npm install github:USERNAME/web3fiber` in a fresh React app.
8. Update this file after major decisions/progress so another AI can resume.

## User guidance
User is a beginner-to-intermediate React developer and prefers explicit Windows/VS Code step-by-step instructions, with exact commands and file paths. Avoid renaming existing functions casually. Explain each terminal command.

## Repair pass (2026-11-23)
- Updated dependency manifests to current stable versions; the demo now uses React 19.3.1 with Fiber 9 / Drei 10. React 18 users use Fiber 8 / Drei 9 as described in README.
- Fixed editor permission gating, multiple-zone selection, stable storage adapter behavior, storage write error handling, schema prop validation, future-layout protection, and block error isolation.
- Added a runtime component test file and ESLint flat config.
- `node --check` passed for non-JSX JavaScript/config files; core layout/sanitization smoke assertions passed. npm registry access timed out in this environment, so install/build/test/lint/browser checks have not yet been run. There is no generated lockfile yet.
