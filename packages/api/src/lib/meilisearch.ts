import { MeiliSearch } from "meilisearch"

const host = process.env.MEILISEARCH_HOST || "http://localhost:7700"
const apiKey = process.env.MEILISEARCH_API_KEY || "vietlex_dev_key"

export const searchClient = new MeiliSearch({ host, apiKey })

export const DOCUMENTS_INDEX = "legal_documents"
export const ARTICLES_INDEX = "articles"

export async function ensureIndexes() {
  const indexes = await searchClient.getIndexes()
  const names = indexes.results.map((i) => i.uid)

  if (!names.includes(DOCUMENTS_INDEX)) {
    await searchClient.createIndex(DOCUMENTS_INDEX, { primaryKey: "id" })
  }
  if (!names.includes(ARTICLES_INDEX)) {
    await searchClient.createIndex(ARTICLES_INDEX, { primaryKey: "id" })
  }
}
