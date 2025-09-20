'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AnswerCard from '@/components/AnswerCard'
import AnswerForm from '@/components/AnswerForm'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { QuestionWithUser } from '@/types'
import { ArrowLeft, User, Clock, MessageCircle } from 'lucide-react'

async function fetchQuestion(id: string): Promise<QuestionWithUser> {
  const response = await fetch(`/api/questions/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch question')
  }
  return response.json()
}

export default function QuestionDetailPage() {
  const params = useParams()
  const questionId = params.id as string

  const {
    data: question,
    isLoading,
    error
  } = useQuery({
    queryKey: ['question', questionId],
    queryFn: () => fetchQuestion(questionId),
  })

  const { translated: translatedTitle, isLoading: titleLoading } = useTranslation(
    question?.title || '', 'ja'
  )
  const { translated: translatedBody, isLoading: bodyLoading } = useTranslation(
    question?.body || '', 'ja'
  )

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 rounded"></div>
              <div className="bg-gray-200 h-4 rounded w-5/6"></div>
              <div className="bg-gray-200 h-4 rounded w-4/6"></div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-gray-200 h-4 rounded w-32"></div>
              <div className="bg-gray-200 h-4 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">質問の読み込みに失敗しました</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ホームに戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        質問一覧に戻る
      </Link>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Question title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {titleLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 rounded w-3/4"></div>
          ) : (
            translatedTitle
          )}
        </h1>

        {/* Question body */}
        <div className="mb-6">
          {bodyLoading ? (
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded w-5/6"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded w-4/6"></div>
            </div>
          ) : (
            <MarkdownRenderer content={translatedBody} />
          )}
        </div>

        {/* Question metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {question.user.image ? (
                <img
                  src={question.user.image}
                  alt={question.user.name || 'User'}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <User className="w-6 h-6" />
              )}
              <span className="font-medium">{question.user.name}</span>
            </div>

            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{question.answers?.length || 0}件の回答</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(question.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Answers section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">
          回答 ({question.answers?.length || 0}件)
        </h2>

        {question.answers && question.answers.length > 0 ? (
          <div className="space-y-4">
            {question.answers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>まだ回答がありません。最初の回答を投稿しませんか？</p>
          </div>
        )}

        {/* Answer form */}
        <AnswerForm questionId={questionId} />
      </div>
    </div>
  )
}