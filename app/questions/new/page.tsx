import Link from 'next/link'
import QuestionForm from '@/components/QuestionForm'
import { ArrowLeft } from 'lucide-react'

export default function NewQuestionPage() {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        ホームに戻る
      </Link>

      {/* Question form */}
      <QuestionForm />
    </div>
  )
}