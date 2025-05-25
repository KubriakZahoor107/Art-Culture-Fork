import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { render } = await import('../dist/server/entry-server.js')

export const config = {
  runtime: 'nodejs'
}

export default async function handler(req, res) {
  try {
    const url = req.url || '/'
    const { html } = await render(url)

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(html)
  } catch (err) {
    console.error('❌ SSR handler failed:', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end('Internal Server Error')
  }
}
