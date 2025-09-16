'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { CreateQuestionData } from '@/types'

async function createQuestion(data: CreateQuestionData) {
  const response = await fetch('/api/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create question')
  }

  return response.json()
}

export default function QuestionForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { data: session } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: (data) => {
      // Invalidate and refetch questions
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      router.push(`/questions/${data.id}`)
    },
    onError: (error: Error) => {
      console.error('Error creating question:', error)
    }
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'タイトルは必須です'
    } else if (title.length > 200) {
      newErrors.title = 'タイトルは200文字以内で入力してください'
    }

    if (!body.trim()) {
      newErrors.body = '本文は必須です'
    } else if (body.length > 10000) {
      newErrors.body = '本文は10000文字以内で入力してください'
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

    mutation.mutate({ title: title.trim(), body: body.trim() })
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">質問を投稿するにはログインが必要です</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          ホームに戻る
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">新しい質問を投稿</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              タイトル *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="質問のタイトルを入力してください"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={200}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">{title.length}/200文字</p>
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              質問の内容 *
            </label>
            <textarea
              id="body"
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="質問の詳細を入力してください。具体的な状況や試したことなどを記載すると、より良い回答が得られます。"
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

          {/* Submit button */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {mutation.isPending ? '投稿中...' : '質問を投稿'}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              キャンセル
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
    </div>
  )
}