import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react'; // Закоментуйте цей рядок

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist/client',
    manifest: true,
    rollupOptions: {
      input: './index.html',
    },
    html: {
      parserOptions: {
        scriptingEnabled: true,
      },
    },
  },
  plugins: [/* react() */], // Закоментуйте цей рядок або залиште порожнім масив
});