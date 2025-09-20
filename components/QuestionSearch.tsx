'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface QuestionSearchProps {
  onSearch: (query: string) => void
  initialQuery?: string
  isLoading?: boolean
}

export default function QuestionSearch({
  onSearch,
  initialQuery = '',
  isLoading = false
}: QuestionSearchProps) {
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        {isLoading ? (
          <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full" />
        ) : (
          <Search className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🎯 質問を検索してみよう！"
        className="w-full pl-12 pr-12 py-4 border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-500 text-lg font-medium hover-bounce disabled:opacity-50"
        disabled={isLoading}
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  )
}