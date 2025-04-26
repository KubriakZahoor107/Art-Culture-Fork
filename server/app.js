import crypto from "crypto";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import * as cheerio from "cheerio";

import errorHandler from "./src/middleware/errorHandler.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import artTermsRoutes from "./src/routes/artTermsRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import exhibitionRoutes from "./src/routes/exhibitionRoutes.js";
import geoRoutes from "./src/routes/geoRoutes.js";
import likeRoutes from "./src/routes/likeRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

// CORS для всіх маршрутів
app.use(cors());

// Лімітер запитів (100 запитів на 15 хвилин)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Логування запитів
app.use(morgan("combined"));

// Розбір JSON-тіла
app.use(express.json());

// Створення __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Прапор продакшн
const isProd = process.env.NODE_ENV === "production";

// Кожен запит отримує свій nonce
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("base64");
  next();
});

// Безпека HTTP-заголовків через Helmet: CSP + HSTS + інші
app.use((req, res, next) => {
  helmet({
    // HSTS: примусовий HTTPS на 1 рік і включно з піддоменами
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          (req, res) => `'nonce-${res.locals.cspNonce}'`
        ],
        styleSrc: [
          "'self'",
          (req, res) => `'nonce-${res.locals.cspNonce}'`
        ],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://api.playukraine.com", "ws://localhost:*"],
        // додайте інші директиви за потребою
      },
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "no-referrer" },
  })(req, res, next);
});

// Статика для завантажених файлів
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/profileImages",
  express.static(path.join(__dirname, "uploads/profileImages"))
);

// API-маршрути
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/art-terms", artTermsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/like", likeRoutes);

// SSR-логіка
let vite;
if (!isProd) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: "ssr" },
    appType: "custom",
  });
  app.use(vite.middlewares);
} else {
  app.use(
    express.static(path.resolve(__dirname, "../dist/client"), {
      index: false,
    })
  );
}

app.use("*", async (req, res, next) => {
  const url = req.originalUrl;
  if (url.startsWith("/api/")) return next();

  try {
    let template, render;
    if (!isProd) {
      template = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = fs.readFileSync(
        path.resolve(__dirname, "../dist/client/index.html"),
        "utf-8"
      );
      render = (await import("../dist/server/entry-server.js")).render;
    }

    const { html } = await render(req.originalUrl);
    const $ = cheerio.load(template);

    // Вставити SSR-вміст
    $("#root").html(html);

    // Додати клієнтський скрипт із nonce
    if (isProd) {
      const manifest = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "../dist/client/manifest.json"),
          "utf-8"
        )
      );
      const clientEntry = Object.values(manifest).find((e) => e.isEntry).file;
      $("body").append(
        `<script nonce="${res.locals.cspNonce}" type="module" src="/${clientEntry}"></script>`
      );
    }

    res.status(200).set({ "Content-Type": "text/html" }).end($.html());
  } catch (e) {
    vite?.ssrFixStacktrace?.(e);
    console.error(e);
    res.status(500).end(e.message);
  }
});

// Обробник помилок
app.use(errorHandler);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SSR server listening on http://localhost:${PORT}`);
});

export default app;
