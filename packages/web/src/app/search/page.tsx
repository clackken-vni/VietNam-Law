"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { search, type ListDocumentsParams, listDocuments } from "@/lib/api"
import { DocumentCard } from "@/components/DocumentCard"

// ─── Document types for filter ──────────────────────
const DOC_TYPES = [
  { value: "", label: "Tất cả" },
  { value: "HIEN_PHAP", label: "Hiến pháp" },
  { value: "BO_LUAT", label: "Bộ luật" },
  { value: "LUAT", label: "Luật" },
  { value: "NGHI_DINH", label: "Nghị định" },
  { value: "THONG_TU", label: "Thông tư" },
  { value: "NGHI_QUYET", label: "Nghị quyết" },
  { value: "QUYET_DINH", label: "Quyết định" },
]

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "EFFECTIVE", label: "Còn hiệu lực" },
  { value: "PARTIALLY_EFFECTIVE", label: "Còn hiệu lực một phần" },
  { value: "EXPIRED", label: "Hết hiệu lực" },
  { value: "NOT_YET_EFFECTIVE", label: "Chưa có hiệu lực" },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Filters
  const [typeFilter, setTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")

  useEffect(() => {
    async function doSearch() {
      setLoading(true)
      setError("")
      try {
        if (query) {
          const data = await search({ q: query, type: "documents" })
          setResults(data)
        } else {
          const params: ListDocumentsParams = {}
          if (typeFilter) params.type = typeFilter
          if (statusFilter) params.status = statusFilter
          if (yearFilter) params.year = Number(yearFilter)
          const data = await listDocuments(params)
          setResults({ hits: data.data.map((d: any) => ({ ...d, _formatted: d })), estimatedTotalHits: data.total })
        }
      } catch (err: any) {
        setError(err.message || "Lỗi tìm kiếm")
      } finally {
        setLoading(false)
      }
    }
    doSearch()
  }, [query, typeFilter, statusFilter, yearFilter])

  const hits = results?.hits || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Kết quả tìm kiếm: "${query}"` : "Tra cứu văn bản pháp luật"}
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          {DOC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Năm ban hành"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36"
        />
      </div>

      {/* Results */}
      {loading && <p className="text-gray-500 py-8 text-center">Đang tìm kiếm...</p>}

      {error && <p className="text-red-500 py-8 text-center">{error}</p>}

      {!loading && !error && (
        <>
          {results && (
            <p className="text-sm text-gray-500 mb-4">
              Tìm thấy {results.estimatedTotalHits || hits.length} kết quả
            </p>
          )}

          {hits.length > 0 ? (
            <div className="space-y-3">
              {hits.map((hit: any) => (
                <DocumentCard key={hit.id} document={hit._formatted || hit} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">
              {query ? "Không tìm thấy kết quả phù hợp." : "Chưa có dữ liệu. API đang được khởi tạo."}
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  )
}
