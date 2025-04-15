// src/controllers/userController.js

import prisma from "../../prismaClient.js"
import logger from "../utils/logging.js"

// src/controllers/userController.js

export const getCreatorsByLanguage = async (req, res, next) => {
  const { language } = req.params
  const { letter } = req.query

  // Log incoming request parameters
  logger.info(`Received request for language: ${language}, letter: ${letter}`)

  // Validate language
  if (!["uk", "en"].includes(language)) {
    logger.warn(`Invalid language parameter: ${language}`)
    return res.status(400).json({ error: "invalid language" })
  }

  let titleField = "title"

  try {
    const creators = await prisma.user.findMany({
      where: {
        role: "CREATOR",
        ...(letter && {
          [titleField]: {
            startsWith: letter,
          },
        }),
      },
      select: {
        id: true,
        email: true,
        [titleField]: true,
        bio: true,
        images: true,
      },
      orderBy: {
        [titleField]: "asc",
      },
    })

    logger.info(`Fetched ${creators.length} creators from database`)

    const mappedCreators = creators.map((creator) => ({
      id: creator.id,
      email: creator.email,
      title: creator[titleField],
      bio: creator.bio,
      images: creator.images,
    }))

    res.json({ creators: mappedCreators })
  } catch (error) {
    logger.error("Error fetching creators by language:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getMuseumsByLanguage = async (req, res, next) => {
  const { language } = req.params
  const { letter } = req.query

  // Log incoming request parameters
  logger.info(`Received request for language: ${language}, letter: ${letter}`)

  // Validate language
  if (!["uk", "en"].includes(language)) {
    logger.warn(`Invalid language parameter: ${language}`)
    return res.status(400).json({ error: "invalid language" })
  }

  let titleField = "title"

  try {
    const museums = await prisma.user.findMany({
      where: {
        role: "MUSEUMS",
        ...(letter && {
          [titleField]: {
            startsWith: letter,
          },
        }),
      },
      select: {
        id: true,
        email: true,
        [titleField]: true,
        bio: true,
        images: true,
      },
      orderBy: {
        [titleField]: "asc",
      },
    })

    logger.info(`Fetched ${museums.length} creators from database`)

    const mappedMuseums = museums.map((museum) => ({
      id: museum.id,
      email: museum.email,
      title: museum[titleField],
      bio: museum.bio,
      images: museum.images,
    }))

    res.json({ museums: mappedMuseums })
  } catch (error) {
    logger.error("Error fetching museums by language:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getCreators = async (req, res, next) => {
  try {
    const creators = await prisma.user.findMany({
      where: {
        role: "CREATOR",
      },
      select: {
        id: true,
        email: true,
        title: true,
        bio: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json({ creators })
  } catch (error) {
    logger.error("Error fetching creators:", error)
    next(error)
  }
}

export const getCreatorById = async (req, res, next) => {
  try {
    const creatorId = parseInt(req.params.id, 10)
    if (isNaN(creatorId)) {
      return res.status(400).json({ error: "invalid creator id" })
    }

    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
      include: {
        products: {
          include: {
            images: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!creator || creator.role !== "CREATOR") {
      return res.status(404).json({ error: "Creator not found" })
    }
    res.json({ creator })
  } catch (error) {
    logger.error("Error fetch data creator id", error)
    next(error)
  }
}

export const getAuthorsByLanguage = async (req, res, next) => {
  const { language } = req.params
  const { letter } = req.query

  //* Log incoming request parameters
  logger.info(`Received request for language: ${language}, letter: ${letter}`)

  //* Validate language
  if (!["uk", "en"].includes(language)) {
    logger.warn(`Invalid language parameter: ${language}`)
    return res.status(400).json({ error: "invalid language" })
  }

  let titleField = "title"

  try {
    const authors = await prisma.user.findMany({
      where: {
        role: "AUTHOR",
        ...(letter && {
          [titleField]: {
            startsWith: letter,
          },
        }),
      },
      select: {
        id: true,
        email: true,
        [titleField]: true,
        bio: true,
        images: true,
      },
      orderBy: {
        [titleField]: "asc",
      },
    })

    logger.info(`Fetched ${authors.length} authors from database`)

    const mappedAuthors = authors.map((author) => ({
      id: author.id,
      email: author.email,
      title: author[titleField],
      bio: author.bio,
      images: author.images,
    }))
    res.json({ authors: mappedAuthors })
  } catch (error) {
    logger.error("Error fetching creators by language:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getAuthors = async (req, res, next) => {
  try {
    const authors = await prisma.user.findMany({
      where: {
        role: "AUTHOR",
      },
      select: {
        id: true,
        email: true,
        title: true,
        bio: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json({ authors })
  } catch (error) {
    logger.error("Error fetching authors:", error)
    next(error)
  }
}

export const getAuthorById = async (req, res, next) => {
  try {
    const authorId = parseInt(req.params.id, 10)
    if (isNaN(authorId)) {
      return res.status(400).json({ error: "invalid author id" })
    }

    const author = await prisma.user.findUnique({
      where: { id: authorId },
      include: {
        products: {
          include: {
            images: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!author || author.role !== "AUTHOR") {
      return res.status(404).json({ error: "Author not found" })
    }
    res.json({ author })
  } catch (error) {
    logger.error("Error fetch data author id", error)
    next(error)
  }
}

export const getMuseums = async (req, res, next) => {
  try {
    const museums = await prisma.user.findMany({
      where: {
        role: "MUSEUM",
      },
      select: {
        id: true,
        email: true,
        title: true,
        bio: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        lat: true,
        lon: true,
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
      },
    })

    res.json({ museums })
  } catch (error) {
    logger.error("Error fetching museums:", error)
    next(error)
  }
}
export const getMuseumById = async (req, res, next) => {
  try {
    const museumId = parseInt(req.params.id, 10)
    if (isNaN(museumId)) {
      return res.status(400).json({ error: "invalid museum id" })
    }

    const museum = await prisma.user.findUnique({
      where: { id: museumId },
      include: {
        museum_logo_image: true,
        products: {
          include: {
            images: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!museum || museum.role !== "MUSEUM") {
      return res.status(404).json({ error: "Museum not found" })
    }
    res.json({ museum })
  } catch (error) {
    logger.error("Error fetch data creator id", error)
    next(error)
  }
}

export const getExhibitions = async (req, res, next) => {
  try {
    const exhibition = await prisma.user.findMany({
      where: {
        role: "EXHIBITION",
      },
      select: {
        id: true,
        email: true,
        title: true,
        bio: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json({ exhibition })
  } catch (error) {
    logger.error("Error fetching exhibitions:", error)
    next(error)
  }
}

export const getExhibitionById = async (req, res, next) => {
  try {
    const exhibitionId = parseInt(req.params.id, 10)
    if (isNaN(exhibitionId)) {
      return res.status(400).json({ error: "invalid exhibition id" })
    }

    const exhibition = await prisma.user.findUnique({
      where: { id: exhibitionId },
      include: {
        products: {
          include: {
            images: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!exhibition || exhibition.role !== "EXHIBITION") {
      return res.status(404).json({ error: "Exhibition not found" })
    }
    res.json({ exhibition })
  } catch (error) {
    logger.error("Error fetch data creator id", error)
    next(error)
  }
}
