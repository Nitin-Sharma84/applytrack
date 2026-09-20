import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages serves the app from /<repo-name>/. Localhost and Vercel serve it from /.
  // The Pages build runs with: npm run build -- --mode pages
  base: mode === 'pages' ? '/applytrack/' : '/',
}))