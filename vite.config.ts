import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Vite config — https://vitejs.dev/config/
// The page head (title, description, robots, Open Graph) lives in index.html and public/robots.txt.
export default defineConfig(({ mode }) => {
  // `vite build --mode development` emits inline sourcemaps and skips minification (debug builds).
  const emitSourcemaps = mode === 'development'

  return {
    base: '/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: process.env.DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8500'),
      strictPort: true,
      // Backend (Spring Boot, project 85 -> 8510). The app uses relative URLs (/api/v1/...), like nginx in Docker.
      proxy: { '/api': { target: process.env.VITE_API_PROXY || 'http://localhost:8510', changeOrigin: true } },
    },
    preview: {
      host: process.env.DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8500'),
    },
  }
})
