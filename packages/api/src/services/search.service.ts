import { searchClient, DOCUMENTS_INDEX, ARTICLES_INDEX } from "../lib/meilisearch"

export async function searchDocuments(query: string, options?: {
  limit?: number
  offset?: number
  filter?: string
}) {
  const index = searchClient.index(DOCUMENTS_INDEX)
  const result = await index.search(query, {
    limit: options?.limit || 20,
    offset: options?.offset || 0,
    filter: options?.filter,
    attributesToHighlight: ["title", "alias"],
    attributesToCrop: [],
  })
  return result
}

export async function searchArticles(query: string, options?: {
  limit?: number
  offset?: number
  filter?: string
}) {
  const index = searchClient.index(ARTICLES_INDEX)
  const result = await index.search(query, {
    limit: options?.limit || 20,
    offset: options?.offset || 0,
    filter: options?.filter,
    attributesToHighlight: ["content", "title"],
    attributesToCrop: ["content"],
    cropLength: 200,
  })
  return result
}

/** Build Meilisearch filter string from params */
export function buildFilterString(filters: Record<string, string | undefined>): string | undefined {
  const parts = Object.entries(filters)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k} = "${v}"`)
  return parts.length > 0 ? parts.join(" AND ") : undefined
}
