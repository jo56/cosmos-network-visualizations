import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cosmos-network-visualizaitons/',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});

