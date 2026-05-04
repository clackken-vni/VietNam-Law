import Link from "next/link"
import { getCategories } from "@/lib/api"
import { DocumentCard } from "@/components/DocumentCard"
import { CategoryCard } from "@/components/CategoryCard"

export default async function HomePage() {
  let categories: any[] = []
  try {
    categories = await getCategories()
  } catch {
    // API not running yet, show static content
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            VietLex
          </h1>
          <p className="text-xl text-primary-200 mb-2 font-light">
            Vietnam Legal Intelligence Platform
          </p>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Tra cứu và nghiên cứu văn bản pháp luật Việt Nam — nhanh chóng, chính xác, thông minh.
          </p>
          <Link
            href="/search"
            className="inline-block bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition"
          >
            Bắt đầu tra cứu
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Lĩnh vực pháp luật</h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat: any) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <CategoryGrid />
        )}
      </section>

      {/* Recent documents placeholder */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Văn bản mới ban hành</h2>
          <Link href="/search?sortBy=issuedDate" className="text-primary-600 hover:underline text-sm">
            Xem tất cả →
          </Link>
        </div>
        <p className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          Đang cập nhật dữ liệu văn bản pháp luật...
        </p>
      </section>
    </div>
  )
}

function CategoryGrid() {
  const items = [
    { name: "Dân sự", slug: "dan-su", icon: "⚖️" },
    { name: "Hình sự", slug: "hinh-su", icon: "🔒" },
    { name: "Hành chính", slug: "hanh-chinh", icon: "🏛️" },
    { name: "Lao động", slug: "lao-dong", icon: "👷" },
    { name: "Đất đai", slug: "dat-dai", icon: "🏠" },
    { name: "Doanh nghiệp", slug: "doanh-nghiep", icon: "🏢" },
    { name: "Thuế", slug: "thue", icon: "💰" },
    { name: "Tài chính - Ngân hàng", slug: "tai-chinh-ngan-hang", icon: "🏦" },
    { name: "Giao thông", slug: "giao-thong", icon: "🚗" },
    { name: "Giáo dục", slug: "giao-duc", icon: "📚" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/linh-vuc/${item.slug}`}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition text-center"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-sm font-medium text-gray-700">{item.name}</span>
        </Link>
      ))}
    </div>
  )
}
