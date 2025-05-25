import react from '@vitejs/plugin-react'

export default {
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'dist/server',
    rollupOptions: {
      external: ['react-router', 'react-router-dom'],
      output: {
        entryFileNames: 'entry-server.js'
      }
    }
  }
}
