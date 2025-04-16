import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist/client',
    manifest: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  plugins: [react()],
});
