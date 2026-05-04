import { Router } from "express"
import { getDocumentReferences } from "../services/reference.service"

export const referencesRouter = Router()

// GET /api/references/:documentId — Đồ thị liên kết của một văn bản
referencesRouter.get("/:documentId", async (req, res, next) => {
  try {
    const refs = await getDocumentReferences(req.params.documentId)
    res.json(refs)
  } catch (err) {
    next(err)
  }
})
