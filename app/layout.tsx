import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import ReactQueryProvider from '@/lib/react-query'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Global知恵袋 - Yahoo!知恵袋のようなQ&Aサイト',
  description: 'グローバルな知識共有のためのQ&Aプラットフォーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <SessionProvider>
          <ReactQueryProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}