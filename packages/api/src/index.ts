import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { documentsRouter } from "./routes/documents"
import { categoriesRouter } from "./routes/categories"
import { authoritiesRouter } from "./routes/authorities"
import { searchRouter } from "./routes/search"
import { referencesRouter } from "./routes/references"
import { errorHandler } from "./middleware/errorHandler"

const app = express()
const PORT = process.env.API_PORT || 3001

app.use(helmet())
app.use(cors())
app.use(morgan("short"))
app.use(express.json())

// Routes
app.use("/api/documents", documentsRouter)
app.use("/api/categories", categoriesRouter)
app.use("/api/authorities", authoritiesRouter)
app.use("/api/search", searchRouter)
app.use("/api/references", referencesRouter)

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`[vietlex] API server running on http://localhost:${PORT}`)
})

export default app
