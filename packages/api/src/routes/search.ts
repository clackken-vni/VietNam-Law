import { Router } from "express"
import { z } from "zod"
import { searchDocuments, searchArticles, buildFilterString } from "../services/search.service"
import { validate } from "../middleware/validate"

export const searchRouter = Router()

const searchQuerySchema = z.object({
  q: z.string().min(1, "Từ khóa tìm kiếm không được để trống"),
  type: z.enum(["documents", "articles"]).default("documents"),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().optional(),
  documentType: z.string().optional(),
  status: z.string().optional(),
})

// GET /api/search?q=...&type=documents|articles
searchRouter.get("/", validate(searchQuerySchema, "query"), async (req, res, next) => {
  try {
    const { q, type, limit, offset, categoryId, documentType, status } =
      req.query as unknown as z.infer<typeof searchQuerySchema>

    const filter = buildFilterString({ categoryId, type: documentType, status })

    if (type === "articles") {
      const result = await searchArticles(q, { limit, offset, filter })
      return res.json(result)
    }

    const result = await searchDocuments(q, { limit, offset, filter })
    res.json(result)
  } catch (err) {
    next(err)
  }
})
