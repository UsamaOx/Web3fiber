import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "zustand",
  "motion",
  "motion/react",
  "@dnd-kit/core",
  "@dnd-kit/sortable",
  "@dnd-kit/utilities",
  "@react-three/fiber",
  "@react-three/drei",
  "three",
];

export default defineConfig({
  plugins: [react()],
  // The demo imports the library source from outside its directory.
  // Force all linked/source imports (including Zustand) to share the app's React.
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL("./src/index.js", import.meta.url)),
        editor: fileURLToPath(new URL("./src/editor.jsx", import.meta.url)),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
      cssFileName: "style",
    },
    rollupOptions: {
      external,
      output: {
        globals: { react: "React", "react-dom": "ReactDOM" },
      },
    },
    cssCodeSplit: true,
    sourcemap: true,
  },
});
