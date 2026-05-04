import Link from "next/link"
import { SearchBar } from "./SearchBar"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-700 shrink-0">
          <ScaleIcon />
          VietLex
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/search" className="text-gray-600 hover:text-primary-600">
            Tìm kiếm
          </Link>
          <Link href="/linh-vuc/dan-su" className="text-gray-600 hover:text-primary-600">
            Dân sự
          </Link>
          <Link href="/linh-vuc/hinh-su" className="text-gray-600 hover:text-primary-600">
            Hình sự
          </Link>
          <Link href="/linh-vuc/doanh-nghiep" className="text-gray-600 hover:text-primary-600">
            Doanh nghiệp
          </Link>
        </nav>

        <div className="flex-1 max-w-lg ml-auto">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}

function ScaleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M3 12h18M8 8l-5 4 5 4M16 8l5 4-5 4" />
    </svg>
  )
}
