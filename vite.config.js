import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://sweetpotato.github.io/senkai-sengi-deck-builder/',
  build: {
    outDir: 'docs',
  },
  plugins: [react()],
})
