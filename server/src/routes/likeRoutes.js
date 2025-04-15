import express from "express"
import {
  getLikeCount,
  getLikeStatus,
  getTopLikedExhibitions,
  getTopLikedMuseums,
  getTopLikedPaintings,
  getTopLikedPosts,
  toggleLikeEntity,
} from "../controllers/likeController.js"
import authenticateToken from "../middleware/authMiddleware.js"

const router = express.Router()

//* Route to like an entity
// router.post("/", authenticateToken, likeEntity)
// router.delete("/unlike", authenticateToken, unlikeEntity)
router.post("/toggle", authenticateToken, toggleLikeEntity)
router.get("/top-liked-posts", getTopLikedPosts)
router.get("/top-liked-museums", getTopLikedMuseums)
router.get("/top-liked-exhibitions", getTopLikedExhibitions)
router.get("/top-liked-paintings", getTopLikedPaintings)
router.get("/status", authenticateToken, getLikeStatus)
router.get("/count", getLikeCount)

export default router
