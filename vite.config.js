import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cosmos-test/',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});

