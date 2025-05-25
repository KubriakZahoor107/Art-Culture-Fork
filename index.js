import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"
import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import { createServer as createViteServer } from "vite"
import app from "./app.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000
const prisma = new PrismaClient()
const isProd = process.env.NODE_ENV === "production"

async function setupSSR(app) {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: "ssr" },
      root: process.cwd(),
      appType: "custom",
    })
    app.use(vite.middlewares)

    app.get("*", async (req, res) => {
      try {
        const url = req.originalUrl
        let template = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8")
        template = await vite.transformIndexHtml(url, template)

        const { render } = await vite.ssrLoadModule("/src/entry-server.jsx")
        const { html } = await render(url)
        res.status(200).set({ "Content-Type": "text/html" }).end(html)
      } catch (e) {
        vite.ssrFixStacktrace(e)
        console.error("SSR error:", e)
        res.status(500).end(e.message)
      }
    })
  } else {
    const template = fs.readFileSync(
      path.resolve(__dirname, "../dist/client/index.html"),
      "utf-8"
    )
    const { render } = await import("../dist/server/entry-server.js")
    app.use("/assets", express.static(path.resolve(__dirname, "../dist/client/assets")))

    app.get("*", async (req, res) => {
      try {
        const url = req.originalUrl
        const { html } = await render(url)
        res.status(200).set({ "Content-Type": "text/html" }).end(html)
      } catch (e) {
        console.error("SSR error:", e)
        res.status(500).end(e.message)
      }
    })
  }
}

async function startServer() {
  try {
    if (process.env.DATABASE_URL) {
      await prisma.$connect()
      console.log("✅ Connected to the database")
    } else {
      console.log("⚠️ DATABASE_URL not found — skipping DB connection")
    }

    await setupSSR(app)

    app.use("/uploads", express.static(path.join(__dirname, "./uploads")))

    app.listen(PORT, () => {
      console.log(`🚀 SSR server listening on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("❌ Error starting server:", error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

startServer()

process.on("unhandledRejection", async (reason) => {
  console.error("Unhandled Rejection:", reason)
  await prisma.$disconnect()
  process.exit(1)
})

process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception:", error)
  await prisma.$disconnect()
  process.exit(1)
})

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...")
  await prisma.$disconnect()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...")
  await prisma.$disconnect()
  process.exit(0)
})
