import Link from "next/link"
import { getCategory, listDocuments } from "@/lib/api"
import { DocumentCard } from "@/components/DocumentCard"

interface PageProps {
  params: { slug: string }
}

export default async function CategoryPage({ params }: PageProps) {
  let category: any = null
  let documents: any[] = []

  try {
    const results = await Promise.all([
      getCategory(params.slug),
      listDocuments({ pageSize: 20 }),
    ])
    category = results[0]
    documents = results[1]?.data ?? []
  } catch {
    // API not running yet
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{category?.name || params.slug}</span>
      </nav>

      {category ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-gray-500 mt-2">{category.description}</p>
            )}
          </div>

          {category.children?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {category.children.map((child: any) => (
                <Link
                  key={child.id}
                  href={`/linh-vuc/${child.slug}`}
                  className="text-sm px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <h1 className="text-2xl md:text-3xl font-bold mb-8 capitalize">
          {params.slug.replace(/-/g, " ")}
        </h1>
      )}

      {/* Document list */}
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc: any) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          Chưa có văn bản trong lĩnh vực này. Dữ liệu đang được cập nhật.
        </p>
      )}
    </div>
  )
}
