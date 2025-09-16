import QuestionList from '@/components/QuestionList'
import { Search, MessageCircle, Users, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Global知恵袋
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            世界中の人々と知識を共有するQ&Aプラットフォーム
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 p-3 rounded-full mb-3">
                <Globe className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">自動翻訳</h3>
              <p className="text-sm text-gray-600 text-center">
                ブラウザの言語に合わせて自動翻訳
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 p-3 rounded-full mb-3">
                <MessageCircle className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">質問と回答</h3>
              <p className="text-sm text-gray-600 text-center">
                簡単に質問を投稿し、専門家から回答を得る
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 p-3 rounded-full mb-3">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">コミュニティ</h3>
              <p className="text-sm text-gray-600 text-center">
                GitHubアカウントでログインして参加
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="質問を検索..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-sm text-gray-400">検索機能は開発中</span>
          </div>
        </div>
      </div>

      {/* Questions section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最新の質問</h2>
        </div>
        
        <QuestionList />
      </div>
    </div>
  )
}