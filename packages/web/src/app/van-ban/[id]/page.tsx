import Link from "next/link"
import { notFound } from "next/navigation"
import { getDocument } from "@/lib/api"
import { ArticleTree } from "@/components/ArticleTree"

const TYPE_LABELS: Record<string, string> = {
  HIEN_PHAP: "Hiến pháp", BO_LUAT: "Bộ luật", LUAT: "Luật",
  NGHI_QUYET: "Nghị quyết", NGHI_DINH: "Nghị định", THONG_TU: "Thông tư",
  QUYET_DINH: "Quyết định", CHI_THI: "Chỉ thị",
}

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  EFFECTIVE: { label: "Còn hiệu lực", color: "bg-green-100 text-green-700" },
  PARTIALLY_EFFECTIVE: { label: "Còn hiệu lực một phần", color: "bg-yellow-100 text-yellow-700" },
  EXPIRED: { label: "Hết hiệu lực", color: "bg-red-100 text-red-700" },
  NOT_YET_EFFECTIVE: { label: "Chưa có hiệu lực", color: "bg-blue-100 text-blue-700" },
}

interface PageProps {
  params: { id: string }
}

export default async function DocumentPage({ params }: PageProps) {
  let doc: any
  try {
    doc = await getDocument(params.id)
  } catch {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500 text-center py-12">
          Đang tải dữ liệu hoặc văn bản không tồn tại. Vui lòng thử lại sau khi API được khởi chạy.
        </p>
      </div>
    )
  }

  if (!doc) notFound()

  const statusInfo = STATUS_BADGE[doc.status] || { label: doc.status, color: "bg-gray-100 text-gray-700" }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        {doc.category && (
          <>
            <Link href={`/linh-vuc/${doc.category.slug}`} className="hover:text-primary-600">
              {doc.category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-800 truncate">{doc.title}</span>
      </nav>

      {/* Document header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-start gap-3 flex-wrap">
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
            {TYPE_LABELS[doc.type] || doc.type}
          </span>
          <span className={`text-sm px-2 py-0.5 rounded ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mt-3">{doc.title}</h1>
        {doc.alias && <p className="text-gray-500 mt-1">{doc.alias}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <span className="text-gray-500">Số hiệu</span>
            <p className="font-medium">{doc.number}</p>
          </div>
          <div>
            <span className="text-gray-500">Ngày ban hành</span>
            <p className="font-medium">{new Date(doc.issuedDate).toLocaleDateString("vi-VN")}</p>
          </div>
          <div>
            <span className="text-gray-500">Ngày hiệu lực</span>
            <p className="font-medium">{new Date(doc.effectiveDate).toLocaleDateString("vi-VN")}</p>
          </div>
          <div>
            <span className="text-gray-500">Cơ quan ban hành</span>
            <p className="font-medium">{doc.authority?.name || "—"}</p>
          </div>
        </div>
      </div>

      {/* Document content - articles */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar: Table of contents */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 bg-white rounded-xl border border-gray-200 p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Mục lục</h3>
            {doc.articles?.map((article: any) => (
              <a
                key={article.id}
                href={`#article-${article.articleNumber}`}
                className="block text-sm text-gray-600 hover:text-primary-600 py-1 border-l-2 border-transparent hover:border-primary-300 pl-3 transition"
              >
                Điều {article.articleNumber}
                {article.title && `: ${article.title}`}
              </a>
            ))}
            {(!doc.articles || doc.articles.length === 0) && (
              <p className="text-sm text-gray-400">Chưa có dữ liệu điều khoản</p>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <div className="min-w-0">
          <ArticleTree articles={doc.articles || []} />
        </div>
      </div>
    </div>
  )
}
