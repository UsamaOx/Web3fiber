# Repair notes — 2026-11-23

## Dependency alignment

The previous package versions were pinned to an older Vite/React toolchain. The manifests now target these current stable releases checked during this repair:

- React / React DOM demo: 19.3.1
- Vite: 8.3.8; `@vitejs/plugin-react`: 6.3.0
- Motion: 14.14.0 (replaces `framer-motion` imports with `motion/react`)
- Zustand: 5.1.0
- React Three Fiber: optional peer range covering Fiber 8 and 9
- Drei: optional peer range covering Drei 9 and 10
- Three.js demo: 0.187.0
- dnd-kit: core 6.3.1, sortable 10.0.0, utilities 3.2.2 (these remain the current stable releases)
- Vitest: 5.1.1; jsdom: 31.0.1; ESLint: 10.15.0; globals: 17.14.0

React 18 and React 19 require different React Three Fiber major versions. The demo uses the React 19 / Fiber 9 / Drei 10 combination. The README documents the React 18 / Fiber 8 / Drei 9 combination separately.

## Source fixes

- Stable default storage adapter and memoized provider context.
- Editor launcher is hidden and edit mode disabled when `canEdit` is false.
- Registered editable zones and added a zone selector for the multi-zone demo.
- Improved persisted layout envelope validation and duplicate-ID filtering.
- Added schema-based prop filtering, numeric range clamping, and safe URL scheme checks.
- Future layout versions are read-only and are not automatically overwritten.
- Added a block error boundary so a failed block cannot take down the host page.
- Storage write failures are caught and logged instead of breaking the app.
- Added a flat ESLint config and runtime component tests.
- Kept dnd-kit, editor UI, and editor CSS in the separate editor entry point.

## Verification status

Plain JavaScript files and configuration files passed `node --check` syntax checks. The full dependency install could not complete in this environment because npm registry access timed out. Therefore Vite build, Vitest, ESLint, demo build, React 18 runtime integration, and browser interaction tests remain **unverified here**. No lockfile was generated; generate and commit `package-lock.json` after running `npm install` in an environment with registry access.


## Follow-up install/build repair

- Library build entries now use absolute paths derived from `import.meta.url`; this avoids Vite/Rolldown resolving the editor entry against an unexpected working directory. `src/editor.js` is included in the package source.
- Pinned jsdom to 27.0.1 so the test environment supports Node 24.13.1; jsdom 31.0.1 required Node 24.15.0 and produced `EBADENGINE` warnings on the user's Node version.
- Re-run `npm install` and the build/test commands on the user's machine; registry access is unavailable in this repair environment, so runtime verification remains pending.
