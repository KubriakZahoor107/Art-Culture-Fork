import { PrismaClient } from "@prisma/client"
import { body, validationResult } from "express-validator"
import authenticateToken from "../middleware/authMiddleware.js"
import authorize from "../middleware/roleMIddleware.js"

const prisma = new PrismaClient()

export const getAllAdminPosts = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        let page = req.params.page ?? 1;
        let pageSize = req.params.pageSize ?? 20;
        let orderBy = req.params.orderBy ?? "createdAt";
        let validColumns = [
            ["createdAt", "desc"], 
            ["title", "asc"],
            ["status", "asc"],
        ];
        if (!validColumns.some((col) => col[0] === orderBy)) {
            return res.status(400).json({ error: "Invalid sort order" });
        }

        let orderDir = req.params.orderDir ?? validColumns.find((col) => col[0] === orderBy)[1];
        page = parseInt(page);
        pageSize = parseInt(pageSize);
        if (pageSize > 20) pageSize = 20;
        if (page < 1) page = 1;
        const { authorId, status } = req.query
        const filter = authorId ? { authorId: parseInt(authorId) } : {}

        const mainQuery = {
            where: { status, ...filter },
            include: {
                author: {
                    select: {
                        email: true,
                        id: true,
                        title: true,
                    },
                },
            },
        }

        const posts = await prisma.post.findMany({
            ...mainQuery,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { [orderBy]: orderDir },
        })
        res.json({ data: posts })
    } catch (error) {
        next(error)
    }
}

export const getPendingPosts = async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                status: "PENDING",
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        return res.json(posts)
    } catch (error) {
        next(error)
    }
}
export const approvePost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id, 10)
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { status: "APPROVED" },
        })

        return res.json(updatedPost)
    } catch (error) {
        next(error)
    }
}

export const rejectPost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id, 10)
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { status: "REJECTED" },
        })

        return res.json(updatedPost)
    } catch (error) {
        next(error)
    }
}

export const registerAdminPostRoutes = (router) => {
    router.get(
        "/pending-posts",
        authenticateToken,
        authorize("ADMIN"),
        getPendingPosts,
    )

    router.get(
        "/posts",
        authenticateToken,
        authorize("ADMIN"),
        [
            body("page").isInt({ min: 1 }).optional(),
            body("pageSize").isInt({ min: 10, max: 100 }).optional(),
            body("orderBy").isIn(["createdAt", "title", "status"]).optional(),
            body("orderDir").isIn(["asc", "desc"]).optional(),
            body("status").isIn(["APPROVED", "REJECTED"]).optional(),
            body("authorId").isInt().optional(),
        ],
        getAllAdminPosts,
    )

    router.patch(
        "/posts/:id/approve",
        authenticateToken,
        authorize("ADMIN"),
        approvePost,
    )
    router.patch(
        "/posts/:id/reject",
        authenticateToken,
        authorize("ADMIN"),
        rejectPost,
    )
}