import { cwd } from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, cwd(), '')

  if (command === 'build' && !env.VITE_API_BASE_URL?.trim()) {
    throw new Error('VITE_API_BASE_URL is required for production builds.')
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})
