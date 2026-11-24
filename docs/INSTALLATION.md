# Install and use Web3Fiber on Windows

This guide covers running the Web3Fiber demo on a Windows PC and installing
Web3Fiber into another React project.

## 1. Install the prerequisites

Install:

- [Node.js](https://nodejs.org/en/download), version 22.12.0 or newer. The
  installer includes npm.
- [Git for Windows](https://git-scm.com/download/win).

Open Windows Terminal or PowerShell and confirm the tools are available:

```powershell
node --version
npm --version
git --version
```

If a command is not recognized after installation, close and reopen the
terminal.

## 2. Download and run the demo

In PowerShell, clone the repository and install its dependencies:

```powershell
git clone https://github.com/UsamaOx/Web3fiber.git
Set-Location Web3fiber
npm install
npm install --prefix demo
```

Start the demo:

```powershell
npm run dev
```

Open the local address printed by Vite (usually
`http://localhost:5173/`) in your browser. Select **Edit website** to open the
editor. The demo saves layouts in localStorage in that browser on this PC.

To stop the development server, focus the PowerShell window and press
**Ctrl+C**.

## 3. Install Web3Fiber in your React project

Web3Fiber supports client-rendered React applications using React 18 or React
19. Open PowerShell in your React project's folder (the folder containing
`package.json`) and install the library from GitHub:

```powershell
npm install github:UsamaOx/Web3fiber
```

The install builds the library from its source. In your React code, import the
runtime components, editor UI, and stylesheet:

```jsx
import { EditableZone, EditorProvider, localStorageAdapter } from 'web3fiber';
import { EditorUI } from 'web3fiber/editor';
import 'web3fiber/style.css';
```

Wrap the areas you want to make editable in `EditableZone`, render `EditorUI`
for users allowed to edit, and provide storage through `EditorProvider`. See
the [README quick start](../README.md#quick-start) for a complete example and
the [optional 3D dependency versions](../README.md#optional-3d-peer-dependencies).

React Three Fiber, Drei, and Three.js are only needed if your project uses the
3D blocks. Choose the versions matching your React version from the README
table.

## Notes

- The editor is a UI feature, not an authorization system. Control `canEdit`
  using your app's authentication, and secure any server-side storage yourself.
- The default localStorage adapter stores layouts only in the current browser
  on the current device. It does not share layouts across users or devices.
- For the project build, tests, and other usage details, see the
  [README](../README.md).
