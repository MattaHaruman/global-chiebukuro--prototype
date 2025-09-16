'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Github } from 'lucide-react'

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto bg-primary-600 text-white p-3 rounded-lg w-fit mb-4">
            <span className="text-2xl font-bold">Q&A</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Global知恵袋にログイン
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            GitHubアカウントでログインして質問や回答を投稿しましょう
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <Github className="w-5 h-5 mr-3" />
              GitHubでログイン
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              ログインすることで、利用規約とプライバシーポリシーに同意したものとみなします。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}