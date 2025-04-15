// src/routes/productRoutes.js

import express from "express"
import { body } from "express-validator"
import {
  createProduct,
  deleteProduct,
  getCreatorProducts,
  getMuseumProducts,
  getProductByAuthorId,
  getProductByExhibitionId,
  getProductById,
  getProductByMuseumId,
  getProducts,
  getUserProducts,
  updateProduct,
} from "../controllers/productController.js"
import authenticateToken from "../middleware/authMiddleware.js"
import uploadPaintings from "../middleware/productImageUploader.js"
import authorize from "../middleware/roleMIddleware.js"
const router = express.Router()

// Create a new product (only accessible by MUSEUM and CREATOR roles)
router.post(
  "/",

  authenticateToken,
  authorize("MUSEUM", "CREATOR", "ADMIN"),
  uploadPaintings.array("productImages", 7),
  // Maximum of 7 images
  [
    body("title_en").notEmpty().withMessage("Title  is required"),
    body("description_en").notEmpty().withMessage("Description  is required"),
    body("title_uk").notEmpty().withMessage("Потрібен заголовок "),
    body("description_uk").notEmpty().withMessage("Потрібен опис "),
    body("specs").optional().isString(),
  ],
  createProduct,
)

router.get("/creators-products", getCreatorProducts)

// Get all products
router.get("/", getProducts)
router.get("/my-products", authenticateToken, getUserProducts)
router.get("/author/:authorId", getProductByAuthorId)
router.get("/museum-products", getMuseumProducts)
router.get("/museum/:museumId", getProductByMuseumId)
router.get("/exproducts", getProductByExhibitionId)
router.get("/:productId", getProductById)

router.put(
  "/:id",
  authenticateToken,
  uploadPaintings.array("productImages", 7),
  [
    body("title_en").notEmpty().withMessage("Title is required"),
    body("description_en").notEmpty().withMessage("Description is required"),
    body("title_uk").notEmpty().withMessage("Потрібен заголовок"),
    body("description_uk").notEmpty().withMessage("Потрібен опис"),
    body("specs_en").optional().isString(),
    body("specs_uk").optional().isString(),
  ],
  updateProduct,
)

router.delete("/:id", authenticateToken, deleteProduct)
export default router
