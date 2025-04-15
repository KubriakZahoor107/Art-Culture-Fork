import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export const searchAuthors = async (req, res, next) => {
  try {
    const query = req.query.q || ""

    const authors = await prisma.user.findMany({
      where: {
        role: "CREATOR",
        OR: [
          { email: { contains: query.toLowerCase() } },
          { title: { contains: query.toLowerCase() } },
        ],
      },
      select: {
        id: true,
        email: true,
        title: true,
        bio: true,
        images: true,
      },
      take: 10, //Limit request
    })
    res.json({ authors })
  } catch (error) {
    console.error("Error searching for authors:", error)
    next(error)
  }
}

export const searchPainting = async (req, res, next) => {
  try {
    const query = req.query.q || ""
    const authorId = req.params.authorId
      ? parseInt(req.params.authorId, 10)
      : null

    const paintings = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { title_en: { contains: query.toLowerCase() } },
              { description_en: { contains: query.toLowerCase() } },
              { title_uk: { contains: query.toLowerCase() } },
              { description_uk: { contains: query.toLowerCase() } },
            ],
          },
          authorId ? { authorId: authorId } : {},
        ],
      },
      include: {
        images: true,
        author: {
          select: {
            id: true,
            email: true,
            title: true,
            bio: true,
            images: true,
          },
        },
      },
      take: 10, //Limit request
    })

    res.json({ paintings })
  } catch (error) {
    console.error("Error searching for paintings:", error)
    next(error)
  }
}

export const searchMuseum = async (req, res, next) => {
  try {
    const query = req.query.q || ""

    const museums = await prisma.user.findMany({
      where: {
        role: "MUSEUM",
        OR: [
          { email: { contains: query.toLowerCase() } },
          { title: { contains: query.toLowerCase() } },
          { bio: { contains: query.toLowerCase() } },
        ],
      },
      select: {
        id: true,
        email: true,
        title: true,
        bio: true,
        images: true,
        country: true,
        house_number: true,
        lat: true,
        lon: true,
        postcode: true,
        state: true,
        street: true,
        city: true,
      },
      take: 10, //Limit request
    })
    res.json({ museums })
  } catch (error) {
    console.error("Error searching for museums:", error)
    next(error)
  }
}

// controllers/searchController.js
export const searchAll = async (req, res, next) => {
  try {
    const query = req.query.q || ""

    // Search for authors (fixing the typo: "contains" instead of "contain")
    const searchAllAuthors = await prisma.user.findMany({
      where: {
        role: { in: ["CREATOR", "MUSEUM", "EXHIBITION", "AUTHOR"] }, // Removed duplicate "MUSEUM"
        OR: [
          { email: { contains: query.toLowerCase() } },
          { title: { contains: query.toLowerCase() } },
        ],
      },
      select: {
        id: true,
        email: true,
        title: true,
        bio: true,
        images: true,
        role: true,
      },
      take: 10,
    })

    // Search for products (remove reference to undefined museumId)
    const searchAllProduct = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { title_en: { contains: query.toLowerCase() } },
              { description_en: { contains: query.toLowerCase() } },
              { title_uk: { contains: query.toLowerCase() } },
              { description_uk: { contains: query.toLowerCase() } },
            ],
          },
          // Remove or modify the authorId condition if not needed
        ],
      },
      include: {
        images: true,
        author: {
          select: {
            id: true,
            email: true,
            title: true,
            bio: true,
            images: true,
          },
        },
      },
      take: 10,
    })

    const searchAllPosts = await prisma.post.findMany({
      where: {
        OR: [
          { title_en: { contains: query.toLowerCase() } },
          { content_en: { contains: query.toLowerCase() } },
          { title_uk: { contains: query.toLowerCase() } },
          { content_uk: { contains: query.toLowerCase() } },
        ],
      },
      select: {
        id: true,
        title_en: true,
        title_uk: true,
        images: true,
      },
      take: 10,
    })

    const searchAllExhibitions = await prisma.exhibition.findMany({
      include: {
        images: true,
        museum: {
          include: {
            museum_logo_image: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            title: true,
          },
        },
        exhibitionArtists: {
          include: {
            artist: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json({
      searchAllAuthors,
      searchAllProduct,
      searchAllPosts,
      searchAllExhibitions,
    })
  } catch (error) {
    console.error("error in searchAll", error)
    next(error)
  }
}
