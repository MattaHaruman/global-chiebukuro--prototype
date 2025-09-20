'use client'

import Link from 'next/link'
import { QuestionWithUser } from '@/types'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { MessageCircle, Clock, User } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'

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
    <div className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow question-card">
      <Link href={`/questions/${question.id}`}>
        <div className="space-y-4">
          {/* Title - Speech Bubble Shape */}
          <div className="speech-bubble bg-blue-50 p-4 relative">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {titleLoading ? (
                <div className="animate-pulse bg-gray-200 h-6 rounded w-3/4"></div>
              ) : (
                translatedTitle
              )}
            </h3>
          </div>

          {/* Body preview - Thought Cloud Shape */}
          <div className="thought-cloud bg-gray-50 p-4 relative">
            {bodyLoading ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 rounded w-4/5"></div>
                <div className="animate-pulse bg-gray-200 h-4 rounded w-3/5"></div>
              </div>
            ) : (
              <MarkdownRenderer
                content={translatedBody}
                className="text-sm markdown-preview"
              />
            )}
          </div>

          {/* Metadata - Tag Shapes */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              {/* Author - Badge Shape */}
              <div className="badge-shape bg-yellow-100 px-3 py-1 relative">
                <div className="flex items-center space-x-2">
                  {question.user.image ? (
                    <img
                      src={question.user.image}
                      alt={question.user.name || 'User'}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                      ?
                    </div>
                  )}
                  <span className="font-medium">{question.user.name}</span>
                </div>
              </div>

              {/* Answer count - Arrow Shape */}
              <div className="arrow-right bg-green-100 px-3 py-1 relative">
                <span className="font-medium">
                  {question.answers?.length || 0}件の回答
                </span>
              </div>
            </div>

            {/* Date - Ribbon Shape */}
            <div className="ribbon bg-purple-100 px-3 py-1 relative">
              <span className="font-medium text-purple-700">
                {formatDate(question.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}