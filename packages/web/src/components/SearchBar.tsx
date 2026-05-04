"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm văn bản pháp luật..."
        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </form>
  )
}
