import Link from "next/link"

interface DocumentCardProps {
  document: {
    id: string
    title: string
    alias?: string
    number: string
    type: string
    issuedDate: string
    effectiveDate: string
    status: string
    category?: { name: string; slug: string }
    authority?: { name: string }
  }
}

const TYPE_LABELS: Record<string, string> = {
  HIEN_PHAP: "Hiến pháp",
  BO_LUAT: "Bộ luật",
  LUAT: "Luật",
  NGHI_QUYET: "Nghị quyết",
  NGHI_DINH: "Nghị định",
  THONG_TU: "Thông tư",
  QUYET_DINH: "Quyết định",
  CHI_THI: "Chỉ thị",
}

export function DocumentCard({ document: doc }: DocumentCardProps) {
  return (
    <Link
      href={`/van-ban/${doc.id}`}
      className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
            {TYPE_LABELS[doc.type] || doc.type}
          </span>
          <h3 className="font-semibold text-gray-800 mt-2 line-clamp-2">{doc.title}</h3>
          {doc.alias && <p className="text-xs text-gray-500 mt-0.5">{doc.alias}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
        <span>Số: {doc.number}</span>
        <span>·</span>
        <span>Ban hành: {new Date(doc.issuedDate).toLocaleDateString("vi-VN")}</span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {doc.category && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {doc.category.name}
          </span>
        )}
        {doc.authority && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded truncate">
            {doc.authority.name}
          </span>
        )}
      </div>
    </Link>
  )
}
