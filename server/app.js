import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import rateLimit from "express-rate-limit"
// Оголошення лімітеру запитів
const limiter = rateLimit({
  trustProxy: true,
  trustProxy: true,
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 100, // максимум 100 запитів
  standardHeaders: true, // віддає rate limit info в заголовках
  legacyHeaders: false, // вимикає X-RateLimit-* заголовки
})
import helmet from "helmet"
import morgan from "morgan"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
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
import fs from "fs"
import * as cheerio from 'cheerio';

dotenv.config()

const app = express()
app.use(cors());

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const isProd = process.env.NODE_ENV === "production"
let vite


app.use(express.json())

// Security HTTP headers
app.use(
  helmet({
    /* ... */
  }),
)
app.use(
  cors({
    /* ... */
  }),
)
app.use(limiter)
app.use(morgan("combined"))
app.use(express.json())
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    /* ... */
  })
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(
  "/uploads/profileImages",
  express.static(path.join(__dirname, "uploads/profileImages")),
)

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts/postId", postRoutes)
app.use("/api/exhibitions", exhibitionRoutes)
app.use("/api/art-terms", artTermsRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/geo", geoRoutes)
app.use("/api/like", likeRoutes)

// SSR Logic
if (!isProd) {
  const { createServer } = await import("vite")
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  })
  app.use(vite.middlewares)
} else {
  app.use(
    express.static(path.resolve(__dirname, "../dist/client"), {
      index: false,
    }),
  )
}

app.use("*", async (req, res, next) => {
  const url = req.originalUrl

  if (url.startsWith("/api/")) {
    return next() // Пропускаємо API-запити для обробки SSR
  }

  try {
    let template, render

    if (!isProd) {
      template = fs.readFileSync(
        path.resolve(__dirname, "../index.html"),
        "utf-8",
      )
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render
    } else {
      template = fs.readFileSync(
        path.resolve(__dirname, "../dist/client/index.html"),
        "utf-8",
      )
      render = (await import("../dist/server/entry-server.js")).render
    }

    const { html } = await render(req.originalUrl);

    const $ = cheerio.load(template)
    $("#root").html(html)

    if (isProd) {
      const manifest = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "../dist/client/manifest.json"),
          "utf-8",
        ),
      )
      const clientEntry = Object.values(manifest).find((entry) => entry.isEntry)
      const clientScript = clientEntry.file
      $("body").append(`<script type="module" src="/${clientScript}"></script>`)
    }

    const finalHtml = $.html()
    res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.error(e)
    res.status(500).end(e.message)
  }
})

// Route debugging
// console.log("Environment", process.env.NODE_ENV)
// console.log("Client URL", process.env.CLIENT_URL)

// Error Handling Middleware
app.use(errorHandler)

// Запуск SSR‑сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SSR server listening on http://localhost:${PORT}`);
});


export default app
