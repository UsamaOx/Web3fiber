# Web3Fiber

Web3Fiber is a JavaScript React library for visual editing of developer-designated website zones. Layouts are stored as versioned JSON; the library does not rewrite the host website's source code.

## Compatibility

- React and React DOM: React 18 or React 19 (`>=18 <20`).
- Node.js: 22.12+ (required by the current Vite/Vitest toolchain).
- Client-rendered React applications (Vite / CRA style). Next.js Server Components are not officially supported in v1.
- The editor is a separate entry point. Import `web3fiber/editor` only in the admin experience; the public runtime entry does not import dnd-kit or the editor UI.
- Poppins is bundled locally as font assets and does not make requests to a third-party font service.

### Optional 3D peer dependencies

The 3D blocks are lazy-loaded. Install the matching React Three Fiber generation for the React version used by the host app:

| Host React | `@react-three/fiber` | `@react-three/drei` |
|---|---:|---:|
| React 18 | `^8.18.0` | `^9.122.0` |
| React 19 | `^9.0.0` (current tested line: `9.8.2`) | `^10.0.0` (current tested line: `10.7.9`) |

Install `three` alongside those packages. These are optional peer dependencies so a site that does not use 3D blocks does not need to install the WebGL stack. If a 3D block is used without its peer dependencies, the block-level error boundary shows a fallback rather than crashing the host page.

## Run the demo

For step-by-step Windows PC instructions to run the demo or install Web3Fiber
in another React project, see the [installation guide](docs/INSTALLATION.md).

```bash
npm install
npm install --prefix demo
npm run dev
```

Open the local URL printed by Vite. Click **Edit website** at the bottom-right. Add blocks from the Block library, choose the editable zone, select a layer, and edit its properties. Layouts save in browser localStorage.

## Build and checks

```bash
npm run build
npm test
npm run lint
npm run demo:build
```

## Install into another React project

After pushing this repository to GitHub:

```bash
npm install github:YOUR_GITHUB_USERNAME/web3fiber
```

The `prepare` script builds `dist/` during Git installation.

## Quick start

```jsx
import { EditorProvider, EditableZone, localStorageAdapter } from 'web3fiber';
import { EditorUI } from 'web3fiber/editor';
import 'web3fiber/style.css';

const storage = localStorageAdapter();

export default function App() {
  const isAdmin = true; // Replace with your own authentication check.
  return (
    <EditorProvider storage={storage} canEdit={isAdmin}>
      <main>
        <EditableZone id="home-hero" fallback={<h1>Original website hero</h1>} />
      </main>
      {isAdmin && <EditorUI />}
    </EditorProvider>
  );
}
```

`canEdit` is controlled by the host application's own authentication. Web3Fiber does not provide login or authorization. The editor UI is hidden and edit mode is disabled when `canEdit` is false. This is a user-interface gate, not a security boundary: protect your storage API and saved layouts with server-side authorization.

## Custom storage adapter

```js
const apiStorage = {
  async load(zoneId) {
    const response = await fetch(`/api/layouts/${zoneId}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Could not load layout');
    return response.json();
  },
  async save(zoneId, layout) {
    const response = await fetch(`/api/layouts/${zoneId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(layout),
    });
    if (!response.ok) throw new Error('Could not save layout');
  },
};
```

Pass it to `<EditorProvider storage={apiStorage}>`. Keep the adapter object stable (for example, create it outside the component or with `useMemo`) so zones do not reload when the host component re-renders. Implement authentication and server-side authorization in your own backend.

## Built-in blocks

Text, Hero section, Button, Image, Feature grid, Call to action, Quote, 3D Cube, 3D Torus Knot, 3D Crystal, and Interactive cube field. Text and Button blocks include Poppins in their font selectors, bundled locally with regular, medium, semibold, and bold weights. Every block includes configurable Motion entrance presets, including slides, springy zooms, flips, and subtle floating. Text and buttons also have interactive hover/tap effects; adjust the effect, intensity, duration, and hover colors in the Inspector. Animations honor `prefers-reduced-motion`.

The Interactive cube field starts with 144 mini cubes distributed across the canvas; adjust the count, two randomly assigned cube colors, and field background in the Inspector. Visitors can push cubes with the pointer, and the cubes collide and bounce inside the canvas. It shares the optional, lazy-loaded React Three Fiber stack with the other 3D blocks. The editor also lets you set or clear a saved background color for each editable zone.

## Safety and limitations

- Layouts are JSON and do not rewrite existing React source code.
- Blocks stack vertically inside developer-designated zones.
- Default persistence is localStorage on the current browser/device. Use a custom adapter for shared, server-backed layouts.
- The editor supports click-to-add and sortable layers (mouse and keyboard). Palette drag-to-canvas and cross-zone drag/drop are not part of this release.
- Stored block props are filtered against the registered schema; unsafe URL schemes are rejected. Unknown block types are skipped, and a broken block is isolated by an error boundary.
- Client-side `canEdit` is not authorization. Secure the backing storage endpoint independently.
- WebGL availability and mobile performance should be tested on target devices.

## License

MIT
