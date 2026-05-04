import Link from "next/link"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    slug: string
    description?: string
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/linh-vuc/${category.slug}`}
      className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition"
    >
      <h3 className="font-semibold text-gray-800">{category.name}</h3>
      {category.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{category.description}</p>
      )}
    </Link>
  )
}
