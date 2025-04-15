// src/middleware/uploadMiddleware.js

import fs from "fs/promises"
import multer from "multer"
import path, { dirname } from "path"
import sharp from "sharp"
import { fileURLToPath } from "url"

// Derive __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirnameLocal = dirname(__filename)

// Configure memory storage
const storage = multer.memoryStorage()

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  )
  const mimetype = allowedTypes.test(file.mimetype)
  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only images are allowed",
      ),
    )
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1080 * 1920 }, // 20 MB limit
})

const processImages = async (req, res, next) => {
  try {
    if (
      !req.files ||
      (req.files.profileImage && req.files.museumLogo === undefined)
    ) {
      // Handle profileImage only
      if (req.files.profileImage) {
        const file = req.files.profileImage[0]
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const filename = uniqueSuffix + path.extname(file.originalname)
        const outputPath = path.join(
          __dirnameLocal,
          "../../uploads/profileImages",
          filename,
        )

        // Ensure the directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true })

        // Resize to 1920x1080
        await sharp(file.buffer)
          .resize(null, null, {
            fit: sharp.fit.cover,
            position: sharp.strategy.center,
          })
          .webp({ quality: 80 })
          .toFile(outputPath)

        req.body.profileImagePath = `/uploads/profileImages/${filename}`
      }
    }

    if (req.files.museumLogo) {
      const file = req.files.museumLogo[0]
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      const filename = uniqueSuffix + ".webp"
      const outputPath = path.join(
        __dirnameLocal,
        "../../uploads/museumLogoImages",
        filename,
      )

      // Ensure the directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true })

      await sharp(file.buffer)
        .resize(null, null, {
          fit: sharp.fit.outside,
          position: sharp.strategy.center,
        })
        .webp({ quality: 100 })
        .toFile(outputPath)

      req.body.museumLogoPath = `/uploads/museumLogoImages/${filename}`
    }

    next()
  } catch (error) {
    console.error("Error processing images:", error)
    next(error)
  }
}

export default {
  upload: upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "museumLogo", maxCount: 1 },
  ]),
  processImages,
}
