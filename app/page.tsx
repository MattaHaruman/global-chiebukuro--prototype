'use client'

import QuestionList from '@/components/QuestionList'
import QuestionSearch from '@/components/QuestionSearch'
import { useState } from 'react'
import { Search, MessageCircle, Users, Globe } from 'lucide-react'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center bg-white rounded-3xl p-8 border-4 border-purple-200 shadow-2xl hover-pulse">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 hover-bounce">
            🌍 Global知恵袋 🎯
          </h1>
          <p className="text-xl text-gray-700 mb-8 font-medium">
            世界中の人々と知識を共有するQ&Aプラットフォーム ✨
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center hover-bounce bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-full mb-3 float">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">🎌 自動翻訳</h3>
              <p className="text-sm text-gray-700 text-center font-medium">
                ブラウザの言語に合わせて自動翻訳 ⚡
              </p>
            </div>

            <div className="flex flex-col items-center hover-bounce bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-4 rounded-full mb-3 float" style={{animationDelay: '0.5s'}}>
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">❓ 質問と回答</h3>
              <p className="text-sm text-gray-700 text-center font-medium">
                簡単に質問を投稿し、専門家から回答を得る 🎯
              </p>
            </div>

            <div className="flex flex-col items-center hover-bounce bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-4 rounded-full mb-3 float" style={{animationDelay: '1s'}}>
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">🎉 コミュニティ</h3>
              <p className="text-sm text-gray-700 text-center font-medium">
                GitHubアカウントでログインして参加 🚀
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search section */}
      <div className="bg-white rounded-2xl p-6 border-4 border-orange-200 shadow-xl hover-pulse">
        <QuestionSearch
          onSearch={handleSearch}
          initialQuery={searchQuery}
        />
      </div>

      {/* Questions section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl shadow-lg hover-bounce">
            {searchQuery ? `🔍 "${searchQuery}" の検索結果` : '🔥 最新の質問 🔥'}
          </h2>
        </div>
        
        <QuestionList searchQuery={searchQuery} />
      </div>
    </div>
  )
}