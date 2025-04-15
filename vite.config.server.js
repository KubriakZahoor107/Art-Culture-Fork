import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'dist/server',
  },
  plugins: [react()],
});
