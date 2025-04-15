import express from "express"
import { body } from "express-validator"
import {
  // authController,
  getCurrentUser,
  login,
  register,
  registerUser,
  resetPassword,
  resetPasswordConfirm,
  updateUserProfile,
} from "../controllers/authController.js"
import authenticateToken from "../middleware/authMiddleware.js"
import authorize from "../middleware/roleMIddleware.js"
import uploadProfileLogo from "../middleware/uploadProfileLogoImages.js"

const router = express.Router()

// Registration Route with Validation
router.post(
  "/register",
  uploadProfileLogo.upload,
  (req, res, next) => {
    if (!req.file) {
      return next()
    }
    uploadProfileLogo.processImages(req, res, next)
  },

  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn([
        "ADMIN",
        "USER",
        "MUSEUM",
        "CREATOR",
        "EDITOR",
        "AUTHOR",
        "EXHIBITION",
      ])
      .withMessage("Invalid role"),
    // Add additional validations for address fields if role is MUSEUM
    body("country")
      .if(body("role").equals("MUSEUM"))
      .notEmpty()
      .withMessage("Country is required for museums"),
    body("city")
      .if(body("role").equals("MUSEUM"))
      .notEmpty()
      .withMessage("State is required for museums"),
    body("street")
      .if(body("role").equals("MUSEUM"))
      .notEmpty()
      .withMessage("Street is required for museums"),
    body("house_number")
      .if(body("role").equals("MUSEUM"))
      .notEmpty()
      .withMessage("House number is required for museums"),
    body("postcode")
      .if(body("role").equals("MUSEUM"))
      .notEmpty()
      .withMessage("Postcode is required for museums"),
    body("lat")
      .if(body("role").equals("MUSEUM"))
      .isFloat()
      .withMessage("Latitude must be a valid number"),
    body("lon")
      .if(body("role").equals("MUSEUM"))
      .isFloat()
      .withMessage("Longitude must be a valid number"),
  ],

  register,
)

// Self-Registration Route - Accessible to All
router.post(
  "/signup",
  authenticateToken,
  authorize("ADMIN"),
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser,
)

// Login Route
router.post("/login", login)

// Password Reset Request
router.post("/reset-password", resetPassword)

// Password Reset Confirmation
router.post("/reset-password/:token", resetPasswordConfirm)

router.get("/me", authenticateToken, getCurrentUser)

router.put(
  "/me",
  authenticateToken,
  uploadProfileLogo.upload,
  (req, res, next) => {
    if (!req.file) {
      return next()
    }
    uploadProfileLogo.processImages(req, res, next)
  },

  [
    body("title")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters"),
    body("bio")
      .optional()
      .isLength({ max: 1500 })
      .withMessage("Bio must be less than 500 characters"),
  ],
  updateUserProfile,
)
export default router
