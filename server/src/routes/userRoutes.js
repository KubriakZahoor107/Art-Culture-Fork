// src/routes/userRoutes.js

import express from "express"
import {
  getAuthorById,
  getAuthors,
  getAuthorsByLanguage,
  getCreatorById,
  getCreators,
  getCreatorsByLanguage,
  getExhibitionById,
  getExhibitions,
  getMuseumById,
  getMuseums,
  getMuseumsByLanguage,
} from "../controllers/userController.js"

const router = express.Router()

router.get("/authors/language/:language", getAuthorsByLanguage)
router.get("/creators/language/:language", getCreatorsByLanguage)
router.get("/museums/language/:language", getMuseumsByLanguage)
router.get("/authors/:id", getAuthorById)
router.get("/authors", getAuthors)
router.get("/creators/:id", getCreatorById)
router.get("/creators", getCreators)
router.get("/museums/:id", getMuseumById)
router.get("/museums", getMuseums)
router.get("/exhibitions", getExhibitions)
router.get("/exhibitions/:id", getExhibitionById)

export default router
