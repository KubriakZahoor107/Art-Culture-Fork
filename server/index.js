import { render } from '../dist/server/entry-server.js'

export const config = {
  runtime: 'nodejs', // Vercel expects this for Node-based SSR
}

export default async function handler(req, res) {
  try {
    const url = req.url || '/'
    const { html } = await render(url)

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(html)
  } catch (e) {
    console.error('❌ SSR Error:', e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end('Internal Server Error')
  }
}
