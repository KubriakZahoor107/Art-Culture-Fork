import crypto from "crypto"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import morgan from "morgan"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import * as cheerio from "cheerio"

import errorHandler from "./src/middleware/errorHandler.js"
import adminRoutes from "./src/routes/adminRoutes.js"
import artTermsRoutes from "./src/routes/artTermsRoutes.js"
import authRoutes from "./src/routes/authRoutes.js"
import exhibitionRoutes from "./src/routes/exhibitionRoutes.js"
import geoRoutes from "./src/routes/geoRoutes.js"
import likeRoutes from "./src/routes/likeRoutes.js"
import postRoutes from "./src/routes/postRoutes.js"
import productRoutes from "./src/routes/productRoutes.js"
import searchRoutes from "./src/routes/searchRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const isProd = process.env.NODE_ENV === "production"
let viteServer

app.use(express.json())

// RATE LIMITER
const limiter = rateLimit({
  trustProxy: true,
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

// SECURITY HEADERS
if (isProd) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'", "https://api.playukraine.com"],
        },
      },
      frameguard: { action: "deny" },
      referrerPolicy: { policy: "no-referrer" },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  )
} else {
  app.use(
    helmet({
      frameguard: { action: "deny" },
      referrerPolicy: { policy: "no-referrer" },
    })
  )
}

// CORS, LOGGER, RATE LIMIT
app.use(cors())
app.use(limiter)
app.use(morgan("combined"))

// STATIC UPLOADS
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(
  "/uploads/profileImages",
  express.static(path.join(__dirname, "uploads/profileImages"))
)

// API ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/exhibitions", exhibitionRoutes)
app.use("/api/art-terms", artTermsRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/geo", geoRoutes)
app.use("/api/like", likeRoutes)

// SSR LOGIC
if (!isProd) {
  const { createServer } = await import("vite")
  viteServer = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  })
  app.use(viteServer.middlewares)
} else {
  app.use(
    express.static(path.resolve(__dirname, "../dist/client"), {
      index: false,
    })
  )
}

// HANDLE ALL OTHER REQUESTS
app.use("*", async (req, res, next) => {
  const url = req.originalUrl
  if (url.startsWith("/api/")) return next()

  try {
    let template, renderFn

    if (!isProd) {
      template = fs.readFileSync(
        path.resolve(__dirname, "../index.html"),
        "utf-8"
      )
      template = await viteServer.transformIndexHtml(url, template)
      renderFn = (await viteServer.ssrLoadModule("/src/entry-server.jsx"))
        .render
    } else {
      template = fs.readFileSync(
        path.resolve(__dirname, "../dist/client/index.html"),
        "utf-8"
      )
      renderFn = (await import("../dist/server/entry-server.js")).render
    }

    const { html } = await renderFn(req.originalUrl)
    const $ = cheerio.load(template)
    $("#root").html(html)

    if (isProd) {
      const manifest = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "../dist/client/manifest.json"),
          "utf-8"
        )
      )
      const clientEntry = Object.values(manifest).find((e) => e.isEntry)
      const clientScript = clientEntry.file
      $("body").append(
        `<script type="module" src="/${clientScript}"></script>`
      )
    }

    res
      .status(200)
      .set({ "Content-Type": "text/html" })
      .end($.html())
  } catch (e) {
    viteServer?.ssrFixStacktrace(e)
    console.error(e)
    res.status(500).end(e.message)
  }
})

// ERROR HANDLER
app.use(errorHandler)

// START SERVER
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`SSR server listening on http://localhost:${PORT}`)
})

export default app
