import { defineConfig } from 'vite'
import type { Connect, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Os projetos ficam em public/<nome>/index.html e abrem em /<nome>/, como na Vercel.
// Aqui o servidor local faz o mesmo, em vez de devolver a página principal.
function publicFolders(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const path = (req.url ?? '').split('?')[0]
    const m = /^\/([\w-]+)\/?$/.exec(path)
    if (m && existsSync(resolve(__dirname, 'public', m[1], 'index.html'))) {
      req.url = `/${m[1]}/index.html`
    }
    next()
  }
  return {
    name: 'public-folders',
    configureServer: (server) => void server.middlewares.use(rewrite),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [publicFolders(), react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor';
            if (id.includes('gsap')) return 'gsap';
          }
        }
      }
    }
  }
})
