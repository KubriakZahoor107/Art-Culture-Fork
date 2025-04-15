import express from "express"
import {
  searchAll,
  searchAuthors,
  searchMuseum,
  searchPainting,
} from "../controllers/searchController.js"
import authenticateToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/authors", authenticateToken, searchAuthors)
router.get("/paintings", authenticateToken, searchPainting)
router.get("/museums", authenticateToken, searchMuseum)
router.get("/all-search", searchAll)
export default router
