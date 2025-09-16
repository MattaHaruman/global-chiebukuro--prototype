'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { CreateAnswerData } from '@/types'
import { Send } from 'lucide-react'

interface Props {
  questionId: string
}

async function createAnswer(questionId: string, data: CreateAnswerData) {
  const response = await fetch(`/api/questions/${questionId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create answer')
  }

  return response.json()
}

export default function AnswerForm({ questionId }: Props) {
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateAnswerData) => createAnswer(questionId, data),
    onSuccess: () => {
      // Invalidate and refetch question data to show new answer
      queryClient.invalidateQueries({ queryKey: ['question', questionId] })
      setBody('')
      setErrors({})
    },
    onError: (error: Error) => {
      console.error('Error creating answer:', error)
    }
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!body.trim()) {
      newErrors.body = '回答内容は必須です'
    } else if (body.length > 10000) {
      newErrors.body = '回答は10000文字以内で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      alert('ログインが必要です')
      return
    }

    if (!validateForm()) {
      return
    }

    mutation.mutate({ body: body.trim() })
  }

  if (!session) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">回答を投稿するにはログインが必要です</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">回答を投稿する</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="answer-body" className="block text-sm font-medium text-gray-700 mb-2">
            回答内容 *
          </label>
          <textarea
            id="answer-body"
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="質問に対する回答を入力してください。具体的で分かりやすい回答を心がけましょう。"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical ${
              errors.body ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={10000}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">{body.length}/10000文字</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            {mutation.isPending ? '投稿中...' : '回答を投稿'}
          </button>
        </div>

        {mutation.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {mutation.error.message}
            </p>
          </div>
        )}
      </form>
    </div>
  )
}