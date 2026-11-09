import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'dev-mode-support',
      transformIndexHtml(html, ctx) {
        if (ctx?.server) {
          // In development mode (npm run dev), replace bundle script with live /src/main.jsx
          return html
            .replace(/<script type="module" crossorigin src="\.\/assets\/.*?"><\/script>/, '<script type="module" src="/src/main.jsx"></script>')
            .replace(/<link rel="stylesheet" crossorigin href="\.\/assets\/.*?">/, '');
        }
        return html;
      },
    },
  ],
})
