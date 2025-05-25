import React from 'react'
import { renderToString } from 'react-dom/server'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { StaticRouter } = require('react-router/server')

import App from './App'
import Head from './components/Head'
import { metaData } from './meta/index.js'

export async function render(url) {
  const route = url === '/' ? 'home' : url.replace('/', '')
  const meta = metaData[route] || metaData['home']

  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )

  const headTags = Head(meta)

  return {
    html: `
    <!DOCTYPE html>
    <html lang="uk">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png/">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png/">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="shortcut icon" href="/favicon.ico"/> 
        ${headTags}
      </head>
      <body>
        <div id="root">${appHtml}</div>
      </body>
    </html>
  `,
  }
}