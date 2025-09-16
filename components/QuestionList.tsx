'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import QuestionCard from './QuestionCard'
import { QuestionWithUser } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface QuestionsResponse {
  questions: QuestionWithUser[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalQuestions: number
  }
}

async function fetchQuestions(page: number = 1): Promise<QuestionsResponse> {
  const response = await fetch(`/api/questions?page=${page}&limit=10`)
  if (!response.ok) {
    throw new Error('Failed to fetch questions')
  }
  return response.json()
}

export default function QuestionList() {
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['questions', currentPage],
    queryFn: () => fetchQuestions(currentPage),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="animate-pulse space-y-3">
              <div className="bg-gray-200 h-6 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-4/5"></div>
                <div className="bg-gray-200 h-4 rounded w-3/5"></div>
              </div>
              <div className="flex justify-between">
                <div className="bg-gray-200 h-4 rounded w-32"></div>
                <div className="bg-gray-200 h-4 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">質問の読み込みに失敗しました</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          再試行
        </button>
      </div>
    )
  }

  if (!data || data.questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>まだ質問がありません</p>
      </div>
    )
  }

  return (
    <div>
      {/* Questions list */}
      <div className="space-y-4 mb-8">
        {data.questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>

      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            前のページ
          </button>

          <span className="text-sm text-gray-600">
            {currentPage} / {data.pagination.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(page => Math.min(data.pagination.totalPages, page + 1))}
            disabled={currentPage === data.pagination.totalPages}
            className="inline-flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            次のページ
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  )
}