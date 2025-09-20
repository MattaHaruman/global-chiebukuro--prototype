'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { User, LogIn, LogOut, PlusCircle } from 'lucide-react'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white border-b-4 border-purple-300 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-bounce">
            <div className="fun-gradient text-white p-2 rounded-xl hover-pulse">
              <span className="text-xl font-bold">🤔💭</span>
            </div>
            <span className="text-2xl font-bold rainbow-text">Global知恵袋 ✨</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <>
                <Link
                  href="/questions/new"
                  className="inline-flex items-center px-4 py-2 fun-gradient text-white rounded-full hover-bounce font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <span className="mr-2">🚀</span>
                  質問する！
                </Link>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {session.user.image && (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-700">
                      {session.user.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn('github')}
                className="inline-flex items-center px-4 py-2 fun-gradient text-white rounded-full hover-bounce font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <span className="mr-2">🎉</span>
                ログイン
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}