import bcrypt from "bcrypt"
import { validationResult } from "express-validator"
import fs from "fs"
import jwt from "jsonwebtoken"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import prisma from "../../prismaClient.js"
import generateToken from "../utils/generateToken.js"
import logger from "../utils/logging.js"
import sendEmail from "../utils/sendEmails.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const register = async (req, res, next) => {
  try {
    // Handle Validation Errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      email,
      password,
      role,
      title,
      bio,
      country,
      city,
      street,
      house_number,
      postcode,
      lat,
      lon,
    } = req.body

    // Access the uploaded files paths
    const profileImage = req.body.profileImagePath || null
    const museumLogo = req.body.museumLogoPath || null

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Prepare user data
    const userData = {
      email,
      password: hashedPassword,
      images: profileImage,
      role: role || "USER",
      title,
      bio,
    }

    // If role is MUSEUM, include address fields
    if (role === "MUSEUM") {
      userData.country = country || null
      userData.city = city || null
      userData.street = street || null
      userData.house_number = house_number || null
      userData.postcode = postcode || null
      userData.lat = lat ? parseFloat(lat) : null
      userData.lon = lon ? parseFloat(lon) : null
    }

    // Create user
    const user = await prisma.user.create({
      data: userData,
    })
    logger.debug("User object after creation:", user)
    const token = generateToken(user)

    const { password: pwd, ...userWithoutPassword } = user
    logger.debug("Request body:", req.body)
    logger.debug("Uploaded file:", req.file)

    if (museumLogo && role === "MUSEUM") {
      await prisma.museum_logo_images.create({
        data: {
          imageUrl: museumLogo,
          userId: user.id,
        },
      })
    }

    await sendEmail(
      user.email,
      "Підтвердження реестрації",
      `Дякуємо за реестрацію на проекті ArtPlayUkraine.`,
      `<p>Дякуємо за реестрацію на проекті ArtPlayUkraine.
			<a href="${process.env.CLIENT_URL}">Перейти до сайту</a>
			</p>`,
    )

    res.status(201).json({
      token,
      user: userWithoutPassword,
      message: "user created successfully",
    })
  } catch (error) {
    next(error)
  }
}

// src/controllers/authController.js

export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with default role 'USER'
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: "USER" },
    })

    logger.log("User object after self-registration:", user)
    const token = generateToken(user)

    const { password: pwd, ...userWithoutPassword } = user

    res.status(201).json({
      token,
      user: userWithoutPassword,
      message: "User created successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" })

    logger.log("User object before token generation:", user)

    // Generate token
    const token = generateToken(user)

    const { password: pwd, ...userWithoutPassword } = user
    res.json({ token, user: userWithoutPassword })
  } catch (error) {
    logger.error("Login error:", error)
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: "User not found" })

    // Generate reset token
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    // Update user with reset token and expiry
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour
      },
    })

    // Send reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Click the link to reset your password: ${resetLink}`,
      `Click the link to reset your password: ${resetLink}`,
    )

    res.json({ message: "Password reset link sent to email" })
  } catch (error) {
    next(error)
  }
}

export const resetPasswordConfirm = async (req, res, next) => {
  try {
    const { token } = req.params
    const { newPassword } = req.body

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ error: "User not found" })

    // Check if token matches and is not expired
    if (user.resetToken !== token || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: "Invalid or expired token" })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password and remove reset token
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    res.json({ message: "Password reset successful" })
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid token" })
    }
    next(error)
  }
}

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id
    if (!userId) return res.status(401).json({ error: "Unauthorized" })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        title: true,
        bio: true,
        images: true,
        country: true,
        state: true,
        city: true,
        street: true,
        house_number: true,
        postcode: true,
        lat: true,
        lon: true,
        createdAt: true,
        updatedAt: true,
        museum_logo_image: {
          select: {
            imageUrl: true,
          },
        },
      },
    })

    if (!user) return res.status(404).json({ error: "User not found" })

    res.json({ user })
  } catch (error) {
    next(error)
  }
}

export const updateUserProfile = async (req, res, next) => {
  try {
    const {
      title,
      bio,
      country,
      state,
      city,
      street,
      house_number,
      postcode,
      lat,
      lon,
    } = req.body

    logger.log("Received update data:", {
      title,
      bio,
      country,
      city,
      street,
      house_number,
      postcode,
      lat,
      lon,
    })
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    let profileImage = user.images
    if (req.body.profileImagePath) {
      profileImage = req.body.profileImagePath

      if (user.images) {
        const oldImagePath = path.join(__dirname, "../../", user.images)
        try {
          await fs.promises.unlink(oldImagePath)
          logger.log("Old image deleted successfully: ${oldImagePath}")
        } catch (err) {
          if (err.code !== "ENOENT") {
            logger.error("Failed to delete old image:", err)
          }
        }
      }
    }

    const updateData = {
      title: title || req.user.title,
      bio: bio || req.user.bio,
      images: profileImage,
    }

    if (req.user.role === "MUSEUM") {
      updateData.country = country || req.user.country
      updateData.city = city || req.user.city
      updateData.street = street || req.user.street
      updateData.house_number = house_number || req.user.house_number
      updateData.postcode = postcode || req.user.postcode
      updateData.lat = lat ? parseFloat(lat) : req.user.lat
      updateData.lon = lon ? parseFloat(lon) : req.user.lon
    }

    // Handle museum logo
    if (req.body.museumLogoPath && user.role === "MUSEUM") {
      const existingLogo = await prisma.museum_logo_images.findUnique({
        where: { userId: user.id },
      })

      if (existingLogo) {
        // Update existing logo
        await prisma.museum_logo_images.update({
          where: { userId: user.id },
          data: {
            imageUrl: req.body.museumLogoPath,
          },
        })
        // Delete old logo file
        const oldLogoPath = path.join(
          __dirname,
          "../../",
          existingLogo.imageUrl,
        )
        try {
          await fs.promises.unlink(oldLogoPath)
          logger.log(`Old museum logo deleted successfully: ${oldLogoPath}`)
        } catch (err) {
          if (err.code !== "ENOENT") {
            logger.error("Failed to delete old museum logo:", err)
          }
        }
      } else {
        // Create new logo entry
        await prisma.museum_logo_images.create({
          data: {
            imageUrl: req.body.museumLogoPath,
            userId: user.id,
          },
        })
      }
    }

    const updateUserProfile = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        title: true,
        bio: true,
        images: true,
        country: true,
        city: true,
        street: true,
        house_number: true,
        postcode: true,
        museum_logo_image: {
          select: {
            imageUrl: true,
          },
        },
        lat: true,
        lon: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json({
      user: updateUserProfile,
      message: "Profile updated successfully",
    })
  } catch (error) {
    logger.error("Error updating user profile:", error)
    next(error)
  }
}
