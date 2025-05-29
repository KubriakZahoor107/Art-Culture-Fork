import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getPendingCounts = async (req, res, next) => {
  try {
    const getPostCounts = await prisma.post.count({
      where: {
        status: "PENDING",
      },
    })
    const getCardCounts = await prisma.product.count({
      where: {
        status: "PENDING",
      },
    })
    return res.json({
      posts: getPostCounts,
      products: getCardCounts,
    })
  } catch (error) {
    next(error)
  }
}

export const getPendingProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return res.json(products)
  } catch (error) {
    next(error)
  }
}

export const approveProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10)
    const updated = await prisma.product.update({
      where: { id: productId },
      data: { status: "APPROVED" },
    })
    return res.json(updated)
  } catch (error) {
    next(error)
  }
}

export const rejectProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10)
    const updated = await prisma.product.update({
      where: { id: productId },
      data: { status: "REJECTED" },
    })
    return res.json(updated)
  } catch (error) {
    next(error)
  }
}
