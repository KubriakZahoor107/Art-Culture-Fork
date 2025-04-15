// routes/geoRoutes.js
import express from "express"
import {
  searchAddress,
  searchMuseumAddress,
} from "../controllers/geoController.js"

const router = express.Router()

// GET /api/geo?q=YourSearchQuery
router.get("/", searchAddress)
router.get("/museum", searchMuseumAddress)
export default router
