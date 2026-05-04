import { Router } from "express"
import { z } from "zod"
import { getDocumentById, getDocumentsPaginated, getDocumentArticles } from "../services/document.service"
import { AppError } from "../middleware/errorHandler"
import { validate } from "../middleware/validate"

export const documentsRouter = Router()

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
  authorityId: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  year: z.coerce.number().int().optional(),
  sortBy: z.enum(["issuedDate", "effectiveDate", "viewCount", "title"]).default("issuedDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

// GET /api/documents — Danh sách văn bản (có filter + phân trang)
documentsRouter.get("/", validate(listQuerySchema, "query"), async (req, res, next) => {
  try {
    const result = await getDocumentsPaginated(req.query as unknown as z.infer<typeof listQuerySchema>)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/documents/:id — Chi tiết một văn bản
documentsRouter.get("/:id", async (req, res, next) => {
  try {
    const doc = await getDocumentById(req.params.id)
    if (!doc) throw new AppError(404, "DOCUMENT_NOT_FOUND", "Văn bản không tồn tại")
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// GET /api/documents/:id/articles — Danh sách điều khoản
documentsRouter.get("/:id/articles", async (req, res, next) => {
  try {
    const articles = await getDocumentArticles(req.params.id)
    res.json(articles)
  } catch (err) {
    next(err)
  }
})
