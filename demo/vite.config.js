import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  // The demo imports the library source from outside its directory.
  // Force all linked/source imports (including Zustand) to share the app's React.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: '0.0.0.0',
    fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] },
  },
});
