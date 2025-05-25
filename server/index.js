import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { render } = await import('../dist/server/entry-server.js')

export default async function handler(req, res) {
  try {
    const url = req.url || '/'
    console.log('📥 SSR request received for:', url)

    const { render } = await import('../dist/server/entry-server.js')

    if (!render || typeof render !== 'function') {
      throw new Error('❌ "render" is not a function or missing from entry-server.js')
    }

    const { html } = await render(url)

    if (!html) {
      throw new Error('❌ No HTML returned from render()')
    }

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
