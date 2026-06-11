import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/crm_admin/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Sets '@' to point to the 'src' directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
