# AGENTS.md

## Project
Web3Fiber is a JavaScript React library for visual editing of designated `EditableZone` areas. Layouts are versioned JSON, never generated source code.

## Rules
- JavaScript ES modules + JSX. No TypeScript in v1.
- React and React DOM are peer dependencies; never bundle React. Support React 18 and 19.
- Keep runtime (`src/index.js`) separate from editor (`src/editor.js`). The runtime entry must not import dnd-kit or editor UI code.
- React Three Fiber is an optional peer: use Fiber 8 + Drei 9 with React 18, or Fiber 9 + Drei 10 with React 19. Keep 3D code lazy-loaded.
- Treat stored layout JSON as untrusted. Validate the layout envelope and block props against their registered schema. Never use `dangerouslySetInnerHTML`.
- Reject unsafe URL schemes in built-in URL fields. Unknown block types must not crash the host page.
- Unknown future layout versions must remain read-only; never overwrite them with an empty v1 layout.
- Guard browser-only APIs. Importing the runtime must be safe in Node environments.
- Respect `prefers-reduced-motion`.
- Every editor control needs an accessible label. Drag-and-drop must have keyboard support.
- Wrap rendered blocks in error boundaries. A broken block must not crash the host page.
- Scope editor CSS with the `w3f-` prefix.
- Do not silently change the public API.
- Do not claim localStorage is shared across users/devices.
- Do not add dependencies without updating the compatibility notes and testing the relevant React versions.

## Workflow
- Work on one phase at a time.
- Before coding, list files to change and tests to write.
- Run `npm run build`, `npm test`, `npm run lint`, and `npm run demo:build` after changes when dependencies are installed.
- Record non-obvious decisions in `docs/DECISIONS.md`.
- Never claim a build or test passed unless the command was actually run successfully.
