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
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <Link href={`/questions/${question.id}`}>
        <div className="space-y-3">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
            {titleLoading ? (
              <div className="animate-pulse bg-gray-200 h-6 rounded w-3/4"></div>
            ) : (
              translatedTitle
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
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {/* Author */}
              <div className="flex items-center space-x-2">
                {question.user.image ? (
                  <img
                    src={question.user.image}
                    alt={question.user.name || 'User'}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span>{question.user.name}</span>
              </div>

              {/* Answer count */}
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{question._count.answers}件の回答</span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(question.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}