const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Unknown error" }))
    throw new Error(err.message || `API error ${res.status}`)
  }
  return res.json()
}

// ─── Documents ──────────────────────────────────────

export interface ListDocumentsParams {
  page?: number
  pageSize?: number
  categoryId?: string
  authorityId?: string
  type?: string
  status?: string
  year?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export function listDocuments(params?: ListDocumentsParams) {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) searchParams.set(key, String(value))
    }
  }
  return fetchApi<any>(`/documents?${searchParams.toString()}`)
}

export function getDocument(id: string) {
  return fetchApi<any>(`/documents/${id}`)
}

export function getDocumentArticles(id: string) {
  return fetchApi<any>(`/documents/${id}/articles`)
}

// ─── Categories & Authorities ───────────────────────

export function getCategories() {
  return fetchApi<any[]>("/categories")
}

export function getCategory(slug: string) {
  return fetchApi<any>(`/categories/${slug}`)
}

export function getAuthorities(level?: string) {
  const q = level ? `?level=${level}` : ""
  return fetchApi<any[]>(`/authorities${q}`)
}

// ─── Search ─────────────────────────────────────────

export function search(params: { q: string; type?: string; limit?: number; offset?: number }) {
  const searchParams = new URLSearchParams()
  searchParams.set("q", params.q)
  if (params.type) searchParams.set("type", params.type)
  if (params.limit) searchParams.set("limit", String(params.limit))
  if (params.offset) searchParams.set("offset", String(params.offset))
  return fetchApi<any>(`/search?${searchParams.toString()}`)
}

// ─── References ─────────────────────────────────────

export function getReferences(documentId: string) {
  return fetchApi<any>(`/references/${documentId}`)
}
