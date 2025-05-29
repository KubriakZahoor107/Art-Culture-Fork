import { PrismaClient } from "@prisma/client"
import { body, validationResult } from "express-validator"
import authenticateToken from "../middleware/authMiddleware.js"
import authorize from "../middleware/roleMIddleware.js"

const prisma = new PrismaClient()

export const getAllAdminUsers = async (req, res, next) => {
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
            //["status", "asc"],
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
            where: { status, ...filter }
        }

        const posts = await prisma.user.findMany({
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

export const updateUserRole = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const userId = parseInt(req.params.id)
    const { role } = req.body
    if (userId === req.user.id && role !== "ADMIN") {
      return res
        .status(400)
        .json({ error: "Admin cannot change your own role" })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true },
    })

    res.json(user)
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" })
    }
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id)

    if (userId === req.user.id) {
      return res.status(400).json({ error: "Admin cannot delete own account" })
    }

    await prisma.user.delete({ where: { id: userId } })

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" })
    }
    next(error)
  }
}


export const registerAdminUserRoutes = (router) => {
    router.get(
        "/users",
        authenticateToken,
        authorize("ADMIN"),
        [
            body("page").isInt({ min: 1 }).optional(),
            body("pageSize").isInt({ min: 10, max: 100 }).optional(),
            body("orderBy").isIn(["createdAt", "title", "status"]).optional(),
            body("orderDir").isIn(["asc", "desc"]).optional(),
            //body("status").isIn(["APPROVED", "REJECTED"]).optional(),
            body("authorId").isInt().optional(),
        ],
        getAllAdminUsers,
    )

    router.put(
      "/users/:id/role",
      authenticateToken,
      authorize("ADMIN"),
      [
        body("role")
          .isIn(["ADMIN", "USER", "MUSEUM", "CREATOR", "EDITOR"])
          .withMessage("Invalid role"),
      ],
      updateUserRole,
    )
    
    router.delete("/users/:id", authenticateToken, authorize("ADMIN"), deleteUser)
}