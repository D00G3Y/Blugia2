import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appPath = path.join(__dirname, '..', 'src', 'App.jsx')
const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml')

// Priority mapping: more specific paths get lower priority
function getPriority(route) {
  if (route === '/') return '1.0'
  const depth = route.split('/').filter(Boolean).length
  if (depth === 1) return '0.8'
  if (depth === 2) return '0.7'
  return '0.6'
}

async function main() {
  const source = await fs.readFile(appPath, 'utf8')

  // Match all <Route path="..." patterns
  const routeRegex = /<Route\s+path="([^"]+)"/g
  const routes = new Set()
  let match
  while ((match = routeRegex.exec(source)) !== null) {
    routes.add(match[1])
  }

  const sorted = [...routes].sort()

  const urls = sorted.map(route => `  <url>
    <loc>${route}</loc>
    <priority>${getPriority(route)}</priority>
  </url>`).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  await fs.writeFile(outPath, xml)
  console.log(`Sitemap generated with ${routes.size} routes → public/sitemap.xml`)
  sorted.forEach(r => console.log(`  ${r}`))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
