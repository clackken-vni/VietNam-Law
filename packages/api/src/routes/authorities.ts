import { Router } from "express"
import { prisma } from "../lib/prisma"

export const authoritiesRouter = Router()

// GET /api/authorities — Danh sách cơ quan ban hành
authoritiesRouter.get("/", async (req, res, next) => {
  try {
    const level = req.query.level as string | undefined
    const where = level ? { level } : {}
    const authorities = await prisma.authority.findMany({
      where,
      orderBy: { name: "asc" },
    })
    res.json(authorities)
  } catch (err) {
    next(err)
  }
})

// GET /api/authorities/:slug — Chi tiết cơ quan ban hành + số lượng văn bản
authoritiesRouter.get("/:slug", async (req, res, next) => {
  try {
    const authority = await prisma.authority.findUnique({
      where: { slug: req.params.slug },
    })
    if (!authority) {
      return res.status(404).json({ code: "AUTHORITY_NOT_FOUND", message: "Cơ quan không tồn tại" })
    }
    const documentCount = await prisma.legalDocument.count({
      where: { authorityId: authority.id },
    })
    res.json({ ...authority, documentCount })
  } catch (err) {
    next(err)
  }
})
