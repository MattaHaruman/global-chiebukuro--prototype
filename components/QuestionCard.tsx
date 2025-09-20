'use client'

import Link from 'next/link'
import { QuestionWithUser } from '@/types'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { MessageCircle, Clock, User } from 'lucide-react'

interface Props {
  question: QuestionWithUser
}

export default function QuestionCard({ question }: Props) {
  const { translated: translatedTitle, isLoading: titleLoading } = useTranslation(question.title)
  const { translated: translatedBody, isLoading: bodyLoading } = useTranslation(
    question.body.length > 200 ? question.body.substring(0, 200) + '...' : question.body
  )

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-white border-4 border-purple-200 rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 hover-bounce rainbow-border">
      <Link href={`/questions/${question.id}`}>
        <div className="space-y-3">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors hover-pulse">
            {titleLoading ? (
              <div className="animate-pulse bg-gray-200 h-6 rounded w-3/4"></div>
            ) : (
              <span>💡 {translatedTitle}</span>
            )}
          </h3>

          {/* Body preview */}
          <div className="text-gray-600 text-sm leading-relaxed">
            {bodyLoading ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 rounded w-4/5"></div>
                <div className="animate-pulse bg-gray-200 h-4 rounded w-3/5"></div>
              </div>
            ) : (
              <p>{translatedBody}</p>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {/* Author */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full hover-bounce">
                {question.user.image ? (
                  <img
                    src={question.user.image}
                    alt={question.user.name || 'User'}
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                ) : (
                  <span className="text-lg">👤</span>
                )}
                <span className="font-bold text-purple-700">👨‍💻 {question.user.name}</span>
              </div>

              {/* Answer count */}
              <div className="flex items-center space-x-1 bg-gradient-to-r from-green-100 to-blue-100 px-3 py-1 rounded-full hover-shake">
                <span className="text-lg">💬</span>
                <span className="font-bold text-green-700">{question.answers?.length || 0}件の回答</span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-100 to-pink-100 px-3 py-1 rounded-full hover-rotate">
              <span className="text-lg">🕐</span>
              <span className="font-bold text-orange-700">{formatDate(question.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}