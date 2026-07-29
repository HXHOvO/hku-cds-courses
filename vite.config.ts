import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 部署到 GitHub Pages 时把 base 改成 '/<仓库名>/'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})
