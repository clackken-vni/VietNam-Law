import { Router } from "express"
import { prisma } from "../lib/prisma"

export const categoriesRouter = Router()

// GET /api/categories — Danh sách lĩnh vực (dạng cây)
categoriesRouter.get("/", async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: { children: true },
        },
      },
      orderBy: { name: "asc" },
    })
    res.json(categories)
  } catch (err) {
    next(err)
  }
})

// GET /api/categories/:slug — Chi tiết lĩnh vực + số lượng văn bản
categoriesRouter.get("/:slug", async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { children: true },
    })
    if (!category) {
      return res.status(404).json({ code: "CATEGORY_NOT_FOUND", message: "Lĩnh vực không tồn tại" })
    }
    const documentCount = await prisma.legalDocument.count({
      where: { categoryId: category.id },
    })
    res.json({ ...category, documentCount })
  } catch (err) {
    next(err)
  }
})
