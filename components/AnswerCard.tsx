'use client'

import { AnswerWithUser } from '@/types'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { User, Clock } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'

interface Props {
  answer: AnswerWithUser
}

export default function AnswerCard({ answer }: Props) {
  const { translated: translatedBody, isLoading: bodyLoading } = useTranslation(answer.body)

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
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Answer body */}
      <div className="mb-4">
        {bodyLoading ? (
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded w-5/6"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded w-4/6"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded w-3/6"></div>
          </div>
        ) : (
          <MarkdownRenderer content={translatedBody} />
        )}
      </div>

      {/* Answer metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {answer.user.image ? (
            <img
              src={answer.user.image}
              alt={answer.user.name || 'User'}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
          <span className="font-medium">{answer.user.name}</span>
        </div>

        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{formatDate(answer.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}